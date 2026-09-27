(()=>{var Ih=0,tl=1,Lh=2;var Hc=1,Uh=2,Sn=3,kn=0,ft=1,mt=2,zn=0,Fi=1,at=2,nl=3,il=4,Dh=5,ii=100,Nh=101,Fh=102,sl=103,rl=104,Oh=200,Bh=201,zh=202,Hh=203,Ho=204,Vo=205,Vh=206,kh=207,Gh=208,Wh=209,Xh=210,qh=211,Yh=212,Zh=213,Jh=214,$h=0,Kh=1,jh=2,hr=3,Qh=4,eu=5,tu=6,nu=7,Vc=0,iu=1,su=2,Hn=0,ru=1,ou=2,au=3,Ia=4,lu=5,cu=6,hu=7;var kc=300,zi=301,Hi=302,ko=303,Go=304,Gr=306,ps=1e3,cn=1001,Wo=1002,Ct=1003,ol=1004;var es=1005;var Bt=1006,no=1007;var ri=1008;var Vn=1009,uu=1010,du=1011,La=1012,Gc=1013,Bn=1014,mn=1015,ms=1016,Wc=1017,Xc=1018,oi=1020,fu=1021,hn=1023,pu=1024,mu=1025,ai=1026,Vi=1027,qc=1028,Yc=1029,gu=1030,Zc=1031,Jc=1033,io=33776,so=33777,ro=33778,oo=33779,al=35840,ll=35841,cl=35842,hl=35843,$c=36196,ul=37492,dl=37496,fl=37808,pl=37809,ml=37810,gl=37811,vl=37812,_l=37813,xl=37814,yl=37815,Ml=37816,El=37817,Sl=37818,bl=37819,wl=37820,Tl=37821,ao=36492,Al=36494,Rl=36495,vu=36283,Cl=36284,Pl=36285,Il=36286;var ur=2300,dr=2301,lo=2302,Ll=2400,Ul=2401,Dl=2402;var _u=3200,xu=3201,Kc=0,yu=1,On="",Jt="srgb",Xn="srgb-linear",Ua="display-p3",Wr="display-p3-linear",fr="linear",lt="srgb",pr="rec709",mr="p3";var pi=7680;var Nl=519,Mu=512,Eu=513,Su=514,jc=515,bu=516,wu=517,Tu=518,Au=519,Fl=35044;var Ol="300 es",Xo=1035,wn=2e3,gr=2001,Gn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bl=1234567,ls=Math.PI/180,gs=180/Math.PI;function fi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]).toLowerCase()}function Pt(i,e,t){return Math.max(e,Math.min(t,i))}function Da(i,e){return(i%e+e)%e}function Ru(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Cu(i,e,t){return i!==e?(t-i)/(e-i):0}function cs(i,e,t){return(1-t)*i+t*e}function Pu(i,e,t,n){return cs(i,e,1-Math.exp(-t*n))}function Iu(i,e=1){return e-Math.abs(Da(i,e*2)-e)}function Lu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Uu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Du(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Nu(i,e){return i+Math.random()*(e-i)}function Fu(i){return i*(.5-Math.random())}function Ou(i){i!==void 0&&(Bl=i);let e=Bl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Bu(i){return i*ls}function zu(i){return i*gs}function qo(i){return(i&i-1)===0&&i!==0}function Hu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function vr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Vu(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ii(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Vt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var $i={DEG2RAD:ls,RAD2DEG:gs,generateUUID:fi,clamp:Pt,euclideanModulo:Da,mapLinear:Ru,inverseLerp:Cu,lerp:cs,damp:Pu,pingpong:Iu,smoothstep:Lu,smootherstep:Uu,randInt:Du,randFloat:Nu,randFloatSpread:Fu,seededRandom:Ou,degToRad:Bu,radToDeg:zu,isPowerOfTwo:qo,ceilPowerOfTwo:Hu,floorPowerOfTwo:vr,setQuaternionFromProperEuler:Vu,normalize:Vt,denormalize:Ii},ye=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ye=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],y=s[0],m=s[3],p=s[6],M=s[1],v=s[4],E=s[7],C=s[2],S=s[5],T=s[8];return r[0]=o*y+a*M+l*C,r[3]=o*m+a*v+l*S,r[6]=o*p+a*E+l*T,r[1]=c*y+h*M+u*C,r[4]=c*m+h*v+u*S,r[7]=c*p+h*E+u*T,r[2]=f*y+d*M+g*C,r[5]=f*m+d*v+g*S,r[8]=f*p+d*E+g*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=t*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=u*y,e[1]=(s*c-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=f*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=d*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(co.makeScale(e,t)),this}rotate(e){return this.premultiply(co.makeRotation(-e)),this}translate(e,t){return this.premultiply(co.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},co=new Ye;function Qc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function _r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ku(){let i=_r("canvas");return i.style.display="block",i}var zl={};function Gu(i){i in zl||(zl[i]=!0,console.warn(i))}var Hl=new Ye().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Vl=new Ye().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ns={[Xn]:{transfer:fr,primaries:pr,toReference:i=>i,fromReference:i=>i},[Jt]:{transfer:lt,primaries:pr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Wr]:{transfer:fr,primaries:mr,toReference:i=>i.applyMatrix3(Vl),fromReference:i=>i.applyMatrix3(Hl)},[Ua]:{transfer:lt,primaries:mr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Vl),fromReference:i=>i.applyMatrix3(Hl).convertLinearToSRGB()}},Wu=new Set([Xn,Wr]),nt={enabled:!0,_workingColorSpace:Xn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Wu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;let n=Ns[e].toReference,s=Ns[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Ns[i].primaries},getTransfer:function(i){return i===On?fr:Ns[i].transfer}};function Oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ho(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var mi,xr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{mi===void 0&&(mi=_r("canvas")),mi.width=e.width,mi.height=e.height;let n=mi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=mi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=_r("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Oi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Oi(t[n]/255)*255):t[n]=Oi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Xu=0,yr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=fi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(uo(s[o].image)):r.push(uo(s[o]))}else r=uo(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function uo(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?xr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var qu=0,Xt=class i extends Gn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=cn,s=cn,r=Bt,o=ri,a=hn,l=Vn,c=i.DEFAULT_ANISOTROPY,h=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=fi(),this.name="",this.source=new yr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==kc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ps:e.x=e.x-Math.floor(e.x);break;case cn:e.x=e.x<0?0:1;break;case Wo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ps:e.y=e.y-Math.floor(e.y);break;case cn:e.y=e.y<0?0:1;break;case Wo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}};Xt.DEFAULT_IMAGE=null;Xt.DEFAULT_MAPPING=kc;Xt.DEFAULT_ANISOTROPY=1;var dt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,E=(d+1)/2,C=(p+1)/2,S=(h+f)/4,T=(u+y)/4,P=(g+m)/4;return v>E&&v>C?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=S/n,r=T/n):E>C?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=S/s,r=P/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=T/r,s=P/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-y)/M,this.z=(f-h)/M,this.w=Math.acos((c+d+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Yo=class extends Gn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0,count:1},n);let r=new Xt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new yr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tn=class extends Yo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Mr=class extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zo=class extends Xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var It=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[o+0],d=r[o+1],g=r[o+2],y=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=y;return}if(u!==y||l!==f||c!==d||h!==g){let m=1-a,p=l*f+c*d+h*g+u*y,M=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){let C=Math.sqrt(v),S=Math.atan2(C,p*M);m=Math.sin(m*S)/C,a=Math.sin(a*S)/C}let E=a*M;if(l=l*m+f*E,c=c*m+d*E,h=h*m+g*E,u=u*m+y*E,m===1-a){let C=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=C,c*=C,h*=C,u*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-a*d,e[t+2]=c*g+h*d+a*f-l*u,e[t+3]=h*g-a*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),f=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fo.copy(this).projectOnVector(e),this.sub(fo)}reflect(e){return this.sub(fo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},fo=new R,kl=new It,An=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,on):on.fromBufferAttribute(r,o),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fs.copy(n.boundingBox)),Fs.applyMatrix4(e.matrixWorld),this.union(Fs)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ts),Os.subVectors(this.max,ts),gi.subVectors(e.a,ts),vi.subVectors(e.b,ts),_i.subVectors(e.c,ts),In.subVectors(vi,gi),Ln.subVectors(_i,vi),$n.subVectors(gi,_i);let t=[0,-In.z,In.y,0,-Ln.z,Ln.y,0,-$n.z,$n.y,In.z,0,-In.x,Ln.z,0,-Ln.x,$n.z,0,-$n.x,-In.y,In.x,0,-Ln.y,Ln.x,0,-$n.y,$n.x,0];return!po(t,gi,vi,_i,Os)||(t=[1,0,0,0,1,0,0,0,1],!po(t,gi,vi,_i,Os))?!1:(Bs.crossVectors(In,Ln),t=[Bs.x,Bs.y,Bs.z],po(t,gi,vi,_i,Os))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},_n=[new R,new R,new R,new R,new R,new R,new R,new R],on=new R,Fs=new An,gi=new R,vi=new R,_i=new R,In=new R,Ln=new R,$n=new R,ts=new R,Os=new R,Bs=new R,Kn=new R;function po(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Kn.fromArray(i,r);let a=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),c=t.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Yu=new An,ns=new R,mo=new R,Rn=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Yu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ns.subVectors(e,this.center);let t=ns.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ns,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(mo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ns.copy(e.center).add(mo)),this.expandByPoint(ns.copy(e.center).sub(mo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},xn=new R,go=new R,zs=new R,Un=new R,vo=new R,Hs=new R,_o=new R,vs=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=xn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xn.copy(this.origin).addScaledVector(this.direction,t),xn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){go.copy(e).add(t).multiplyScalar(.5),zs.copy(t).sub(e).normalize(),Un.copy(this.origin).sub(go);let r=e.distanceTo(t)*.5,o=-this.direction.dot(zs),a=Un.dot(this.direction),l=-Un.dot(zs),c=Un.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let y=1/h;u*=y,f*=y,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(go).addScaledVector(zs,f),d}intersectSphere(e,t){xn.subVectors(e.center,this.origin);let n=xn.dot(this.direction),s=xn.dot(xn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,xn)!==null}intersectTriangle(e,t,n,s,r){vo.subVectors(t,e),Hs.subVectors(n,e),_o.crossVectors(vo,Hs);let o=this.direction.dot(_o),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Un.subVectors(this.origin,e);let l=a*this.direction.dot(Hs.crossVectors(Un,Hs));if(l<0)return null;let c=a*this.direction.dot(vo.cross(Un));if(c<0||l+c>o)return null;let h=-a*Un.dot(_o);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$e=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,f,d,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,f,d,g,y,m)}set(e,t,n,s,r,o,a,l,c,h,u,f,d,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/xi.setFromMatrixColumn(e,0).length(),r=1/xi.setFromMatrixColumn(e,1).length(),o=1/xi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=o*h,d=o*u,g=a*h,y=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-y*c,t[9]=-a*l,t[2]=y-f*c,t[6]=g+d*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,g=c*h,y=c*u;t[0]=f+y*a,t[4]=g*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=y+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,g=c*h,y=c*u;t[0]=f-y*a,t[4]=-o*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=y-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*h,d=o*u,g=a*h,y=a*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+y,t[1]=l*u,t[5]=y*c+f,t[9]=d*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,d=o*c,g=a*l,y=a*c;t[0]=l*h,t[4]=y-f*u,t[8]=g*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-y*u}else if(e.order==="XZY"){let f=o*l,d=o*c,g=a*l,y=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+y,t[5]=o*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*h,t[10]=y*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zu,e,Ju)}lookAt(e,t,n){let s=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Dn.crossVectors(n,Yt),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Dn.crossVectors(n,Yt)),Dn.normalize(),Vs.crossVectors(Yt,Dn),s[0]=Dn.x,s[4]=Vs.x,s[8]=Yt.x,s[1]=Dn.y,s[5]=Vs.y,s[9]=Yt.y,s[2]=Dn.z,s[6]=Vs.z,s[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],y=n[6],m=n[10],p=n[14],M=n[3],v=n[7],E=n[11],C=n[15],S=s[0],T=s[4],P=s[8],I=s[12],_=s[1],b=s[5],N=s[9],O=s[13],L=s[2],Y=s[6],q=s[10],B=s[14],z=s[3],W=s[7],ie=s[11],re=s[15];return r[0]=o*S+a*_+l*L+c*z,r[4]=o*T+a*b+l*Y+c*W,r[8]=o*P+a*N+l*q+c*ie,r[12]=o*I+a*O+l*B+c*re,r[1]=h*S+u*_+f*L+d*z,r[5]=h*T+u*b+f*Y+d*W,r[9]=h*P+u*N+f*q+d*ie,r[13]=h*I+u*O+f*B+d*re,r[2]=g*S+y*_+m*L+p*z,r[6]=g*T+y*b+m*Y+p*W,r[10]=g*P+y*N+m*q+p*ie,r[14]=g*I+y*O+m*B+p*re,r[3]=M*S+v*_+E*L+C*z,r[7]=M*T+v*b+E*Y+C*W,r[11]=M*P+v*N+E*q+C*ie,r[15]=M*I+v*O+E*B+C*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],y=e[7],m=e[11],p=e[15];return g*(+r*l*u-s*c*u-r*a*f+n*c*f+s*a*d-n*l*d)+y*(+t*l*d-t*c*f+r*o*f-s*o*d+s*c*h-r*l*h)+m*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+p*(-s*a*h-t*l*u+t*a*f+s*o*u-n*o*f+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],y=e[13],m=e[14],p=e[15],M=u*m*c-y*f*c+y*l*d-a*m*d-u*l*p+a*f*p,v=g*f*c-h*m*c-g*l*d+o*m*d+h*l*p-o*f*p,E=h*y*c-g*u*c+g*a*d-o*y*d-h*a*p+o*u*p,C=g*u*l-h*y*l-g*a*f+o*y*f+h*a*m-o*u*m,S=t*M+n*v+s*E+r*C;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/S;return e[0]=M*T,e[1]=(y*f*r-u*m*r-y*s*d+n*m*d+u*s*p-n*f*p)*T,e[2]=(a*m*r-y*l*r+y*s*c-n*m*c-a*s*p+n*l*p)*T,e[3]=(u*l*r-a*f*r-u*s*c+n*f*c+a*s*d-n*l*d)*T,e[4]=v*T,e[5]=(h*m*r-g*f*r+g*s*d-t*m*d-h*s*p+t*f*p)*T,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*T,e[7]=(o*f*r-h*l*r+h*s*c-t*f*c-o*s*d+t*l*d)*T,e[8]=E*T,e[9]=(g*u*r-h*y*r-g*n*d+t*y*d+h*n*p-t*u*p)*T,e[10]=(o*y*r-g*a*r+g*n*c-t*y*c-o*n*p+t*a*p)*T,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*T,e[12]=C*T,e[13]=(h*y*s-g*u*s+g*n*f-t*y*f-h*n*m+t*u*m)*T,e[14]=(g*a*s-o*y*s-g*n*l+t*y*l+o*n*m-t*a*m)*T,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*f+t*a*f)*T,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,y=o*h,m=o*u,p=a*u,M=l*c,v=l*h,E=l*u,C=n.x,S=n.y,T=n.z;return s[0]=(1-(y+p))*C,s[1]=(d+E)*C,s[2]=(g-v)*C,s[3]=0,s[4]=(d-E)*S,s[5]=(1-(f+p))*S,s[6]=(m+M)*S,s[7]=0,s[8]=(g+v)*T,s[9]=(m-M)*T,s[10]=(1-(f+y))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=xi.set(s[0],s[1],s[2]).length(),o=xi.set(s[4],s[5],s[6]).length(),a=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],an.copy(this);let c=1/r,h=1/o,u=1/a;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=u,an.elements[9]*=u,an.elements[10]*=u,t.setFromRotationMatrix(an),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=wn){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s),d,g;if(a===wn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===gr)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=wn){let l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(o-r),f=(t+e)*c,d=(n+s)*h,g,y;if(a===wn)g=(o+r)*u,y=-2*u;else if(a===gr)g=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=y,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},xi=new R,an=new $e,Zu=new R(0,0,0),Ju=new R(1,1,1),Dn=new R,Vs=new R,Yt=new R,Gl=new $e,Wl=new It,zt=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Pt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zt.DEFAULT_ORDER="XYZ";var Er=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},$u=0,Xl=new R,yi=new It,yn=new $e,ks=new R,is=new R,Ku=new R,ju=new It,ql=new R(1,0,0),Yl=new R(0,1,0),Zl=new R(0,0,1),Qu={type:"added"},ed={type:"removed"},xo={type:"childadded",child:null},yo={type:"childremoved",child:null},Lt=class i extends Gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new R,t=new zt,n=new It,s=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new Ye}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Er,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.multiply(yi),this}rotateOnWorldAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.premultiply(yi),this}rotateX(e){return this.rotateOnAxis(ql,e)}rotateY(e){return this.rotateOnAxis(Yl,e)}rotateZ(e){return this.rotateOnAxis(Zl,e)}translateOnAxis(e,t){return Xl.copy(e).applyQuaternion(this.quaternion),this.position.add(Xl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ql,e)}translateY(e){return this.translateOnAxis(Yl,e)}translateZ(e){return this.translateOnAxis(Zl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ks.copy(e):ks.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(is,ks,this.up):yn.lookAt(ks,is,this.up),this.quaternion.setFromRotationMatrix(yn),s&&(yn.extractRotation(s.matrixWorld),yi.setFromRotationMatrix(yn),this.quaternion.premultiply(yi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Qu),xo.child=e,this.dispatchEvent(xo),xo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ed),yo.child=e,this.dispatchEvent(yo),yo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,e,Ku),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,ju,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Lt.DEFAULT_UP=new R(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ln=new R,Mn=new R,Mo=new R,En=new R,Mi=new R,Ei=new R,Jl=new R,Eo=new R,So=new R,bo=new R,Li=class i{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ln.subVectors(e,t),s.cross(ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ln.subVectors(s,t),Mn.subVectors(n,t),Mo.subVectors(e,t);let o=ln.dot(ln),a=ln.dot(Mn),l=ln.dot(Mo),c=Mn.dot(Mn),h=Mn.dot(Mo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(o,En.y),l.addScaledVector(a,En.z),l)}static isFrontFacing(e,t,n,s){return ln.subVectors(n,t),Mn.subVectors(e,t),ln.cross(Mn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),ln.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Mi.subVectors(s,n),Ei.subVectors(r,n),Eo.subVectors(e,n);let l=Mi.dot(Eo),c=Ei.dot(Eo);if(l<=0&&c<=0)return t.copy(n);So.subVectors(e,s);let h=Mi.dot(So),u=Ei.dot(So);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Mi,o);bo.subVectors(e,r);let d=Mi.dot(bo),g=Ei.dot(bo);if(g>=0&&d<=g)return t.copy(r);let y=d*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Ei,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Jl.subVectors(r,s),a=(u-h)/(u-h+(d-g)),t.copy(s).addScaledVector(Jl,a);let p=1/(m+y+f);return o=y*p,a=f*p,t.copy(n).addScaledVector(Mi,o).addScaledVector(Ei,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Gs={h:0,s:0,l:0};function wo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=Da(e,1),t=Pt(t,0,1),n=Pt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=wo(o,r,e+1/3),this.g=wo(o,r,e),this.b=wo(o,r,e-1/3)}return nt.toWorkingColorSpace(this,s),this}setStyle(e,t=Jt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Jt){let n=eh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}copyLinearToSRGB(e){return this.r=ho(e.r),this.g=ho(e.g),this.b=ho(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Jt){return nt.fromWorkingColorSpace(Ot.copy(this),e),Math.round(Pt(Ot.r*255,0,255))*65536+Math.round(Pt(Ot.g*255,0,255))*256+Math.round(Pt(Ot.b*255,0,255))}getHexString(e=Jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Ot.copy(this),t);let n=Ot.r,s=Ot.g,r=Ot.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=Jt){nt.fromWorkingColorSpace(Ot.copy(this),e);let t=Ot.r,n=Ot.g,s=Ot.b;return e!==Jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(Gs);let n=cs(Nn.h,Gs.h,t),s=cs(Nn.s,Gs.s,t),r=cs(Nn.l,Gs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ot=new ge;ge.NAMES=eh;var td=0,Cn=class extends Gn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=Fi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ho,this.blendDst=Vo,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ge(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ho&&(n.blendSrc=this.blendSrc),this.blendDst!==Vo&&(n.blendDst=this.blendDst),this.blendEquation!==ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Mt=class extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zt,this.combine=Vc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var yt=new R,Ws=new ye,Je=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Fl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Gu("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ws.fromBufferAttribute(this,t),Ws.applyMatrix3(e),this.setXY(t,Ws.x,Ws.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ii(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ii(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ii(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ii(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ii(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),s=Vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),s=Vt(s,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fl&&(e.usage=this.usage),e}};var Sr=class extends Je{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var br=class extends Je{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var je=class extends Je{constructor(e,t,n){super(new Float32Array(e),t,n)}},nd=0,Qt=new $e,To=new Lt,Si=new R,Zt=new An,ss=new An,At=new R,tt=class i extends Gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qc(e)?br:Sr)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return To.lookAt(e),To.updateMatrix(),this.applyMatrix4(To.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(e){let t=[];for(let n=0,s=e.length;n<s;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new je(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ss.setFromBufferAttribute(a),this.morphTargetsRelative?(At.addVectors(Zt.min,ss.min),Zt.expandByPoint(At),At.addVectors(Zt.max,ss.max),Zt.expandByPoint(At)):(Zt.expandByPoint(ss.min),Zt.expandByPoint(ss.max))}Zt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)At.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(At));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)At.fromBufferAttribute(a,c),l&&(Si.fromBufferAttribute(e,c),At.add(Si)),s=Math.max(s,n.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Je(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new R,l[P]=new R;let c=new R,h=new R,u=new R,f=new ye,d=new ye,g=new ye,y=new R,m=new R;function p(P,I,_){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,I),u.fromBufferAttribute(n,_),f.fromBufferAttribute(r,P),d.fromBufferAttribute(r,I),g.fromBufferAttribute(r,_),h.sub(c),u.sub(c),d.sub(f),g.sub(f);let b=1/(d.x*g.y-g.x*d.y);isFinite(b)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(b),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(b),a[P].add(y),a[I].add(y),a[_].add(y),l[P].add(m),l[I].add(m),l[_].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let P=0,I=M.length;P<I;++P){let _=M[P],b=_.start,N=_.count;for(let O=b,L=b+N;O<L;O+=3)p(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let v=new R,E=new R,C=new R,S=new R;function T(P){C.fromBufferAttribute(s,P),S.copy(C);let I=a[P];v.copy(I),v.sub(C.multiplyScalar(C.dot(I))).normalize(),E.crossVectors(S,I);let b=E.dot(l[P])<0?-1:1;o.setXYZW(P,v.x,v.y,v.z,b)}for(let P=0,I=M.length;P<I;++P){let _=M[P],b=_.start,N=_.count;for(let O=b,L=b+N;O<L;O+=3)T(e.getX(O+0)),T(e.getX(O+1)),T(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Je(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?d=l[y]*a.data.stride+a.offset:d=l[y]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new Je(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},$l=new $e,jn=new vs,Xs=new Rn,Kl=new R,bi=new R,wi=new R,Ti=new R,Ao=new R,qs=new R,Ys=new ye,Zs=new ye,Js=new ye,jl=new R,Ql=new R,ec=new R,$s=new R,Ks=new R,xe=class extends Lt{constructor(e=new tt,t=new Mt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Ao.fromBufferAttribute(u,e),o?qs.addScaledVector(Ao,h):qs.addScaledVector(Ao.sub(t),h))}t.add(qs)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(r),jn.copy(e.ray).recast(e.near),!(Xs.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Xs,Kl)===null||jn.origin.distanceToSquared(Kl)>(e.far-e.near)**2))&&($l.copy(r).invert(),jn.copy(e.ray).applyMatrix4($l),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,jn)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let E=M,C=v;E<C;E+=3){let S=a.getX(E),T=a.getX(E+1),P=a.getX(E+2);s=js(this,p,e,n,c,h,u,S,T,P),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),y=Math.min(a.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){let M=a.getX(m),v=a.getX(m+1),E=a.getX(m+2);s=js(this,o,e,n,c,h,u,M,v,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=f.length;g<y;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let E=M,C=v;E<C;E+=3){let S=E,T=E+1,P=E+2;s=js(this,p,e,n,c,h,u,S,T,P),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),y=Math.min(l.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){let M=m,v=m+1,E=m+2;s=js(this,o,e,n,c,h,u,M,v,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function id(i,e,t,n,s,r,o,a){let l;if(e.side===ft?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===kn,a),l===null)return null;Ks.copy(a),Ks.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ks);return c<t.near||c>t.far?null:{distance:c,point:Ks.clone(),object:i}}function js(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,bi),i.getVertexPosition(l,wi),i.getVertexPosition(c,Ti);let h=id(i,e,t,n,bi,wi,Ti,$s);if(h){s&&(Ys.fromBufferAttribute(s,a),Zs.fromBufferAttribute(s,l),Js.fromBufferAttribute(s,c),h.uv=Li.getInterpolation($s,bi,wi,Ti,Ys,Zs,Js,new ye)),r&&(Ys.fromBufferAttribute(r,a),Zs.fromBufferAttribute(r,l),Js.fromBufferAttribute(r,c),h.uv1=Li.getInterpolation($s,bi,wi,Ti,Ys,Zs,Js,new ye)),o&&(jl.fromBufferAttribute(o,a),Ql.fromBufferAttribute(o,l),ec.fromBufferAttribute(o,c),h.normal=Li.getInterpolation($s,bi,wi,Ti,jl,Ql,ec,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new R,materialIndex:0};Li.getNormal(bi,wi,Ti,u.normal),h.face=u}return h}var _s=class i extends tt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(u,2));function g(y,m,p,M,v,E,C,S,T,P,I){let _=E/T,b=C/P,N=E/2,O=C/2,L=S/2,Y=T+1,q=P+1,B=0,z=0,W=new R;for(let ie=0;ie<q;ie++){let re=ie*b-O;for(let he=0;he<Y;he++){let Ce=he*_-N;W[y]=Ce*M,W[m]=re*v,W[p]=L,c.push(W.x,W.y,W.z),W[y]=0,W[m]=0,W[p]=S>0?1:-1,h.push(W.x,W.y,W.z),u.push(he/T),u.push(1-ie/P),B+=1}}for(let ie=0;ie<P;ie++)for(let re=0;re<T;re++){let he=f+re+Y*ie,Ce=f+re+Y*(ie+1),J=f+(re+1)+Y*(ie+1),le=f+(re+1)+Y*ie;l.push(he,Ce,le),l.push(Ce,J,le),z+=6}a.addGroup(d,z,I),d+=z,f+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ki(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function kt(i){let e={};for(let t=0;t<i.length;t++){let n=ki(i[t]);for(let s in n)e[s]=n[s]}return e}function sd(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function th(i){return i.getRenderTarget()===null?i.outputColorSpace:nt.workingColorSpace}var rd={clone:ki,merge:kt},od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ad=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Be=class extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=od,this.fragmentShader=ad,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ki(e.uniforms),this.uniformsGroups=sd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},wr=class extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=wn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fn=new R,tc=new ye,nc=new ye,et=class extends wr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=gs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ls*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gs*2*Math.atan(Math.tan(ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z)}getViewSize(e,t){return this.getViewBounds(e,tc,nc),t.subVectors(nc,tc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ls*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ai=-90,Ri=1,Jo=class extends Lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new et(Ai,Ri,e,t);s.layers=this.layers,this.add(s);let r=new et(Ai,Ri,e,t);r.layers=this.layers,this.add(r);let o=new et(Ai,Ri,e,t);o.layers=this.layers,this.add(o);let a=new et(Ai,Ri,e,t);a.layers=this.layers,this.add(a);let l=new et(Ai,Ri,e,t);l.layers=this.layers,this.add(l);let c=new et(Ai,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===gr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Tr=class extends Xt{constructor(e,t,n,s,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:zi,super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$o=class extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Tr(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Bt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new _s(5,5,5),r=new Be({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ft,blending:zn});r.uniforms.tEquirect.value=t;let o=new xe(s,r),a=t.minFilter;return t.minFilter===ri&&(t.minFilter=Bt),new Jo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Ro=new R,ld=new R,cd=new Ye,bn=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Ro.subVectors(n,t).cross(ld.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ro),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||cd.getNormalMatrix(e),s=this.coplanarPoint(Ro).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Qn=new Rn,Qs=new R,xs=class{constructor(e=new bn,t=new bn,n=new bn,s=new bn,r=new bn,o=new bn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=wn){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],y=s[10],m=s[11],p=s[12],M=s[13],v=s[14],E=s[15];if(n[0].setComponents(l-r,f-c,m-d,E-p).normalize(),n[1].setComponents(l+r,f+c,m+d,E+p).normalize(),n[2].setComponents(l+o,f+h,m+g,E+M).normalize(),n[3].setComponents(l-o,f-h,m-g,E-M).normalize(),n[4].setComponents(l-a,f-u,m-y,E-v).normalize(),t===wn)n[5].setComponents(l+a,f+u,m+y,E+v).normalize();else if(t===gr)n[5].setComponents(a,u,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){return Qn.center.set(0,0,0),Qn.radius=.7071067811865476,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Qs.x=s.normal.x>0?e.max.x:e.min.x,Qs.y=s.normal.y>0?e.max.y:e.min.y,Qs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function nh(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function hd(i,e){let t=e.isWebGL2,n=new WeakMap;function s(c,h){let u=c.array,f=c.usage,d=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,f),c.onUploadCallback();let y;if(u instanceof Float32Array)y=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)y=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else y=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)y=i.SHORT;else if(u instanceof Uint32Array)y=i.UNSIGNED_INT;else if(u instanceof Int32Array)y=i.INT;else if(u instanceof Int8Array)y=i.BYTE;else if(u instanceof Uint8Array)y=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)y=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:y,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:d}}function r(c,h,u){let f=h.array,d=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),d.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let y=0,m=g.length;y<m;y++){let p=g[y];t?i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(t?i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}var Ge=class i extends tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,f=t/l,d=[],g=[],y=[],m=[];for(let p=0;p<h;p++){let M=p*f-o;for(let v=0;v<c;v++){let E=v*u-r;g.push(E,-M,0),y.push(0,0,1),m.push(v/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let v=M+c*p,E=M+c*(p+1),C=M+1+c*(p+1),S=M+1+c*p;d.push(v,E,S),d.push(E,C,S)}this.setIndex(d),this.setAttribute("position",new je(g,3)),this.setAttribute("normal",new je(y,3)),this.setAttribute("uv",new je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ud=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,md=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xd=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,yd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Md=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ed=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ud=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Dd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Od=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Vd="gl_FragColor = linearToOutputTexel( gl_FragColor );",kd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Gd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Zd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$d=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ef=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,rf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,of=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,af=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,uf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,df=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ff=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,pf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,_f=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,xf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ef=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Af=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Rf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Pf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,If=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Df=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Nf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ff=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Of=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Jf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$f=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Kf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ep=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,np=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ip=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	float startCompression = 0.8 - 0.04;
	float desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min(color.r, min(color.g, color.b));
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max(color.r, max(color.g, color.b));
	if (peak < startCompression) return color;
	float d = 1. - startCompression;
	float newPeak = 1. - d * d / (peak + d - startCompression);
	color *= newPeak / peak;
	float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);
	return mix(color, vec3(1, 1, 1), g);
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,op=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ap=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,up=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,dp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_p=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,xp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,yp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Mp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ep=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ip=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Up=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Op=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Vp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Wp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Xp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:ud,alphahash_pars_fragment:dd,alphamap_fragment:fd,alphamap_pars_fragment:pd,alphatest_fragment:md,alphatest_pars_fragment:gd,aomap_fragment:vd,aomap_pars_fragment:_d,batching_pars_vertex:xd,batching_vertex:yd,begin_vertex:Md,beginnormal_vertex:Ed,bsdfs:Sd,iridescence_fragment:bd,bumpmap_pars_fragment:wd,clipping_planes_fragment:Td,clipping_planes_pars_fragment:Ad,clipping_planes_pars_vertex:Rd,clipping_planes_vertex:Cd,color_fragment:Pd,color_pars_fragment:Id,color_pars_vertex:Ld,color_vertex:Ud,common:Dd,cube_uv_reflection_fragment:Nd,defaultnormal_vertex:Fd,displacementmap_pars_vertex:Od,displacementmap_vertex:Bd,emissivemap_fragment:zd,emissivemap_pars_fragment:Hd,colorspace_fragment:Vd,colorspace_pars_fragment:kd,envmap_fragment:Gd,envmap_common_pars_fragment:Wd,envmap_pars_fragment:Xd,envmap_pars_vertex:qd,envmap_physical_pars_fragment:rf,envmap_vertex:Yd,fog_vertex:Zd,fog_pars_vertex:Jd,fog_fragment:$d,fog_pars_fragment:Kd,gradientmap_pars_fragment:jd,lightmap_fragment:Qd,lightmap_pars_fragment:ef,lights_lambert_fragment:tf,lights_lambert_pars_fragment:nf,lights_pars_begin:sf,lights_toon_fragment:of,lights_toon_pars_fragment:af,lights_phong_fragment:lf,lights_phong_pars_fragment:cf,lights_physical_fragment:hf,lights_physical_pars_fragment:uf,lights_fragment_begin:df,lights_fragment_maps:ff,lights_fragment_end:pf,logdepthbuf_fragment:mf,logdepthbuf_pars_fragment:gf,logdepthbuf_pars_vertex:vf,logdepthbuf_vertex:_f,map_fragment:xf,map_pars_fragment:yf,map_particle_fragment:Mf,map_particle_pars_fragment:Ef,metalnessmap_fragment:Sf,metalnessmap_pars_fragment:bf,morphinstance_vertex:wf,morphcolor_vertex:Tf,morphnormal_vertex:Af,morphtarget_pars_vertex:Rf,morphtarget_vertex:Cf,normal_fragment_begin:Pf,normal_fragment_maps:If,normal_pars_fragment:Lf,normal_pars_vertex:Uf,normal_vertex:Df,normalmap_pars_fragment:Nf,clearcoat_normal_fragment_begin:Ff,clearcoat_normal_fragment_maps:Of,clearcoat_pars_fragment:Bf,iridescence_pars_fragment:zf,opaque_fragment:Hf,packing:Vf,premultiplied_alpha_fragment:kf,project_vertex:Gf,dithering_fragment:Wf,dithering_pars_fragment:Xf,roughnessmap_fragment:qf,roughnessmap_pars_fragment:Yf,shadowmap_pars_fragment:Zf,shadowmap_pars_vertex:Jf,shadowmap_vertex:$f,shadowmask_pars_fragment:Kf,skinbase_vertex:jf,skinning_pars_vertex:Qf,skinning_vertex:ep,skinnormal_vertex:tp,specularmap_fragment:np,specularmap_pars_fragment:ip,tonemapping_fragment:sp,tonemapping_pars_fragment:rp,transmission_fragment:op,transmission_pars_fragment:ap,uv_pars_fragment:lp,uv_pars_vertex:cp,uv_vertex:hp,worldpos_vertex:up,background_vert:dp,background_frag:fp,backgroundCube_vert:pp,backgroundCube_frag:mp,cube_vert:gp,cube_frag:vp,depth_vert:_p,depth_frag:xp,distanceRGBA_vert:yp,distanceRGBA_frag:Mp,equirect_vert:Ep,equirect_frag:Sp,linedashed_vert:bp,linedashed_frag:wp,meshbasic_vert:Tp,meshbasic_frag:Ap,meshlambert_vert:Rp,meshlambert_frag:Cp,meshmatcap_vert:Pp,meshmatcap_frag:Ip,meshnormal_vert:Lp,meshnormal_frag:Up,meshphong_vert:Dp,meshphong_frag:Np,meshphysical_vert:Fp,meshphysical_frag:Op,meshtoon_vert:Bp,meshtoon_frag:zp,points_vert:Hp,points_frag:Vp,shadow_vert:kp,shadow_frag:Gp,sprite_vert:Wp,sprite_frag:Xp},de={common:{diffuse:{value:new ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new ge(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},pn={basic:{uniforms:kt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:kt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ge(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:kt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ge(0)},specular:{value:new ge(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:kt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:kt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new ge(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:kt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:kt([de.points,de.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:kt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:kt([de.common,de.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:kt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:kt([de.sprite,de.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:kt([de.common,de.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:kt([de.lights,de.fog,{color:{value:new ge(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};pn.physical={uniforms:kt([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new ge(0)},specularColor:{value:new ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};var er={r:0,b:0,g:0},ei=new zt,qp=new $e;function Yp(i,e,t,n,s,r,o){let a=new ge(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(m,p){let M=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?t:e).get(v)),v===null?y(a,l):v&&v.isColor&&(y(v,1),M=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Gr)?(h===void 0&&(h=new xe(new _s(1,1,1),new Be({name:"BackgroundCubeMaterial",uniforms:ki(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:ft,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ei.copy(p.backgroundRotation),ei.x*=-1,ei.y*=-1,ei.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ei.y*=-1,ei.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(qp.makeRotationFromEuler(ei)),h.material.toneMapped=nt.getTransfer(v.colorSpace)!==lt,(u!==v||f!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new xe(new Ge(2,2),new Be({name:"BackgroundMaterial",uniforms:ki(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=nt.getTransfer(v.colorSpace)!==lt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function y(m,p){m.getRGB(er,th(i)),n.buffers.color.setClear(er.r,er.g,er.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,y(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,y(a,l)},render:g}}function Zp(i,e,t,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=m(null),c=l,h=!1;function u(L,Y,q,B,z){let W=!1;if(o){let ie=y(B,q,Y);c!==ie&&(c=ie,d(c.object)),W=p(L,B,q,z),W&&M(L,B,q,z)}else{let ie=Y.wireframe===!0;(c.geometry!==B.id||c.program!==q.id||c.wireframe!==ie)&&(c.geometry=B.id,c.program=q.id,c.wireframe=ie,W=!0)}z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(W||h)&&(h=!1,P(L,Y,q,B),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(L){return n.isWebGL2?i.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?i.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function y(L,Y,q){let B=q.wireframe===!0,z=a[L.id];z===void 0&&(z={},a[L.id]=z);let W=z[Y.id];W===void 0&&(W={},z[Y.id]=W);let ie=W[B];return ie===void 0&&(ie=m(f()),W[B]=ie),ie}function m(L){let Y=[],q=[],B=[];for(let z=0;z<s;z++)Y[z]=0,q[z]=0,B[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Y,enabledAttributes:q,attributeDivisors:B,object:L,attributes:{},index:null}}function p(L,Y,q,B){let z=c.attributes,W=Y.attributes,ie=0,re=q.getAttributes();for(let he in re)if(re[he].location>=0){let J=z[he],le=W[he];if(le===void 0&&(he==="instanceMatrix"&&L.instanceMatrix&&(le=L.instanceMatrix),he==="instanceColor"&&L.instanceColor&&(le=L.instanceColor)),J===void 0||J.attribute!==le||le&&J.data!==le.data)return!0;ie++}return c.attributesNum!==ie||c.index!==B}function M(L,Y,q,B){let z={},W=Y.attributes,ie=0,re=q.getAttributes();for(let he in re)if(re[he].location>=0){let J=W[he];J===void 0&&(he==="instanceMatrix"&&L.instanceMatrix&&(J=L.instanceMatrix),he==="instanceColor"&&L.instanceColor&&(J=L.instanceColor));let le={};le.attribute=J,J&&J.data&&(le.data=J.data),z[he]=le,ie++}c.attributes=z,c.attributesNum=ie,c.index=B}function v(){let L=c.newAttributes;for(let Y=0,q=L.length;Y<q;Y++)L[Y]=0}function E(L){C(L,0)}function C(L,Y){let q=c.newAttributes,B=c.enabledAttributes,z=c.attributeDivisors;q[L]=1,B[L]===0&&(i.enableVertexAttribArray(L),B[L]=1),z[L]!==Y&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,Y),z[L]=Y)}function S(){let L=c.newAttributes,Y=c.enabledAttributes;for(let q=0,B=Y.length;q<B;q++)Y[q]!==L[q]&&(i.disableVertexAttribArray(q),Y[q]=0)}function T(L,Y,q,B,z,W,ie){ie===!0?i.vertexAttribIPointer(L,Y,q,z,W):i.vertexAttribPointer(L,Y,q,B,z,W)}function P(L,Y,q,B){if(n.isWebGL2===!1&&(L.isInstancedMesh||B.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();let z=B.attributes,W=q.getAttributes(),ie=Y.defaultAttributeValues;for(let re in W){let he=W[re];if(he.location>=0){let Ce=z[re];if(Ce===void 0&&(re==="instanceMatrix"&&L.instanceMatrix&&(Ce=L.instanceMatrix),re==="instanceColor"&&L.instanceColor&&(Ce=L.instanceColor)),Ce!==void 0){let J=Ce.normalized,le=Ce.itemSize,pe=t.get(Ce);if(pe===void 0)continue;let Ue=pe.buffer,be=pe.type,fe=pe.bytesPerElement,He=n.isWebGL2===!0&&(be===i.INT||be===i.UNSIGNED_INT||Ce.gpuType===Gc);if(Ce.isInterleavedBufferAttribute){let Pe=Ce.data,H=Pe.stride,st=Ce.offset;if(Pe.isInstancedInterleavedBuffer){for(let Ae=0;Ae<he.locationSize;Ae++)C(he.location+Ae,Pe.meshPerAttribute);L.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Pe.meshPerAttribute*Pe.count)}else for(let Ae=0;Ae<he.locationSize;Ae++)E(he.location+Ae);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let Ae=0;Ae<he.locationSize;Ae++)T(he.location+Ae,le/he.locationSize,be,J,H*fe,(st+le/he.locationSize*Ae)*fe,He)}else{if(Ce.isInstancedBufferAttribute){for(let Pe=0;Pe<he.locationSize;Pe++)C(he.location+Pe,Ce.meshPerAttribute);L.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Ce.meshPerAttribute*Ce.count)}else for(let Pe=0;Pe<he.locationSize;Pe++)E(he.location+Pe);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let Pe=0;Pe<he.locationSize;Pe++)T(he.location+Pe,le/he.locationSize,be,J,le*fe,le/he.locationSize*Pe*fe,He)}}else if(ie!==void 0){let J=ie[re];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(he.location,J);break;case 3:i.vertexAttrib3fv(he.location,J);break;case 4:i.vertexAttrib4fv(he.location,J);break;default:i.vertexAttrib1fv(he.location,J)}}}}S()}function I(){N();for(let L in a){let Y=a[L];for(let q in Y){let B=Y[q];for(let z in B)g(B[z].object),delete B[z];delete Y[q]}delete a[L]}}function _(L){if(a[L.id]===void 0)return;let Y=a[L.id];for(let q in Y){let B=Y[q];for(let z in B)g(B[z].object),delete B[z];delete Y[q]}delete a[L.id]}function b(L){for(let Y in a){let q=a[Y];if(q[L.id]===void 0)continue;let B=q[L.id];for(let z in B)g(B[z].object),delete B[z];delete q[L.id]}}function N(){O(),h=!0,c!==l&&(c=l,d(c.object))}function O(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:N,resetDefaultState:O,dispose:I,releaseStatesOfGeometry:_,releaseStatesOfProgram:b,initAttributes:v,enableAttribute:E,disableUnusedAttributes:S}}function Jp(i,e,t,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),t.update(u,r,1)}function l(h,u,f){if(f===0)return;let d,g;if(s)d=i,g="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,h,u,f),t.update(u,r,f)}function c(h,u,f){if(f===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{d.multiDrawArraysWEBGL(r,h,0,u,0,f);let g=0;for(let y=0;y<f;y++)g+=u[y];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function $p(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext!="undefined"&&i.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),y=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=f>0,E=o||e.has("OES_texture_float"),C=v&&E,S=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:y,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:M,vertexTextures:v,floatFragmentTextures:E,floatVertexTextures:C,maxSamples:S}}function Kp(i){let e=this,t=null,n=0,s=!1,r=!1,o=new bn,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:n,v=M*4,E=p.clippingState||null;l.value=E,E=h(g,f,v,d);for(let C=0;C!==v;++C)E[C]=t[C];p.clippingState=E,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let p=d+y*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,E=d;v!==y;++v,E+=4)o.copy(u[v]).applyMatrix4(M,a),o.normal.toArray(m,E),m[E+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function jp(i){let e=new WeakMap;function t(o,a){return a===ko?o.mapping=zi:a===Go&&(o.mapping=Hi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ko||a===Go)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new $o(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Gi=class extends wr{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ui=4,ic=[.125,.215,.35,.446,.526,.582],si=20,Co=new Gi,sc=new ge,Po=null,Io=0,Lo=0,ni=(1+Math.sqrt(5))/2,Ci=1/ni,rc=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,ni,Ci),new R(0,ni,-Ci),new R(Ci,0,ni),new R(-Ci,0,ni),new R(ni,Ci,0),new R(-ni,Ci,0)],Ar=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Po=this._renderer.getRenderTarget(),Io=this._renderer.getActiveCubeFace(),Lo=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Po,Io,Lo),e.scissorTest=!1,tr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zi||e.mapping===Hi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Po=this._renderer.getRenderTarget(),Io=this._renderer.getActiveCubeFace(),Lo=this._renderer.getActiveMipmapLevel();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:ms,format:hn,colorSpace:Xn,depthBuffer:!1},s=oc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oc(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Qp(r)),this._blurMaterial=em(r,e,t)}return s}_compileMaterial(e){let t=new xe(this._lodPlanes[0],e);this._renderer.compile(t,Co)}_sceneToCubeUV(e,t,n,s){let a=new et(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(sc),h.toneMapping=Hn,h.autoClear=!1;let d=new Mt({name:"PMREM.Background",side:ft,depthWrite:!1,depthTest:!1}),g=new xe(new _s,d),y=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,y=!0):(d.color.copy(sc),y=!0);for(let p=0;p<6;p++){let M=p%3;M===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):M===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let v=this._cubeSize;tr(s,M*v,p>2?v:0,v,v),h.setRenderTarget(s),y&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===zi||e.mapping===Hi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ac());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new xe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;tr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Co)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=rc[(s-1)%rc.length];this._blur(e,s-1,s,r,o)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new xe(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*si-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):si;m>si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${si}`);let p=[],M=0;for(let T=0;T<si;++T){let P=T/y,I=Math.exp(-P*P/2);p.push(I),T===0?M+=I:T<m&&(M+=2*I)}for(let T=0;T<p.length;T++)p[T]=p[T]/M;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;let E=this._sizeLods[s],C=3*E*(s>v-Ui?s-v+Ui:0),S=4*(this._cubeSize-E);tr(t,C,S,3*E,2*E),l.setRenderTarget(t),l.render(u,Co)}};function Qp(i){let e=[],t=[],n=[],s=i,r=i-Ui+1+ic.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Ui?l=ic[o-i+Ui-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,y=3,m=2,p=1,M=new Float32Array(y*g*d),v=new Float32Array(m*g*d),E=new Float32Array(p*g*d);for(let S=0;S<d;S++){let T=S%3*2/3-1,P=S>2?0:-1,I=[T,P,0,T+2/3,P,0,T+2/3,P+1,0,T,P,0,T+2/3,P+1,0,T,P+1,0];M.set(I,y*g*S),v.set(f,m*g*S);let _=[S,S,S,S,S,S];E.set(_,p*g*S)}let C=new tt;C.setAttribute("position",new Je(M,y)),C.setAttribute("uv",new Je(v,m)),C.setAttribute("faceIndex",new Je(E,p)),e.push(C),s>Ui&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function oc(i,e,t){let n=new Tn(i,e,t);return n.texture.mapping=Gr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function em(i,e,t){let n=new Float32Array(si),s=new R(0,1,0);return new Be({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ac(){return new Be({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function lc(){return new Be({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Na(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function tm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===ko||l===Go,h=l===zi||l===Hi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new Ar(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{let u=a.image;if(c&&u&&u.height>0||h&&u&&s(u)){t===null&&(t=new Ar(i));let f=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function nm(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){let s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function im(i,e,t,n){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let g in f.attributes)e.remove(f.attributes[g]);for(let g in f.morphAttributes){let y=f.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)e.remove(y[m])}f.removeEventListener("dispose",o),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(u){let f=u.attributes;for(let g in f)e.update(f[g],i.ARRAY_BUFFER);let d=u.morphAttributes;for(let g in d){let y=d[g];for(let m=0,p=y.length;m<p;m++)e.update(y[m],i.ARRAY_BUFFER)}}function c(u){let f=[],d=u.index,g=u.attributes.position,y=0;if(d!==null){let M=d.array;y=d.version;for(let v=0,E=M.length;v<E;v+=3){let C=M[v+0],S=M[v+1],T=M[v+2];f.push(C,S,S,T,T,C)}}else if(g!==void 0){let M=g.array;y=g.version;for(let v=0,E=M.length/3-1;v<E;v+=3){let C=v+0,S=v+1,T=v+2;f.push(C,S,S,T,T,C)}}else return;let m=new(Qc(f)?br:Sr)(f,1);m.version=y;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function sm(i,e,t,n){let s=n.isWebGL2,r;function o(d){r=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,g){i.drawElements(r,g,a,d*l),t.update(g,r,1)}function u(d,g,y){if(y===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,d*l,y),t.update(g,r,y)}function f(d,g,y){if(y===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<y;p++)this.render(d[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,d,0,y);let p=0;for(let M=0;M<y;M++)p+=g[M];t.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function rm(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function om(i,e){return i[0]-e[0]}function am(i,e){return Math.abs(e[1])-Math.abs(i[1])}function lm(i,e,t){let n={},s=new Float32Array(8),r=new WeakMap,o=new dt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){let f=c.morphTargetInfluences;if(e.isWebGL2===!0){let d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0,y=r.get(h);if(y===void 0||y.count!==g){let N=function(){_.dispose(),r.delete(h),h.removeEventListener("dispose",N)};y!==void 0&&y.texture.dispose();let m=h.morphAttributes.position!==void 0,p=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,v=h.morphAttributes.position||[],E=h.morphAttributes.normal||[],C=h.morphAttributes.color||[],S=0;m===!0&&(S=1),p===!0&&(S=2),M===!0&&(S=3);let T=h.attributes.position.count*S,P=1;T>e.maxTextureSize&&(P=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);let I=new Float32Array(T*P*4*g),_=new Mr(I,T,P,g);_.type=mn,_.needsUpdate=!0;let b=S*4;for(let O=0;O<g;O++){let L=v[O],Y=E[O],q=C[O],B=T*P*4*O;for(let z=0;z<L.count;z++){let W=z*b;m===!0&&(o.fromBufferAttribute(L,z),I[B+W+0]=o.x,I[B+W+1]=o.y,I[B+W+2]=o.z,I[B+W+3]=0),p===!0&&(o.fromBufferAttribute(Y,z),I[B+W+4]=o.x,I[B+W+5]=o.y,I[B+W+6]=o.z,I[B+W+7]=0),M===!0&&(o.fromBufferAttribute(q,z),I[B+W+8]=o.x,I[B+W+9]=o.y,I[B+W+10]=o.z,I[B+W+11]=q.itemSize===4?o.w:1)}}y={count:g,texture:_,size:new ye(T,P)},r.set(h,y),h.addEventListener("dispose",N)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)u.getUniforms().setValue(i,"morphTexture",c.morphTexture,t);else{let m=0;for(let M=0;M<f.length;M++)m+=f[M];let p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",p),u.getUniforms().setValue(i,"morphTargetInfluences",f)}u.getUniforms().setValue(i,"morphTargetsTexture",y.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",y.size)}else{let d=f===void 0?0:f.length,g=n[h.id];if(g===void 0||g.length!==d){g=[];for(let v=0;v<d;v++)g[v]=[v,0];n[h.id]=g}for(let v=0;v<d;v++){let E=g[v];E[0]=v,E[1]=f[v]}g.sort(am);for(let v=0;v<8;v++)v<d&&g[v][1]?(a[v][0]=g[v][0],a[v][1]=g[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(om);let y=h.morphAttributes.position,m=h.morphAttributes.normal,p=0;for(let v=0;v<8;v++){let E=a[v],C=E[0],S=E[1];C!==Number.MAX_SAFE_INTEGER&&S?(y&&h.getAttribute("morphTarget"+v)!==y[C]&&h.setAttribute("morphTarget"+v,y[C]),m&&h.getAttribute("morphNormal"+v)!==m[C]&&h.setAttribute("morphNormal"+v,m[C]),s[v]=S,p+=S):(y&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),m&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),s[v]=0)}let M=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",M),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function cm(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Rr=class extends Xt{constructor(e,t,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:ai,h!==ai&&h!==Vi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ai&&(n=Bn),n===void 0&&h===Vi&&(n=oi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Ct,this.minFilter=l!==void 0?l:Ct,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ih=new Xt,sh=new Rr(1,1);sh.compareFunction=jc;var rh=new Mr,oh=new Zo,ah=new Tr,cc=[],hc=[],uc=new Float32Array(16),dc=new Float32Array(9),fc=new Float32Array(4);function Ki(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=cc[s];if(r===void 0&&(r=new Float32Array(s),cc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function St(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Xr(i,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function hm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function um(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2fv(this.addr,e),bt(t,e)}}function dm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;i.uniform3fv(this.addr,e),bt(t,e)}}function fm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4fv(this.addr,e),bt(t,e)}}function pm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;fc.set(n),i.uniformMatrix2fv(this.addr,!1,fc),bt(t,n)}}function mm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;dc.set(n),i.uniformMatrix3fv(this.addr,!1,dc),bt(t,n)}}function gm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(St(t,n))return;uc.set(n),i.uniformMatrix4fv(this.addr,!1,uc),bt(t,n)}}function vm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function _m(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2iv(this.addr,e),bt(t,e)}}function xm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3iv(this.addr,e),bt(t,e)}}function ym(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4iv(this.addr,e),bt(t,e)}}function Mm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Em(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2uiv(this.addr,e),bt(t,e)}}function Sm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3uiv(this.addr,e),bt(t,e)}}function bm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4uiv(this.addr,e),bt(t,e)}}function wm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?sh:ih;t.setTexture2D(e||r,s)}function Tm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||oh,s)}function Am(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ah,s)}function Rm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||rh,s)}function Cm(i){switch(i){case 5126:return hm;case 35664:return um;case 35665:return dm;case 35666:return fm;case 35674:return pm;case 35675:return mm;case 35676:return gm;case 5124:case 35670:return vm;case 35667:case 35671:return _m;case 35668:case 35672:return xm;case 35669:case 35673:return ym;case 5125:return Mm;case 36294:return Em;case 36295:return Sm;case 36296:return bm;case 35678:case 36198:case 36298:case 36306:case 35682:return wm;case 35679:case 36299:case 36307:return Tm;case 35680:case 36300:case 36308:case 36293:return Am;case 36289:case 36303:case 36311:case 36292:return Rm}}function Pm(i,e){i.uniform1fv(this.addr,e)}function Im(i,e){let t=Ki(e,this.size,2);i.uniform2fv(this.addr,t)}function Lm(i,e){let t=Ki(e,this.size,3);i.uniform3fv(this.addr,t)}function Um(i,e){let t=Ki(e,this.size,4);i.uniform4fv(this.addr,t)}function Dm(i,e){let t=Ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Nm(i,e){let t=Ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Fm(i,e){let t=Ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Om(i,e){i.uniform1iv(this.addr,e)}function Bm(i,e){i.uniform2iv(this.addr,e)}function zm(i,e){i.uniform3iv(this.addr,e)}function Hm(i,e){i.uniform4iv(this.addr,e)}function Vm(i,e){i.uniform1uiv(this.addr,e)}function km(i,e){i.uniform2uiv(this.addr,e)}function Gm(i,e){i.uniform3uiv(this.addr,e)}function Wm(i,e){i.uniform4uiv(this.addr,e)}function Xm(i,e,t){let n=this.cache,s=e.length,r=Xr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||ih,r[o])}function qm(i,e,t){let n=this.cache,s=e.length,r=Xr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||oh,r[o])}function Ym(i,e,t){let n=this.cache,s=e.length,r=Xr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||ah,r[o])}function Zm(i,e,t){let n=this.cache,s=e.length,r=Xr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||rh,r[o])}function Jm(i){switch(i){case 5126:return Pm;case 35664:return Im;case 35665:return Lm;case 35666:return Um;case 35674:return Dm;case 35675:return Nm;case 35676:return Fm;case 5124:case 35670:return Om;case 35667:case 35671:return Bm;case 35668:case 35672:return zm;case 35669:case 35673:return Hm;case 5125:return Vm;case 36294:return km;case 36295:return Gm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Ym;case 36289:case 36303:case 36311:case 36292:return Zm}}var Ko=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Cm(t.type)}},jo=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Jm(t.type)}},Qo=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Uo=/(\w+)(\])?(\[|\.)?/g;function pc(i,e){i.seq.push(e),i.map[e.id]=e}function $m(i,e,t){let n=i.name,s=n.length;for(Uo.lastIndex=0;;){let r=Uo.exec(n),o=Uo.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){pc(t,c===void 0?new Ko(a,i,e):new jo(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Qo(a),pc(t,u)),t=u}}}var Bi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);$m(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function mc(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Km=37297,jm=0;function Qm(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function e0(i){let e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(i),n;switch(e===t?n="":e===mr&&t===pr?n="LinearDisplayP3ToLinearSRGB":e===pr&&t===mr&&(n="LinearSRGBToLinearDisplayP3"),i){case Xn:case Wr:return[n,"LinearTransferOETF"];case Jt:case Ua:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function gc(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Qm(i.getShaderSource(e),o)}else return s}function t0(i,e){let t=e0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function n0(i,e){let t;switch(e){case ru:t="Linear";break;case ou:t="Reinhard";break;case au:t="OptimizedCineon";break;case Ia:t="ACESFilmic";break;case cu:t="AgX";break;case hu:t="Neutral";break;case lu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function i0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.alphaToCoverage||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Di).join(`
`)}function s0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Di).join(`
`)}function r0(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o0(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Di(i){return i!==""}function vc(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _c(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ea(i){return i.replace(a0,c0)}var l0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function c0(i,e){let t=qe[e];if(t===void 0){let n=l0.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ea(t)}var h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xc(i){return i.replace(h0,u0)}function u0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	`;return i.isWebGL2&&(e+=`precision ${i.precision} sampler3D;
		precision ${i.precision} sampler2DArray;
		precision ${i.precision} sampler2DShadow;
		precision ${i.precision} samplerCubeShadow;
		precision ${i.precision} sampler2DArrayShadow;
		precision ${i.precision} isampler2D;
		precision ${i.precision} isampler3D;
		precision ${i.precision} isamplerCube;
		precision ${i.precision} isampler2DArray;
		precision ${i.precision} usampler2D;
		precision ${i.precision} usampler3D;
		precision ${i.precision} usamplerCube;
		precision ${i.precision} usampler2DArray;
		`),i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function d0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Uh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Sn&&(e="SHADOWMAP_TYPE_VSM"),e}function f0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case Hi:e="ENVMAP_TYPE_CUBE";break;case Gr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p0(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Hi&&(e="ENVMAP_MODE_REFRACTION"),e}function m0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Vc:e="ENVMAP_BLENDING_MULTIPLY";break;case iu:e="ENVMAP_BLENDING_MIX";break;case su:e="ENVMAP_BLENDING_ADD";break}return e}function g0(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function v0(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=d0(t),c=f0(t),h=p0(t),u=m0(t),f=g0(t),d=t.isWebGL2?"":i0(t),g=s0(t),y=r0(r),m=s.createProgram(),p,M,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Di).join(`
`),p.length>0&&(p+=`
`),M=[d,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Di).join(`
`),M.length>0&&(M+=`
`)):(p=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Di).join(`
`),M=[d,yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Hn?n0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,t0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Di).join(`
`)),o=ea(o),o=vc(o,t),o=_c(o,t),a=ea(a),a=vc(a,t),a=_c(a,t),o=xc(o),a=xc(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,M=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);let E=v+p+o,C=v+M+a,S=mc(s,s.VERTEX_SHADER,E),T=mc(s,s.FRAGMENT_SHADER,C);s.attachShader(m,S),s.attachShader(m,T),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function P(N){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(m).trim(),L=s.getShaderInfoLog(S).trim(),Y=s.getShaderInfoLog(T).trim(),q=!0,B=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,S,T);else{let z=gc(s,S,"vertex"),W=gc(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+O+`
`+z+`
`+W)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(L===""||Y==="")&&(B=!1);B&&(N.diagnostics={runnable:q,programLog:O,vertexShader:{log:L,prefix:p},fragmentShader:{log:Y,prefix:M}})}s.deleteShader(S),s.deleteShader(T),I=new Bi(s,m),_=o0(s,m)}let I;this.getUniforms=function(){return I===void 0&&P(this),I};let _;this.getAttributes=function(){return _===void 0&&P(this),_};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(m,Km)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=jm++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=T,this}var _0=0,ta=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new na(e),t.set(e,n)),n}},na=class{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}};function x0(i,e,t,n,s,r,o){let a=new Er,l=new ta,c=new Set,h=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,d=s.vertexTextures,g=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return c.add(_),_===0?"uv":`uv${_}`}function p(_,b,N,O,L){let Y=O.fog,q=L.geometry,B=_.isMeshStandardMaterial?O.environment:null,z=(_.isMeshStandardMaterial?t:e).get(_.envMap||B),W=z&&z.mapping===Gr?z.image.height:null,ie=y[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));let re=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,he=re!==void 0?re.length:0,Ce=0;q.morphAttributes.position!==void 0&&(Ce=1),q.morphAttributes.normal!==void 0&&(Ce=2),q.morphAttributes.color!==void 0&&(Ce=3);let J,le,pe,Ue;if(ie){let rt=pn[ie];J=rt.vertexShader,le=rt.fragmentShader}else J=_.vertexShader,le=_.fragmentShader,l.update(_),pe=l.getVertexShaderID(_),Ue=l.getFragmentShaderID(_);let be=i.getRenderTarget(),fe=L.isInstancedMesh===!0,He=L.isBatchedMesh===!0,Pe=!!_.map,H=!!_.matcap,st=!!z,Ae=!!_.aoMap,Oe=!!_.lightMap,Le=!!_.bumpMap,oe=!!_.normalMap,K=!!_.displacementMap,ue=!!_.emissiveMap,Re=!!_.metalnessMap,A=!!_.roughnessMap,x=_.anisotropy>0,G=_.clearcoat>0,te=_.iridescence>0,U=_.sheen>0,D=_.transmission>0,ne=x&&!!_.anisotropyMap,ae=G&&!!_.clearcoatMap,k=G&&!!_.clearcoatNormalMap,j=G&&!!_.clearcoatRoughnessMap,_e=te&&!!_.iridescenceMap,se=te&&!!_.iridescenceThicknessMap,De=U&&!!_.sheenColorMap,we=U&&!!_.sheenRoughnessMap,Se=!!_.specularMap,Ee=!!_.specularColorMap,Te=!!_.specularIntensityMap,Qe=D&&!!_.transmissionMap,Ve=D&&!!_.thicknessMap,ct=!!_.gradientMap,F=!!_.alphaMap,me=_.alphaTest>0,$=!!_.alphaHash,ce=!!_.extensions,ve=Hn;_.toneMapped&&(be===null||be.isXRRenderTarget===!0)&&(ve=i.toneMapping);let Ke={isWebGL2:u,shaderID:ie,shaderType:_.type,shaderName:_.name,vertexShader:J,fragmentShader:le,defines:_.defines,customVertexShaderID:pe,customFragmentShaderID:Ue,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:He,instancing:fe,instancingColor:fe&&L.instanceColor!==null,instancingMorph:fe&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:be===null?i.outputColorSpace:be.isXRRenderTarget===!0?be.texture.colorSpace:Xn,alphaToCoverage:!!_.alphaToCoverage,map:Pe,matcap:H,envMap:st,envMapMode:st&&z.mapping,envMapCubeUVHeight:W,aoMap:Ae,lightMap:Oe,bumpMap:Le,normalMap:oe,displacementMap:d&&K,emissiveMap:ue,normalMapObjectSpace:oe&&_.normalMapType===yu,normalMapTangentSpace:oe&&_.normalMapType===Kc,metalnessMap:Re,roughnessMap:A,anisotropy:x,anisotropyMap:ne,clearcoat:G,clearcoatMap:ae,clearcoatNormalMap:k,clearcoatRoughnessMap:j,iridescence:te,iridescenceMap:_e,iridescenceThicknessMap:se,sheen:U,sheenColorMap:De,sheenRoughnessMap:we,specularMap:Se,specularColorMap:Ee,specularIntensityMap:Te,transmission:D,transmissionMap:Qe,thicknessMap:Ve,gradientMap:ct,opaque:_.transparent===!1&&_.blending===Fi&&_.alphaToCoverage===!1,alphaMap:F,alphaTest:me,alphaHash:$,combine:_.combine,mapUv:Pe&&m(_.map.channel),aoMapUv:Ae&&m(_.aoMap.channel),lightMapUv:Oe&&m(_.lightMap.channel),bumpMapUv:Le&&m(_.bumpMap.channel),normalMapUv:oe&&m(_.normalMap.channel),displacementMapUv:K&&m(_.displacementMap.channel),emissiveMapUv:ue&&m(_.emissiveMap.channel),metalnessMapUv:Re&&m(_.metalnessMap.channel),roughnessMapUv:A&&m(_.roughnessMap.channel),anisotropyMapUv:ne&&m(_.anisotropyMap.channel),clearcoatMapUv:ae&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:k&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:se&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:De&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(_.sheenRoughnessMap.channel),specularMapUv:Se&&m(_.specularMap.channel),specularColorMapUv:Ee&&m(_.specularColorMap.channel),specularIntensityMapUv:Te&&m(_.specularIntensityMap.channel),transmissionMapUv:Qe&&m(_.transmissionMap.channel),thicknessMapUv:Ve&&m(_.thicknessMap.channel),alphaMapUv:F&&m(_.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(oe||x),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!q.attributes.uv&&(Pe||F),fog:!!Y,useFog:_.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:L.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ce,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Pe&&_.map.isVideoTexture===!0&&nt.getTransfer(_.map.colorSpace)===lt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===mt,flipSided:_.side===ft,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:ce&&_.extensions.derivatives===!0,extensionFragDepth:ce&&_.extensions.fragDepth===!0,extensionDrawBuffers:ce&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:ce&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ce&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:ce&&_.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ke.vertexUv1s=c.has(1),Ke.vertexUv2s=c.has(2),Ke.vertexUv3s=c.has(3),c.clear(),Ke}function M(_){let b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(let N in _.defines)b.push(N),b.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(v(b,_),E(b,_),b.push(i.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function v(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function E(_,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.instancingMorph&&a.enable(4),b.matcap&&a.enable(5),b.envMap&&a.enable(6),b.normalMapObjectSpace&&a.enable(7),b.normalMapTangentSpace&&a.enable(8),b.clearcoat&&a.enable(9),b.iridescence&&a.enable(10),b.alphaTest&&a.enable(11),b.vertexColors&&a.enable(12),b.vertexAlphas&&a.enable(13),b.vertexUv1s&&a.enable(14),b.vertexUv2s&&a.enable(15),b.vertexUv3s&&a.enable(16),b.vertexTangents&&a.enable(17),b.anisotropy&&a.enable(18),b.alphaHash&&a.enable(19),b.batching&&a.enable(20),_.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.alphaToCoverage&&a.enable(20),_.push(a.mask)}function C(_){let b=y[_.type],N;if(b){let O=pn[b];N=rd.clone(O.uniforms)}else N=_.uniforms;return N}function S(_,b){let N;for(let O=0,L=h.length;O<L;O++){let Y=h[O];if(Y.cacheKey===b){N=Y,++N.usedTimes;break}}return N===void 0&&(N=new v0(i,b,_,r),h.push(N)),N}function T(_){if(--_.usedTimes===0){let b=h.indexOf(_);h[b]=h[h.length-1],h.pop(),_.destroy()}}function P(_){l.remove(_)}function I(){l.dispose()}return{getParameters:p,getProgramCacheKey:M,getUniforms:C,acquireProgram:S,releaseProgram:T,releaseShaderCache:P,programs:h,dispose:I}}function y0(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function M0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Mc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ec(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,f,d,g,y,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),e++,p}function a(u,f,d,g,y,m){let p=o(u,f,d,g,y,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):t.push(p)}function l(u,f,d,g,y,m){let p=o(u,f,d,g,y,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||M0),n.length>1&&n.sort(f||Mc),s.length>1&&s.sort(f||Mc)}function h(){for(let u=e,f=i.length;u<f;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function E0(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Ec,i.set(n,[o])):s>=r.length?(o=new Ec,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function S0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new ge};break;case"SpotLight":t={position:new R,direction:new R,color:new ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new ge,groundColor:new ge};break;case"RectAreaLight":t={color:new ge,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function b0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var w0=0;function T0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function A0(i,e){let t=new S0,n=b0(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new R);let r=new R,o=new $e,a=new $e;function l(h,u){let f=0,d=0,g=0;for(let N=0;N<9;N++)s.probe[N].set(0,0,0);let y=0,m=0,p=0,M=0,v=0,E=0,C=0,S=0,T=0,P=0,I=0;h.sort(T0);let _=u===!0?Math.PI:1;for(let N=0,O=h.length;N<O;N++){let L=h[N],Y=L.color,q=L.intensity,B=L.distance,z=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)f+=Y.r*q*_,d+=Y.g*q*_,g+=Y.b*q*_;else if(L.isLightProbe){for(let W=0;W<9;W++)s.probe[W].addScaledVector(L.sh.coefficients[W],q);I++}else if(L.isDirectionalLight){let W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity*_),L.castShadow){let ie=L.shadow,re=n.get(L);re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,s.directionalShadow[y]=re,s.directionalShadowMap[y]=z,s.directionalShadowMatrix[y]=L.shadow.matrix,E++}s.directional[y]=W,y++}else if(L.isSpotLight){let W=t.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(Y).multiplyScalar(q*_),W.distance=B,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,s.spot[p]=W;let ie=L.shadow;if(L.map&&(s.spotLightMap[T]=L.map,T++,ie.updateMatrices(L),L.castShadow&&P++),s.spotLightMatrix[p]=ie.matrix,L.castShadow){let re=n.get(L);re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,s.spotShadow[p]=re,s.spotShadowMap[p]=z,S++}p++}else if(L.isRectAreaLight){let W=t.get(L);W.color.copy(Y).multiplyScalar(q),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),s.rectArea[M]=W,M++}else if(L.isPointLight){let W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity*_),W.distance=L.distance,W.decay=L.decay,L.castShadow){let ie=L.shadow,re=n.get(L);re.shadowBias=ie.bias,re.shadowNormalBias=ie.normalBias,re.shadowRadius=ie.radius,re.shadowMapSize=ie.mapSize,re.shadowCameraNear=ie.camera.near,re.shadowCameraFar=ie.camera.far,s.pointShadow[m]=re,s.pointShadowMap[m]=z,s.pointShadowMatrix[m]=L.shadow.matrix,C++}s.point[m]=W,m++}else if(L.isHemisphereLight){let W=t.get(L);W.skyColor.copy(L.color).multiplyScalar(q*_),W.groundColor.copy(L.groundColor).multiplyScalar(q*_),s.hemi[v]=W,v++}}M>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=de.LTC_FLOAT_1,s.rectAreaLTC2=de.LTC_FLOAT_2):(s.rectAreaLTC1=de.LTC_HALF_1,s.rectAreaLTC2=de.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=de.LTC_FLOAT_1,s.rectAreaLTC2=de.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=de.LTC_HALF_1,s.rectAreaLTC2=de.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=g;let b=s.hash;(b.directionalLength!==y||b.pointLength!==m||b.spotLength!==p||b.rectAreaLength!==M||b.hemiLength!==v||b.numDirectionalShadows!==E||b.numPointShadows!==C||b.numSpotShadows!==S||b.numSpotMaps!==T||b.numLightProbes!==I)&&(s.directional.length=y,s.spot.length=p,s.rectArea.length=M,s.point.length=m,s.hemi.length=v,s.directionalShadow.length=E,s.directionalShadowMap.length=E,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=E,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=S+T-P,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=P,s.numLightProbes=I,b.directionalLength=y,b.pointLength=m,b.spotLength=p,b.rectAreaLength=M,b.hemiLength=v,b.numDirectionalShadows=E,b.numPointShadows=C,b.numSpotShadows=S,b.numSpotMaps=T,b.numLightProbes=I,s.version=w0++)}function c(h,u){let f=0,d=0,g=0,y=0,m=0,p=u.matrixWorldInverse;for(let M=0,v=h.length;M<v;M++){let E=h[M];if(E.isDirectionalLight){let C=s.directional[f];C.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),f++}else if(E.isSpotLight){let C=s.spot[g];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(p),C.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),g++}else if(E.isRectAreaLight){let C=s.rectArea[y];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(p),a.identity(),o.copy(E.matrixWorld),o.premultiply(p),a.extractRotation(o),C.halfWidth.set(E.width*.5,0,0),C.halfHeight.set(0,E.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),y++}else if(E.isPointLight){let C=s.point[d];C.position.setFromMatrixPosition(E.matrixWorld),C.position.applyMatrix4(p),d++}else if(E.isHemisphereLight){let C=s.hemi[m];C.direction.setFromMatrixPosition(E.matrixWorld),C.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function Sc(i,e){let t=new A0(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function R0(i,e){let t=new WeakMap;function n(r,o=0){let a=t.get(r),l;return a===void 0?(l=new Sc(i,e),t.set(r,[l])):o>=a.length?(l=new Sc(i,e),a.push(l)):l=a[o],l}function s(){t=new WeakMap}return{get:n,dispose:s}}var ia=class extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sa=class extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},C0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,P0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function I0(i,e,t){let n=new xs,s=new ye,r=new ye,o=new dt,a=new ia({depthPacking:xu}),l=new sa,c={},h=t.maxTextureSize,u={[kn]:ft,[ft]:kn,[mt]:mt},f=new Be({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:C0,fragmentShader:P0}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new tt;g.setAttribute("position",new Je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new xe(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hc;let p=this.type;this.render=function(S,T,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let I=i.getRenderTarget(),_=i.getActiveCubeFace(),b=i.getActiveMipmapLevel(),N=i.state;N.setBlending(zn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let O=p!==Sn&&this.type===Sn,L=p===Sn&&this.type!==Sn;for(let Y=0,q=S.length;Y<q;Y++){let B=S[Y],z=B.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let W=z.getFrameExtents();if(s.multiply(W),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/W.x),s.x=r.x*W.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/W.y),s.y=r.y*W.y,z.mapSize.y=r.y)),z.map===null||O===!0||L===!0){let re=this.type!==Sn?{minFilter:Ct,magFilter:Ct}:{};z.map!==null&&z.map.dispose(),z.map=new Tn(s.x,s.y,re),z.map.texture.name=B.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let ie=z.getViewportCount();for(let re=0;re<ie;re++){let he=z.getViewport(re);o.set(r.x*he.x,r.y*he.y,r.x*he.z,r.y*he.w),N.viewport(o),z.updateMatrices(B,re),n=z.getFrustum(),E(T,P,z.camera,B,this.type)}z.isPointLightShadow!==!0&&this.type===Sn&&M(z,P),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(I,_,b)};function M(S,T){let P=e.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Tn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,P,f,y,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,P,d,y,null)}function v(S,T,P,I){let _=null,b=P.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(b!==void 0)_=b;else if(_=P.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let N=_.uuid,O=T.uuid,L=c[N];L===void 0&&(L={},c[N]=L);let Y=L[O];Y===void 0&&(Y=_.clone(),L[O]=Y,T.addEventListener("dispose",C)),_=Y}if(_.visible=T.visible,_.wireframe=T.wireframe,I===Sn?_.side=T.shadowSide!==null?T.shadowSide:T.side:_.side=T.shadowSide!==null?T.shadowSide:u[T.side],_.alphaMap=T.alphaMap,_.alphaTest=T.alphaTest,_.map=T.map,_.clipShadows=T.clipShadows,_.clippingPlanes=T.clippingPlanes,_.clipIntersection=T.clipIntersection,_.displacementMap=T.displacementMap,_.displacementScale=T.displacementScale,_.displacementBias=T.displacementBias,_.wireframeLinewidth=T.wireframeLinewidth,_.linewidth=T.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let N=i.properties.get(_);N.light=P}return _}function E(S,T,P,I,_){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===Sn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,S.matrixWorld);let O=e.update(S),L=S.material;if(Array.isArray(L)){let Y=O.groups;for(let q=0,B=Y.length;q<B;q++){let z=Y[q],W=L[z.materialIndex];if(W&&W.visible){let ie=v(S,W,I,_);S.onBeforeShadow(i,S,T,P,O,ie,z),i.renderBufferDirect(P,null,O,ie,S,z),S.onAfterShadow(i,S,T,P,O,ie,z)}}}else if(L.visible){let Y=v(S,L,I,_);S.onBeforeShadow(i,S,T,P,O,Y,null),i.renderBufferDirect(P,null,O,Y,S,null),S.onAfterShadow(i,S,T,P,O,Y,null)}}let N=S.children;for(let O=0,L=N.length;O<L;O++)E(N[O],T,P,I,_)}function C(S){S.target.removeEventListener("dispose",C);for(let P in c){let I=c[P],_=S.target.uuid;_ in I&&(I[_].dispose(),delete I[_])}}}function L0(i,e,t){let n=t.isWebGL2;function s(){let F=!1,me=new dt,$=null,ce=new dt(0,0,0,0);return{setMask:function(ve){$!==ve&&!F&&(i.colorMask(ve,ve,ve,ve),$=ve)},setLocked:function(ve){F=ve},setClear:function(ve,Ke,rt,Rt,Kt){Kt===!0&&(ve*=Rt,Ke*=Rt,rt*=Rt),me.set(ve,Ke,rt,Rt),ce.equals(me)===!1&&(i.clearColor(ve,Ke,rt,Rt),ce.copy(me))},reset:function(){F=!1,$=null,ce.set(-1,0,0,0)}}}function r(){let F=!1,me=null,$=null,ce=null;return{setTest:function(ve){ve?fe(i.DEPTH_TEST):He(i.DEPTH_TEST)},setMask:function(ve){me!==ve&&!F&&(i.depthMask(ve),me=ve)},setFunc:function(ve){if($!==ve){switch(ve){case $h:i.depthFunc(i.NEVER);break;case Kh:i.depthFunc(i.ALWAYS);break;case jh:i.depthFunc(i.LESS);break;case hr:i.depthFunc(i.LEQUAL);break;case Qh:i.depthFunc(i.EQUAL);break;case eu:i.depthFunc(i.GEQUAL);break;case tu:i.depthFunc(i.GREATER);break;case nu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=ve}},setLocked:function(ve){F=ve},setClear:function(ve){ce!==ve&&(i.clearDepth(ve),ce=ve)},reset:function(){F=!1,me=null,$=null,ce=null}}}function o(){let F=!1,me=null,$=null,ce=null,ve=null,Ke=null,rt=null,Rt=null,Kt=null;return{setTest:function(ot){F||(ot?fe(i.STENCIL_TEST):He(i.STENCIL_TEST))},setMask:function(ot){me!==ot&&!F&&(i.stencilMask(ot),me=ot)},setFunc:function(ot,Ht,fn){($!==ot||ce!==Ht||ve!==fn)&&(i.stencilFunc(ot,Ht,fn),$=ot,ce=Ht,ve=fn)},setOp:function(ot,Ht,fn){(Ke!==ot||rt!==Ht||Rt!==fn)&&(i.stencilOp(ot,Ht,fn),Ke=ot,rt=Ht,Rt=fn)},setLocked:function(ot){F=ot},setClear:function(ot){Kt!==ot&&(i.clearStencil(ot),Kt=ot)},reset:function(){F=!1,me=null,$=null,ce=null,ve=null,Ke=null,rt=null,Rt=null,Kt=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,u=new WeakMap,f={},d={},g=new WeakMap,y=[],m=null,p=!1,M=null,v=null,E=null,C=null,S=null,T=null,P=null,I=new ge(0,0,0),_=0,b=!1,N=null,O=null,L=null,Y=null,q=null,B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,W=0,ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(ie)[1]),z=W>=1):ie.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),z=W>=2);let re=null,he={},Ce=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),le=new dt().fromArray(Ce),pe=new dt().fromArray(J);function Ue(F,me,$,ce){let ve=new Uint8Array(4),Ke=i.createTexture();i.bindTexture(F,Ke),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let rt=0;rt<$;rt++)n&&(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)?i.texImage3D(me,0,i.RGBA,1,1,ce,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(me+rt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return Ke}let be={};be[i.TEXTURE_2D]=Ue(i.TEXTURE_2D,i.TEXTURE_2D,1),be[i.TEXTURE_CUBE_MAP]=Ue(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(be[i.TEXTURE_2D_ARRAY]=Ue(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),be[i.TEXTURE_3D]=Ue(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),fe(i.DEPTH_TEST),l.setFunc(hr),K(!1),ue(tl),fe(i.CULL_FACE),Le(zn);function fe(F){f[F]!==!0&&(i.enable(F),f[F]=!0)}function He(F){f[F]!==!1&&(i.disable(F),f[F]=!1)}function Pe(F,me){return d[F]!==me?(i.bindFramebuffer(F,me),d[F]=me,n&&(F===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=me),F===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=me)),!0):!1}function H(F,me){let $=y,ce=!1;if(F){$=g.get(me),$===void 0&&($=[],g.set(me,$));let ve=F.textures;if($.length!==ve.length||$[0]!==i.COLOR_ATTACHMENT0){for(let Ke=0,rt=ve.length;Ke<rt;Ke++)$[Ke]=i.COLOR_ATTACHMENT0+Ke;$.length=ve.length,ce=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,ce=!0);if(ce)if(t.isWebGL2)i.drawBuffers($);else if(e.has("WEBGL_draw_buffers")===!0)e.get("WEBGL_draw_buffers").drawBuffersWEBGL($);else throw new Error("THREE.WebGLState: Usage of gl.drawBuffers() require WebGL2 or WEBGL_draw_buffers extension")}function st(F){return m!==F?(i.useProgram(F),m=F,!0):!1}let Ae={[ii]:i.FUNC_ADD,[Nh]:i.FUNC_SUBTRACT,[Fh]:i.FUNC_REVERSE_SUBTRACT};if(n)Ae[sl]=i.MIN,Ae[rl]=i.MAX;else{let F=e.get("EXT_blend_minmax");F!==null&&(Ae[sl]=F.MIN_EXT,Ae[rl]=F.MAX_EXT)}let Oe={[Oh]:i.ZERO,[Bh]:i.ONE,[zh]:i.SRC_COLOR,[Ho]:i.SRC_ALPHA,[Xh]:i.SRC_ALPHA_SATURATE,[Gh]:i.DST_COLOR,[Vh]:i.DST_ALPHA,[Hh]:i.ONE_MINUS_SRC_COLOR,[Vo]:i.ONE_MINUS_SRC_ALPHA,[Wh]:i.ONE_MINUS_DST_COLOR,[kh]:i.ONE_MINUS_DST_ALPHA,[qh]:i.CONSTANT_COLOR,[Yh]:i.ONE_MINUS_CONSTANT_COLOR,[Zh]:i.CONSTANT_ALPHA,[Jh]:i.ONE_MINUS_CONSTANT_ALPHA};function Le(F,me,$,ce,ve,Ke,rt,Rt,Kt,ot){if(F===zn){p===!0&&(He(i.BLEND),p=!1);return}if(p===!1&&(fe(i.BLEND),p=!0),F!==Dh){if(F!==M||ot!==b){if((v!==ii||S!==ii)&&(i.blendEquation(i.FUNC_ADD),v=ii,S=ii),ot)switch(F){case Fi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case at:i.blendFunc(i.ONE,i.ONE);break;case nl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case il:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Fi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case at:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case nl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case il:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}E=null,C=null,T=null,P=null,I.set(0,0,0),_=0,M=F,b=ot}return}ve=ve||me,Ke=Ke||$,rt=rt||ce,(me!==v||ve!==S)&&(i.blendEquationSeparate(Ae[me],Ae[ve]),v=me,S=ve),($!==E||ce!==C||Ke!==T||rt!==P)&&(i.blendFuncSeparate(Oe[$],Oe[ce],Oe[Ke],Oe[rt]),E=$,C=ce,T=Ke,P=rt),(Rt.equals(I)===!1||Kt!==_)&&(i.blendColor(Rt.r,Rt.g,Rt.b,Kt),I.copy(Rt),_=Kt),M=F,b=!1}function oe(F,me){F.side===mt?He(i.CULL_FACE):fe(i.CULL_FACE);let $=F.side===ft;me&&($=!$),K($),F.blending===Fi&&F.transparent===!1?Le(zn):Le(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),l.setFunc(F.depthFunc),l.setTest(F.depthTest),l.setMask(F.depthWrite),a.setMask(F.colorWrite);let ce=F.stencilWrite;c.setTest(ce),ce&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),A(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):He(i.SAMPLE_ALPHA_TO_COVERAGE)}function K(F){N!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),N=F)}function ue(F){F!==Ih?(fe(i.CULL_FACE),F!==O&&(F===tl?i.cullFace(i.BACK):F===Lh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):He(i.CULL_FACE),O=F}function Re(F){F!==L&&(z&&i.lineWidth(F),L=F)}function A(F,me,$){F?(fe(i.POLYGON_OFFSET_FILL),(Y!==me||q!==$)&&(i.polygonOffset(me,$),Y=me,q=$)):He(i.POLYGON_OFFSET_FILL)}function x(F){F?fe(i.SCISSOR_TEST):He(i.SCISSOR_TEST)}function G(F){F===void 0&&(F=i.TEXTURE0+B-1),re!==F&&(i.activeTexture(F),re=F)}function te(F,me,$){$===void 0&&(re===null?$=i.TEXTURE0+B-1:$=re);let ce=he[$];ce===void 0&&(ce={type:void 0,texture:void 0},he[$]=ce),(ce.type!==F||ce.texture!==me)&&(re!==$&&(i.activeTexture($),re=$),i.bindTexture(F,me||be[F]),ce.type=F,ce.texture=me)}function U(){let F=he[re];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function D(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ne(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ae(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function k(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function j(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _e(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function se(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function De(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function we(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Se(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ee(F){le.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),le.copy(F))}function Te(F){pe.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),pe.copy(F))}function Qe(F,me){let $=u.get(me);$===void 0&&($=new WeakMap,u.set(me,$));let ce=$.get(F);ce===void 0&&(ce=i.getUniformBlockIndex(me,F.name),$.set(F,ce))}function Ve(F,me){let ce=u.get(me).get(F);h.get(me)!==ce&&(i.uniformBlockBinding(me,ce,F.__bindingPointIndex),h.set(me,ce))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},re=null,he={},d={},g=new WeakMap,y=[],m=null,p=!1,M=null,v=null,E=null,C=null,S=null,T=null,P=null,I=new ge(0,0,0),_=0,b=!1,N=null,O=null,L=null,Y=null,q=null,le.set(0,0,i.canvas.width,i.canvas.height),pe.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:fe,disable:He,bindFramebuffer:Pe,drawBuffers:H,useProgram:st,setBlending:Le,setMaterial:oe,setFlipSided:K,setCullFace:ue,setLineWidth:Re,setPolygonOffset:A,setScissorTest:x,activeTexture:G,bindTexture:te,unbindTexture:U,compressedTexImage2D:D,compressedTexImage3D:ne,texImage2D:we,texImage3D:Se,updateUBOMapping:Qe,uniformBlockBinding:Ve,texStorage2D:se,texStorage3D:De,texSubImage2D:ae,texSubImage3D:k,compressedTexSubImage2D:j,compressedTexSubImage3D:_e,scissor:Ee,viewport:Te,reset:ct}}function U0(i,e,t,n,s,r,o){let a=s.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ye,u=new WeakMap,f,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,x){return g?new OffscreenCanvas(A,x):_r("canvas")}function m(A,x,G,te){let U=1,D=Re(A);if((D.width>te||D.height>te)&&(U=te/Math.max(D.width,D.height)),U<1||x===!0)if(typeof HTMLImageElement!="undefined"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&A instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&A instanceof ImageBitmap||typeof VideoFrame!="undefined"&&A instanceof VideoFrame){let ne=x?vr:Math.floor,ae=ne(U*D.width),k=ne(U*D.height);f===void 0&&(f=y(ae,k));let j=G?y(ae,k):f;return j.width=ae,j.height=k,j.getContext("2d").drawImage(A,0,0,ae,k),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+D.width+"x"+D.height+") to ("+ae+"x"+k+")."),j}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+D.width+"x"+D.height+")."),A;return A}function p(A){let x=Re(A);return qo(x.width)&&qo(x.height)}function M(A){return a?!1:A.wrapS!==cn||A.wrapT!==cn||A.minFilter!==Ct&&A.minFilter!==Bt}function v(A,x){return A.generateMipmaps&&x&&A.minFilter!==Ct&&A.minFilter!==Bt}function E(A){i.generateMipmap(A)}function C(A,x,G,te,U=!1){if(a===!1)return x;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let D=x;if(x===i.RED&&(G===i.FLOAT&&(D=i.R32F),G===i.HALF_FLOAT&&(D=i.R16F),G===i.UNSIGNED_BYTE&&(D=i.R8)),x===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(D=i.R8UI),G===i.UNSIGNED_SHORT&&(D=i.R16UI),G===i.UNSIGNED_INT&&(D=i.R32UI),G===i.BYTE&&(D=i.R8I),G===i.SHORT&&(D=i.R16I),G===i.INT&&(D=i.R32I)),x===i.RG&&(G===i.FLOAT&&(D=i.RG32F),G===i.HALF_FLOAT&&(D=i.RG16F),G===i.UNSIGNED_BYTE&&(D=i.RG8)),x===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(D=i.RG8UI),G===i.UNSIGNED_SHORT&&(D=i.RG16UI),G===i.UNSIGNED_INT&&(D=i.RG32UI),G===i.BYTE&&(D=i.RG8I),G===i.SHORT&&(D=i.RG16I),G===i.INT&&(D=i.RG32I)),x===i.RGBA){let ne=U?fr:nt.getTransfer(te);G===i.FLOAT&&(D=i.RGBA32F),G===i.HALF_FLOAT&&(D=i.RGBA16F),G===i.UNSIGNED_BYTE&&(D=ne===lt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(D=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(D=i.RGB5_A1)}return(D===i.R16F||D===i.R32F||D===i.RG16F||D===i.RG32F||D===i.RGBA16F||D===i.RGBA32F)&&e.get("EXT_color_buffer_float"),D}function S(A,x,G){return v(A,G)===!0||A.isFramebufferTexture&&A.minFilter!==Ct&&A.minFilter!==Bt?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function T(A){return A===Ct||A===ol||A===es?i.NEAREST:i.LINEAR}function P(A){let x=A.target;x.removeEventListener("dispose",P),_(x),x.isVideoTexture&&u.delete(x)}function I(A){let x=A.target;x.removeEventListener("dispose",I),N(x)}function _(A){let x=n.get(A);if(x.__webglInit===void 0)return;let G=A.source,te=d.get(G);if(te){let U=te[x.__cacheKey];U.usedTimes--,U.usedTimes===0&&b(A),Object.keys(te).length===0&&d.delete(G)}n.remove(A)}function b(A){let x=n.get(A);i.deleteTexture(x.__webglTexture);let G=A.source,te=d.get(G);delete te[x.__cacheKey],o.memory.textures--}function N(A){let x=n.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(x.__webglFramebuffer[te]))for(let U=0;U<x.__webglFramebuffer[te].length;U++)i.deleteFramebuffer(x.__webglFramebuffer[te][U]);else i.deleteFramebuffer(x.__webglFramebuffer[te]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[te])}else{if(Array.isArray(x.__webglFramebuffer))for(let te=0;te<x.__webglFramebuffer.length;te++)i.deleteFramebuffer(x.__webglFramebuffer[te]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let te=0;te<x.__webglColorRenderbuffer.length;te++)x.__webglColorRenderbuffer[te]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[te]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let G=A.textures;for(let te=0,U=G.length;te<U;te++){let D=n.get(G[te]);D.__webglTexture&&(i.deleteTexture(D.__webglTexture),o.memory.textures--),n.remove(G[te])}n.remove(A)}let O=0;function L(){O=0}function Y(){let A=O;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),O+=1,A}function q(A){let x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function B(A,x){let G=n.get(A);if(A.isVideoTexture&&K(A),A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){let te=A.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pe(G,A,x);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+x)}function z(A,x){let G=n.get(A);if(A.version>0&&G.__version!==A.version){pe(G,A,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+x)}function W(A,x){let G=n.get(A);if(A.version>0&&G.__version!==A.version){pe(G,A,x);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+x)}function ie(A,x){let G=n.get(A);if(A.version>0&&G.__version!==A.version){Ue(G,A,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+x)}let re={[ps]:i.REPEAT,[cn]:i.CLAMP_TO_EDGE,[Wo]:i.MIRRORED_REPEAT},he={[Ct]:i.NEAREST,[ol]:i.NEAREST_MIPMAP_NEAREST,[es]:i.NEAREST_MIPMAP_LINEAR,[Bt]:i.LINEAR,[no]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},Ce={[Mu]:i.NEVER,[Au]:i.ALWAYS,[Eu]:i.LESS,[jc]:i.LEQUAL,[Su]:i.EQUAL,[Tu]:i.GEQUAL,[bu]:i.GREATER,[wu]:i.NOTEQUAL};function J(A,x,G){if(x.type===mn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Bt||x.magFilter===no||x.magFilter===es||x.magFilter===ri||x.minFilter===Bt||x.minFilter===no||x.minFilter===es||x.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),G?(i.texParameteri(A,i.TEXTURE_WRAP_S,re[x.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,re[x.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,re[x.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,he[x.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,he[x.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(x.wrapS!==cn||x.wrapT!==cn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,T(x.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,T(x.minFilter)),x.minFilter!==Ct&&x.minFilter!==Bt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),x.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Ce[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ct||x.minFilter!==es&&x.minFilter!==ri||x.type===mn&&e.has("OES_texture_float_linear")===!1||a===!1&&x.type===ms&&e.has("OES_texture_half_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let te=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function le(A,x){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",P));let te=x.source,U=d.get(te);U===void 0&&(U={},d.set(te,U));let D=q(x);if(D!==A.__cacheKey){U[D]===void 0&&(U[D]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),U[D].usedTimes++;let ne=U[A.__cacheKey];ne!==void 0&&(U[A.__cacheKey].usedTimes--,ne.usedTimes===0&&b(x)),A.__cacheKey=D,A.__webglTexture=U[D].texture}return G}function pe(A,x,G){let te=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(te=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(te=i.TEXTURE_3D);let U=le(A,x),D=x.source;t.bindTexture(te,A.__webglTexture,i.TEXTURE0+G);let ne=n.get(D);if(D.version!==ne.__version||U===!0){t.activeTexture(i.TEXTURE0+G);let ae=nt.getPrimaries(nt.workingColorSpace),k=x.colorSpace===On?null:nt.getPrimaries(x.colorSpace),j=x.colorSpace===On||ae===k?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let _e=M(x)&&p(x.image)===!1,se=m(x.image,_e,!1,s.maxTextureSize);se=ue(x,se);let De=p(se)||a,we=r.convert(x.format,x.colorSpace),Se=r.convert(x.type),Ee=C(x.internalFormat,we,Se,x.colorSpace,x.isVideoTexture);J(te,x,De);let Te,Qe=x.mipmaps,Ve=a&&x.isVideoTexture!==!0&&Ee!==$c,ct=ne.__version===void 0||U===!0,F=D.dataReady,me=S(x,se,De);if(x.isDepthTexture)Ee=i.DEPTH_COMPONENT,a?x.type===mn?Ee=i.DEPTH_COMPONENT32F:x.type===Bn?Ee=i.DEPTH_COMPONENT24:x.type===oi?Ee=i.DEPTH24_STENCIL8:Ee=i.DEPTH_COMPONENT16:x.type===mn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===ai&&Ee===i.DEPTH_COMPONENT&&x.type!==La&&x.type!==Bn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=Bn,Se=r.convert(x.type)),x.format===Vi&&Ee===i.DEPTH_COMPONENT&&(Ee=i.DEPTH_STENCIL,x.type!==oi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=oi,Se=r.convert(x.type))),ct&&(Ve?t.texStorage2D(i.TEXTURE_2D,1,Ee,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Ee,se.width,se.height,0,we,Se,null));else if(x.isDataTexture)if(Qe.length>0&&De){Ve&&ct&&t.texStorage2D(i.TEXTURE_2D,me,Ee,Qe[0].width,Qe[0].height);for(let $=0,ce=Qe.length;$<ce;$++)Te=Qe[$],Ve?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Te.width,Te.height,we,Se,Te.data):t.texImage2D(i.TEXTURE_2D,$,Ee,Te.width,Te.height,0,we,Se,Te.data);x.generateMipmaps=!1}else Ve?(ct&&t.texStorage2D(i.TEXTURE_2D,me,Ee,se.width,se.height),F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,se.width,se.height,we,Se,se.data)):t.texImage2D(i.TEXTURE_2D,0,Ee,se.width,se.height,0,we,Se,se.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ve&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,Ee,Qe[0].width,Qe[0].height,se.depth);for(let $=0,ce=Qe.length;$<ce;$++)Te=Qe[$],x.format!==hn?we!==null?Ve?F&&t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Te.width,Te.height,se.depth,we,Te.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ee,Te.width,Te.height,se.depth,0,Te.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Te.width,Te.height,se.depth,we,Se,Te.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,Ee,Te.width,Te.height,se.depth,0,we,Se,Te.data)}else{Ve&&ct&&t.texStorage2D(i.TEXTURE_2D,me,Ee,Qe[0].width,Qe[0].height);for(let $=0,ce=Qe.length;$<ce;$++)Te=Qe[$],x.format!==hn?we!==null?Ve?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,Te.width,Te.height,we,Te.data):t.compressedTexImage2D(i.TEXTURE_2D,$,Ee,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Te.width,Te.height,we,Se,Te.data):t.texImage2D(i.TEXTURE_2D,$,Ee,Te.width,Te.height,0,we,Se,Te.data)}else if(x.isDataArrayTexture)Ve?(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,Ee,se.width,se.height,se.depth),F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,we,Se,se.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,se.width,se.height,se.depth,0,we,Se,se.data);else if(x.isData3DTexture)Ve?(ct&&t.texStorage3D(i.TEXTURE_3D,me,Ee,se.width,se.height,se.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,we,Se,se.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,se.width,se.height,se.depth,0,we,Se,se.data);else if(x.isFramebufferTexture){if(ct)if(Ve)t.texStorage2D(i.TEXTURE_2D,me,Ee,se.width,se.height);else{let $=se.width,ce=se.height;for(let ve=0;ve<me;ve++)t.texImage2D(i.TEXTURE_2D,ve,Ee,$,ce,0,we,Se,null),$>>=1,ce>>=1}}else if(Qe.length>0&&De){if(Ve&&ct){let $=Re(Qe[0]);t.texStorage2D(i.TEXTURE_2D,me,Ee,$.width,$.height)}for(let $=0,ce=Qe.length;$<ce;$++)Te=Qe[$],Ve?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,we,Se,Te):t.texImage2D(i.TEXTURE_2D,$,Ee,we,Se,Te);x.generateMipmaps=!1}else if(Ve){if(ct){let $=Re(se);t.texStorage2D(i.TEXTURE_2D,me,Ee,$.width,$.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,Se,se)}else t.texImage2D(i.TEXTURE_2D,0,Ee,we,Se,se);v(x,De)&&E(te),ne.__version=D.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Ue(A,x,G){if(x.image.length!==6)return;let te=le(A,x),U=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+G);let D=n.get(U);if(U.version!==D.__version||te===!0){t.activeTexture(i.TEXTURE0+G);let ne=nt.getPrimaries(nt.workingColorSpace),ae=x.colorSpace===On?null:nt.getPrimaries(x.colorSpace),k=x.colorSpace===On||ne===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,k);let j=x.isCompressedTexture||x.image[0].isCompressedTexture,_e=x.image[0]&&x.image[0].isDataTexture,se=[];for(let $=0;$<6;$++)!j&&!_e?se[$]=m(x.image[$],!1,!0,s.maxCubemapSize):se[$]=_e?x.image[$].image:x.image[$],se[$]=ue(x,se[$]);let De=se[0],we=p(De)||a,Se=r.convert(x.format,x.colorSpace),Ee=r.convert(x.type),Te=C(x.internalFormat,Se,Ee,x.colorSpace),Qe=a&&x.isVideoTexture!==!0,Ve=D.__version===void 0||te===!0,ct=U.dataReady,F=S(x,De,we);J(i.TEXTURE_CUBE_MAP,x,we);let me;if(j){Qe&&Ve&&t.texStorage2D(i.TEXTURE_CUBE_MAP,F,Te,De.width,De.height);for(let $=0;$<6;$++){me=se[$].mipmaps;for(let ce=0;ce<me.length;ce++){let ve=me[ce];x.format!==hn?Se!==null?Qe?ct&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,0,0,ve.width,ve.height,Se,ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,Te,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qe?ct&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,0,0,ve.width,ve.height,Se,Ee,ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,Te,ve.width,ve.height,0,Se,Ee,ve.data)}}}else{if(me=x.mipmaps,Qe&&Ve){me.length>0&&F++;let $=Re(se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,F,Te,$.width,$.height)}for(let $=0;$<6;$++)if(_e){Qe?ct&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,se[$].width,se[$].height,Se,Ee,se[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Te,se[$].width,se[$].height,0,Se,Ee,se[$].data);for(let ce=0;ce<me.length;ce++){let Ke=me[ce].image[$].image;Qe?ct&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,0,0,Ke.width,Ke.height,Se,Ee,Ke.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,Te,Ke.width,Ke.height,0,Se,Ee,Ke.data)}}else{Qe?ct&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Se,Ee,se[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Te,Se,Ee,se[$]);for(let ce=0;ce<me.length;ce++){let ve=me[ce];Qe?ct&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,0,0,Se,Ee,ve.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,Te,Se,Ee,ve.image[$])}}}v(x,we)&&E(i.TEXTURE_CUBE_MAP),D.__version=U.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function be(A,x,G,te,U,D){let ne=r.convert(G.format,G.colorSpace),ae=r.convert(G.type),k=C(G.internalFormat,ne,ae,G.colorSpace);if(!n.get(x).__hasExternalTextures){let _e=Math.max(1,x.width>>D),se=Math.max(1,x.height>>D);U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?t.texImage3D(U,D,k,_e,se,x.depth,0,ne,ae,null):t.texImage2D(U,D,k,_e,se,0,ne,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),oe(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,U,n.get(G).__webglTexture,0,Le(x)):(U===i.TEXTURE_2D||U>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&U<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,te,U,n.get(G).__webglTexture,D),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(A,x,G){if(i.bindRenderbuffer(i.RENDERBUFFER,A),x.depthBuffer&&!x.stencilBuffer){let te=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(G||oe(x)){let U=x.depthTexture;U&&U.isDepthTexture&&(U.type===mn?te=i.DEPTH_COMPONENT32F:U.type===Bn&&(te=i.DEPTH_COMPONENT24));let D=Le(x);oe(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,D,te,x.width,x.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,D,te,x.width,x.height)}else i.renderbufferStorage(i.RENDERBUFFER,te,x.width,x.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(x.depthBuffer&&x.stencilBuffer){let te=Le(x);G&&oe(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,te,i.DEPTH24_STENCIL8,x.width,x.height):oe(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te,i.DEPTH24_STENCIL8,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{let te=x.textures;for(let U=0;U<te.length;U++){let D=te[U],ne=r.convert(D.format,D.colorSpace),ae=r.convert(D.type),k=C(D.internalFormat,ne,ae,D.colorSpace),j=Le(x);G&&oe(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,j,k,x.width,x.height):oe(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,j,k,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,k,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function He(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),B(x.depthTexture,0);let te=n.get(x.depthTexture).__webglTexture,U=Le(x);if(x.depthTexture.format===ai)oe(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,U):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(x.depthTexture.format===Vi)oe(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,U):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Pe(A){let x=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");He(x.__webglFramebuffer,A)}else if(G){x.__webglDepthbuffer=[];for(let te=0;te<6;te++)t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[te]),x.__webglDepthbuffer[te]=i.createRenderbuffer(),fe(x.__webglDepthbuffer[te],A,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),fe(x.__webglDepthbuffer,A,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function H(A,x,G){let te=n.get(A);x!==void 0&&be(te.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Pe(A)}function st(A){let x=A.texture,G=n.get(A),te=n.get(x);A.addEventListener("dispose",I);let U=A.textures,D=A.isWebGLCubeRenderTarget===!0,ne=U.length>1,ae=p(A)||a;if(ne||(te.__webglTexture===void 0&&(te.__webglTexture=i.createTexture()),te.__version=x.version,o.memory.textures++),D){G.__webglFramebuffer=[];for(let k=0;k<6;k++)if(a&&x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer[k]=[];for(let j=0;j<x.mipmaps.length;j++)G.__webglFramebuffer[k][j]=i.createFramebuffer()}else G.__webglFramebuffer[k]=i.createFramebuffer()}else{if(a&&x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer=[];for(let k=0;k<x.mipmaps.length;k++)G.__webglFramebuffer[k]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(ne)if(s.drawBuffers)for(let k=0,j=U.length;k<j;k++){let _e=n.get(U[k]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),o.memory.textures++)}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&oe(A)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let k=0;k<U.length;k++){let j=U[k];G.__webglColorRenderbuffer[k]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[k]);let _e=r.convert(j.format,j.colorSpace),se=r.convert(j.type),De=C(j.internalFormat,_e,se,j.colorSpace,A.isXRRenderTarget===!0),we=Le(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,we,De,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+k,i.RENDERBUFFER,G.__webglColorRenderbuffer[k])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(G.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(D){t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture),J(i.TEXTURE_CUBE_MAP,x,ae);for(let k=0;k<6;k++)if(a&&x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)be(G.__webglFramebuffer[k][j],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+k,j);else be(G.__webglFramebuffer[k],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+k,0);v(x,ae)&&E(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ne){for(let k=0,j=U.length;k<j;k++){let _e=U[k],se=n.get(_e);t.bindTexture(i.TEXTURE_2D,se.__webglTexture),J(i.TEXTURE_2D,_e,ae),be(G.__webglFramebuffer,A,_e,i.COLOR_ATTACHMENT0+k,i.TEXTURE_2D,0),v(_e,ae)&&E(i.TEXTURE_2D)}t.unbindTexture()}else{let k=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?k=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(k,te.__webglTexture),J(k,x,ae),a&&x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)be(G.__webglFramebuffer[j],A,x,i.COLOR_ATTACHMENT0,k,j);else be(G.__webglFramebuffer,A,x,i.COLOR_ATTACHMENT0,k,0);v(x,ae)&&E(k),t.unbindTexture()}A.depthBuffer&&Pe(A)}function Ae(A){let x=p(A)||a,G=A.textures;for(let te=0,U=G.length;te<U;te++){let D=G[te];if(v(D,x)){let ne=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ae=n.get(D).__webglTexture;t.bindTexture(ne,ae),E(ne),t.unbindTexture()}}}function Oe(A){if(a&&A.samples>0&&oe(A)===!1){let x=A.textures,G=A.width,te=A.height,U=i.COLOR_BUFFER_BIT,D=[],ne=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=n.get(A),k=x.length>1;if(k)for(let j=0;j<x.length;j++)t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let j=0;j<x.length;j++){D.push(i.COLOR_ATTACHMENT0+j),A.depthBuffer&&D.push(ne);let _e=ae.__ignoreDepthValues!==void 0?ae.__ignoreDepthValues:!1;if(_e===!1&&(A.depthBuffer&&(U|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(U|=i.STENCIL_BUFFER_BIT)),k&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ae.__webglColorRenderbuffer[j]),_e===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[ne]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[ne])),k){let se=n.get(x[j]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,G,te,0,0,G,te,U,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,D)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),k)for(let j=0;j<x.length;j++){t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,ae.__webglColorRenderbuffer[j]);let _e=n.get(x[j]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,_e,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}}function Le(A){return Math.min(s.maxSamples,A.samples)}function oe(A){let x=n.get(A);return a&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function K(A){let x=o.render.frame;u.get(A)!==x&&(u.set(A,x),A.update())}function ue(A,x){let G=A.colorSpace,te=A.format,U=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===Xo||G!==Xn&&G!==On&&(nt.getTransfer(G)===lt?a===!1?e.has("EXT_sRGB")===!0&&te===hn?(A.format=Xo,A.minFilter=Bt,A.generateMipmaps=!1):x=xr.sRGBToLinear(x):(te!==hn||U!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),x}function Re(A){return typeof HTMLImageElement!="undefined"&&A instanceof HTMLImageElement?(h.width=A.naturalWidth||A.width,h.height=A.naturalHeight||A.height):typeof VideoFrame!="undefined"&&A instanceof VideoFrame?(h.width=A.displayWidth,h.height=A.displayHeight):(h.width=A.width,h.height=A.height),h}this.allocateTextureUnit=Y,this.resetTextureUnits=L,this.setTexture2D=B,this.setTexture2DArray=z,this.setTexture3D=W,this.setTextureCube=ie,this.rebindTextures=H,this.setupRenderTarget=st,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=be,this.useMultisampledRTT=oe}function D0(i,e,t){let n=t.isWebGL2;function s(r,o=On){let a,l=nt.getTransfer(o);if(r===Vn)return i.UNSIGNED_BYTE;if(r===Wc)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Xc)return i.UNSIGNED_SHORT_5_5_5_1;if(r===uu)return i.BYTE;if(r===du)return i.SHORT;if(r===La)return i.UNSIGNED_SHORT;if(r===Gc)return i.INT;if(r===Bn)return i.UNSIGNED_INT;if(r===mn)return i.FLOAT;if(r===ms)return n?i.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===fu)return i.ALPHA;if(r===hn)return i.RGBA;if(r===pu)return i.LUMINANCE;if(r===mu)return i.LUMINANCE_ALPHA;if(r===ai)return i.DEPTH_COMPONENT;if(r===Vi)return i.DEPTH_STENCIL;if(r===Xo)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===qc)return i.RED;if(r===Yc)return i.RED_INTEGER;if(r===gu)return i.RG;if(r===Zc)return i.RG_INTEGER;if(r===Jc)return i.RGBA_INTEGER;if(r===io||r===so||r===ro||r===oo)if(l===lt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===io)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===so)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ro)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===oo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===io)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===so)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ro)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===oo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===al||r===ll||r===cl||r===hl)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===al)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ll)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===cl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===hl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===$c)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ul||r===dl)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===ul)return l===lt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===dl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===fl||r===pl||r===ml||r===gl||r===vl||r===_l||r===xl||r===yl||r===Ml||r===El||r===Sl||r===bl||r===wl||r===Tl)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===fl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===pl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ml)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===gl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===vl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===_l)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===xl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===yl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ml)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===El)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Sl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===bl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===wl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Tl)return l===lt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ao||r===Al||r===Rl)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===ao)return l===lt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Al)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Rl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===vu||r===Cl||r===Pl||r===Il)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===ao)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Cl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Pl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Il)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===oi?n?i.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var ra=class extends et{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Wt=class extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}},N0={type:"move"},hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Wt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},F0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,O0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,oa=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new Xt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}render(e,t){if(this.texture!==null){if(this.mesh===null){let n=t.cameras[0].viewport,s=new Be({extensions:{fragDepth:!0},vertexShader:F0,fragmentShader:O0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new xe(new Ge(20,20),s)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}},aa=class extends Gn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,y=new oa,m=t.getContextAttributes(),p=null,M=null,v=[],E=[],C=new ye,S=null,T=new et;T.layers.enable(1),T.viewport=new dt;let P=new et;P.layers.enable(2),P.viewport=new dt;let I=[T,P],_=new ra;_.layers.enable(1),_.layers.enable(2);let b=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let le=v[J];return le===void 0&&(le=new hs,v[J]=le),le.getTargetRaySpace()},this.getControllerGrip=function(J){let le=v[J];return le===void 0&&(le=new hs,v[J]=le),le.getGripSpace()},this.getHand=function(J){let le=v[J];return le===void 0&&(le=new hs,v[J]=le),le.getHandSpace()};function O(J){let le=E.indexOf(J.inputSource);if(le===-1)return;let pe=v[le];pe!==void 0&&(pe.update(J.inputSource,J.frame,c||o),pe.dispatchEvent({type:J.type,data:J.inputSource}))}function L(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",Y);for(let J=0;J<v.length;J++){let le=E[J];le!==null&&(E[J]=null,v[J].disconnect(le))}b=null,N=null,y.reset(),e.setRenderTarget(p),d=null,f=null,u=null,s=null,M=null,Ce.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",L),s.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(C),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let le={antialias:s.renderState.layers===void 0?m.antialias:!0,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,le),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new Tn(d.framebufferWidth,d.framebufferHeight,{format:hn,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let le=null,pe=null,Ue=null;m.depth&&(Ue=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=m.stencil?Vi:ai,pe=m.stencil?oi:Bn);let be={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(be),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new Tn(f.textureWidth,f.textureHeight,{format:hn,type:Vn,depthTexture:new Rr(f.textureWidth,f.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0});let fe=e.properties.get(M);fe.__ignoreDepthValues=f.ignoreDepthValues}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ce.setContext(s),Ce.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function Y(J){for(let le=0;le<J.removed.length;le++){let pe=J.removed[le],Ue=E.indexOf(pe);Ue>=0&&(E[Ue]=null,v[Ue].disconnect(pe))}for(let le=0;le<J.added.length;le++){let pe=J.added[le],Ue=E.indexOf(pe);if(Ue===-1){for(let fe=0;fe<v.length;fe++)if(fe>=E.length){E.push(pe),Ue=fe;break}else if(E[fe]===null){E[fe]=pe,Ue=fe;break}if(Ue===-1)break}let be=v[Ue];be&&be.connect(pe)}}let q=new R,B=new R;function z(J,le,pe){q.setFromMatrixPosition(le.matrixWorld),B.setFromMatrixPosition(pe.matrixWorld);let Ue=q.distanceTo(B),be=le.projectionMatrix.elements,fe=pe.projectionMatrix.elements,He=be[14]/(be[10]-1),Pe=be[14]/(be[10]+1),H=(be[9]+1)/be[5],st=(be[9]-1)/be[5],Ae=(be[8]-1)/be[0],Oe=(fe[8]+1)/fe[0],Le=He*Ae,oe=He*Oe,K=Ue/(-Ae+Oe),ue=K*-Ae;le.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ue),J.translateZ(K),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();let Re=He+K,A=Pe+K,x=Le-ue,G=oe+(Ue-ue),te=H*Pe/A*Re,U=st*Pe/A*Re;J.projectionMatrix.makePerspective(x,G,te,U,Re,A),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function W(J,le){le===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(le.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;y.texture!==null&&(J.near=y.depthNear,J.far=y.depthFar),_.near=P.near=T.near=J.near,_.far=P.far=T.far=J.far,(b!==_.near||N!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),b=_.near,N=_.far,T.near=b,T.far=N,P.near=b,P.far=N,T.updateProjectionMatrix(),P.updateProjectionMatrix(),J.updateProjectionMatrix());let le=J.parent,pe=_.cameras;W(_,le);for(let Ue=0;Ue<pe.length;Ue++)W(pe[Ue],le);pe.length===2?z(_,T,P):_.projectionMatrix.copy(T.projectionMatrix),ie(J,_,le)};function ie(J,le,pe){pe===null?J.matrix.copy(le.matrixWorld):(J.matrix.copy(pe.matrixWorld),J.matrix.invert(),J.matrix.multiply(le.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(le.projectionMatrix),J.projectionMatrixInverse.copy(le.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=gs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(J){l=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null};let re=null;function he(J,le){if(h=le.getViewerPose(c||o),g=le,h!==null){let pe=h.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let Ue=!1;pe.length!==_.cameras.length&&(_.cameras.length=0,Ue=!0);for(let fe=0;fe<pe.length;fe++){let He=pe[fe],Pe=null;if(d!==null)Pe=d.getViewport(He);else{let st=u.getViewSubImage(f,He);Pe=st.viewport,fe===0&&(e.setRenderTargetTextures(M,st.colorTexture,f.ignoreDepthValues?void 0:st.depthStencilTexture),e.setRenderTarget(M))}let H=I[fe];H===void 0&&(H=new et,H.layers.enable(fe),H.viewport=new dt,I[fe]=H),H.matrix.fromArray(He.transform.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale),H.projectionMatrix.fromArray(He.projectionMatrix),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),H.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),fe===0&&(_.matrix.copy(H.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),Ue===!0&&_.cameras.push(H)}let be=s.enabledFeatures;if(be&&be.includes("depth-sensing")){let fe=u.getDepthInformation(pe[0]);fe&&fe.isValid&&fe.texture&&y.init(e,fe,s.renderState)}}for(let pe=0;pe<v.length;pe++){let Ue=E[pe],be=v[pe];Ue!==null&&be!==void 0&&be.update(Ue,le,c||o)}y.render(e,_),re&&re(J,le),le.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:le}),g=null}let Ce=new nh;Ce.setAnimationLoop(he),this.setAnimationLoop=function(J){re=J},this.dispose=function(){}}},ti=new zt,B0=new $e;function z0(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,th(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,v,E){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,E)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===ft&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===ft&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),v=M.envMap,E=M.envMapRotation;if(v&&(m.envMap.value=v,ti.copy(E),ti.x*=-1,ti.y*=-1,ti.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),m.envMapRotation.value.setFromMatrix4(B0.makeRotationFromEuler(ti)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;let C=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*C,t(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),e.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ft&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function H0(i,e,t,n){let s={},r={},o=[],a=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(M,v){let E=v.program;n.uniformBlockBinding(M,E)}function c(M,v){let E=s[M.id];E===void 0&&(g(M),E=h(M),s[M.id]=E,M.addEventListener("dispose",m));let C=v.program;n.updateUBOMapping(M,C);let S=e.render.frame;r[M.id]!==S&&(f(M),r[M.id]=S)}function h(M){let v=u();M.__bindingPointIndex=v;let E=i.createBuffer(),C=M.__size,S=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,C,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,E),E}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){let v=s[M.id],E=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let S=0,T=E.length;S<T;S++){let P=Array.isArray(E[S])?E[S]:[E[S]];for(let I=0,_=P.length;I<_;I++){let b=P[I];if(d(b,S,I,C)===!0){let N=b.__offset,O=Array.isArray(b.value)?b.value:[b.value],L=0;for(let Y=0;Y<O.length;Y++){let q=O[Y],B=y(q);typeof q=="number"||typeof q=="boolean"?(b.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,N+L,b.__data)):q.isMatrix3?(b.__data[0]=q.elements[0],b.__data[1]=q.elements[1],b.__data[2]=q.elements[2],b.__data[3]=0,b.__data[4]=q.elements[3],b.__data[5]=q.elements[4],b.__data[6]=q.elements[5],b.__data[7]=0,b.__data[8]=q.elements[6],b.__data[9]=q.elements[7],b.__data[10]=q.elements[8],b.__data[11]=0):(q.toArray(b.__data,L),L+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,b.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(M,v,E,C){let S=M.value,T=v+"_"+E;if(C[T]===void 0)return typeof S=="number"||typeof S=="boolean"?C[T]=S:C[T]=S.clone(),!0;{let P=C[T];if(typeof S=="number"||typeof S=="boolean"){if(P!==S)return C[T]=S,!0}else if(P.equals(S)===!1)return P.copy(S),!0}return!1}function g(M){let v=M.uniforms,E=0,C=16;for(let T=0,P=v.length;T<P;T++){let I=Array.isArray(v[T])?v[T]:[v[T]];for(let _=0,b=I.length;_<b;_++){let N=I[_],O=Array.isArray(N.value)?N.value:[N.value];for(let L=0,Y=O.length;L<Y;L++){let q=O[L],B=y(q),z=E%C;z!==0&&C-z<B.boundary&&(E+=C-z),N.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=E,E+=B.storage}}}let S=E%C;return S>0&&(E+=C-S),M.__size=E,M.__cache={},this}function y(M){let v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){let v=M.target;v.removeEventListener("dispose",m);let E=o.indexOf(v.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(let M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var ys=class{constructor(e={}){let{canvas:t=ku(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let d=new Uint32Array(4),g=new Int32Array(4),y=null,m=null,p=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Jt,this._useLegacyLights=!1,this.toneMapping=Hn,this.toneMappingExposure=1;let v=this,E=!1,C=0,S=0,T=null,P=-1,I=null,_=new dt,b=new dt,N=null,O=new ge(0),L=0,Y=t.width,q=t.height,B=1,z=null,W=null,ie=new dt(0,0,Y,q),re=new dt(0,0,Y,q),he=!1,Ce=new xs,J=!1,le=!1,pe=null,Ue=new $e,be=new ye,fe=new R,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Pe(){return T===null?B:1}let H=n;function st(w,V){for(let Q=0;Q<w.length;Q++){let ee=w[Q],Z=t.getContext(ee,V);if(Z!==null)return Z}return null}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r162"),t.addEventListener("webglcontextlost",ct,!1),t.addEventListener("webglcontextrestored",F,!1),t.addEventListener("webglcontextcreationerror",me,!1),H===null){let V=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&V.shift(),H=st(V,w),H===null)throw st(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext!="undefined"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Ae,Oe,Le,oe,K,ue,Re,A,x,G,te,U,D,ne,ae,k,j,_e,se,De,we,Se,Ee,Te;function Qe(){Ae=new nm(H),Oe=new $p(H,Ae,e),Ae.init(Oe),Se=new D0(H,Ae,Oe),Le=new L0(H,Ae,Oe),oe=new rm(H),K=new y0,ue=new U0(H,Ae,Le,K,Oe,Se,oe),Re=new jp(v),A=new tm(v),x=new hd(H,Oe),Ee=new Zp(H,Ae,x,Oe),G=new im(H,x,oe,Ee),te=new cm(H,G,x,oe),se=new lm(H,Oe,ue),k=new Kp(K),U=new x0(v,Re,A,Ae,Oe,Ee,k),D=new z0(v,K),ne=new E0,ae=new R0(Ae,Oe),_e=new Yp(v,Re,A,Le,te,f,l),j=new I0(v,te,Oe),Te=new H0(H,oe,Oe,Le),De=new Jp(H,Ae,oe,Oe),we=new sm(H,Ae,oe,Oe),oe.programs=U.programs,v.capabilities=Oe,v.extensions=Ae,v.properties=K,v.renderLists=ne,v.shadowMap=j,v.state=Le,v.info=oe}Qe();let Ve=new aa(v,H);this.xr=Ve,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){let w=Ae.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Ae.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(w){w!==void 0&&(B=w,this.setSize(Y,q,!1))},this.getSize=function(w){return w.set(Y,q)},this.setSize=function(w,V,Q=!0){if(Ve.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=w,q=V,t.width=Math.floor(w*B),t.height=Math.floor(V*B),Q===!0&&(t.style.width=w+"px",t.style.height=V+"px"),this.setViewport(0,0,w,V)},this.getDrawingBufferSize=function(w){return w.set(Y*B,q*B).floor()},this.setDrawingBufferSize=function(w,V,Q){Y=w,q=V,B=Q,t.width=Math.floor(w*Q),t.height=Math.floor(V*Q),this.setViewport(0,0,w,V)},this.getCurrentViewport=function(w){return w.copy(_)},this.getViewport=function(w){return w.copy(ie)},this.setViewport=function(w,V,Q,ee){w.isVector4?ie.set(w.x,w.y,w.z,w.w):ie.set(w,V,Q,ee),Le.viewport(_.copy(ie).multiplyScalar(B).round())},this.getScissor=function(w){return w.copy(re)},this.setScissor=function(w,V,Q,ee){w.isVector4?re.set(w.x,w.y,w.z,w.w):re.set(w,V,Q,ee),Le.scissor(b.copy(re).multiplyScalar(B).round())},this.getScissorTest=function(){return he},this.setScissorTest=function(w){Le.setScissorTest(he=w)},this.setOpaqueSort=function(w){z=w},this.setTransparentSort=function(w){W=w},this.getClearColor=function(w){return w.copy(_e.getClearColor())},this.setClearColor=function(){_e.setClearColor.apply(_e,arguments)},this.getClearAlpha=function(){return _e.getClearAlpha()},this.setClearAlpha=function(){_e.setClearAlpha.apply(_e,arguments)},this.clear=function(w=!0,V=!0,Q=!0){let ee=0;if(w){let Z=!1;if(T!==null){let Me=T.texture.format;Z=Me===Jc||Me===Zc||Me===Yc}if(Z){let Me=T.texture.type,Ie=Me===Vn||Me===Bn||Me===La||Me===oi||Me===Wc||Me===Xc,Ne=_e.getClearColor(),Fe=_e.getClearAlpha(),Ze=Ne.r,ze=Ne.g,ke=Ne.b;Ie?(d[0]=Ze,d[1]=ze,d[2]=ke,d[3]=Fe,H.clearBufferuiv(H.COLOR,0,d)):(g[0]=Ze,g[1]=ze,g[2]=ke,g[3]=Fe,H.clearBufferiv(H.COLOR,0,g))}else ee|=H.COLOR_BUFFER_BIT}V&&(ee|=H.DEPTH_BUFFER_BIT),Q&&(ee|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(ee)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",F,!1),t.removeEventListener("webglcontextcreationerror",me,!1),ne.dispose(),ae.dispose(),K.dispose(),Re.dispose(),A.dispose(),te.dispose(),Ee.dispose(),Te.dispose(),U.dispose(),Ve.dispose(),Ve.removeEventListener("sessionstart",Kt),Ve.removeEventListener("sessionend",ot),pe&&(pe.dispose(),pe=null),Ht.stop()};function ct(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let w=oe.autoReset,V=j.enabled,Q=j.autoUpdate,ee=j.needsUpdate,Z=j.type;Qe(),oe.autoReset=w,j.enabled=V,j.autoUpdate=Q,j.needsUpdate=ee,j.type=Z}function me(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function $(w){let V=w.target;V.removeEventListener("dispose",$),ce(V)}function ce(w){ve(w),K.remove(w)}function ve(w){let V=K.get(w).programs;V!==void 0&&(V.forEach(function(Q){U.releaseProgram(Q)}),w.isShaderMaterial&&U.releaseShaderCache(w))}this.renderBufferDirect=function(w,V,Q,ee,Z,Me){V===null&&(V=He);let Ie=Z.isMesh&&Z.matrixWorld.determinant()<0,Ne=Ah(w,V,Q,ee,Z);Le.setMaterial(ee,Ie);let Fe=Q.index,Ze=1;if(ee.wireframe===!0){if(Fe=G.getWireframeAttribute(Q),Fe===void 0)return;Ze=2}let ze=Q.drawRange,ke=Q.attributes.position,xt=ze.start*Ze,qt=(ze.start+ze.count)*Ze;Me!==null&&(xt=Math.max(xt,Me.start*Ze),qt=Math.min(qt,(Me.start+Me.count)*Ze)),Fe!==null?(xt=Math.max(xt,0),qt=Math.min(qt,Fe.count)):ke!=null&&(xt=Math.max(xt,0),qt=Math.min(qt,ke.count));let Tt=qt-xt;if(Tt<0||Tt===1/0)return;Ee.setup(Z,ee,Ne,Q,Fe);let vn,pt=De;if(Fe!==null&&(vn=x.get(Fe),pt=we,pt.setIndex(vn)),Z.isMesh)ee.wireframe===!0?(Le.setLineWidth(ee.wireframeLinewidth*Pe()),pt.setMode(H.LINES)):pt.setMode(H.TRIANGLES);else if(Z.isLine){let Xe=ee.linewidth;Xe===void 0&&(Xe=1),Le.setLineWidth(Xe*Pe()),Z.isLineSegments?pt.setMode(H.LINES):Z.isLineLoop?pt.setMode(H.LINE_LOOP):pt.setMode(H.LINE_STRIP)}else Z.isPoints?pt.setMode(H.POINTS):Z.isSprite&&pt.setMode(H.TRIANGLES);if(Z.isBatchedMesh)pt.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else if(Z.isInstancedMesh)pt.renderInstances(xt,Tt,Z.count);else if(Q.isInstancedBufferGeometry){let Xe=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,jr=Math.min(Q.instanceCount,Xe);pt.renderInstances(xt,Tt,jr)}else pt.render(xt,Tt)};function Ke(w,V,Q){w.transparent===!0&&w.side===mt&&w.forceSinglePass===!1?(w.side=ft,w.needsUpdate=!0,Ds(w,V,Q),w.side=kn,w.needsUpdate=!0,Ds(w,V,Q),w.side=mt):Ds(w,V,Q)}this.compile=function(w,V,Q=null){Q===null&&(Q=w),m=ae.get(Q),m.init(),M.push(m),Q.traverseVisible(function(Z){Z.isLight&&Z.layers.test(V.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),w!==Q&&w.traverseVisible(function(Z){Z.isLight&&Z.layers.test(V.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),m.setupLights(v._useLegacyLights);let ee=new Set;return w.traverse(function(Z){let Me=Z.material;if(Me)if(Array.isArray(Me))for(let Ie=0;Ie<Me.length;Ie++){let Ne=Me[Ie];Ke(Ne,Q,Z),ee.add(Ne)}else Ke(Me,Q,Z),ee.add(Me)}),M.pop(),m=null,ee},this.compileAsync=function(w,V,Q=null){let ee=this.compile(w,V,Q);return new Promise(Z=>{function Me(){if(ee.forEach(function(Ie){K.get(Ie).currentProgram.isReady()&&ee.delete(Ie)}),ee.size===0){Z(w);return}setTimeout(Me,10)}Ae.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let rt=null;function Rt(w){rt&&rt(w)}function Kt(){Ht.stop()}function ot(){Ht.start()}let Ht=new nh;Ht.setAnimationLoop(Rt),typeof self!="undefined"&&Ht.setContext(self),this.setAnimationLoop=function(w){rt=w,Ve.setAnimationLoop(w),w===null?Ht.stop():Ht.start()},Ve.addEventListener("sessionstart",Kt),Ve.addEventListener("sessionend",ot),this.render=function(w,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Ve.enabled===!0&&Ve.isPresenting===!0&&(Ve.cameraAutoUpdate===!0&&Ve.updateCamera(V),V=Ve.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,V,T),m=ae.get(w,M.length),m.init(),M.push(m),Ue.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Ce.setFromProjectionMatrix(Ue),le=this.localClippingEnabled,J=k.init(this.clippingPlanes,le),y=ne.get(w,p.length),y.init(),p.push(y),fn(w,V,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(z,W),this.info.render.frame++,J===!0&&k.beginShadows();let Q=m.state.shadowsArray;if(j.render(Q,w,V),J===!0&&k.endShadows(),this.info.autoReset===!0&&this.info.reset(),(Ve.enabled===!1||Ve.isPresenting===!1||Ve.hasDepthSensing()===!1)&&_e.render(y,w),m.setupLights(v._useLegacyLights),V.isArrayCamera){let ee=V.cameras;for(let Z=0,Me=ee.length;Z<Me;Z++){let Ie=ee[Z];Ja(y,w,Ie,Ie.viewport)}}else Ja(y,w,V);T!==null&&(ue.updateMultisampleRenderTarget(T),ue.updateRenderTargetMipmap(T)),w.isScene===!0&&w.onAfterRender(v,w,V),Ee.resetDefaultState(),P=-1,I=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,p.pop(),p.length>0?y=p[p.length-1]:y=null};function fn(w,V,Q,ee){if(w.visible===!1)return;if(w.layers.test(V.layers)){if(w.isGroup)Q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(V);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Ce.intersectsSprite(w)){ee&&fe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ue);let Ie=te.update(w),Ne=w.material;Ne.visible&&y.push(w,Ie,Ne,Q,fe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Ce.intersectsObject(w))){let Ie=te.update(w),Ne=w.material;if(ee&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),fe.copy(w.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),fe.copy(Ie.boundingSphere.center)),fe.applyMatrix4(w.matrixWorld).applyMatrix4(Ue)),Array.isArray(Ne)){let Fe=Ie.groups;for(let Ze=0,ze=Fe.length;Ze<ze;Ze++){let ke=Fe[Ze],xt=Ne[ke.materialIndex];xt&&xt.visible&&y.push(w,Ie,xt,Q,fe.z,ke)}}else Ne.visible&&y.push(w,Ie,Ne,Q,fe.z,null)}}let Me=w.children;for(let Ie=0,Ne=Me.length;Ie<Ne;Ie++)fn(Me[Ie],V,Q,ee)}function Ja(w,V,Q,ee){let Z=w.opaque,Me=w.transmissive,Ie=w.transparent;m.setupLightsView(Q),J===!0&&k.setGlobalState(v.clippingPlanes,Q),Me.length>0&&Th(Z,Me,V,Q),ee&&Le.viewport(_.copy(ee)),Z.length>0&&Us(Z,V,Q),Me.length>0&&Us(Me,V,Q),Ie.length>0&&Us(Ie,V,Q),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Th(w,V,Q,ee){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;let Me=Oe.isWebGL2;pe===null&&(pe=new Tn(1,1,{generateMipmaps:!0,type:Ae.has("EXT_color_buffer_half_float")?ms:Vn,minFilter:ri,samples:Me?4:0})),v.getDrawingBufferSize(be),Me?pe.setSize(be.x,be.y):pe.setSize(vr(be.x),vr(be.y));let Ie=v.getRenderTarget();v.setRenderTarget(pe),v.getClearColor(O),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear();let Ne=v.toneMapping;v.toneMapping=Hn,Us(w,Q,ee),ue.updateMultisampleRenderTarget(pe),ue.updateRenderTargetMipmap(pe);let Fe=!1;for(let Ze=0,ze=V.length;Ze<ze;Ze++){let ke=V[Ze],xt=ke.object,qt=ke.geometry,Tt=ke.material,vn=ke.group;if(Tt.side===mt&&xt.layers.test(ee.layers)){let pt=Tt.side;Tt.side=ft,Tt.needsUpdate=!0,$a(xt,Q,ee,qt,Tt,vn),Tt.side=pt,Tt.needsUpdate=!0,Fe=!0}}Fe===!0&&(ue.updateMultisampleRenderTarget(pe),ue.updateRenderTargetMipmap(pe)),v.setRenderTarget(Ie),v.setClearColor(O,L),v.toneMapping=Ne}function Us(w,V,Q){let ee=V.isScene===!0?V.overrideMaterial:null;for(let Z=0,Me=w.length;Z<Me;Z++){let Ie=w[Z],Ne=Ie.object,Fe=Ie.geometry,Ze=ee===null?Ie.material:ee,ze=Ie.group;Ne.layers.test(Q.layers)&&$a(Ne,V,Q,Fe,Ze,ze)}}function $a(w,V,Q,ee,Z,Me){w.onBeforeRender(v,V,Q,ee,Z,Me),w.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),Z.onBeforeRender(v,V,Q,ee,w,Me),Z.transparent===!0&&Z.side===mt&&Z.forceSinglePass===!1?(Z.side=ft,Z.needsUpdate=!0,v.renderBufferDirect(Q,V,ee,Z,w,Me),Z.side=kn,Z.needsUpdate=!0,v.renderBufferDirect(Q,V,ee,Z,w,Me),Z.side=mt):v.renderBufferDirect(Q,V,ee,Z,w,Me),w.onAfterRender(v,V,Q,ee,Z,Me)}function Ds(w,V,Q){V.isScene!==!0&&(V=He);let ee=K.get(w),Z=m.state.lights,Me=m.state.shadowsArray,Ie=Z.state.version,Ne=U.getParameters(w,Z.state,Me,V,Q),Fe=U.getProgramCacheKey(Ne),Ze=ee.programs;ee.environment=w.isMeshStandardMaterial?V.environment:null,ee.fog=V.fog,ee.envMap=(w.isMeshStandardMaterial?A:Re).get(w.envMap||ee.environment),ee.envMapRotation=ee.environment!==null&&w.envMap===null?V.environmentRotation:w.envMapRotation,Ze===void 0&&(w.addEventListener("dispose",$),Ze=new Map,ee.programs=Ze);let ze=Ze.get(Fe);if(ze!==void 0){if(ee.currentProgram===ze&&ee.lightsStateVersion===Ie)return ja(w,Ne),ze}else Ne.uniforms=U.getUniforms(w),w.onBuild(Q,Ne,v),w.onBeforeCompile(Ne,v),ze=U.acquireProgram(Ne,Fe),Ze.set(Fe,ze),ee.uniforms=Ne.uniforms;let ke=ee.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(ke.clippingPlanes=k.uniform),ja(w,Ne),ee.needsLights=Ch(w),ee.lightsStateVersion=Ie,ee.needsLights&&(ke.ambientLightColor.value=Z.state.ambient,ke.lightProbe.value=Z.state.probe,ke.directionalLights.value=Z.state.directional,ke.directionalLightShadows.value=Z.state.directionalShadow,ke.spotLights.value=Z.state.spot,ke.spotLightShadows.value=Z.state.spotShadow,ke.rectAreaLights.value=Z.state.rectArea,ke.ltc_1.value=Z.state.rectAreaLTC1,ke.ltc_2.value=Z.state.rectAreaLTC2,ke.pointLights.value=Z.state.point,ke.pointLightShadows.value=Z.state.pointShadow,ke.hemisphereLights.value=Z.state.hemi,ke.directionalShadowMap.value=Z.state.directionalShadowMap,ke.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,ke.spotShadowMap.value=Z.state.spotShadowMap,ke.spotLightMatrix.value=Z.state.spotLightMatrix,ke.spotLightMap.value=Z.state.spotLightMap,ke.pointShadowMap.value=Z.state.pointShadowMap,ke.pointShadowMatrix.value=Z.state.pointShadowMatrix),ee.currentProgram=ze,ee.uniformsList=null,ze}function Ka(w){if(w.uniformsList===null){let V=w.currentProgram.getUniforms();w.uniformsList=Bi.seqWithValue(V.seq,w.uniforms)}return w.uniformsList}function ja(w,V){let Q=K.get(w);Q.outputColorSpace=V.outputColorSpace,Q.batching=V.batching,Q.instancing=V.instancing,Q.instancingColor=V.instancingColor,Q.instancingMorph=V.instancingMorph,Q.skinning=V.skinning,Q.morphTargets=V.morphTargets,Q.morphNormals=V.morphNormals,Q.morphColors=V.morphColors,Q.morphTargetsCount=V.morphTargetsCount,Q.numClippingPlanes=V.numClippingPlanes,Q.numIntersection=V.numClipIntersection,Q.vertexAlphas=V.vertexAlphas,Q.vertexTangents=V.vertexTangents,Q.toneMapping=V.toneMapping}function Ah(w,V,Q,ee,Z){V.isScene!==!0&&(V=He),ue.resetTextureUnits();let Me=V.fog,Ie=ee.isMeshStandardMaterial?V.environment:null,Ne=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Xn,Fe=(ee.isMeshStandardMaterial?A:Re).get(ee.envMap||Ie),Ze=ee.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,ze=!!Q.attributes.tangent&&(!!ee.normalMap||ee.anisotropy>0),ke=!!Q.morphAttributes.position,xt=!!Q.morphAttributes.normal,qt=!!Q.morphAttributes.color,Tt=Hn;ee.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Tt=v.toneMapping);let vn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,pt=vn!==void 0?vn.length:0,Xe=K.get(ee),jr=m.state.lights;if(J===!0&&(le===!0||w!==I)){let jt=w===I&&ee.id===P;k.setState(ee,w,jt)}let ht=!1;ee.version===Xe.__version?(Xe.needsLights&&Xe.lightsStateVersion!==jr.state.version||Xe.outputColorSpace!==Ne||Z.isBatchedMesh&&Xe.batching===!1||!Z.isBatchedMesh&&Xe.batching===!0||Z.isInstancedMesh&&Xe.instancing===!1||!Z.isInstancedMesh&&Xe.instancing===!0||Z.isSkinnedMesh&&Xe.skinning===!1||!Z.isSkinnedMesh&&Xe.skinning===!0||Z.isInstancedMesh&&Xe.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Xe.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Xe.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Xe.instancingMorph===!1&&Z.morphTexture!==null||Xe.envMap!==Fe||ee.fog===!0&&Xe.fog!==Me||Xe.numClippingPlanes!==void 0&&(Xe.numClippingPlanes!==k.numPlanes||Xe.numIntersection!==k.numIntersection)||Xe.vertexAlphas!==Ze||Xe.vertexTangents!==ze||Xe.morphTargets!==ke||Xe.morphNormals!==xt||Xe.morphColors!==qt||Xe.toneMapping!==Tt||Oe.isWebGL2===!0&&Xe.morphTargetsCount!==pt)&&(ht=!0):(ht=!0,Xe.__version=ee.version);let Zn=Xe.currentProgram;ht===!0&&(Zn=Ds(ee,V,Z));let Qa=!1,Qi=!1,Qr=!1,Nt=Zn.getUniforms(),Jn=Xe.uniforms;if(Le.useProgram(Zn.program)&&(Qa=!0,Qi=!0,Qr=!0),ee.id!==P&&(P=ee.id,Qi=!0),Qa||I!==w){Nt.setValue(H,"projectionMatrix",w.projectionMatrix),Nt.setValue(H,"viewMatrix",w.matrixWorldInverse);let jt=Nt.map.cameraPosition;jt!==void 0&&jt.setValue(H,fe.setFromMatrixPosition(w.matrixWorld)),Oe.logarithmicDepthBuffer&&Nt.setValue(H,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(ee.isMeshPhongMaterial||ee.isMeshToonMaterial||ee.isMeshLambertMaterial||ee.isMeshBasicMaterial||ee.isMeshStandardMaterial||ee.isShaderMaterial)&&Nt.setValue(H,"isOrthographic",w.isOrthographicCamera===!0),I!==w&&(I=w,Qi=!0,Qr=!0)}if(Z.isSkinnedMesh){Nt.setOptional(H,Z,"bindMatrix"),Nt.setOptional(H,Z,"bindMatrixInverse");let jt=Z.skeleton;jt&&(Oe.floatVertexTextures?(jt.boneTexture===null&&jt.computeBoneTexture(),Nt.setValue(H,"boneTexture",jt.boneTexture,ue)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Z.isBatchedMesh&&(Nt.setOptional(H,Z,"batchingTexture"),Nt.setValue(H,"batchingTexture",Z._matricesTexture,ue));let eo=Q.morphAttributes;if((eo.position!==void 0||eo.normal!==void 0||eo.color!==void 0&&Oe.isWebGL2===!0)&&se.update(Z,Q,Zn),(Qi||Xe.receiveShadow!==Z.receiveShadow)&&(Xe.receiveShadow=Z.receiveShadow,Nt.setValue(H,"receiveShadow",Z.receiveShadow)),ee.isMeshGouraudMaterial&&ee.envMap!==null&&(Jn.envMap.value=Fe,Jn.flipEnvMap.value=Fe.isCubeTexture&&Fe.isRenderTargetTexture===!1?-1:1),Qi&&(Nt.setValue(H,"toneMappingExposure",v.toneMappingExposure),Xe.needsLights&&Rh(Jn,Qr),Me&&ee.fog===!0&&D.refreshFogUniforms(Jn,Me),D.refreshMaterialUniforms(Jn,ee,B,q,pe),Bi.upload(H,Ka(Xe),Jn,ue)),ee.isShaderMaterial&&ee.uniformsNeedUpdate===!0&&(Bi.upload(H,Ka(Xe),Jn,ue),ee.uniformsNeedUpdate=!1),ee.isSpriteMaterial&&Nt.setValue(H,"center",Z.center),Nt.setValue(H,"modelViewMatrix",Z.modelViewMatrix),Nt.setValue(H,"normalMatrix",Z.normalMatrix),Nt.setValue(H,"modelMatrix",Z.matrixWorld),ee.isShaderMaterial||ee.isRawShaderMaterial){let jt=ee.uniformsGroups;for(let to=0,Ph=jt.length;to<Ph;to++)if(Oe.isWebGL2){let el=jt[to];Te.update(el,Zn),Te.bind(el,Zn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Zn}function Rh(w,V){w.ambientLightColor.needsUpdate=V,w.lightProbe.needsUpdate=V,w.directionalLights.needsUpdate=V,w.directionalLightShadows.needsUpdate=V,w.pointLights.needsUpdate=V,w.pointLightShadows.needsUpdate=V,w.spotLights.needsUpdate=V,w.spotLightShadows.needsUpdate=V,w.rectAreaLights.needsUpdate=V,w.hemisphereLights.needsUpdate=V}function Ch(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(w,V,Q){K.get(w.texture).__webglTexture=V,K.get(w.depthTexture).__webglTexture=Q;let ee=K.get(w);ee.__hasExternalTextures=!0,ee.__autoAllocateDepthBuffer=Q===void 0,ee.__autoAllocateDepthBuffer||Ae.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ee.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,V){let Q=K.get(w);Q.__webglFramebuffer=V,Q.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(w,V=0,Q=0){T=w,C=V,S=Q;let ee=!0,Z=null,Me=!1,Ie=!1;if(w){let Fe=K.get(w);Fe.__useDefaultFramebuffer!==void 0?(Le.bindFramebuffer(H.FRAMEBUFFER,null),ee=!1):Fe.__webglFramebuffer===void 0?ue.setupRenderTarget(w):Fe.__hasExternalTextures&&ue.rebindTextures(w,K.get(w.texture).__webglTexture,K.get(w.depthTexture).__webglTexture);let Ze=w.texture;(Ze.isData3DTexture||Ze.isDataArrayTexture||Ze.isCompressedArrayTexture)&&(Ie=!0);let ze=K.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ze[V])?Z=ze[V][Q]:Z=ze[V],Me=!0):Oe.isWebGL2&&w.samples>0&&ue.useMultisampledRTT(w)===!1?Z=K.get(w).__webglMultisampledFramebuffer:Array.isArray(ze)?Z=ze[Q]:Z=ze,_.copy(w.viewport),b.copy(w.scissor),N=w.scissorTest}else _.copy(ie).multiplyScalar(B).floor(),b.copy(re).multiplyScalar(B).floor(),N=he;if(Le.bindFramebuffer(H.FRAMEBUFFER,Z)&&Oe.drawBuffers&&ee&&Le.drawBuffers(w,Z),Le.viewport(_),Le.scissor(b),Le.setScissorTest(N),Me){let Fe=K.get(w.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+V,Fe.__webglTexture,Q)}else if(Ie){let Fe=K.get(w.texture),Ze=V||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Fe.__webglTexture,Q||0,Ze)}P=-1},this.readRenderTargetPixels=function(w,V,Q,ee,Z,Me,Ie){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=K.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ie!==void 0&&(Ne=Ne[Ie]),Ne){Le.bindFramebuffer(H.FRAMEBUFFER,Ne);try{let Fe=w.texture,Ze=Fe.format,ze=Fe.type;if(Ze!==hn&&Se.convert(Ze)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let ke=ze===ms&&(Ae.has("EXT_color_buffer_half_float")||Oe.isWebGL2&&Ae.has("EXT_color_buffer_float"));if(ze!==Vn&&Se.convert(ze)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(ze===mn&&(Oe.isWebGL2||Ae.has("OES_texture_float")||Ae.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=w.width-ee&&Q>=0&&Q<=w.height-Z&&H.readPixels(V,Q,ee,Z,Se.convert(Ze),Se.convert(ze),Me)}finally{let Fe=T!==null?K.get(T).__webglFramebuffer:null;Le.bindFramebuffer(H.FRAMEBUFFER,Fe)}}},this.copyFramebufferToTexture=function(w,V,Q=0){let ee=Math.pow(2,-Q),Z=Math.floor(V.image.width*ee),Me=Math.floor(V.image.height*ee);ue.setTexture2D(V,0),H.copyTexSubImage2D(H.TEXTURE_2D,Q,0,0,w.x,w.y,Z,Me),Le.unbindTexture()},this.copyTextureToTexture=function(w,V,Q,ee=0){let Z=V.image.width,Me=V.image.height,Ie=Se.convert(Q.format),Ne=Se.convert(Q.type);ue.setTexture2D(Q,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,Q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,Q.unpackAlignment),V.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,ee,w.x,w.y,Z,Me,Ie,Ne,V.image.data):V.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,ee,w.x,w.y,V.mipmaps[0].width,V.mipmaps[0].height,Ie,V.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,ee,w.x,w.y,Ie,Ne,V.image),ee===0&&Q.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),Le.unbindTexture()},this.copyTextureToTexture3D=function(w,V,Q,ee,Z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Me=Math.round(w.max.x-w.min.x),Ie=Math.round(w.max.y-w.min.y),Ne=w.max.z-w.min.z+1,Fe=Se.convert(ee.format),Ze=Se.convert(ee.type),ze;if(ee.isData3DTexture)ue.setTexture3D(ee,0),ze=H.TEXTURE_3D;else if(ee.isDataArrayTexture||ee.isCompressedArrayTexture)ue.setTexture2DArray(ee,0),ze=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,ee.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,ee.unpackAlignment);let ke=H.getParameter(H.UNPACK_ROW_LENGTH),xt=H.getParameter(H.UNPACK_IMAGE_HEIGHT),qt=H.getParameter(H.UNPACK_SKIP_PIXELS),Tt=H.getParameter(H.UNPACK_SKIP_ROWS),vn=H.getParameter(H.UNPACK_SKIP_IMAGES),pt=Q.isCompressedTexture?Q.mipmaps[Z]:Q.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,pt.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,pt.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,w.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,w.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,w.min.z),Q.isDataTexture||Q.isData3DTexture?H.texSubImage3D(ze,Z,V.x,V.y,V.z,Me,Ie,Ne,Fe,Ze,pt.data):ee.isCompressedArrayTexture?H.compressedTexSubImage3D(ze,Z,V.x,V.y,V.z,Me,Ie,Ne,Fe,pt.data):H.texSubImage3D(ze,Z,V.x,V.y,V.z,Me,Ie,Ne,Fe,Ze,pt),H.pixelStorei(H.UNPACK_ROW_LENGTH,ke),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,xt),H.pixelStorei(H.UNPACK_SKIP_PIXELS,qt),H.pixelStorei(H.UNPACK_SKIP_ROWS,Tt),H.pixelStorei(H.UNPACK_SKIP_IMAGES,vn),Z===0&&ee.generateMipmaps&&H.generateMipmap(ze),Le.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?ue.setTextureCube(w,0):w.isData3DTexture?ue.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?ue.setTexture2DArray(w,0):ue.setTexture2D(w,0),Le.unbindTexture()},this.resetState=function(){C=0,S=0,T=null,Le.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Ua?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===Wr?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},la=class extends ys{};la.prototype.isWebGL1Renderer=!0;var Wi=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ge(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},Cr=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ge(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Et=class extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zt,this.environmentRotation=new zt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var ca=class extends Xt{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Ct,h=Ct,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wn=class extends Je{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Pi=new $e,bc=new $e,nr=[],wc=new An,V0=new $e,rs=new xe,os=new Rn,en=class extends xe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Wn(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,V0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new An),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),wc.copy(e.boundingBox).applyMatrix4(Pi),this.boundingBox.union(wc)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Rn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),os.copy(e.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(os)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(rs.geometry=this.geometry,rs.material=this.material,rs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),os.copy(this.boundingSphere),os.applyMatrix4(n),e.ray.intersectsSphere(os)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Pi),bc.multiplyMatrices(n,Pi),rs.matrixWorld=bc,rs.raycast(e,nr);for(let o=0,a=nr.length;o<a;o++){let l=nr[o];l.instanceId=r,l.object=this,t.push(l)}nr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Wn(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ca(new Float32Array(s*this.count),s,this.count,qc,mn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Ms=class extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Tc=new R,Ac=new R,Rc=new $e,Do=new vs,ir=new Rn,Es=class extends Lt{constructor(e=new tt,t=new Ms){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Tc.fromBufferAttribute(t,s-1),Ac.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Tc.distanceTo(Ac);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(s),ir.radius+=r,e.ray.intersectsSphere(ir)===!1)return;Rc.copy(s).invert(),Do.copy(e.ray).applyMatrix4(Rc);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new R,h=new R,u=new R,f=new R,d=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){let p=Math.max(0,o.start),M=Math.min(g.count,o.start+o.count);for(let v=p,E=M-1;v<E;v+=d){let C=g.getX(v),S=g.getX(v+1);if(c.fromBufferAttribute(m,C),h.fromBufferAttribute(m,S),Do.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);let P=e.ray.origin.distanceTo(f);P<e.near||P>e.far||t.push({distance:P,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{let p=Math.max(0,o.start),M=Math.min(m.count,o.start+o.count);for(let v=p,E=M-1;v<E;v+=d){if(c.fromBufferAttribute(m,v),h.fromBufferAttribute(m,v+1),Do.distanceSqToSegment(c,h,f,u)>l)continue;f.applyMatrix4(this.matrixWorld);let S=e.ray.origin.distanceTo(f);S<e.near||S>e.far||t.push({distance:S,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}},Cc=new R,Pc=new R,Xi=class extends Es{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Cc.fromBufferAttribute(t,s),Pc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Cc.distanceTo(Pc);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Pn=class extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ic=new $e,ha=new vs,sr=new Rn,rr=new R,gn=class extends Lt{constructor(e=new tt,t=new Pn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(s),sr.radius+=r,e.ray.intersectsSphere(sr)===!1)return;Ic.copy(s).invert(),ha.copy(e.ray).applyMatrix4(Ic);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=f,y=d;g<y;g++){let m=c.getX(g);rr.fromBufferAttribute(u,m),Lc(rr,m,l,s,e,t,this)}}else{let f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let g=f,y=d;g<y;g++)rr.fromBufferAttribute(u,g),Lc(rr,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Lc(i,e,t,n,s,r,o){let a=ha.distanceSqToPoint(i);if(a<t){let l=new R;ha.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,object:o})}}var qi=class extends Xt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},tn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ye:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new R,s=[],r=[],o=[],a=new R,l=new $e;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Pt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(Pt(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ss=class extends tn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ye){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ua=class extends Ss{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Fa(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var or=new R,No=new Fa,Fo=new Fa,Oo=new Fa,bs=class extends tn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new R){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(or.subVectors(s[0],s[1]).add(s[0]),c=or);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(or.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=or),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),d),y=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),No.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,y,m),Fo.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,y,m),Oo.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(No.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Fo.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Oo.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(No.calc(l),Fo.calc(l),Oo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new R().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Uc(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function k0(i,e){let t=1-i;return t*t*e}function G0(i,e){return 2*(1-i)*i*e}function W0(i,e){return i*i*e}function us(i,e,t,n){return k0(i,e)+G0(i,t)+W0(i,n)}function X0(i,e){let t=1-i;return t*t*t*e}function q0(i,e){let t=1-i;return 3*t*t*i*e}function Y0(i,e){return 3*(1-i)*i*i*e}function Z0(i,e){return i*i*i*e}function ds(i,e,t,n,s){return X0(i,e)+q0(i,t)+Y0(i,n)+Z0(i,s)}var Pr=class extends tn{constructor(e=new ye,t=new ye,n=new ye,s=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ye){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(e,s.x,r.x,o.x,a.x),ds(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},da=class extends tn{constructor(e=new R,t=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(e,s.x,r.x,o.x,a.x),ds(e,s.y,r.y,o.y,a.y),ds(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ir=class extends tn{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fa=class extends tn{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Lr=class extends tn{constructor(e=new ye,t=new ye,n=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ye){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(us(e,s.x,r.x,o.x),us(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ur=class extends tn{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(us(e,s.x,r.x,o.x),us(e,s.y,r.y,o.y),us(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Dr=class extends tn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Uc(a,l.x,c.x,h.x,u.x),Uc(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ye().fromArray(s))}return this}},pa=Object.freeze({__proto__:null,ArcCurve:ua,CatmullRomCurve3:bs,CubicBezierCurve:Pr,CubicBezierCurve3:da,EllipseCurve:Ss,LineCurve:Ir,LineCurve3:fa,QuadraticBezierCurve:Lr,QuadraticBezierCurve3:Ur,SplineCurve:Dr}),ma=class extends tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new pa[s.type]().fromJSON(s))}return this}},Nr=class extends ma{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ir(this.currentPoint.clone(),new ye(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Lr(this.currentPoint.clone(),new ye(e,t),new ye(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Pr(this.currentPoint.clone(),new ye(e,t),new ye(n,s),new ye(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Dr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Ss(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}};var Fr=class i extends tt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new R,h=new ye;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*s;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new je(o,3)),this.setAttribute("normal",new je(a,3)),this.setAttribute("uv",new je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Gt=class i extends tt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,y=[],m=n/2,p=0;M(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(f,3)),this.setAttribute("uv",new je(d,2));function M(){let E=new R,C=new R,S=0,T=(t-e)/n;for(let P=0;P<=r;P++){let I=[],_=P/r,b=_*(t-e)+e;for(let N=0;N<=s;N++){let O=N/s,L=O*l+a,Y=Math.sin(L),q=Math.cos(L);C.x=b*Y,C.y=-_*n+m,C.z=b*q,u.push(C.x,C.y,C.z),E.set(Y,T,q).normalize(),f.push(E.x,E.y,E.z),d.push(O,1-_),I.push(g++)}y.push(I)}for(let P=0;P<s;P++)for(let I=0;I<r;I++){let _=y[I][P],b=y[I+1][P],N=y[I+1][P+1],O=y[I][P+1];h.push(_,b,O),h.push(b,N,O),S+=6}c.addGroup(p,S,0),p+=S}function v(E){let C=g,S=new ye,T=new R,P=0,I=E===!0?e:t,_=E===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*_,0),f.push(0,_,0),d.push(.5,.5),g++;let b=g;for(let N=0;N<=s;N++){let L=N/s*l+a,Y=Math.cos(L),q=Math.sin(L);T.x=I*q,T.y=m*_,T.z=I*Y,u.push(T.x,T.y,T.z),f.push(0,_,0),S.x=Y*.5+.5,S.y=q*.5*_+.5,d.push(S.x,S.y),g++}for(let N=0;N<s;N++){let O=C+N,L=b+N;E===!0?h.push(L,L+1,O):h.push(L+1,L,O),P+=3}c.addGroup(p,P,E===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Or=class i extends Gt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ga=class i extends tt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new je(r,3)),this.setAttribute("normal",new je(r.slice(),3)),this.setAttribute("uv",new je(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let v=new R,E=new R,C=new R;for(let S=0;S<t.length;S+=3)d(t[S+0],v),d(t[S+1],E),d(t[S+2],C),l(v,E,C,M)}function l(M,v,E,C){let S=C+1,T=[];for(let P=0;P<=S;P++){T[P]=[];let I=M.clone().lerp(E,P/S),_=v.clone().lerp(E,P/S),b=S-P;for(let N=0;N<=b;N++)N===0&&P===S?T[P][N]=I:T[P][N]=I.clone().lerp(_,N/b)}for(let P=0;P<S;P++)for(let I=0;I<2*(S-P)-1;I++){let _=Math.floor(I/2);I%2===0?(f(T[P][_+1]),f(T[P+1][_]),f(T[P][_])):(f(T[P][_+1]),f(T[P+1][_+1]),f(T[P+1][_]))}}function c(M){let v=new R;for(let E=0;E<r.length;E+=3)v.x=r[E+0],v.y=r[E+1],v.z=r[E+2],v.normalize().multiplyScalar(M),r[E+0]=v.x,r[E+1]=v.y,r[E+2]=v.z}function h(){let M=new R;for(let v=0;v<r.length;v+=3){M.x=r[v+0],M.y=r[v+1],M.z=r[v+2];let E=m(M)/2/Math.PI+.5,C=p(M)/Math.PI+.5;o.push(E,1-C)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let v=o[M+0],E=o[M+2],C=o[M+4],S=Math.max(v,E,C),T=Math.min(v,E,C);S>.9&&T<.1&&(v<.2&&(o[M+0]+=1),E<.2&&(o[M+2]+=1),C<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function d(M,v){let E=M*3;v.x=e[E+0],v.y=e[E+1],v.z=e[E+2]}function g(){let M=new R,v=new R,E=new R,C=new R,S=new ye,T=new ye,P=new ye;for(let I=0,_=0;I<r.length;I+=9,_+=6){M.set(r[I+0],r[I+1],r[I+2]),v.set(r[I+3],r[I+4],r[I+5]),E.set(r[I+6],r[I+7],r[I+8]),S.set(o[_+0],o[_+1]),T.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),C.copy(M).add(v).add(E).divideScalar(3);let b=m(C);y(S,_+0,M,b),y(T,_+2,v,b),y(P,_+4,E,b)}}function y(M,v,E,C){C<0&&M.x===1&&(o[v]=M.x-1),E.x===0&&E.z===0&&(o[v]=C/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var ws=class extends Nr{constructor(e){super(e),this.uuid=fi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Nr().fromJSON(s))}return this}},J0={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=lh(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,f,d;if(n&&(r=eg(i,e,r,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let g=t;g<s;g+=t)u=i[g],f=i[g+1],u<a&&(a=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return Ts(r,o,t,a,l,d,0),o}};function lh(i,e,t,n,s){let r,o;if(s===ug(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Dc(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Dc(r,i[r],i[r+1],o);return o&&qr(o,o.next)&&(Rs(o),o=o.next),o}function li(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(qr(t,t.next)||gt(t.prev,t,t.next)===0)){if(Rs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ts(i,e,t,n,s,r,o){if(!i)return;!o&&r&&rg(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?K0(i,n,s,r):$0(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Rs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=j0(li(i),e,t),Ts(i,e,t,n,s,r,2)):o===2&&Q0(i,e,t,n,s,r):Ts(li(i),e,t,n,s,r,1);break}}}function $0(i){let e=i.prev,t=i,n=i.next;if(gt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,f=s>r?s>o?s:o:r>o?r:o,d=a>l?a>c?a:c:l>c?l:c,g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Ni(s,a,r,l,o,c,g.x,g.y)&&gt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function K0(i,e,t,n){let s=i.prev,r=i,o=i.next;if(gt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,d=a<l?a<c?a:c:l<c?l:c,g=h<u?h<f?h:f:u<f?u:f,y=a>l?a>c?a:c:l>c?l:c,m=h>u?h>f?h:f:u>f?u:f,p=va(d,g,e,t,n),M=va(y,m,e,t,n),v=i.prevZ,E=i.nextZ;for(;v&&v.z>=p&&E&&E.z<=M;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ni(a,h,l,u,c,f,v.x,v.y)&&gt(v.prev,v,v.next)>=0||(v=v.prevZ,E.x>=d&&E.x<=y&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Ni(a,h,l,u,c,f,E.x,E.y)&&gt(E.prev,E,E.next)>=0))return!1;E=E.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ni(a,h,l,u,c,f,v.x,v.y)&&gt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;E&&E.z<=M;){if(E.x>=d&&E.x<=y&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Ni(a,h,l,u,c,f,E.x,E.y)&&gt(E.prev,E,E.next)>=0)return!1;E=E.nextZ}return!0}function j0(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!qr(s,r)&&ch(s,n,n.next,r)&&As(s,r)&&As(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Rs(n),Rs(n.next),n=i=r),n=n.next}while(n!==i);return li(n)}function Q0(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&lg(o,a)){let l=hh(o,a);o=li(o,o.next),l=li(l,l.next),Ts(o,e,t,n,s,r,0),Ts(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function eg(i,e,t,n){let s=[],r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=lh(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(ag(c));for(s.sort(tg),r=0;r<s.length;r++)t=ng(s[r],t);return t}function tg(i,e){return i.x-e.x}function ng(i,e){let t=ig(i,e);if(!t)return e;let n=hh(t,i);return li(n,n.next),li(t,t.next)}function ig(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,s=t.x<t.next.x?t:t.next,f===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Ni(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),As(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&sg(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function sg(i,e){return gt(i.prev,i,e.prev)<0&&gt(e.next,i,i.next)<0}function rg(i,e,t,n){let s=i;do s.z===0&&(s.z=va(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,og(s)}function og(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function va(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function ag(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ni(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function lg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!cg(i,e)&&(As(i,e)&&As(e,i)&&hg(i,e)&&(gt(i.prev,i,e.prev)||gt(i,e.prev,e))||qr(i,e)&&gt(i.prev,i,i.next)>0&&gt(e.prev,e,e.next)>0)}function gt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function qr(i,e){return i.x===e.x&&i.y===e.y}function ch(i,e,t,n){let s=lr(gt(i,e,t)),r=lr(gt(i,e,n)),o=lr(gt(t,n,i)),a=lr(gt(t,n,e));return!!(s!==r&&o!==a||s===0&&ar(i,t,e)||r===0&&ar(i,n,e)||o===0&&ar(t,i,n)||a===0&&ar(t,e,n))}function ar(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function lr(i){return i>0?1:i<0?-1:0}function cg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&ch(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function As(i,e){return gt(i.prev,i,i.next)<0?gt(i,e,i.next)>=0&&gt(i,i.prev,e)>=0:gt(i,e,i.prev)<0||gt(i,i.next,e)<0}function hg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function hh(i,e){let t=new _a(i.i,i.x,i.y),n=new _a(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Dc(i,e,t,n){let s=new _a(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Rs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function _a(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ug(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var fs=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Nc(e),Fc(n,e);let o=e.length;t.forEach(Nc);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Fc(n,t[l]);let a=J0.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Nc(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Fc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ci=class i extends ga{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Cs=class i extends tt{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=e,f=(t-e)/s,d=new R,g=new ye;for(let y=0;y<=s;y++){for(let m=0;m<=n;m++){let p=r+m/n*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let y=0;y<s;y++){let m=y*(n+1);for(let p=0;p<n;p++){let M=p+m,v=M,E=M+n+1,C=M+n+2,S=M+1;a.push(v,E,S),a.push(E,C,S)}}this.setIndex(a),this.setAttribute("position",new je(l,3)),this.setAttribute("normal",new je(c,3)),this.setAttribute("uv",new je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Br=class i extends tt{constructor(e=new ws([new ye(0,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new je(s,3)),this.setAttribute("normal",new je(r,3)),this.setAttribute("uv",new je(o,2));function c(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,g=f.holes;fs.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];fs.isClockWise(M)===!0&&(g[m]=M.reverse())}let y=fs.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];d=d.concat(M)}for(let m=0,p=d.length;m<p;m++){let M=d[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=y.length;m<p;m++){let M=y[m],v=M[0]+u,E=M[1]+u,C=M[2]+u;n.push(v,E,C),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return dg(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function dg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var _t=class i extends tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new R,f=new R,d=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){let M=[],v=p/n,E=0;p===0&&o===0?E=.5/t:p===n&&l===Math.PI&&(E=-.5/t);for(let C=0;C<=t;C++){let S=C/t;u.x=-e*Math.cos(s+S*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(s+S*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(S+E,1-v),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let v=h[p][M+1],E=h[p][M],C=h[p+1][M],S=h[p+1][M+1];(p!==0||o>0)&&d.push(v,E,S),(p!==n-1||l<Math.PI)&&d.push(E,C,S)}this.setIndex(d),this.setAttribute("position",new je(g,3)),this.setAttribute("normal",new je(y,3)),this.setAttribute("uv",new je(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var zr=class i extends tt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){let y=g/s*r,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(y),u.y=(e+t*Math.cos(m))*Math.sin(y),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){let y=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,M=(s+1)*d+g;o.push(y,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new je(a,3)),this.setAttribute("normal",new je(l,3)),this.setAttribute("uv",new je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Hr=class i extends tt{constructor(e=new Ur(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new R,l=new R,c=new ye,h=new R,u=[],f=[],d=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(f,3)),this.setAttribute("uv",new je(d,2));function y(){for(let v=0;v<t;v++)m(v);m(r===!1?t:0),M(),p()}function m(v){h=e.getPointAt(v/t,h);let E=o.normals[v],C=o.binormals[v];for(let S=0;S<=s;S++){let T=S/s*Math.PI*2,P=Math.sin(T),I=-Math.cos(T);l.x=I*E.x+P*C.x,l.y=I*E.y+P*C.y,l.z=I*E.z+P*C.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let v=1;v<=t;v++)for(let E=1;E<=s;E++){let C=(s+1)*(v-1)+(E-1),S=(s+1)*v+(E-1),T=(s+1)*v+E,P=(s+1)*(v-1)+E;g.push(C,S,P),g.push(S,T,P)}}function M(){for(let v=0;v<=t;v++)for(let E=0;E<=s;E++)c.x=v/t,c.y=E/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new pa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var it=class extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Kc,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function cr(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function fg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Yi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},xa=class extends Yi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ll,endingEnd:Ll}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ul:r=e,a=2*t-n;break;case Dl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ul:o=e,l=2*n-t;break;case Dl:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,p=-f*m+2*f*y-f*g,M=(1+f)*m+(-1.5-2*f)*y+(-.5+f)*g+1,v=(-1-d)*m+(1.5+d)*y+.5*g,E=d*m-d*y;for(let C=0;C!==a;++C)r[C]=p*o[h+C]+M*o[c+C]+v*o[l+C]+E*o[u+C];return r}},ya=class extends Yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},Ma=class extends Yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},un=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=cr(t,this.TimeBufferType),this.values=cr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:cr(e.times,Array),values:cr(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ma(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new xa(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case dr:t=this.InterpolantFactoryMethodLinear;break;case lo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return dr;case this.InterpolantFactoryMethodSmooth:return lo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&fg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===lo,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let y=t[u+g];if(y!==t[f+g]||y!==t[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};un.prototype.TimeBufferType=Float32Array;un.prototype.ValueBufferType=Float32Array;un.prototype.DefaultInterpolation=dr;var hi=class extends un{};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=ur;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ea=class extends un{};Ea.prototype.ValueTypeName="color";var Sa=class extends un{};Sa.prototype.ValueTypeName="number";var ba=class extends Yi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)It.slerpFlat(r,0,o,c-a,o,c,l);return r}},Ps=class extends un{InterpolantFactoryMethodLinear(e){return new ba(this.times,this.values,this.getValueSize(),e)}};Ps.prototype.ValueTypeName="quaternion";Ps.prototype.DefaultInterpolation=dr;Ps.prototype.InterpolantFactoryMethodSmooth=void 0;var ui=class extends un{};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=ur;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var wa=class extends un{};wa.prototype.ValueTypeName="vector";var Ta=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null}}},pg=new Ta,Aa=class{constructor(e){this.manager=e!==void 0?e:pg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Aa.DEFAULT_MATERIAL_NAME="__DEFAULT";var Zi=class extends Lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ge(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},Ji=class extends Zi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Bo=new $e,Oc=new R,Bc=new R,Vr=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xs,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Oc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Oc),Bc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Bc),t.updateMatrixWorld(),Bo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var zc=new $e,as=new R,zo=new R,Ra=class extends Vr{constructor(){super(new et(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ye(4,2),this._viewportCount=6,this._viewports=[new dt(2,1,1,1),new dt(0,1,1,1),new dt(3,1,1,1),new dt(1,1,1,1),new dt(3,0,1,1),new dt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),as.setFromMatrixPosition(e.matrixWorld),n.position.copy(as),zo.copy(n.position),zo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(zo),n.updateMatrixWorld(),s.makeTranslation(-as.x,-as.y,-as.z),zc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zc)}},Is=class extends Zi{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ra}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Ca=class extends Vr{constructor(){super(new Gi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},di=class extends Zi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.shadow=new Ca}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},kr=class extends Zi{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Oa="\\[\\]\\.:\\/",mg=new RegExp("["+Oa+"]","g"),Ba="[^"+Oa+"]",gg="[^"+Oa.replace("\\.","")+"]",vg=/((?:WC+[\/:])*)/.source.replace("WC",Ba),_g=/(WCOD+)?/.source.replace("WCOD",gg),xg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ba),yg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ba),Mg=new RegExp("^"+vg+_g+xg+yg+"$"),Eg=["material","materials","bones","map"],Pa=class{constructor(e,t,n){let s=n||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ut=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(mg,"")}static parseTrackName(e){let t=Mg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Eg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ut.Composite=Pa;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Fg=new Float32Array(1);typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"162"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="162");var We=Math.PI*2,X=(i,e)=>i+Math.random()*(e-i),wt=(i,e,t)=>i<e?e:i>t?t:i,uh=(i,e,t)=>i+(e-i)*t,vt=(i,e,t)=>{let n=wt((t-i)/(e-i),0,1);return n*n*(3-2*n)},Sg=`
float igCaustic(vec2 p, float t){
  vec2 q = p;
  q += 0.60 * vec2(sin(p.y * 1.30 + t * 0.80), sin(p.x * 1.10 - t * 0.60));
  q += 0.30 * vec2(sin(q.y * 2.70 - t * 1.10), sin(q.x * 2.30 + t * 0.90));
  float s = sin(q.x * 2.0) + sin(q.y * 2.0) + sin((q.x + q.y) * 1.4 + t * 0.5);
  float c = 1.0 - smoothstep(0.0, 0.45, abs(s));
  return c * c * c;
}`;function Yr(i,e,t=1,n=.55){return i.onBeforeCompile=s=>{s.uniforms.uTime=e.uTime,s.uniforms.uCausColor=e.uCausColor,s.uniforms.uCausK={value:t},s.uniforms.uCausScale={value:n},s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vIgW;
varying vec3 vIgN;`).replace("#include <project_vertex>",`#include <project_vertex>
vIgW = (modelMatrix * vec4(transformed, 1.0)).xyz;
vIgN = normalize(mat3(modelMatrix) * objectNormal);`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uTime; uniform vec3 uCausColor; uniform float uCausK; uniform float uCausScale;
varying vec3 vIgW; varying vec3 vIgN;
`+Sg).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  float igUp = clamp(vIgN.y * 0.8 + 0.2, 0.0, 1.0);
  totalEmissiveRadiance += uCausColor * igCaustic(vIgW.xz * uCausScale + vIgW.y * 0.15, uTime) * uCausK * igUp;`)},i.customProgramCacheKey=()=>"igcaus"+t+"_"+n,i}function Ut(i,e,t,n=!0){let s=document.createElement("canvas");s.width=i,s.height=e;let r=s.getContext("2d");t(r,i,e);let o=new qi(s);return n&&(o.colorSpace=Jt),o.anisotropy=4,o}function bg(i,e,t){let n=Math.sin(i*127.1+e*311.7+t*74.7)*43758.5453;return n-Math.floor(n)}function wg(i,e,t){let n=Math.floor(i),s=Math.floor(e),r=Math.floor(t),o=i-n,a=e-s,l=t-r,c=o*o*(3-2*o),h=a*a*(3-2*a),u=l*l*(3-2*l),f=0;for(let d=0;d<2;d++)for(let g=0;g<2;g++)for(let y=0;y<2;y++){let m=bg(n+d,s+g,r+y);f+=m*(d?c:1-c)*(g?h:1-h)*(y?u:1-u)}return f}function qn(i,e,t,n=4){let s=.5,r=0;for(let o=0;o<n;o++)r+=s*wg(i,e,t),i*=2.03,e*=2.03,t*=2.03,s*=.5;return r}function Zr(){return new Be({transparent:!0,depthWrite:!1,blending:at,uniforms:{uTint:{value:new ge(.85,.95,1)},uOpacity:{value:1}},vertexShader:`
      varying vec3 vN; varying vec3 vV;
      void main(){
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(position,1.0);
        vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uTint; uniform float uOpacity;
      varying vec3 vN; varying vec3 vV;
      void main(){
        float f = 1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(f, 2.2);
        vec3 l = normalize(vec3(-0.4, 0.7, 0.6));
        float spec = pow(max(dot(reflect(-l, normalize(vN)), normalize(vV)), 0.0), 40.0);
        vec3 c = uTint * (rim * 0.9 + 0.04) + vec3(spec * 1.4);
        gl_FragColor = vec4(c * uOpacity, 1.0);
      }`})}function Jr(){return Ut(64,256,(i,e,t)=>{let n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(255,255,240,0.55)"),n.addColorStop(.6,"rgba(255,255,240,0.18)"),n.addColorStop(1,"rgba(255,255,240,0)"),i.fillStyle=n,i.fillRect(0,0,e,t);let s=i.getImageData(0,0,e,t);for(let r=0;r<t;r++)for(let o=0;o<e;o++){let a=Math.sin(Math.PI*o/(e-1)),l=(r*e+o)*4+3;s.data[l]=s.data[l]*a*a}i.putImageData(s,0,0)})}function dh(i){let e=new ys({canvas:i,antialias:!0,alpha:!1,powerPreference:"low-power"});return e.outputColorSpace=Jt,e.toneMapping=Ia,e.toneMappingExposure=1.05,e}var nn=`
float igH2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float igN2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(igH2(i), igH2(i + vec2(1.0, 0.0)), u.x), mix(igH2(i + vec2(0.0, 1.0)), igH2(i + vec2(1.0, 1.0)), u.x), u.y); }
float igF2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * igN2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
`;function fh(i,e=256,t=256){return Ut(e,t,(n,s,r)=>{let o=n.createImageData(s,r);for(let a=0;a<r;a++){let l=1-a/(r-1);for(let c=0;c<s;c++){let h=c/s,u=Math.cos(h*We),f=Math.sin(h*We),d=i(l,u,f,h),g=(a*s+c)*4;o.data[g]=d[0],o.data[g+1]=d[1],o.data[g+2]=d[2],o.data[g+3]=255}}n.putImageData(o,0,0)})}var $t=(i,e,t)=>[i[0]+(e[0]-i[0])*t,i[1]+(e[1]-i[1])*t,i[2]+(e[2]-i[2])*t],sn=(i,e,t,n)=>vt(e-n,e+n,i)*(1-vt(t-n,t+n,i));function za(i,e,t){return Math.sin(i*310+e*47)*Math.sin(i*173-e*91)*t}var Tg={neon:{color(i,e){let t=$t([228,232,226],[128,138,118],vt(-.2,.9,e)),n=sn(e,-.72,-.08,.07)*(1-vt(.48,.56,i))*vt(.04,.12,i);t=$t(t,[214,38,52],n*.95);let s=sn(e,.08,.42,.06)*vt(.12,.22,i)*(1-vt(.86,.94,i));t=$t(t,[40,190,255],s);let r=za(i,e,8);return[t[0]+r,t[1]+r,t[2]+r]},glow(i,e){let t=sn(e,.08,.42,.06)*vt(.12,.22,i)*(1-vt(.86,.94,i)),n=sn(e,-.72,-.08,.07)*(1-vt(.48,.56,i))*vt(.04,.12,i);return[20+20*t+60*n,20+150*t,20+230*t]}},angel:{color(i,e){let t=$t([232,230,214],[168,166,150],vt(-.3,1,e)),n=sn(i,.76,.82,.015)+sn(i,.55,.63,.02)+sn(i,.33,.4,.02)+sn(i,.12,.17,.015)*.8;t=$t(t,[34,32,28],wt(n,0,1)*.85);let s=sn(e,.1,.5,.2)*.25;t=$t(t,[250,250,245],s);let r=za(i,e,6);return[t[0]+r,t[1]+r,t[2]+r]}},discus:{color(i,e){let t=$t([214,110,48],[170,72,34],vt(-.6,1,e)),n=Math.abs(Math.sin(e*11+Math.sin(i*13)*1.2+i*4));t=$t(t,[60,190,200],(1-vt(.05,.3,n))*.85);let s=sn(i,.74,.8,.02)*.35;return t=$t(t,[60,30,20],s),t}},guppy:{color(i,e){let t=$t([224,222,206],[132,140,118],vt(-.3,.9,e)),n=sn(i,.18,.42,.05)*sn(e,-.5,.5,.2);return t=$t(t,[255,150,60],n*.7),t}},cory:{color(i,e){let t=$t([236,226,204],[124,116,100],vt(-.6,.6,e)),n=Math.sin(i*60)*Math.sin(e*22+i*9)>.55?1:0;t=$t(t,[58,52,44],n*.6*vt(-.4,.2,e));let s=za(i,e,10);return[t[0]+s,t[1]+s,t[2]+s]}}},$r={};function Ag(i){if($r[i])return $r[i];let e=Tg[i];return $r[i]={map:fh(e.color),emissive:e.glow?fh(e.glow,128,128):null},$r[i]}var Kr=null;function Rg(){return Kr||(Kr=Ut(256,256,(i,e,t)=>{let n=i.createRadialGradient(0,t/2,0,0,t/2,e*1.05);n.addColorStop(0,"rgba(255,255,255,0.85)"),n.addColorStop(.7,"rgba(255,255,255,0.45)"),n.addColorStop(1,"rgba(255,255,255,0.12)"),i.fillStyle=n,i.fillRect(0,0,e,t),i.globalCompositeOperation="destination-out",i.strokeStyle="rgba(0,0,0,0.35)",i.lineWidth=3;for(let s=0;s<22;s++){let r=-1.2+s*.11428571428571428;i.beginPath(),i.moveTo(0,t/2),i.lineTo(Math.cos(r)*e*1.2,t/2+Math.sin(r)*e*1.2),i.stroke()}}),Kr)}function Cg(i,e=!0){let t=new ws;t.moveTo(i[0][0],i[0][1]);for(let a=1;a<i.length;a++){let l=i[a];l.length===4?t.quadraticCurveTo(l[0],l[1],l[2],l[3]):t.lineTo(l[0],l[1])}let n=new Br(t,16);n.computeBoundingBox();let s=n.boundingBox,r=n.attributes.uv,o=n.attributes.position;for(let a=0;a<r.count;a++)r.setXY(a,(o.getX(a)-s.min.x)/(s.max.x-s.min.x||1),(o.getY(a)-s.min.y)/(s.max.y-s.min.y||1));return n}function Ha(i,e=.85){return new it({color:i,map:Rg(),transparent:!0,opacity:e,side:mt,roughness:.5,metalness:0,depthWrite:!1})}var Ls={slim:i=>Math.pow(Math.sin(Math.PI*wt(i*1.02,0,1)),.72)*(.16+.84*vt(0,.34,i)),deep:i=>Math.pow(Math.sin(Math.PI*wt(i,0,1)),.85)*(.14+.86*vt(0,.3,i)),round:i=>Math.sqrt(Math.max(0,1-Math.pow(2.05*i-1.08,2)))*(.14+.86*vt(0,.18,i)),flat:i=>Math.pow(Math.sin(Math.PI*wt(i*1.02,0,1)),.6)*(.2+.8*vt(0,.3,i))};function Pg(i,e,t,n,s=1){let r=new _t(1,56,36);r.rotateZ(-Math.PI/2);let o=r.attributes.position;for(let a=0;a<o.count;a++){let l=o.getX(a),c=o.getY(a),h=o.getZ(a),u=(l+1)/2,f=n(u),d=c*e*f;c<0&&(d*=s);let g=vt(.85,1,u);o.setXYZ(a,l*i/2,d+g*e*.04,h*t*f*(.55+.45*Math.sqrt(Math.max(0,1-c*c))))}return r.computeVertexNormals(),r}function Ig(i,e,t,n){var r,o;let s=new it({map:i.map,roughness:(r=n.rough)!=null?r:.42,metalness:(o=n.metal)!=null?o:.08,emissiveMap:i.emissive||null,emissive:i.emissive?new ge(1,1,1):new ge(0,0,0),emissiveIntensity:i.emissive?.55:0});return s.onBeforeCompile=a=>{a.uniforms.uSwim=e.uSwim,a.uniforms.uAmp=e.uAmp,a.uniforms.uHalf={value:t/2},a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
uniform float uSwim; uniform float uAmp; uniform float uHalf;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        float xn = transformed.x / uHalf;
        float tail = clamp((0.45 - xn) / 1.45, 0.0, 1.0);
        transformed.z += sin(uSwim - xn * 2.6) * uAmp * uHalf * tail * tail;`)},s.customProgramCacheKey=()=>"igswim",s}function Lg(i,e,t,n,s){let r=new it({color:14275256,roughness:.3,metalness:.2}),o=new it({color:328965,roughness:.05,metalness:0}),a=new _t(s,16,12),l=new _t(s*.62,16,12);[1,-1].forEach(c=>{let h=new xe(a,r);h.position.set(e,t,n*c),h.scale.set(1,1,.55),i.add(h);let u=new xe(l,o);u.position.set(e+s*.08,t,n*c+c*s*.3),u.scale.set(1,1,.6),i.add(u)})}function ph(i){let e={uSwim:{value:X(0,We)},uAmp:{value:.12}},t=new Wt,n=Ag(i),s,r,o,a,l,c,h=1,u={};i==="neon"?(s=.72,r=.145,o=.085,a=Ls.slim,c=14213862,u={rough:.32,metal:.18}):i==="angel"?(s=1.35,r=.62,o=.12,a=Ls.deep,c=15263448,u={rough:.35,metal:.2}):i==="discus"?(s=1.55,r=.78,o=.17,a=Ls.round,c=13662780,u={rough:.4,metal:.1}):i==="guppy"?(s=.55,r=.13,o=.07,a=Ls.slim,c=16747068,u={rough:.35,metal:.15}):(s=.72,r=.2,o=.15,a=Ls.flat,c=13616301,h=.55,u={rough:.6,metal:.05});let f=new xe(Pg(s,r,o,a,h),Ig(n,e,s,u));t.add(f),Lg(t,s*.34,r*.14,o*.62,r*(i==="angel"||i==="discus"?.1:.2));let d=s/2,g=(S,T,P)=>new xe(Cg(S),Ha(T,P)),y=new Wt;y.position.x=-d*.98,t.add(y);let m;if(i==="guppy"){let S=[16742958,3116287,16727930,16763194,10181887];c=S[Math.floor(Math.random()*S.length)],m=[[0,0],[-.1,.16,-.46,.2],[-.52,0,-.46,-.2],[-.1,-.16,0,0]]}else i==="angel"?m=[[0,0],[-.1,.1,-.38,.26],[-.26,0,-.38,-.26],[-.1,-.1,0,0]]:i==="discus"?m=[[0,0],[-.06,.08,-.2,.14],[-.16,0,-.2,-.14],[-.06,-.08,0,0]]:m=[[0,0],[-.06,.05,-.22*s/.72,.13*s/.72],[-.12*s/.72,0,-.22*s/.72,-.13*s/.72],[-.06,-.05,0,0]];let p=g(m,c,i==="guppy"?.95:.75);if(y.add(p),i==="angel"){t.add(g([[d*.25,r*.5],[-d*.1,r*1.6,-d*.95,r*2.1],[-d*.6,r*1,-d*.55,r*.35]],c,.7)),t.add(g([[d*.25,-r*.5],[-d*.1,-r*1.6,-d*.95,-r*2.1],[-d*.6,-r*1,-d*.55,-r*.35]],c,.7));let S=new xe(new Ge(.015,r*2.2),Ha(15789794,.8));S.position.set(d*.35,-r*1.3,.02),S.rotation.z=.25,t.add(S);let T=S.clone();T.position.z=-.02,t.add(T)}else if(i==="discus")t.add(g([[d*.55,r*.62],[0,r*1.12,-d*.8,r*.55],[-d*.75,r*.35]],c,.6)),t.add(g([[d*.45,-r*.62],[0,-r*1.12,-d*.8,-r*.55],[-d*.75,-r*.35]],c,.6));else if(i==="guppy")t.add(g([[d*.05,r*.55],[-d*.3,r*1.8,-d*.75,r*1.2],[-d*.5,r*.4]],c,.9));else if(i==="cory"){t.add(g([[d*.15,r*.6],[0,r*1.9,-d*.25,r*1.5],[-d*.3,r*.55]],c,.75));let S=new xe(new Ge(.06,.008),Ha(15129798,.9));S.position.set(d*1.02,-r*.35,o*.3),S.rotation.z=-.5,t.add(S);let T=S.clone();T.position.z=-o*.3,t.add(T)}else t.add(g([[d*.05,r*.62],[-d*.15,r*1.3,-d*.35,r*1.1],[-d*.3,r*.5]],c,.65)),t.add(g([[-d*.05,-r*.55],[-d*.25,-r*1.05,-d*.55,-r*.85],[-d*.5,-r*.4]],c,.6));let M=g([[0,0],[-.04*s,.06*s,-.16*s,.02*s],[-.1*s,-.04*s,0,0]],c,.5),v=M.clone(),E=M.clone();v.position.set(d*.45,-r*.25,o*.75),E.position.set(d*.45,-r*.25,-o*.75),v.rotation.y=-.6,E.rotation.y=.6,t.add(v),t.add(E);let C=(S,T,P)=>{let I=wt((.45-S)/1.45,0,1);return Math.sin(T-S*2.6)*P*d*I*I};return{kind:i,group:t,len:s,h:r,uniforms:e,caudal:y,pl:v,pr:E,animate(S,T){e.uSwim.value=S,e.uAmp.value=T;let P=C(-.98,S,T),I=C(-.9,S,T);y.position.z=P,y.rotation.y=Math.atan2(P-I,d*.08)*1.4,v.rotation.y=-.6+Math.sin(S*1.3)*.25,E.rotation.y=.6-Math.sin(S*1.3)*.25}}}var Va={blue:{fog:1923191,top:7323872,deep:535104,caus:[.55,.62,.55],sun:16774108,hemi:9425134},green:{fog:2054732,top:8834480,deep:535588,caus:[.55,.6,.45],sun:16187356,hemi:10936512},violet:{fog:2959974,top:10261984,deep:854828,caus:[.5,.48,.62],sun:15788287,hemi:12103935}},Yn={x:11,yTop:8.6,zBack:-5,zFront:3.2,floor:0};function mh(i,e){let t=new Et,n=new et(40,16/9,.1,80);n.position.set(0,4.1,13.2);let s=new R(0,3.5,-.8);n.lookAt(s);let r={uTime:{value:0},uCausColor:{value:new ge(.55,.62,.55)}},o=Va.blue;t.fog=new Wi(o.fog,.048);let a=new Be({side:ft,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new ge(o.top)},uDeep:{value:new ge(o.deep)},uTime:r.uTime},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uTop; uniform vec3 uDeep; uniform float uTime; varying vec3 vP;
      void main(){ float h = clamp(normalize(vP).y * 1.6 + 0.35, 0.0, 1.0); vec3 c = mix(uDeep, uTop, pow(h, 1.4));
      gl_FragColor = vec4(c, 1.0); }`});t.add(new xe(new _t(40,32,16),a));let l=new Ji(o.hemi,9075290,1.1);t.add(l);let c=new di(o.sun,2.4);c.position.set(-3,14,6),t.add(c);let h=new di(10475775,.5);h.position.set(6,3,10),t.add(h);let u=Ut(512,512,(U,D,ne)=>{U.fillStyle="#cdb893",U.fillRect(0,0,D,ne);for(let ae=0;ae<26e3;ae++){let k=Math.random();U.fillStyle=k<.45?`rgba(110,90,62,${.18+Math.random()*.25})`:k<.9?`rgba(245,236,214,${.2+Math.random()*.3})`:`rgba(60,55,50,${.3})`;let j=Math.random()*1.8+.4;U.fillRect(Math.random()*D,Math.random()*ne,j,j)}});u.wrapS=u.wrapT=ps,u.repeat.set(6,4);let f=new Ge(34,22,170,110);f.rotateX(-Math.PI/2);{let U=f.attributes.position;for(let D=0;D<U.count;D++){let ne=U.getX(D),ae=U.getZ(D);U.setY(D,(qn(ne*.18,0,ae*.25)-.5)*.9+Math.max(0,-ae-2)*.12)}f.computeVertexNormals()}let d=new xe(f,Yr(new it({map:u,roughness:.95,metalness:0,color:12101772}),r,.55,1.35));d.position.set(0,0,0),t.add(d);let g=Yr(new it({color:7828331,roughness:.88,metalness:.02,flatShading:!1}),r,.22,2.6);function y(U,D,ne,ae){let k=new ci(1,5),j=k.attributes.position,_e=X(0,50);for(let De=0;De<j.count;De++){let we=new R(j.getX(De),j.getY(De),j.getZ(De)),Se=qn(we.x*1.4+_e,we.y*1.4,we.z*1.4,5);we.multiplyScalar(.75+Se*.55),we.y*=ae,we.y<-.2&&(we.y=-.2+(we.y+.2)*.2),j.setXYZ(De,we.x,we.y,we.z)}k.computeVertexNormals();let se=new xe(k,g);return se.position.set(U,.1*ne,D),se.scale.setScalar(ne),se.rotation.y=X(0,We),t.add(se),se}y(-5.8,-1.2,1.25,.72),y(-4.5,-2.2,.8,.9),y(3.2,-.6,1,.65),y(6.8,-2.6,1.5,.85),y(1.2,-3.4,.7,.8),y(-1.8,.8,.45,.6);let m=Yr(new it({color:5914152,roughness:.85}),r,.18,2.6),p=(U,D)=>{let ne=new bs(U.map(se=>new R(...se))),ae=new Hr(ne,48,D,10,!1),k=ae.attributes.position,j=48,_e=11;for(let se=0;se<=j;se++){let De=1-se/j*.75,we=ne.getPointAt(se/j);for(let Se=0;Se<_e;Se++){let Ee=se*_e+Se;if(Ee>=k.count)continue;let Te=new R(k.getX(Ee),k.getY(Ee),k.getZ(Ee)).sub(we).multiplyScalar(De).add(we);k.setXYZ(Ee,Te.x,Te.y,Te.z)}}return ae.computeVertexNormals(),t.add(new xe(ae,m)),ne},M=p([[-3.6,.1,-1.4],[-2.2,.8,-1.8],[-1,2.3,-2.4],[-.2,4,-2.9],[.3,5.4,-3.2]],.34);p([[-1.2,2.1,-2.3],[.4,2.8,-2],[1.8,3.9,-2.2],[2.6,4.6,-2.5]],.18),p([[-2.6,.6,-1.6],[-4,1.3,-2.2],[-5,2.4,-2.8]],.16);{let U=new it({color:4155948,roughness:1}),D=new ci(.045,0),ne=new en(D,U,900),ae=new $e,k=new It;for(let j=0;j<900;j++){let _e=M.getPointAt(Math.random()*.85);ae.compose(new R(_e.x+X(-.26,.26),_e.y+X(.12,.3),_e.z+X(-.26,.26)),k.setFromEuler(new zt(X(0,3),X(0,3),0)),new R(1,1,1).multiplyScalar(X(.6,1.4))),ne.setMatrixAt(j,ae)}t.add(ne)}function v(U,D,ne,ae={}){let k=new it({color:16777215,side:mt,roughness:.6,metalness:0,...ae});return k.onBeforeCompile=j=>{j.uniforms.uTime=r.uTime,j.uniforms.uLow={value:new ge(U)},j.uniforms.uHigh={value:new ge(D)},j.uniforms.uAmp={value:ne},j.vertexShader=j.vertexShader.replace("#include <common>",`#include <common>
attribute float aPhase; attribute float aHue; uniform float uTime; uniform float uAmp; varying float vH; varying float vHue;`).replace("#include <begin_vertex>",`#include <begin_vertex>
          vH = uv.y; vHue = aHue;
          float bend = uv.y * uv.y;
          transformed.x += sin(uTime * 0.7 + aPhase + uv.y * 2.0) * uAmp * bend;
          transformed.z += cos(uTime * 0.55 + aPhase * 1.3 + uv.y * 1.5) * uAmp * 0.6 * bend;`),j.fragmentShader=j.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uLow; uniform vec3 uHigh; varying float vH; varying float vHue;`).replace("#include <color_fragment>",`#include <color_fragment>
  diffuseColor.rgb *= mix(uLow, uHigh, smoothstep(0.0, 1.0, vH)) * (0.85 + 0.3 * vHue);`)},k.customProgramCacheKey=()=>"igsway"+U+D+ne,k}function E(U,D,ne,ae){let k=new en(U,D,ne),j=new Float32Array(ne),_e=new Float32Array(ne),se=new $e;for(let De=0;De<ne;De++)ae(se,De),k.setMatrixAt(De,se),j[De]=X(0,We),_e[De]=Math.random();return U.setAttribute("aPhase",new Wn(j,1)),U.setAttribute("aHue",new Wn(_e,1)),t.add(k),k}let C=new It,S=new zt,T=new R,P=new R,I=new Ge(1,1,1,14);I.translate(0,.5,0);{let U=I.attributes.position;for(let D=0;D<U.count;D++){let ne=U.getY(D);U.setX(D,U.getX(D)*(1-ne*.7))}}E(I,v(3041850,8831088,.9),150,(U,D)=>{let ne=X(-12,12),ae=X(-5.2,-3.2);U.compose(T.set(ne,0,ae),C.setFromEuler(S.set(0,X(-.8,.8),X(-.08,.08))),P.set(X(.12,.2),X(4.5,8.2),1))});let _=new Ge(1,1,4,10);_.translate(0,.5,0);{let U=_.attributes.position;for(let D=0;D<U.count;D++){let ne=U.getY(D),ae=U.getX(D);U.setX(D,ae*Math.sin(Math.PI*Math.min(1,ne*1.05))*1),U.setZ(D,-ne*ne*.35+Math.abs(ae)*.08)}_.computeVertexNormals()}let b=[[-7.8,-1.6],[4.6,-1.8],[8.9,-.6],[-2.8,-.2]];E(_,v(2910772,8372322,.12),b.length*16,(U,D)=>{let ne=b[Math.floor(D/16)],ae=D%16/16*We+X(-.2,.2);C.setFromEuler(S.set(X(.35,.75),ae,0,"YXZ")),U.compose(T.set(ne[0],0,ne[1]),C,P.set(X(.45,.6),X(1.7,2.6),1))});let N=new Ge(.34,.1,2,1),O=[[-9.6,-2.4,1],[-6.6,-3.2,0],[-.8,-3.6,1],[5.6,-3,0],[9.8,-3.4,1],[2.4,-2.8,0],[-4.2,-3.8,0]],L=new it({color:4876852,roughness:.8});O.forEach(([U,D,ne])=>{let ae=3+Math.floor(Math.random()*3),k=28;for(let j=0;j<ae;j++){let _e=3.6+j*.5,se=new xe(new Gt(.018,.025,_e,5),ne?new it({color:8010282,roughness:.8}):L);se.position.set(U+j*.28-ae*.14,_e/2+.1,D+j%2*.2),t.add(se)}E(N.clone(),v(ne?6965802:3832376,ne?14177854:10146410,.35),ae*k,(j,_e)=>{let se=Math.floor(_e/k),De=_e%k/k,we=X(3.2,5.2)*0+(3.6+se*.5)*De;C.setFromEuler(S.set(0,_e%2*Math.PI+_e*1.3%1*.6,(_e%2?1:-1)*.35)),j.compose(T.set(U+se*.28-ae*.14+Math.sin(De*5)*.05,.1+we,D+se%2*.2),C,P.set(1-De*.3,1,1))})});let Y=new Ge(.035,1,1,3);Y.translate(0,.5,0),E(Y,v(3107376,9227618,.05),4200,(U,D)=>{let ne=Math.floor(D/300),ae=-10+ne*1.6+X(-.6,.6),k=X(.2,2.8);U.compose(T.set(ae+X(-.7,.7),-.05,k),C.setFromEuler(S.set(X(-.2,.2),X(0,We),X(-.25,.25))),P.set(1,X(.18,.42),1))});let q=new Mt({map:Jr(),transparent:!0,blending:at,depthWrite:!1,fog:!1,opacity:.22,side:mt}),B=[];for(let U=0;U<7;U++){let D=new xe(new Ge(X(1.2,2.4),12),q.clone());D.position.set(-10+U*3.3+X(-.6,.6),4.2,X(-4,-1)),D.rotation.z=-.25,D.userData.ph=X(0,We),t.add(D),B.push(D)}let z=new Be({transparent:!0,depthWrite:!1,blending:at,side:mt,fog:!1,uniforms:{uTime:r.uTime},vertexShader:"varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW,1.0); }",fragmentShader:`uniform float uTime; varying vec3 vW;
      
      float c2(vec2 p, float t){ vec2 q = p + 0.6*vec2(sin(p.y*1.3+t*0.8), sin(p.x*1.1-t*0.6)); float s = sin(q.x*2.0)+sin(q.y*2.0)+sin((q.x+q.y)*1.4+t*0.5); float c = 1.0 - smoothstep(0.0,0.6,abs(s)); return c*c; }
      void main(){ float c = c2(vW.xz*1.4, uTime*1.1); float fade = smoothstep(-8.0, 3.0, vW.z); gl_FragColor = vec4(vec3(0.75,0.9,1.0) * (0.06 + c*0.22) * fade, 1.0); }`}),W=new xe(new Ge(40,14,1,1),z);W.rotation.x=Math.PI/2,W.position.set(0,Yn.yTop+.2,-1),t.add(W);let ie=160,re=new en(new _t(1,16,12),Zr(),ie),he=[];for(let U=0;U<ie;U++)he.push({y:X(0,8.5),x:0,z:0,r:X(.025,.07),v:X(.9,1.6),w:X(0,We)});t.add(re);let Ce=new xe(new Gt(.28,.32,.18,20),new it({color:5659230,roughness:.9}));Ce.position.set(8.2,.25,-2.2),t.add(Ce);let J=500,le=new Float32Array(J*3);for(let U=0;U<J;U++)le[U*3]=X(-12,12),le[U*3+1]=X(0,9),le[U*3+2]=X(-5,4);let pe=new tt;pe.setAttribute("position",new Je(le,3));let Ue=new gn(pe,new Pn({color:16776168,size:.035,transparent:!0,opacity:.55,depthWrite:!1}));t.add(Ue);let be=[];function fe(U,D,ne,ae){let k=ph(U);return k.pos=new R(D,ne,ae),k.vel=new R(X(-1,1),0,X(-.3,.3)),k.swim=X(0,We),k.wander=X(0,We),k.rest=0,k.speed={neon:1.25,angel:.55,discus:.45,guppy:.95,cory:.35}[U]*X(.85,1.15),k.group.position.copy(k.pos),t.add(k.group),be.push(k),k}let He=new R(0,4,-1),Pe=new R(0,4,-1);for(let U=0;U<34;U++)fe("neon",X(-3,3),X(2.8,5.4),X(-2.5,1));fe("angel",-3,5,-1.5),fe("angel",2.5,4.4,-.8),fe("discus",4.5,3.2,-1.2);for(let U=0;U<6;U++)fe("guppy",X(-8,8),X(5.5,7.5),X(-2,1.5));for(let U=0;U<4;U++)fe("cory",X(-6,6),.35,X(-.5,1.8)).vel.set(X(-.3,.3),0,0);let H=new R,st=new R,Ae=new It().setFromAxisAngle(new R(0,1,0),Math.PI/2),Oe=new It,Le=new $e,oe=new R(0,1,0),K=new R,ue=new R;function Re(U,D){let ne=U.pos,ae=U.vel;if(K.set(0,0,0),U.kind==="neon"){K.copy(Pe).sub(ne).multiplyScalar(.18),ue.set(0,0,0);let se=0,De=new R;for(let we of be){if(we===U||we.kind!=="neon")continue;let Se=ne.distanceTo(we.pos);Se<.75&&ue.add(ne.clone().sub(we.pos).multiplyScalar((.75-Se)*5)),Se<1.4&&(De.add(we.vel),se++)}K.add(ue),se&&K.add(De.multiplyScalar(.4/se))}else if(U.kind==="cory"){if(U.rest>0){U.rest-=D,ae.multiplyScalar(.92);return}U.wander+=X(-1,1)*D*2,K.set(Math.cos(U.wander),0,Math.sin(U.wander)*.4),Math.random()<D*.3&&(U.rest=X(1.5,4))}else U.wander+=X(-1,1)*D*.9,K.set(Math.cos(U.wander),Math.sin(U.wander*.7)*.25,Math.sin(U.wander*.6)*.35);let k=Yn.x-1.2;ne.x>k&&(K.x-=(ne.x-k)*2),ne.x<-k&&(K.x+=(-k-ne.x)*2);let j=U.kind==="cory"?.3:1.4,_e=U.kind==="cory"?.45:Yn.yTop-.9;ne.y>_e&&(K.y-=(ne.y-_e)*2),ne.y<j&&(K.y+=(j-ne.y)*2),ne.z>Yn.zFront-.8&&(K.z-=(ne.z-Yn.zFront+.8)*2),ne.z<Yn.zBack+1.2&&(K.z+=(Yn.zBack+1.2-ne.z)*2),K.normalize().multiplyScalar(U.speed),ae.lerp(K,wt(D*1.2,0,1)),U.kind==="cory"&&(ae.y=0,ne.y=uh(ne.y,.38,.1))}let A=0,x=0;function G(U,D,ne){A+=U*D,r.uTime.value=A,Math.random()<U*D*.2&&He.set(X(-7,7),X(2.4,6.2),X(-3,1)),Pe.lerp(He,wt(U*D*.25,0,1));for(let k of be){Re(k,U*D),k.pos.addScaledVector(k.vel,U*D),k.group.position.copy(k.pos);let j=k.vel.length();j>.02&&(st.copy(k.vel).normalize(),st.y=wt(st.y,-.35,.35),st.normalize(),Le.lookAt(H,st,oe),Oe.setFromRotationMatrix(Le).multiply(Ae),k.group.quaternion.slerp(Oe,wt(U*D*2.5,0,1))),k.swim+=U*D*(5+j*6),k.animate(k.swim,.06+Math.min(.12,j*.08))}for(let k=0;k<ie;k++){let j=he[k];j.y+=j.v*U*D,j.y>Yn.yTop&&(j.y=.3,j.w=X(0,We)),j.x=Ce.position.x+Math.sin(j.y*2.2+j.w)*.12*(.3+j.y*.08),j.z=Ce.position.z+Math.cos(j.y*1.7+j.w)*.1;let _e=j.r*(1+j.y*.04);Le.makeScale(_e,_e*.9,_e).setPosition(j.x,j.y,j.z),re.setMatrixAt(k,Le)}re.instanceMatrix.needsUpdate=!0;let ae=pe.attributes.position;for(let k=0;k<J;k++){let j=ae.getY(k)+Math.sin(A*.3+k)*.002*D;ae.setY(k,j),ae.setX(k,ae.getX(k)+Math.cos(A*.2+k*.7)*.0015*D)}ae.needsUpdate=!0,B.forEach(k=>{k.material.opacity=.14+Math.sin(A*.35+k.userData.ph)*.08,k.position.x+=Math.sin(A*.1+k.userData.ph)*.002}),ne||(x+=U*.08,n.position.x=Math.sin(x)*.6,n.position.y=4.3+Math.sin(x*.7)*.15,n.lookAt(s))}function te(U){let D=Va[U]||Va.blue;D!==o&&(o=D,t.fog.color.set(D.fog),a.uniforms.uTop.value.set(D.top),a.uniforms.uDeep.value.set(D.deep),r.uCausColor.value.setRGB(...D.caus),l.color.set(D.hemi),c.color.set(D.sun))}te("blue"),o=null,te("blue");for(let U=0;U<90;U++)G(1/30,1,!0);return{scene:t,camera:n,update:G,setWater:te,resize(U,D){n.aspect=U/Math.max(1,D),n.fov=n.aspect<1.2?55:40,n.updateProjectionMatrix()}}}var ji={blue:3844351,green:3727526,violet:10648575};function ka(i,e){let t=new Et;t.background=new ge(461590);let n=new et(38,16/9,.1,60);n.position.set(0,4.4,15),n.lookAt(0,4.3,0);let s={value:new ge(ji.blue)},r={value:0},o=Ut(256,256,(B,z,W)=>{let ie=B.createRadialGradient(z/2,W/2,0,z/2,W/2,z/2);ie.addColorStop(0,"rgba(255,255,255,1)"),ie.addColorStop(.35,"rgba(255,255,255,0.35)"),ie.addColorStop(1,"rgba(255,255,255,0)"),B.fillStyle=ie,B.fillRect(0,0,z,W)},!1),a=new xe(new Ge(40,20),new it({color:1382950,roughness:.95}));a.position.set(0,8,-4),t.add(a);let l=new xe(new Ge(40,20),new it({color:921881,roughness:.55,metalness:.1}));l.rotation.x=-Math.PI/2,t.add(l);let c=new xe(new Ge(12,16),new Mt({map:o,transparent:!0,blending:at,depthWrite:!1,opacity:.35}));c.position.set(0,5,-3.95),t.add(c);let h=new xe(new Ge(9,5),new Mt({map:o,transparent:!0,blending:at,depthWrite:!1,opacity:.55}));h.rotation.x=-Math.PI/2,h.position.y=.01,t.add(h);let u=new Is(ji.blue,30,18,1.6);u.position.set(0,1.2,.5),t.add(u);let f=new Is(ji.blue,12,14,1.6);f.position.set(0,6,.8),t.add(f),t.add(new kr(2240580,.6));let d=1.05,g=8.4,y=.7,m=new Be({transparent:!0,depthWrite:!1,uniforms:{uColor:s,uTime:r},vertexShader:"varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uColor; uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        float h = (vP.y + ${(g/2).toFixed(2)}) / ${g.toFixed(2)};
        float fall = mix(1.0, 0.35, pow(h, 0.8));
        float facing = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float core = pow(facing, 1.6);
        float ripple = 0.9 + 0.1 * sin(vP.y * 3.0 - uTime * 1.5 + vP.x * 4.0);
        vec3 c = uColor * (0.25 + core * 1.1) * fall * ripple;
        gl_FragColor = vec4(c, 0.78);
      }`}),p=new xe(new Gt(d*.96,d*.96,g,64,1,!0),m);p.position.y=y+g/2,t.add(p);let M=new Be({transparent:!0,depthWrite:!1,blending:at,uniforms:{uColor:s},vertexShader:"varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uColor; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = 1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(f, 3.0) * 0.9;
        float streak = smoothstep(0.62, 0.7, vN.x) * (1.0 - smoothstep(0.7, 0.8, vN.x)) * 0.35 + smoothstep(-0.5,-0.45,vN.x)*(1.0-smoothstep(-0.45,-0.4,vN.x))*0.15;
        gl_FragColor = vec4(vec3(rim) * mix(vec3(1.0), uColor, 0.4) + vec3(streak), 1.0); }`}),v=new xe(new Gt(d,d,g,64,1,!0),M);v.position.y=y+g/2,t.add(v);let E=new it({color:1777448,roughness:.35,metalness:.8}),C=new xe(new Gt(d*1.35,d*1.45,y,48),E);C.position.y=y/2,t.add(C);let S=new xe(new Gt(d*1.12,d*1.12,.3,48),E);S.position.y=y+g+.15,t.add(S);let T=new xe(new zr(d*1.02,.05,12,64),new Mt({color:ji.blue}));T.rotation.x=Math.PI/2,T.position.y=y+.02,t.add(T);let P=220,I=Zr(),_=new en(new _t(1,20,14),I,P);t.add(_);let b=[];function N(B,z){let W=X(0,We),ie=Math.sqrt(Math.random())*d*.55;B.x=Math.cos(W)*ie,B.z=Math.sin(W)*ie,B.y=z!=null?z:y+X(0,.3),B.r=Math.random()<.15?X(.16,.28):X(.04,.12),B.v=.9+(.3-B.r)*1.8,B.w=X(0,We)}for(let B=0;B<P;B++){let z={};N(z,y+X(0,g)),b.push(z)}let O=new $e,L=0;function Y(B,z){L+=B*z,r.value=L;for(let ie=0;ie<P;ie++){let re=b[ie];re.y+=re.v*B*z,re.y>y+g-re.r&&N(re);let he=re.x+Math.sin(re.y*1.6+re.w)*.12,Ce=re.z+Math.cos(re.y*1.3+re.w)*.1,J=1+Math.sin(L*6+re.w)*.06;O.makeScale(re.r*J,re.r/J*.92,re.r*J).setPosition(wt(he,-d*.8,d*.8),re.y,wt(Ce,-d*.8,d*.8)),_.setMatrixAt(ie,O)}_.instanceMatrix.needsUpdate=!0;let W=.9+Math.sin(L*.6)*.1;u.intensity=30*W,c.material.opacity=.32*W}function q(B){let z=ji[B]||ji.blue;s.value.set(z),u.color.set(z),f.color.set(z),T.material.color.set(z),c.material.color.set(z),h.material.color.set(z),I.uniforms.uTint.value.set(z).lerp(new ge(1,1,1),.55)}q("blue");for(let B=0;B<30;B++)Y(1/30,1);return{scene:t,camera:n,update:Y,setWater:q,resize(B,z){n.aspect=B/Math.max(1,z),n.fov=n.aspect<1.2?60:38,n.updateProjectionMatrix()}}}function gh(i,e){let t=new Et,n=new et(35,1,.1,50);n.position.set(0,0,10);let s=new xe(new Ge(30,30),new Be({depthWrite:!1,uniforms:{uA:{value:new ge(993861)},uB:{value:new ge(2828902)},uC:{value:new ge(2056075)}},vertexShader:"varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec2 vU;
      void main(){ float r = distance(vU, vec2(0.5)); vec3 c = mix(uC, uA, smoothstep(0.0, 0.35, r)); c = mix(c, uB, smoothstep(0.25, 0.7, vU.y) * 0.45);
      gl_FragColor = vec4(c, 1.0); }`}));s.position.z=-8,t.add(s);let r={value:0},o={value:0},a=new xe(new _t(1,128,96),new Be({transparent:!0,uniforms:{uT:r,uBreath:o},vertexShader:`uniform float uT; uniform float uBreath; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec3 p = position;
        vec4 mv = modelViewMatrix * vec4(p,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uT; uniform float uBreath; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(1.0 - f, 2.5);
        float flow = 0.5 + 0.5 * sin(vP.x * 3.1 + uT * 0.35) * sin(vP.y * 2.7 - uT * 0.3) * sin(vP.z * 3.3 + uT * 0.25);
        vec3 core = mix(vec3(0.55, 0.85, 0.95), vec3(0.78, 0.72, 1.0), flow);
        vec3 c = core * (0.45 + 0.85 * pow(f, 1.2)) + vec3(0.85, 0.95, 1.0) * rim * 1.1;
        c *= 0.72 + 0.25 * uBreath;
        gl_FragColor = vec4(c, 0.92);
      }`}));t.add(a);let l=Ut(256,256,(_,b,N)=>{let O=_.createRadialGradient(b/2,N/2,0,b/2,N/2,b/2);O.addColorStop(0,"rgba(255,255,255,0.9)"),O.addColorStop(.25,"rgba(255,255,255,0.35)"),O.addColorStop(1,"rgba(255,255,255,0)"),_.fillStyle=O,_.fillRect(0,0,b,N)},!1),c=new xe(new Ge(1,1),new Mt({map:l,color:9426687,transparent:!0,blending:at,depthWrite:!1,opacity:.55}));c.position.z=-.5,t.add(c);let h={value:0},u={value:1},f=new xe(new Cs(2.35,2.4,160,1),new Be({transparent:!0,depthWrite:!1,uniforms:{uP:h,uIn:u},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform float uP; uniform float uIn; varying vec2 vP;
      void main(){ float a = atan(vP.x, vP.y); a = a < 0.0 ? a + 6.2831853 : a; float k = a / 6.2831853;
        float on = step(k, uP);
        vec3 c = mix(vec3(0.6, 0.72, 0.86), mix(vec3(0.95, 0.85, 1.0), vec3(0.75, 0.95, 1.0), uIn), on);
        gl_FragColor = vec4(c, mix(0.18, 0.85, on)); }`}));t.add(f);let d=[];for(let _=0;_<3;_++){let b=new xe(new Cs(.98,1,128),new Mt({color:12576511,transparent:!0,opacity:0,depthWrite:!1,blending:at}));t.add(b),d.push({m:b,life:1})}let g=0,y=420,m=new Float32Array(y*3),p=[];for(let _=0;_<y;_++){let b=X(0,We),N=X(1.4,4.2),O=X(-2,1);p.push({a:b,r:N,z:O,s:X(.02,.08),w:X(0,We)})}let M=new tt;M.setAttribute("position",new Je(m,3));let v=Ut(64,64,(_,b,N)=>{let O=_.createRadialGradient(b/2,N/2,0,b/2,N/2,b/2);O.addColorStop(0,"rgba(255,255,255,1)"),O.addColorStop(1,"rgba(255,255,255,0)"),_.fillStyle=O,_.fillRect(0,0,b,N)},!1),E=new gn(M,new Pn({map:v,color:13625599,size:.09,transparent:!0,opacity:.8,depthWrite:!1,blending:at}));t.add(E);let C=0,S=0,T=null,P=_=>.5-.5*Math.cos(Math.PI*wt(_,0,1));function I(_,b,N,O){let L=O.guiding&&!N;L&&(C+=_),r.value=C;let Y;O.guiding?Y=O.inhale?P(O.progress):1-P(O.progress):Y=.35,S=N?Y:S+(Y-S)*wt(_*6,0,1),o.value=S;let q=1.05+S*.75;a.scale.setScalar(q),c.scale.setScalar(q*5.2),c.material.opacity=.38+S*.22,h.value=O.guiding?wt(O.progress,0,1):0,u.value=O.inhale?1:0,f.visible=O.guiding;let B=O.guiding?O.inhale?"in":"out":"idle";if(B!==T){if(O.guiding&&!N){let W=d[g++%d.length];W.life=0}T=B}d.forEach(W=>{W.life<1?(W.life=Math.min(1,W.life+_/3.5),W.m.scale.setScalar(q*(1+W.life*1.6)),W.m.material.opacity=(1-W.life)*.45):W.m.material.opacity=0});let z=M.attributes.position;for(let W=0;W<y;W++){let ie=p[W],re=ie.r*(.85+S*.3)+(L?Math.sin(C*.4+ie.w)*.08:0),he=ie.a+(L?C*.02*(W%2?1:-1):0);z.setXYZ(W,Math.cos(he)*re,Math.sin(he)*re*.95,ie.z)}z.needsUpdate=!0}return{scene:t,camera:n,update:I,setWater(){},resize(_,b){n.aspect=_/Math.max(1,b);let N=n.aspect<1?1/n.aspect:1;n.position.z=10*N,n.updateProjectionMatrix()}}}var Ga={blue:{top:1855366,deep:132623,glow:[.55,.8,1],rim:[.75,.9,1]},green:{top:1335386,deep:133641,glow:[.5,1,.85],rim:[.75,1,.9]},violet:{top:4860550,deep:328463,glow:[.85,.65,1],rim:[1,.8,1]}};function vh(i,e){let t=new Et,n=new et(42,16/9,.1,80);n.position.set(0,0,14);let s=Ga.blue;t.fog=new Wi(s.deep,.028);let r={value:0},o={value:new ge().setRGB(...s.glow)},a={value:new ge().setRGB(...s.rim)},l=new Be({side:ft,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new ge(s.top)},uDeep:{value:new ge(s.deep)},uT:r},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uTop; uniform vec3 uDeep; uniform float uT; varying vec3 vP;
      void main(){ vec3 n = normalize(vP); float h = clamp(n.y * 1.1 + 0.55, 0.0, 1.0);
        float wave = 0.08 * sin(n.x * 5.0 + uT * 0.2) * sin(n.y * 3.0 - uT * 0.15);
        vec3 c = mix(uDeep, uTop, pow(h, 1.6) + wave);
        gl_FragColor = vec4(c, 1.0); }`});t.add(new xe(new _t(40,32,16),l));let c=new _t(1,72,28,0,We,0,Math.PI*.55);{let P=c.attributes.position;for(let I=0;I<P.count;I++)P.setY(I,P.getY(I)*.62);c.computeVertexNormals()}let h=new Be({transparent:!0,depthWrite:!1,side:mt,blending:at,uniforms:{uT:r,uGlow:o,uRim:a,uPulse:{value:0}},vertexShader:`uniform float uPulse; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec3 p = position;
        float edge = 1.0 - clamp(p.y / 0.62, 0.0, 1.0);
        p.xz *= 1.0 - uPulse * 0.22 * edge;           // la campana se cierra
        p.y *= 1.0 + uPulse * 0.18;
        p.y += sin(atan(p.z, p.x) * 8.0) * 0.02 * edge;   // borde festoneado
        vec4 mv = modelViewMatrix * vec4(p, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uGlow; uniform vec3 uRim; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(f, 2.4);
        // cuatro g\xF3nadas en forma de herradura (medusa luna)
        float a = atan(vP.z, vP.x); float r = length(vP.xz);
        float ring = smoothstep(0.08, 0.0, abs(r - 0.32 - 0.05 * cos(a * 4.0))) * (0.5 + 0.5 * cos(a * 4.0));
        float body = 0.13 + 0.16 * (1.0 - r);
        vec3 c = uGlow * body + uRim * rim * 0.95 + vec3(1.0, 0.85, 0.95) * ring * 0.55;
        gl_FragColor = vec4(c, 1.0); }`}),u=new Ge(.22,2.6,1,24);u.translate(0,-1.3,0);let f=new Be({transparent:!0,depthWrite:!1,side:mt,blending:at,uniforms:{uT:r,uGlow:o},vertexShader:`uniform float uT; varying float vY; varying vec2 vU;
      void main(){ vU = uv; vec3 p = position; float k = -p.y / 2.6; vY = k;
        p.x += sin(uT * 1.2 + k * 5.0) * 0.18 * k; p.z += cos(uT * 0.9 + k * 4.0) * 0.12 * k;
        p.x *= 1.0 + sin(k * 18.0 + uT) * 0.25;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:`uniform vec3 uGlow; varying float vY; varying vec2 vU;
      void main(){ float edge = 1.0 - abs(vU.x - 0.5) * 2.0; float a = (1.0 - vY) * edge * 0.55;
        gl_FragColor = vec4(uGlow * a * 0.6 + vec3(0.9, 0.8, 1.0) * a * 0.15, 1.0); }`});function d(P){let _=new Float32Array(P*18*2*3),b=new Float32Array(P*18*2),N=new Float32Array(P*18*2),O=0;for(let Y=0;Y<P;Y++){let q=Y/P*We,B=Math.cos(q)*.97,z=Math.sin(q)*.97,W=X(1.6,3.2),ie=X(0,We);for(let re=0;re<18;re++)for(let he=0;he<2;he++){let Ce=(re+he)/18;_[O*3]=B,_[O*3+1]=-Ce*W,_[O*3+2]=z,b[O]=Ce,N[O]=ie,O++}}let L=new tt;return L.setAttribute("position",new Je(_,3)),L.setAttribute("aK",new Je(b,1)),L.setAttribute("aPh",new Je(N,1)),L}let g=new Be({transparent:!0,depthWrite:!1,blending:at,uniforms:{uT:r,uGlow:o,uPulse:{value:0}},vertexShader:`uniform float uT; uniform float uPulse; attribute float aK; attribute float aPh; varying float vK;
      void main(){ vK = aK; vec3 p = position;
        p.xz *= 1.0 - uPulse * 0.2;
        p.x += sin(uT * 0.9 + aPh + aK * 4.0) * 0.35 * aK; p.z += cos(uT * 0.7 + aPh + aK * 3.0) * 0.3 * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:"uniform vec3 uGlow; varying float vK; void main(){ gl_FragColor = vec4(uGlow * (1.0 - vK) * 0.4, 1.0); }"}),y=[];for(let P=0;P<9;P++){let I=new Wt,_=h.clone();_.uniforms={uT:r,uGlow:o,uRim:a,uPulse:{value:0}};let b=new xe(c,_);I.add(b);for(let L=0;L<4;L++){let Y=new xe(u,f);Y.rotation.y=L/4*We+.4,Y.position.y=.05,I.add(Y)}let N=g.clone();N.uniforms={uT:r,uGlow:o,uPulse:_.uniforms.uPulse},I.add(new Xi(d(40),N));let O=X(.55,1.15);I.scale.setScalar(O),I.position.set(-8.5+P%5*4.2+X(-1,1),(P%2?2.6:-2.2)+X(-1.2,1.2),X(-8,1.5)),I.rotation.z=X(-.35,.35),I.rotation.x=X(.2,.55),t.add(I),y.push({g:I,pulse:_.uniforms.uPulse,ph:X(0,We),per:X(3.2,4.6),drift:new R(X(-.08,.08),0,X(-.03,.03)),s:O})}let m=900,p=new Float32Array(m*3);for(let P=0;P<m;P++)p[P*3]=X(-16,16),p[P*3+1]=X(-9,9),p[P*3+2]=X(-14,6);let M=new tt;M.setAttribute("position",new Je(p,3));let v=Ut(32,32,(P,I,_)=>{let b=P.createRadialGradient(I/2,_/2,0,I/2,_/2,I/2);b.addColorStop(0,"rgba(255,255,255,1)"),b.addColorStop(1,"rgba(255,255,255,0)"),P.fillStyle=b,P.fillRect(0,0,I,_)},!1),E=new gn(M,new Pn({map:v,size:.07,color:13625087,transparent:!0,opacity:.55,depthWrite:!1,blending:at}));t.add(E);let C=0;function S(P,I,_){C+=P*I,r.value=C;for(let N of y){let O=(C+N.ph)%N.per/N.per,L=O<.35?Math.sin(O/.35*Math.PI*.5):Math.cos((O-.35)/.65*Math.PI*.5);N.pulse.value=L;let Y=new R(0,1,0).applyEuler(N.g.rotation),q=(O<.35?.55:.08)-.1;N.g.position.addScaledVector(Y,q*P*I*.9*N.s),N.g.position.addScaledVector(N.drift,P*I),N.g.rotation.z+=Math.sin(C*.1+N.ph)*6e-4*I,N.g.position.y>7&&(N.g.position.y=-7),N.g.position.y<-7.5&&(N.g.position.y=7),N.g.position.x>11&&(N.g.position.x=-11),N.g.position.x<-11&&(N.g.position.x=11)}let b=M.attributes.position;for(let N=0;N<m;N++){let O=b.getY(N)-.05*P*I;O<-9&&(O=9),b.setY(N,O)}b.needsUpdate=!0,_||(n.position.x=Math.sin(C*.03)*.8,n.lookAt(0,0,0))}function T(P){let I=Ga[P]||Ga.blue;I!==s&&(s=I,l.uniforms.uTop.value.set(I.top),l.uniforms.uDeep.value.set(I.deep),t.fog.color.set(I.deep),o.value.setRGB(...I.glow),a.value.setRGB(...I.rim))}for(let P=0;P<60;P++)S(1/30,1,!0);return{scene:t,camera:n,update:S,setWater:T,resize(P,I){n.aspect=P/Math.max(1,I),n.fov=n.aspect<1.2?60:42,n.updateProjectionMatrix()}}}var _h={blue:[[.2,.6,1],[.55,.35,1],[.1,.9,.9]],green:[[.2,1,.6],[.9,1,.3],[.1,.8,.9]],violet:[[.75,.35,1],[1,.4,.75],[.35,.5,1]]};function xh(i,e){let t=new Et;t.background=new ge(263435);let n=new et(40,16/9,.1,60);n.position.set(0,3.2,12),n.lookAt(0,3.4,0);let s={value:0},r={value:new R},o={value:new R},a={value:new R},l=420,c=26,h=8.2,u=new Float32Array(l*c*2*3),f=new Float32Array(l*c*2),d=new Float32Array(l*c*2),g=new Float32Array(l*c*2),y=new Float32Array(l*3),m=new Float32Array(l),p=new Float32Array(l),M=0,v=[];for(let B=0;B<l;B++){let z=X(0,We),W=Math.sqrt(Math.random())*.35,ie=Math.cos(z)*W,re=Math.sin(z)*W,he=X(-5.5,5.5),Ce=X(-2.5,2.5),J=X(6.5,8.2),le=Math.random(),pe=X(0,We);v.push({sx:ie,sz:re,spread:he,depth:Ce,len:J});let Ue=fe=>{let He=h-fe*J,Pe=Math.pow(fe,1.6);return[ie+he*Pe*(.3+.7*fe),He,re+Ce*Pe*.8]};for(let fe=0;fe<c;fe++)for(let He=0;He<2;He++){let Pe=(fe+He)/c,H=Ue(Pe);u[M*3]=H[0],u[M*3+1]=H[1],u[M*3+2]=H[2],f[M]=Pe,d[M]=le,g[M]=pe,M++}let be=Ue(1);y[B*3]=be[0],y[B*3+1]=be[1],y[B*3+2]=be[2],m[B]=le,p[B]=pe}let E=new tt;E.setAttribute("position",new Je(u,3)),E.setAttribute("aK",new Je(f,1)),E.setAttribute("aH",new Je(d,1)),E.setAttribute("aPh",new Je(g,1));let C=`
    uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uT;
    vec3 pal(float x){ x = fract(x); return x < 0.333 ? mix(uA, uB, x * 3.0) : x < 0.666 ? mix(uB, uC, (x - 0.333) * 3.0) : mix(uC, uA, (x - 0.666) * 3.0); }`,S=new Be({transparent:!0,depthWrite:!1,blending:at,uniforms:{uT:s,uA:r,uB:o,uC:a},vertexShader:`uniform float uT; attribute float aK; attribute float aH; attribute float aPh; varying float vK; varying float vH; varying float vPh;
      void main(){ vK = aK; vH = aH; vPh = aPh; vec3 p = position;
        p.x += sin(uT * 0.35 + aPh) * 0.12 * aK * aK; p.z += cos(uT * 0.3 + aPh) * 0.1 * aK * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:`${C} varying float vK; varying float vH; varying float vPh;
      void main(){ vec3 c = pal(vH * 0.35 + uT * 0.02);
        float pulse = 0.55 + 0.45 * smoothstep(0.7, 1.0, sin(vK * 9.0 - uT * 0.6 + vPh));
        gl_FragColor = vec4(c * (0.12 + 0.35 * vK) * pulse, 1.0); }`}),T=new Xi(E,S);t.add(T);let P=new tt;P.setAttribute("position",new Je(y,3)),P.setAttribute("aH",new Je(m,1)),P.setAttribute("aPh",new Je(p,1));let I=new Be({transparent:!0,depthWrite:!1,blending:at,uniforms:{uT:s,uA:r,uB:o,uC:a,uSize:{value:16}},vertexShader:`uniform float uT; uniform float uSize; attribute float aH; attribute float aPh; varying float vH; varying float vPh;
      void main(){ vH = aH; vPh = aPh; vec3 p = position; p.x += sin(uT * 0.35 + aPh) * 0.12; p.z += cos(uT * 0.3 + aPh) * 0.1;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = uSize * (8.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${C} varying float vH; varying float vPh;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
        float tw = 0.7 + 0.3 * sin(uT * 0.8 + vPh * 3.0);
        vec3 c = pal(vH * 0.35 + uT * 0.02) * a * tw + vec3(1.0) * pow(a, 6.0) * 0.6;
        gl_FragColor = vec4(c, 1.0); }`});t.add(new gn(P,I));let _=Ut(256,256,(B,z,W)=>{let ie=B.createRadialGradient(z/2,W/2,0,z/2,W/2,z/2);ie.addColorStop(0,"rgba(255,255,255,0.9)"),ie.addColorStop(1,"rgba(255,255,255,0)"),B.fillStyle=ie,B.fillRect(0,0,z,W)},!1),b=new xe(new Ge(16,7),new Mt({map:_,transparent:!0,blending:at,depthWrite:!1,opacity:.35}));b.rotation.x=-Math.PI/2,b.position.y=-.2,t.add(b);let N=new xe(new Gt(.55,.7,.35,32),new Mt({color:1382434}));N.position.y=h+.15,t.add(N);let O=0,L=null;function Y(B){if(B===L)return;L=B;let z=_h[B]||_h.blue;r.value.set(...z[0]),o.value.set(...z[1]),a.value.set(...z[2]),b.material.color.setRGB(...z[0])}Y("blue");function q(B,z,W){O+=B*z,s.value=O,W||(n.position.x=Math.sin(O*.04)*1.2,n.lookAt(0,3.4,0))}return{scene:t,camera:n,update:q,setWater:Y,resize(B,z){n.aspect=B/Math.max(1,z),n.fov=n.aspect<1.2?62:40,n.updateProjectionMatrix(),I.uniforms.uSize.value=Math.max(10,Math.min(22,z/30))}}}var Wa={blue:{top:[.16,.34,.62],hor:[.78,.86,.93],sun:[1,.95,.82],sunY:.16,deep:[.03,.17,.28],shallow:[.1,.42,.48],sand:[.8,.72,.58]},green:{top:[.1,.28,.4],hor:[.72,.88,.82],sun:[1,.97,.86],sunY:.2,deep:[.02,.18,.2],shallow:[.08,.46,.4],sand:[.78,.73,.6]},violet:{top:[.2,.16,.42],hor:[1,.62,.48],sun:[1,.78,.52],sunY:.05,deep:[.06,.08,.2],shallow:[.24,.22,.38],sand:[.72,.58,.52]}},Xa=`
uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uSun; uniform vec3 uSunDir; uniform float uT;
vec3 igSky(vec3 d){
  float h = clamp(d.y, -0.2, 1.0);
  vec3 c = mix(uHor, uTop, pow(clamp(h * 1.6, 0.0, 1.0), 0.55));
  float s = max(dot(d, uSunDir), 0.0);
  c += uSun * (smoothstep(0.9993, 0.9997, s) * 3.0 + pow(s, 60.0) * 0.35 + pow(s, 6.0) * 0.08);
  // nubes suaves y lentas
  vec2 cp = d.xz / max(d.y + 0.08, 0.05) * 0.35 + vec2(uT * 0.004, 0.0);
  float cl = smoothstep(0.55, 0.85, igF2(cp * 1.3)) * smoothstep(0.0, 0.25, d.y);
  c = mix(c, mix(uHor, vec3(1.0), 0.5) * (0.85 + 0.3 * pow(s, 3.0)), cl * 0.55);
  return c;
}`;function yh(i,e){let t=new Et,n=new et(45,16/9,.1,400);n.position.set(0,1.55,9),n.lookAt(0,1.2,-40);let s=Wa.blue,r="blue",o={value:0},a={uT:o,uTop:{value:new R(...s.top)},uHor:{value:new R(...s.hor)},uSun:{value:new R(...s.sun)},uSunDir:{value:new R(.2,s.sunY,-1).normalize()},uDeep:{value:new R(...s.deep)},uShallow:{value:new R(...s.shallow)},uSand:{value:new R(...s.sand)}},l=new xe(new _t(300,48,24),new Be({side:ft,depthWrite:!1,uniforms:a,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:nn+Xa+"varying vec3 vD; void main(){ gl_FragColor = vec4(igSky(normalize(vD)), 1.0); }"}));t.add(l);let c=`
  uniform float uT;
  vec3 igWave(vec2 p, out vec3 n){
    vec3 o = vec3(0.0); vec3 dx = vec3(1.0, 0.0, 0.0), dz = vec3(0.0, 0.0, 1.0);
    vec4 W[5];
    W[0] = vec4(0.10, 0.98, 0.038, 0.22);
    W[1] = vec4(-0.35, 0.94, 0.030, 0.37);
    W[2] = vec4(0.55, 0.83, 0.018, 0.61);
    W[3] = vec4(-0.8, 0.6, 0.010, 1.05);
    W[4] = vec4(0.25, 0.97, 0.008, 1.6);
    for (int i = 0; i < 5; i++){
      vec2 d = normalize(W[i].xy); float a = W[i].z * 6.0, k = W[i].w; float w = sqrt(9.8 * k) * 0.55;
      float f = k * dot(d, p) + w * uT;
      float q = 0.55 / (k * a * 5.0 + 1.0);
      o.x += q * a * d.x * cos(f); o.z += q * a * d.y * cos(f); o.y += a * sin(f);
      dx += vec3(-q * d.x * d.x * a * k * sin(f), d.x * a * k * cos(f), -q * d.x * d.y * a * k * sin(f));
      dz += vec3(-q * d.x * d.y * a * k * sin(f), d.y * a * k * cos(f), -q * d.y * d.y * a * k * sin(f));
    }
    n = normalize(cross(dz, dx));
    return o;
  }`,h=new Ge(260,250,320,260);h.rotateX(-Math.PI/2),h.translate(0,0,-122);let u=new xe(h,new Be({uniforms:a,vertexShader:nn+c+`
      varying vec3 vW; varying vec3 vN; varying float vShore;
      void main(){
        vec3 p = position; vec3 n;
        float shoreK = smoothstep(4.5, -6.0, p.z);             // olas m\xE1s bajas cerca de la orilla
        vec3 o = igWave(p.xz, n);
        p += o * mix(0.25, 1.0, shoreK);
        n = normalize(mix(vec3(0.0, 1.0, 0.0), n, mix(0.35, 1.0, shoreK)));
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; vN = n; vShore = p.z;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:nn+Xa+`
      uniform vec3 uDeep; uniform vec3 uShallow;
      varying vec3 vW; varying vec3 vN; varying float vShore;
      void main(){
        vec3 V = normalize(cameraPosition - vW);
        vec2 q = vW.xz * 0.35 + vec2(uT * 0.05, uT * 0.03);
        vec3 n = normalize(vN + vec3(igN2(q * 3.0) - 0.5, 0.0, igN2(q * 3.0 + 7.3) - 0.5) * 0.18);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec3 R = reflect(-V, n); R.y = abs(R.y);
        vec3 refl = igSky(R);
        float depth = smoothstep(4.0, -20.0, vShore);
        vec3 body = mix(uShallow, uDeep, depth);
        body += uSun * 0.05 * max(dot(n, uSunDir), 0.0);
        vec3 c = mix(body, refl, clamp(fres, 0.0, 1.0));
        float glit = pow(max(dot(reflect(-uSunDir, n), V), 0.0), 380.0) * 5.0;
        c += uSun * glit;
        // espuma de la ola que rompe cerca de la orilla
        float br = sin(vShore * 1.2 + uT * 0.9);
        float foam = smoothstep(0.82, 0.98, br) * smoothstep(-3.5, 3.0, vShore) * smoothstep(0.35, 0.7, igF2(vW.xz * 1.5 + uT * 0.1));
        c = mix(c, vec3(0.93, 0.96, 0.97), foam * 0.8);
        float dist = length(vW - cameraPosition);
        c = mix(c, igSky(normalize(vec3(-V.x, 0.02, -V.z))), smoothstep(40.0, 180.0, dist));
        gl_FragColor = vec4(c, 1.0);
      }`}));t.add(u);let f=new Ge(80,16,200,60);f.rotateX(-Math.PI/2),f.translate(0,0,8);{let p=f.attributes.position;for(let M=0;M<p.count;M++){let v=p.getZ(M);p.setY(M,(v-3.5)*.07)}f.computeVertexNormals()}let d=new xe(f,new Be({uniforms:a,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:nn+Xa+`
      uniform vec3 uSand; uniform vec3 uShallow;
      varying vec3 vW;
      void main(){
        float grain = igN2(vW.xz * 40.0) * 0.08 + igF2(vW.xz * 0.8) * 0.12;
        vec3 c = uSand * (0.9 + grain);
        float cyc = uT * 0.18;
        float front = 3.2 + 2.3 * (0.5 + 0.5 * sin(cyc)) + (igF2(vec2(vW.x * 0.25, cyc)) - 0.5) * 1.2;   // hasta d\xF3nde llega el agua
        float wet = smoothstep(front + 1.8, front - 0.2, vW.z);
        c = mix(c, c * 0.62, wet);                                        // arena mojada, m\xE1s oscura
        float sheet = smoothstep(front + 0.05, front - 0.6, vW.z);
        vec3 water = mix(uShallow * 1.3, uHor * 0.85, 0.35);
        float rip = igN2(vW.xz * vec2(3.0, 6.0) + vec2(0.0, uT * 0.6));
        c = mix(c, mix(c * 0.75, water, 0.5) + rip * 0.05, sheet * 0.7);
        float foam = smoothstep(0.45, 0.0, abs(vW.z - front)) * (0.55 + 0.45 * igF2(vW.xz * 2.2 + uT * 0.2));
        c = mix(c, vec3(0.95, 0.97, 0.98), foam * 0.75);
                gl_FragColor = vec4(c, 1.0);
      }`}));t.add(d);let g=0;function y(p,M,v){g+=p*M*.9,o.value=g,v||(n.position.y=1.55+Math.sin(g*.12)*.05,n.lookAt(Math.sin(g*.03)*1.2,1.2,-40))}function m(p){p!==r&&(r=p,s=Wa[p]||Wa.blue,a.uTop.value.set(...s.top),a.uHor.value.set(...s.hor),a.uSun.value.set(...s.sun),a.uSunDir.value.set(.2,s.sunY,-1).normalize(),a.uDeep.value.set(...s.deep),a.uShallow.value.set(...s.shallow),a.uSand.value.set(...s.sand))}return y(0,1,!0),{scene:t,camera:n,update:y,setWater:m,resize(p,M){n.aspect=p/Math.max(1,M),n.fov=n.aspect<1.2?65:45,n.updateProjectionMatrix()}}}var qa={blue:{a:[.03,.05,.11],b:[.1,.16,.3],l1:[1,.72,.38],l2:[.55,.75,1],l3:[1,.9,.75]},green:{a:[.02,.06,.05],b:[.1,.22,.18],l1:[1,.85,.45],l2:[.6,.95,.75],l3:[1,.95,.8]},violet:{a:[.06,.03,.1],b:[.26,.14,.34],l1:[1,.6,.45],l2:[.85,.6,1],l3:[1,.82,.9]}};function Ug(i){let e=document.createElement("canvas");e.width=e.height=i;let t=e.getContext("2d"),n=t.createImageData(i,i),s=i/2;for(let r=0;r<i;r++)for(let o=0;o<i;o++){let a=(o+.5-s)/s,l=(r+.5-s)/s,c=Math.sqrt(a*a+l*l),h=(r*i+o)*4;if(c>=1){n.data[h+3]=0;continue}let u=Math.sqrt(1-c*c);n.data[h]=128+a*127*(1-u*.3),n.data[h+1]=128+l*127*(1-u*.3),n.data[h+2]=255*u,n.data[h+3]=255*Math.min(1,(1-c)*6)}return t.putImageData(n,0,0),e}function Mh(i,e){let t=new Et,n=new Gi(-1,1,1,-1,0,1),s=640,r=360,o=document.createElement("canvas");o.width=s,o.height=r;let a=o.getContext("2d"),l=Ug(64),c=new qi(o);c.minFilter=Bt,c.generateMipmaps=!1;let h=qa.blue,u="blue",f={uT:{value:0},uDrops:{value:c},uAspect:{value:16/9},uA:{value:new R(...h.a)},uB:{value:new R(...h.b)},uL1:{value:new R(...h.l1)},uL2:{value:new R(...h.l2)},uL3:{value:new R(...h.l3)}},d=new xe(new Ge(2,2),new Be({uniforms:f,depthWrite:!1,depthTest:!1,vertexShader:"varying vec2 vU; void main(){ vU = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:nn+`
      uniform float uT; uniform sampler2D uDrops; uniform float uAspect;
      uniform vec3 uA; uniform vec3 uB; uniform vec3 uL1; uniform vec3 uL2; uniform vec3 uL3;
      varying vec2 vU;
      vec3 lights(vec2 p, float blur, float scale, float seed){
        vec3 acc = vec3(0.0);
        vec2 g = p * scale; vec2 id = floor(g);
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
          vec2 c = id + vec2(float(i), float(j));
          float h = igH2(c + seed);
          if (h < 0.45) continue;
          vec2 o = vec2(igH2(c + seed + 3.1), igH2(c + seed + 7.7));
          vec2 pos = c + o;
          pos.x += sin(uT * 0.05 + h * 30.0) * 0.08;
          float r = mix(0.22, 0.48, igH2(c + seed + 1.3));
          float d = length(g - pos);
          float disc = 1.0 - smoothstep(r * (1.0 - blur), r, d);
          disc *= 0.75 + 0.25 * smoothstep(r * 0.2, r, d);   // borde algo m\xE1s marcado, como en fotos
          float tw = 0.85 + 0.15 * sin(uT * (0.2 + h) + h * 40.0);
          vec3 col = h > 0.8 ? uL3 : (h > 0.62 ? uL1 : uL2);
          acc += col * disc * tw * mix(0.35, 0.8, h);
        }
        return acc;
      }
      vec3 scene(vec2 uv, float blur){
        vec2 p = vec2(uv.x * uAspect, uv.y);
        vec3 c = mix(uA, uB, smoothstep(0.0, 1.0, uv.y) * 0.6 + igF2(p * 1.5 + uT * 0.01) * 0.4);
        c += lights(p, blur, 3.0, 0.0) * 1.15;
        c += lights(p + 13.0, blur, 5.5, 5.0) * 0.55;
        c += lights(p + 31.0, blur, 1.6, 9.0) * 0.6 * smoothstep(0.7, 0.2, uv.y);
        return c;
      }
      void main(){
        vec4 d = texture2D(uDrops, vec2(vU.x, 1.0 - vU.y));
        float m = d.a;
        vec2 n = (d.rg - 0.5) * 2.0;
        vec3 outside = scene(vU, 0.85);
        float fog = 0.06 + 0.05 * igF2(vU * vec2(uAspect, 1.0) * 3.0);
        outside = mix(outside, uB * 1.3 + 0.03, fog);
        vec2 luv = vU - n * 0.05;                          // la gota invierte y concentra lo que hay detr\xE1s
        vec3 inside = scene(luv, 0.25) * 1.15;
        inside += pow(max(0.0, n.y * -0.7 + n.x * -0.3), 6.0) * 0.35;   // brillo de la gota
        inside *= 0.85 + 0.15 * d.b;
        vec3 c = mix(outside, inside, m);
        c *= 1.0 - smoothstep(0.6, 1.25, length((vU - 0.5) * vec2(1.2, 1.0))) * 0.35;
        gl_FragColor = vec4(c, 1.0);
      }`}));t.add(d);let g=[],y=[];function m(I){for(let _=0;_<I;_++)g.push({x:X(0,s),y:X(0,r),r:Math.pow(Math.random(),2.5)*7+1.3,life:X(20,90)})}function p(I){return{x:X(10,s-10),y:I?X(-40,-5):X(0,r*.8),r:X(7,12),v:0,hold:X(1,7),wob:X(0,6),trail:0}}function M(){g=[],m(420),y=[];for(let I=0;I<14;I++)y.push(p(!1))}M();let v=0,E=0;function C(){a.clearRect(0,0,s,r);for(let I of g)a.drawImage(l,I.x-I.r,I.y-I.r,I.r*2,I.r*2);for(let I of y)a.drawImage(l,I.x-I.r,I.y-I.r*1.15,I.r*2,I.r*2.3);c.needsUpdate=!0}function S(I){for(let _=g.length-1;_>=0;_--)g[_].life-=I,g[_].life<=0&&g.splice(_,1);g.length<420&&m(Math.min(6,420-g.length));for(let _ of y){if(_.hold>0){_.hold-=I;continue}_.v=Math.min(_.v+I*30,26+_.r*2);let b=_.v*I;_.y+=b,_.wob+=I*1.3,_.x+=Math.sin(_.wob)*I*3,_.trail+=b,_.trail>7&&(_.trail=0,g.push({x:_.x+X(-1.5,1.5),y:_.y-_.r*1.6,r:X(1.2,2.6),life:X(8,30)}));for(let N=g.length-1;N>=0;N--){let O=g[N];Math.abs(O.x-_.x)<_.r&&O.y>_.y-2&&O.y<_.y+_.r&&(g.splice(N,1),_.r=Math.min(13,_.r+.05))}Math.random()<I*.15&&(_.hold=X(.5,3)),_.y-_.r>r+10&&Object.assign(_,p(!0))}}function T(I,_,b){v+=I*_,f.uT.value=v;let N=b?.35:1;E+=I,S(I*_*N),E>1/30&&(E=0,C())}function P(I){I!==u&&(u=I,h=qa[I]||qa.blue,f.uA.value.set(...h.a),f.uB.value.set(...h.b),f.uL1.value.set(...h.l1),f.uL2.value.set(...h.l2),f.uL3.value.set(...h.l3))}for(let I=0;I<30;I++)S(.1);return C(),{scene:t,camera:n,update:T,setWater:P,resize(I,_){f.uAspect.value=I/Math.max(1,_);let b=Math.round(s/f.uAspect.value);if(b!==r&&b>50&&b<2e3){r=b,o.height=r,c.dispose(),M();for(let N=0;N<30;N++)S(.1);C()}}}}var Ya={blue:{top:[.004,.01,.035],hor:[.02,.05,.1],a1:[.15,.95,.65],a2:[.25,.45,1]},green:{top:[.004,.02,.02],hor:[.02,.07,.06],a1:[.25,1,.45],a2:[.1,.7,.8]},violet:{top:[.02,.008,.04],hor:[.07,.03,.1],a1:[.75,.35,1],a2:[1,.35,.65]}},Eh=`
uniform float uT; uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uA1; uniform vec3 uA2;
float igStars(vec3 d){
  vec2 p = vec2(atan(d.z, d.x) * 60.0, d.y * 120.0);
  vec2 id = floor(p); vec2 f = fract(p) - 0.5;
  float h = igH2(id);
  float s = step(0.965, h) * smoothstep(0.12, 0.0, length(f - (vec2(igH2(id + 1.3), igH2(id + 2.7)) - 0.5) * 0.6));
  float tw = 0.7 + 0.3 * sin(uT * (0.6 + h * 1.5) + h * 50.0);
  return s * tw * (0.4 + 1.6 * pow(igH2(id + 9.1), 6.0));
}
vec3 igAurora(vec3 d){
  if (d.y < 0.01) return vec3(0.0);
  vec3 acc = vec3(0.0);
  float jit = igH2(d.xz * 731.0 + d.y * 97.0);
  for (int i = 0; i < 48; i++){
    float fi = float(i) + jit;
    float H = 5.0 + fi * 0.85;                        // capas de altura: cortina vertical en el mundo
    vec2 P = d.xz / d.y * H;
    float z0 = -30.0 + 10.0 * sin(P.x * 0.07 + uT * 0.02) + 4.0 * sin(P.x * 0.19 - uT * 0.03) + 2.5 * sin(P.x * 0.43 + uT * 0.05);
    float dz = (P.y - z0) / 4.0;
    float band = exp(-dz * dz * 2.5);
    float streak = 0.35 + 0.65 * pow(igN2(vec2(P.x * 0.45 + uT * 0.04, 0.5)), 1.5);
    float w = exp(-fi * 0.055) * smoothstep(0.0, 3.0, fi);
    vec3 col = mix(uA1, uA2, smoothstep(8.0, 40.0, fi));
    acc += col * band * streak * w * 0.15;
  }
  return acc * smoothstep(0.02, 0.2, d.y);
}
float igRidge(float az){ return 0.012 + 0.05 * igF2(vec2(az * 2.2, 3.0)) + 0.025 * igN2(vec2(az * 9.0, 1.0)); }
vec3 igNight(vec3 d){
  float az = atan(d.z, d.x);
  vec3 c = mix(uHor, uTop, smoothstep(0.0, 0.6, d.y));
  float mw = exp(-pow(dot(d, normalize(vec3(0.6, 0.5, -0.62))) * 3.2, 2.0));   // V\xEDa L\xE1ctea suave
  c += vec3(0.05, 0.05, 0.07) * mw * igF2(vec2(az * 6.0, d.y * 8.0));
  c += igStars(d) * vec3(0.95, 0.95, 1.0) * smoothstep(0.02, 0.15, d.y);
  c += igAurora(d);
  float ridge = igRidge(az);
  float mount = smoothstep(ridge + 0.004, ridge - 0.004, d.y);
  c = mix(c, uHor * 0.3 + uA1 * 0.012, mount);
  return c;
}`;function Sh(i,e){let t=new Et,n=new et(55,16/9,.1,500);n.position.set(0,1.4,6),n.lookAt(0,4.5,-30);let s=Ya.blue,r="blue",o={uT:{value:0},uTop:{value:new R(...s.top)},uHor:{value:new R(...s.hor)},uA1:{value:new R(...s.a1)},uA2:{value:new R(...s.a2)}};t.add(new xe(new _t(300,64,32),new Be({side:ft,depthWrite:!1,uniforms:o,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:nn+Eh+"varying vec3 vD; void main(){ vec3 d = normalize(vD); gl_FragColor = vec4(igNight(d), 1.0); }"})));let a=new Ge(400,300);a.rotateX(-Math.PI/2),a.translate(0,0,-140),t.add(new xe(a,new Be({uniforms:o,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:nn+Eh+`
      varying vec3 vW;
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 q = vW.xz * 0.3;
        vec2 rip = vec2(igN2(q * 2.0 + vec2(uT * 0.08, 0.0)) - 0.5, igN2(q * 2.0 + vec2(3.3, uT * 0.06)) - 0.5);
        vec3 R = normalize(vec3(V.x + rip.x * 0.03, -V.y, V.z + rip.y * 0.03));
        float fres = 0.45 + 0.55 * pow(1.0 - abs(V.y), 3.0);
        vec3 c = igNight(R) * fres * 0.85 + uHor * 0.15;
        gl_FragColor = vec4(c, 1.0);
      }`})));let l=new Mt({color:197898}),c=new Wt;t.add(c);for(let S of[-1,1]){let T=new xe(new Fr(1,40),l);T.rotation.x=-Math.PI/2,T.scale.set(13,6.5,1),T.position.set(S*16.5,.02,-2.2),c.add(T)}let h=new Or(1,1,7);for(let S=0;S<26;S++){let T=S%2?1:-1,P=T*X(4.2,15),I=X(-5,.5),_=X(2.5,6.5),b=new Wt;for(let N=0;N<4;N++){let O=new xe(h,l),L=_*(.42-N*.08);O.scale.set(L*.55,_*.38,L*.55),O.position.y=_*(.3+N*.2),b.add(O)}b.position.set(P,0,I),c.add(b)}let u=new tt;u.setAttribute("position",new Je(new Float32Array(6),3));let f=new Ms({color:16777215,transparent:!0,opacity:0}),d=new Es(u,f);t.add(d);let g=-1,y=X(20,40),m=0,p=0,M=0,v=0;function E(S,T,P){if(v+=S*T,o.uT.value=v,!P&&(n.position.x=Math.sin(v*.02)*.6,n.lookAt(0,4.5,-30),y-=S,y<=0&&g<0&&(g=0,y=X(25,60),m=X(-60,20),p=X(60,90),M=-150),g>=0)){g+=S;let I=g/1.2,_=u.attributes.position;_.setXYZ(0,m+I*40,p-I*14,M),_.setXYZ(1,m+I*40-10,p-I*14+3.5,M),_.needsUpdate=!0,f.opacity=Math.sin(Math.min(1,I)*Math.PI)*.7,I>=1&&(g=-1,f.opacity=0)}}function C(S){S!==r&&(r=S,s=Ya[S]||Ya.blue,o.uTop.value.set(...s.top),o.uHor.value.set(...s.hor),o.uA1.value.set(...s.a1),o.uA2.value.set(...s.a2))}return{scene:t,camera:n,update:E,setWater:C,resize(S,T){n.aspect=S/Math.max(1,T),n.fov=n.aspect<1.2?75:55,n.updateProjectionMatrix()}}}function bh(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,o=0,a=Object.keys(i.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let M=0,v=a.length;M<v;M++){let E=a[M],C=i.attributes[E];l[E]=new Je(new C.array.constructor(C.count*C.itemSize),C.itemSize,C.normalized);let S=i.morphAttributes[E];S&&(c[E]=new Je(new S.array.constructor(S.count*S.itemSize),S.itemSize,S.normalized))}let d=e*.5,g=Math.log10(1/e),y=Math.pow(10,g),m=d*y;for(let M=0;M<r;M++){let v=n?n.getX(M):M,E="";for(let C=0,S=a.length;C<S;C++){let T=a[C],P=i.getAttribute(T),I=P.itemSize;for(let _=0;_<I;_++)E+=`${~~(P[u[_]](v)*y+m)},`}if(E in t)h.push(t[E]);else{for(let C=0,S=a.length;C<S;C++){let T=a[C],P=i.getAttribute(T),I=i.morphAttributes[T],_=P.itemSize,b=l[T],N=c[T];for(let O=0;O<_;O++){let L=u[O],Y=f[O];if(b[Y](o,P[L](v)),I)for(let q=0,B=I.length;q<B;q++)N[q][Y](o,I[q][L](v))}}t[E]=o,h.push(o),o++}}let p=i.clone();for(let M in i.attributes){let v=l[M];if(p.setAttribute(M,new Je(v.array.slice(0,o*v.itemSize),v.itemSize,v.normalized)),M in c)for(let E=0;E<c[M].length;E++){let C=c[M][E];p.morphAttributes[M][E]=new Je(C.array.slice(0,o*C.itemSize),C.itemSize,C.normalized)}}return p.setIndex(h),p}var Za={blue:{skyT:9419224,skyH:14411746,fog:11125698,sun:16773590,leaf:[3107642,4160831,5212741,2776636],grass:[.24,.45,.2],water:[.05,.2,.19],fall:10259004},green:{skyT:8369888,skyH:15266012,fog:12177584,sun:16774876,leaf:[3898674,5151290,6203972,3107374],grass:[.3,.55,.22],water:[.06,.22,.16],fall:9415228},violet:{skyT:7036830,skyH:15845288,fog:13084580,sun:16765600,leaf:[12082218,13666867,10370858,8022570],grass:[.42,.4,.2],water:[.1,.14,.2],fall:13662762}},rn=i=>1.3*Math.sin(i*.09)+.5*Math.sin(i*.23+1),Dt=2.4;function wh(i,e){let t=new Et,n=new et(50,16/9,.1,300);n.position.set(0,1.7,9.5),n.lookAt(0,.2,-12);let s=Za.blue,r="blue";t.fog=new Cr(s.fog,18,75);let o={value:0},a={uTop:{value:new ge(s.skyT)},uHor:{value:new ge(s.skyH)}};t.add(new xe(new _t(200,32,16),new Be({side:ft,depthWrite:!1,fog:!1,uniforms:a,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"uniform vec3 uTop; uniform vec3 uHor; varying vec3 vD; void main(){ gl_FragColor = vec4(mix(uHor, uTop, smoothstep(0.0, 0.5, vD.y)), 1.0); }"})));let l=new Ji(14675680,3820074,1.1);t.add(l);let c=new di(s.sun,1.6);c.position.set(-8,14,-6),t.add(c);let h=new Ge(70,90,180,220);h.rotateX(-Math.PI/2),h.translate(0,0,-30);let u=new Float32Array(h.attributes.position.count*3);function f(oe,K){let ue=Math.abs(oe-rn(K)),Re=$i.smoothstep(ue,Dt-.4,Dt+2.8)*1.1+$i.smoothstep(ue,6,22)*3.5,A=(qn(oe*.25,0,K*.25)-.5)*(.4+$i.smoothstep(ue,3,10)*1.2),x=ue<Dt?-.35+ue/Dt*.2:0;return Re+A+x}{let oe=h.attributes.position;for(let K=0;K<oe.count;K++){let ue=oe.getX(K),Re=oe.getZ(K),A=f(ue,Re);oe.setY(K,A);let x=Math.abs(ue-rn(Re)),G=$i.smoothstep(x,Dt+.2,Dt+1.4),te=.7+qn(ue*.6,1,Re*.6,3)*.55,U=[.2*te,.19*te,.15*te],D=s.grass.map(ne=>ne*te);for(let ne=0;ne<3;ne++)u[K*3+ne]=U[ne]+(D[ne]-U[ne])*G}h.setAttribute("color",new Je(u,3)),h.computeVertexNormals()}let d=new xe(h,new it({vertexColors:!0,roughness:.95}));t.add(d);function g(){let oe=h.attributes.position;for(let K=0;K<oe.count;K++){let ue=oe.getX(K),Re=oe.getZ(K),A=Math.abs(ue-rn(Re)),x=$i.smoothstep(A,Dt+.2,Dt+1.4),G=.7+qn(ue*.6,1,Re*.6,3)*.55,te=[.2*G,.19*G,.15*G],U=s.grass.map(D=>D*G);for(let D=0;D<3;D++)u[K*3+D]=te[D]+(U[D]-te[D])*x}h.attributes.color.needsUpdate=!0}let y=new it({color:8025964,roughness:.85}),m=new it({color:5990970,roughness:.95}),p=[];function M(oe,K,ue,Re,A){let x=bh(new ci(1,4)),G=x.attributes.position,te=X(0,50);for(let ne=0;ne<G.count;ne++){let ae=new R(G.getX(ne),G.getY(ne),G.getZ(ne));ae.multiplyScalar(.75+qn(ae.x*1.3+te,ae.y*1.3,ae.z*1.3,4)*.55),ae.y*=Re,G.setXYZ(ne,ae.x,ae.y,ae.z)}x.computeVertexNormals();let U=Math.abs(oe-rn(K))<Dt,D=new xe(x,A?m:y);return D.position.set(oe,U?-.3:f(oe,K)-.1,K),D.scale.setScalar(ue),D.rotation.y=X(0,We),t.add(D),D}[[.4,3,.45],[-1.2,-1.5,.6],[1.6,-5.5,.5],[.2,-9,.7],[-.9,-14,.55],[1.5,1,.3]].forEach(([oe,K,ue])=>{let Re=rn(K)+oe;M(Re,K,ue,.55,!1),p.push(new R(Re,K,ue))});for(let oe=0;oe<16;oe++){let K=X(-40,7),ue=oe%2?1:-1;M(rn(K)+ue*X(Dt+.1,Dt+1.2),K,X(.3,.8),.6,Math.random()<.5)}let v=new Ge(1,1,30,200);v.rotateX(-Math.PI/2);{let oe=v.attributes.position;for(let K=0;K<oe.count;K++){let ue=oe.getX(K),A=9-(oe.getZ(K)+.5)*70;oe.setXYZ(K,rn(A)+ue*(Dt*2+.6),-.12,A)}v.computeVertexNormals()}let E={uT:o,uWater:{value:new R(...s.water)},uSky:{value:new ge(s.skyH)},uSun:{value:new ge(s.sun)},uRocks:{value:p.map(oe=>new R(oe.x,oe.y,oe.z))},uFogC:{value:new ge(s.fog)}},C=new xe(v,new Be({uniforms:E,transparent:!0,side:mt,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:nn+`
      uniform float uT; uniform vec3 uWater; uniform vec3 uSky; uniform vec3 uSun; uniform vec3 uRocks[6]; uniform vec3 uFogC;
      varying vec3 vW;
      void main(){
        vec2 q = vec2(vW.x * 1.6, vW.z * 0.9 - uT * 1.1);     // la corriente viene hacia ti
        vec2 q2 = vec2(vW.x * 3.1 + 5.0, vW.z * 1.7 - uT * 1.6);
        float h1 = igF2(q), h2 = igN2(q2);
        vec3 n = normalize(vec3((igF2(q + vec2(0.05, 0.0)) - h1) * 6.0 + (h2 - 0.5) * 0.3, 1.0, (igF2(q + vec2(0.0, 0.05)) - h1) * 6.0));
        vec3 V = normalize(cameraPosition - vW);
        float fres = 0.04 + 0.96 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec3 c = mix(uWater, uSky, clamp(fres, 0.0, 0.55));
        vec3 L = normalize(vec3(-0.45, 0.8, -0.35));
        c += uSun * pow(max(dot(reflect(-L, n), V), 0.0), 120.0) * 1.6;
        float foam = 0.0;
        for (int i = 0; i < 6; i++){
          vec3 r = uRocks[i];
          float d = length((vW.xz - r.xy) * vec2(1.0, 0.6)) - r.z * 0.9;
          float tail = smoothstep(0.0, 2.5, vW.z - r.y) * smoothstep(3.5, 0.0, vW.z - r.y) * smoothstep(r.z * 1.2, 0.0, abs(vW.x - r.x));
          foam += smoothstep(0.25, 0.0, d) * 0.8 + tail * 0.3;
        }
        foam *= 0.55 + 0.45 * igN2(q2 * 2.0);
        c = mix(c, vec3(0.92, 0.96, 0.96), clamp(foam, 0.0, 0.8));
        float a = mix(0.42, 0.9, fres) + foam * 0.35;
        float fogK = smoothstep(18.0, 75.0, length(vW - cameraPosition));
        c = mix(c, uFogC, fogK);
        gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
      }`}));C.renderOrder=2,t.add(C);let S=new Ge(.04,.42,1,4);S.translate(0,.21,0);{let oe=S.attributes.position;for(let K=0;K<oe.count;K++){let ue=oe.getY(K)/.42;oe.setX(K,oe.getX(K)*(1-ue*.9))}}let T={uT:o,uCol:{value:new R(...s.grass)},uFogC:{value:new ge(s.fog)}},P=22e3,I=new en(S,new Be({side:mt,uniforms:T,vertexShader:`
      uniform float uT; varying float vY; varying float vS; varying float vF;
      void main(){
        vec3 p = position; vY = uv.y;
        vec4 w0 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vS = fract(w0.x * 13.1 + w0.z * 7.3);
        float sway = sin(uT * 1.1 + w0.x * 0.7 + w0.z * 0.5) * 0.12 + sin(uT * 2.3 + w0.z) * 0.04;
        vec4 w = instanceMatrix * vec4(p, 1.0);
        w.x += sway * vY * vY; w.z += sway * 0.5 * vY * vY;
        vec4 ww = modelMatrix * w; vF = smoothstep(18.0, 75.0, length(ww.xyz - cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * ww;
      }`,fragmentShader:"uniform vec3 uCol; uniform vec3 uFogC; varying float vY; varying float vS; varying float vF; void main(){ vec3 c = uCol * (0.55 + vY * 0.7) * (0.85 + vS * 0.3); gl_FragColor = vec4(mix(c, uFogC, vF), 1.0); }"}),P);{let oe=new $e,K=new It,ue=new R,Re=new R,A=0;for(;A<P;){let x=9-Math.pow(Math.random(),1.6)*44,G=X(-13,13),te=Math.abs(G-rn(x));if(te<Dt+.3)continue;Re.set(G,f(G,x)-.02,x),K.setFromAxisAngle(new R(0,1,0),X(0,We));let U=X(.6,1.2)*(te<Dt+1.5?1.25:1);ue.set(U,U*X(.6,1.4),U),oe.compose(Re,K,ue),I.setMatrixAt(A++,oe)}}t.add(I);let _=new it({color:4864556,roughness:.95}),b=new Gt(.1,.2,1,10,4);b.translate(0,.5,0);{let oe=b.attributes.position;for(let K=0;K<oe.count;K++){let ue=oe.getY(K);oe.setX(K,oe.getX(K)+Math.sin(ue*3)*.03)}b.computeVertexNormals()}function N(oe){return Ut(256,256,(K,ue,Re)=>{K.clearRect(0,0,ue,Re);for(let A=0;A<260;A++){let x=Math.random()*We,G=Math.sqrt(Math.random())*105,te=ue/2+Math.cos(x)*G,U=Re/2+Math.sin(x)*G;K.save(),K.translate(te,U),K.rotate(X(0,We)),K.fillStyle=oe[Math.random()*oe.length|0],K.globalAlpha=1,K.beginPath(),K.ellipse(0,0,X(7,12),X(3.5,6),0,0,We),K.fill(),K.fillStyle="rgba(255,255,255,0.12)",K.beginPath(),K.ellipse(-2,-1,X(3,5),1.5,0,0,We),K.fill(),K.restore()}})}let O=oe=>"#"+oe.toString(16).padStart(6,"0"),L=N(s.leaf.map(O)),Y=new it({map:L,alphaTest:.5,side:mt,roughness:.85}),q=new Ge(1,1),B=[];for(let oe=0;oe<46;oe++){let K=X(-60,4),ue=oe%2?1:-1,Re=rn(K)+ue*X(Dt+3,20);B.push([Re,K,X(4.5,9)])}let z=70,W=new en(q,Y,B.length*z),ie=[];{let oe=new $e,K=new It,ue=new zt,Re=new R,A=new R,x=new ge,G=0;B.forEach(([te,U,D])=>{let ne=f(te,U)-.1,ae=new xe(b,_);ae.position.set(te,ne,U),ae.scale.set(D*.17,D*.7,D*.17),t.add(ae);let k=ne+D*.72,j=D*.32,_e=D*.36;for(let se=0;se<z;se++){let De=X(-1,1),we=X(0,We),Se=Math.cbrt(Math.random());A.set(te+Math.cos(we)*Math.sqrt(1-De*De)*j*Se,k+De*_e*Se,U+Math.sin(we)*Math.sqrt(1-De*De)*j*Se),ue.set(X(-.6,.6),X(0,We),X(-.6,.6)),K.setFromEuler(ue);let Ee=D*X(.26,.4);Re.set(Ee,Ee,Ee),oe.compose(A,K,Re),W.setMatrixAt(G,oe);let Te=.6+.4*(De*.5+.5);x.setRGB(Te,Te,Te),W.setColorAt(G,x),G++}})}t.add(W);let re=Jr(),he=[];for(let oe=0;oe<5;oe++){let K=new xe(new Ge(1.4,14),new Mt({map:re,transparent:!0,depthWrite:!1,blending:at,opacity:.12,color:s.sun,fog:!1}));K.position.set(X(-6,6),5,X(-18,-4)),K.rotation.z=.45,K.rotation.y=X(-.3,.3),t.add(K),he.push(K)}let Ce=24,J=new Ge(.14,.09),le=new it({color:s.fall,side:mt,roughness:.8}),pe=new en(J,le,Ce);t.add(pe);let Ue=[];function be(oe){let K=X(-25,6);return{x:rn(K)+X(-6,6),y:oe?X(0,5):X(4,5.5),z:K,rx:X(0,We),ry:X(0,We),vx:X(-.2,.2),onWater:!1,ph:X(0,We)}}for(let oe=0;oe<Ce;oe++)Ue.push(be(!0));let fe=new $e,He=new It,Pe=new zt,H=new R(1,1,1),st=new R,Ae=0;function Oe(oe,K,ue){Ae+=oe*K,o.value=Ae;let Re=oe*K;for(let A=0;A<Ce;A++){let x=Ue[A];if(x.onWater)x.z+=Re*1.1,x.x+=(rn(x.z)-x.x)*Re*.05+Math.sin(Ae+x.ph)*Re*.1,x.ry+=Re*.3,x.z>10&&(Ue[A]=be(!1));else{x.y-=Re*.45,x.x+=Math.sin(Ae*.8+x.ph)*Re*.3+x.vx*Re,x.rx+=Re*1.2,x.ry+=Re*.7;let G=Math.abs(x.x-rn(x.z)),te=G<Dt?-.1:f(x.x,x.z);x.y<=te+.02&&(G<Dt?(x.onWater=!0,x.y=-.1,x.rx=-Math.PI/2):Ue[A]=be(!1))}Pe.set(x.rx,x.ry,0),He.setFromEuler(Pe),st.set(x.x,x.y,x.z),fe.compose(st,He,H),pe.setMatrixAt(A,fe)}pe.instanceMatrix.needsUpdate=!0,he.forEach((A,x)=>{A.material.opacity=.09+.04*Math.sin(Ae*.2+x*1.7)}),ue||(n.position.x=Math.sin(Ae*.04)*.4,n.lookAt(0,.2,-12))}function Le(oe){oe!==r&&(r=oe,s=Za[oe]||Za.blue,a.uTop.value.set(s.skyT),a.uHor.value.set(s.skyH),t.fog.color.set(s.fog),c.color.set(s.sun),E.uWater.value.set(...s.water),E.uSky.value.set(s.skyH),E.uSun.value.set(s.sun),E.uFogC.value.set(s.fog),T.uCol.value.set(...s.grass),T.uFogC.value.set(s.fog),Y.map.dispose(),Y.map=N(s.leaf.map(O)),Y.needsUpdate=!0,le.color.set(s.fall),he.forEach(K=>K.material.color.set(s.sun)),g())}return Oe(.016,1,!0),{scene:t,camera:n,update:Oe,setWater:Le,resize(oe,K){n.aspect=oe/Math.max(1,K),n.fov=n.aspect<1.2?70:50,n.updateProjectionMatrix()}}}function Dg(){try{let i=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(i.getContext("webgl2")||i.getContext("webgl")))}catch{return!1}}function Ng(i,e,t){let n=dh(e),s=Math.min(window.devicePixelRatio||1,1.75);n.setPixelRatio(s);let o=({aquarium:mh,pause:gh,jellies:vh,fibre:xh,sea:yh,rain:Mh,night:Sh,river:wh,bubbles:ka}[i]||ka)(e,n),a=0,l=s,c=0,h=0;function u(v){if(c+=v,h++,h<45&&c<1.5)return;let E=c/h;c=0,h=0;let C=E>.045?Math.max(.75,l*.8):E<.022?Math.min(s,l*1.15):l;Math.abs(C-l)>.05&&(l=C,n.setPixelRatio(l),y())}let f=0,d=performance.now(),g=!0;function y(){let v=e.parentElement.getBoundingClientRect();n.setSize(Math.max(1,v.width),Math.max(1,v.height),!1),o.resize(v.width,v.height)}y();let m=window.ResizeObserver?new ResizeObserver(y):null;m&&m.observe(e.parentElement);function p(v){if(!g)return;if(!e.isConnected){M();return}let E=(v-d)/1e3,C=Math.min(.05,E);if(d=v,!document.hidden){let S=t.phase?t.phase():null,T=S&&!S.guiding;(!T||v-a>400)&&(a=v,t.color&&o.setWater(t.color()),o.update(C,t.speed?t.speed():1,t.reduced(),S),T||u(E),n.render(o.scene,o.camera))}f=requestAnimationFrame(p)}f=requestAnimationFrame(p);function M(){g&&(g=!1,cancelAnimationFrame(f),m&&m.disconnect(),o.scene.traverse(v=>{v.geometry&&v.geometry.dispose(),v.material&&(Array.isArray(v.material)?v.material:[v.material]).forEach(E=>{Object.values(E).forEach(C=>{C&&C.isTexture&&C.dispose()}),E.dispose()})}),n.dispose(),n.forceContextLoss&&n.forceContextLoss())}return{stop:M}}window.IGScenes3D={supported:Dg,start:Ng};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
