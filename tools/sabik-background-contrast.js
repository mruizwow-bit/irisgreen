/* Browser QA only. Measure the rendered background beneath each text rectangle.
   This supports transparency/gradients instead of mistaking alpha=0 for black. */
const {PNG}=require('pngjs');
function luminance(rgb){return rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
async function backgroundContrast(page,selector){
 const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
 const saved=await el.evaluate(n=>{const c=getComputedStyle(n);return{color:c.color,visibility:n.style.visibility,priority:n.style.getPropertyPriority('visibility')};});
 const box=await el.boundingBox();
 const clip={x:Math.ceil(box.x),y:Math.ceil(box.y),width:Math.floor(box.width)-1,height:Math.floor(box.height)-1};
 let png;
 try{await el.evaluate(n=>n.style.setProperty('visibility','hidden','important'));png=PNG.sync.read(await page.screenshot({clip,scale:'css'}));}
 finally{await el.evaluate((n,s)=>s.visibility?n.style.setProperty('visibility',s.visibility,s.priority):n.style.removeProperty('visibility'),saved);}
 const fg=luminance(saved.color.match(/[\d.]+/g).slice(0,3).map(Number));let min=Infinity,max=0,darkest=1,lightest=0;
 for(let i=0;i<png.data.length;i+=4){const bg=luminance([...png.data.subarray(i,i+3)]),ratio=(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);min=Math.min(min,ratio);max=Math.max(max,ratio);darkest=Math.min(darkest,bg);lightest=Math.max(lightest,bg);}
 return{selector,color:saved.color,minContrast:min,maxContrast:max,backgroundLuminanceMin:darkest,backgroundLuminanceMax:lightest,method:'Rendered background pixels beneath the text rectangle, text hidden with layout preserved, CSS px'};
}
module.exports={backgroundContrast};
