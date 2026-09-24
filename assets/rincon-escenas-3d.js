(()=>{var wu=0,Il=1,Au=2;var xr=1,Ru=2,ys=3,di=0,Et=1,wt=2,zn=0,Ms=1,vt=2,Ll=3,Nl=4,Cu=5;var Ii=100,Pu=101,Iu=102,Lu=103,Nu=104,Du=200,Uu=201,Fu=202,Bu=203,Dl=204,Ul=205,Ou=206,zu=207,Hu=208,Vu=209,Gu=210,ku=211,Wu=212,Xu=213,qu=214,oa=0,la=1,ca=2,ns=3,ua=4,ha=5,da=6,fa=7,Fl=0,Yu=1,Zu=2,Tn=0,Bl=1,Ol=2,zl=3,_r=4,Hl=5,Vl=6,Gl=7;var kl=300,fi=301,Li=302,ka=303,Wa=304,vr=306,is=1e3,Ln=1001,pa=1002,Vt=1003,Ju=1004;var yr=1005;var Ut=1006,Xa=1007;var pi=1008;var sn=1009,Wl=1010,Xl=1011,Ss=1012,qa=1013,wn=1014,fn=1015,An=1016,Ya=1017,Za=1018,bs=1020,ql=35902,Yl=35899,Zl=1021,Jl=1022,pn=1023,Nn=1026,mi=1027,Ja=1028,Ka=1029,gi=1030,$a=1031;var ja=1033,Mr=33776,Sr=33777,br=33778,Er=33779,Qa=35840,eo=35841,to=35842,no=35843,io=36196,so=37492,ro=37496,ao=37488,oo=37489,Tr=37490,lo=37491,co=37808,uo=37809,ho=37810,fo=37811,po=37812,mo=37813,go=37814,xo=37815,_o=37816,vo=37817,yo=37818,Mo=37819,So=37820,bo=37821,Eo=36492,To=36494,wo=36495,Ao=36283,Ro=36284,wr=36285,Co=36286;var Vs=2300,ma=2301,ra=2302,_l=2303,vl=2400,yl=2401,Ml=2402;var Ku=3200;var Po=0,$u=1,Zn="",Zt="srgb",Gs="srgb-linear",ks="linear",pt="srgb";var aa=7680;var ju=519,Qu=512,eh=513,th=514,Io=515,nh=516,ih=517,Lo=518,sh=519,rh=35044;var Kl="300 es",bn=2e3,ss=2001;function pd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function md(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ws(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ah(){let i=Ws("canvas");return i.style.display="block",i}var Wc={},rs=null;function $l(...i){let e="THREE."+i.shift();rs?rs("log",e,...i):console.log(e,...i)}function oh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Oe(...i){i=oh(i);let e="THREE."+i.shift();if(rs)rs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ve(...i){i=oh(i);let e="THREE."+i.shift();if(rs)rs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ei(...i){let e=i.join(" ");e in Wc||(Wc[e]=!0,Oe(...i))}function lh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var ch={[oa]:la,[ca]:da,[ua]:fa,[ns]:ha,[la]:oa,[da]:ca,[fa]:ua,[ha]:ns},Dn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xc=1234567,Bs=Math.PI/180,as=180/Math.PI;function Ni(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function it(i,e,t){return Math.max(e,Math.min(t,i))}function jl(i,e){return(i%e+e)%e}function gd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function xd(i,e,t){return i!==e?(t-i)/(e-i):0}function Os(i,e,t){return(1-t)*i+t*e}function _d(i,e,t,n){return Os(i,e,1-Math.exp(-t*n))}function vd(i,e=1){return e-Math.abs(jl(i,e*2)-e)}function yd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Md(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function bd(i,e){return i+Math.random()*(e-i)}function Ed(i){return i*(.5-Math.random())}function Td(i){i!==void 0&&(Xc=i);let e=Xc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function wd(i){return i*Bs}function Ad(i){return i*as}function Rd(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Cd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Pd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Id(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),f=r((e-n)/2),h=a((e-n)/2),d=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*f,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*f,o*c);break;case"ZXZ":i.set(l*f,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*m,l*d,o*c);break;case"YXY":i.set(l*d,o*u,l*m,o*c);break;case"ZYZ":i.set(l*m,l*d,o*u,o*c);break;default:Oe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Qi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Di={DEG2RAD:Bs,RAD2DEG:as,generateUUID:Ni,clamp:it,euclideanModulo:jl,mapLinear:gd,inverseLerp:xd,lerp:Os,damp:_d,pingpong:vd,smoothstep:yd,smootherstep:Md,randInt:Sd,randFloat:bd,randFloatSpread:Ed,seededRandom:Td,degToRad:wd,radToDeg:Ad,isPowerOfTwo:Rd,ceilPowerOfTwo:Cd,floorPowerOfTwo:Pd,setQuaternionFromProperEuler:Id,normalize:jt,denormalize:Qi},sc=class sc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};sc.prototype.isVector2=!0;var Te=sc,Ft=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],f=n[s+3],h=r[a+0],d=r[a+1],m=r[a+2],M=r[a+3];if(f!==M||l!==h||c!==d||u!==m){let g=l*h+c*d+u*m+f*M;g<0&&(h=-h,d=-d,m=-m,M=-M,g=-g);let p=1-o;if(g<.9995){let b=Math.acos(g),A=Math.sin(b);p=Math.sin(p*b)/A,o=Math.sin(o*b)/A,l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+M*o}else{l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+M*o;let b=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=b,c*=b,u*=b,f*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],f=r[a],h=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+u*f+l*d-c*h,e[t+1]=l*m+u*h+c*f-o*d,e[t+2]=c*m+u*d+o*h-l*f,e[t+3]=u*m-o*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),f=o(r/2),h=l(n/2),d=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"YXZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"ZXY":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"ZYX":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"YZX":this._x=h*u*f+c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f-h*d*m;break;case"XZY":this._x=h*u*f-c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f+h*d*m;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=n+o+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(it(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},rc=class rc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Yo.copy(this).projectOnVector(e),this.sub(Yo)}reflect(e){return this.sub(Yo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};rc.prototype.isVector3=!0;var P=rc,Yo=new P,qc=new Ft,ac=class ac{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],m=n[8],M=s[0],g=s[3],p=s[6],b=s[1],A=s[4],v=s[7],w=s[2],S=s[5],C=s[8];return r[0]=a*M+o*b+l*w,r[3]=a*g+o*A+l*S,r[6]=a*p+o*v+l*C,r[1]=c*M+u*b+f*w,r[4]=c*g+u*A+f*S,r[7]=c*p+u*v+f*C,r[2]=h*M+d*b+m*w,r[5]=h*g+d*A+m*S,r[8]=h*p+d*v+m*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*r,d=c*r-a*l,m=t*f+n*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/m;return e[0]=f*M,e[1]=(s*c-u*n)*M,e[2]=(o*n-s*a)*M,e[3]=h*M,e[4]=(u*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=d*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ei("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zo.makeScale(e,t)),this}rotate(e){return Ei("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zo.makeRotation(-e)),this}translate(e,t){return Ei("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ac.prototype.isMatrix3=!0;var qe=ac,Zo=new qe,Yc=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zc=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ld(){let i={enabled:!0,workingColorSpace:Gs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===pt&&(s.r=Yn(s.r),s.g=Yn(s.g),s.b=Yn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===pt&&(s.r=es(s.r),s.g=es(s.g),s.b=es(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Zn?ks:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ei("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ei("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gs]:{primaries:e,whitePoint:n,transfer:ks,toXYZ:Yc,fromXYZ:Zc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Zt},outputColorSpaceConfig:{drawingBufferColorSpace:Zt}},[Zt]:{primaries:e,whitePoint:n,transfer:pt,toXYZ:Yc,fromXYZ:Zc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Zt}}}),i}var at=Ld();function Yn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function es(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var zi,ga=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zi===void 0&&(zi=Ws("canvas")),zi.width=e.width,zi.height=e.height;let s=zi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=zi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Ws("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Yn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Yn(t[n]/255)*255):t[n]=Yn(t[n]);return{data:t,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Nd=0,os=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=Ni(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement!="undefined"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame!="undefined"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jo(s[a].image)):r.push(Jo(s[a]))}else r=Jo(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Jo(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?ga.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}var Dd=0,Ko=new P,en=class i extends Dn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ln,s=Ln,r=Ut,a=pi,o=pn,l=sn,c=i.DEFAULT_ANISOTROPY,u=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=Ni(),this.name="",this.source=new os(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ko).x}get height(){return this.source.getSize(Ko).y}get depth(){return this.source.getSize(Ko).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Oe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Oe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==kl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case is:e.x=e.x-Math.floor(e.x);break;case Ln:e.x=e.x<0?0:1;break;case pa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case is:e.y=e.y-Math.floor(e.y);break;case Ln:e.y=e.y<0?0:1;break;case pa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=kl;en.DEFAULT_ANISOTROPY=1;var oc=class oc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],m=l[9],M=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-M)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+M)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,v=(d+1)/2,w=(p+1)/2,S=(u+h)/4,C=(f+M)/4,_=(m+g)/4;return A>v&&A>w?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=S/n,r=C/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=S/s,r=_/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=_/r),this.set(n,s,r,t),this}let b=Math.sqrt((g-m)*(g-m)+(f-M)*(f-M)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(g-m)/b,this.y=(f-M)/b,this.z=(h-u)/b,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this.w=it(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this.w=it(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};oc.prototype.isVector4=!0;var Tt=oc,xa=class extends Dn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new en(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new os(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},nn=class extends xa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Xs=class extends en{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var _a=class extends en{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Ga=class Ga{constructor(e,t,n,s,r,a,o,l,c,u,f,h,d,m,M,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,f,h,d,m,M,g)}set(e,t,n,s,r,a,o,l,c,u,f,h,d,m,M,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=m,p[11]=M,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ga().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Hi.setFromMatrixColumn(e,0).length(),r=1/Hi.setFromMatrixColumn(e,1).length(),a=1/Hi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=a*u,d=a*f,m=o*u,M=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=d+m*c,t[5]=h-M*c,t[9]=-o*l,t[2]=M-h*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,d=l*f,m=c*u,M=c*f;t[0]=h+M*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=d*o-m,t[6]=M+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,d=l*f,m=c*u,M=c*f;t[0]=h-M*o,t[4]=-a*f,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*u,t[9]=M-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,d=a*f,m=o*u,M=o*f;t[0]=l*u,t[4]=m*c-d,t[8]=h*c+M,t[1]=l*f,t[5]=M*c+h,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,d=a*c,m=o*l,M=o*c;t[0]=l*u,t[4]=M-h*f,t[8]=m*f+d,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=d*f+m,t[10]=h-M*f}else if(e.order==="XZY"){let h=a*l,d=a*c,m=o*l,M=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+M,t[5]=a*u,t[9]=d*f-m,t[2]=m*f-d,t[6]=o*u,t[10]=M*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ud,e,Fd)}lookAt(e,t,n){let s=this.elements;return rn.subVectors(e,t),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),jn.crossVectors(n,rn),jn.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),jn.crossVectors(n,rn)),jn.normalize(),Nr.crossVectors(rn,jn),s[0]=jn.x,s[4]=Nr.x,s[8]=rn.x,s[1]=jn.y,s[5]=Nr.y,s[9]=rn.y,s[2]=jn.z,s[6]=Nr.z,s[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],m=n[2],M=n[6],g=n[10],p=n[14],b=n[3],A=n[7],v=n[11],w=n[15],S=s[0],C=s[4],_=s[8],y=s[12],R=s[1],L=s[5],I=s[9],B=s[13],U=s[2],G=s[6],K=s[10],V=s[14],Z=s[3],k=s[7],j=s[11],ee=s[15];return r[0]=a*S+o*R+l*U+c*Z,r[4]=a*C+o*L+l*G+c*k,r[8]=a*_+o*I+l*K+c*j,r[12]=a*y+o*B+l*V+c*ee,r[1]=u*S+f*R+h*U+d*Z,r[5]=u*C+f*L+h*G+d*k,r[9]=u*_+f*I+h*K+d*j,r[13]=u*y+f*B+h*V+d*ee,r[2]=m*S+M*R+g*U+p*Z,r[6]=m*C+M*L+g*G+p*k,r[10]=m*_+M*I+g*K+p*j,r[14]=m*y+M*B+g*V+p*ee,r[3]=b*S+A*R+v*U+w*Z,r[7]=b*C+A*L+v*G+w*k,r[11]=b*_+A*I+v*K+w*j,r[15]=b*y+A*B+v*V+w*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],m=e[3],M=e[7],g=e[11],p=e[15],b=l*d-c*h,A=o*d-c*f,v=o*h-l*f,w=a*d-c*u,S=a*h-l*u,C=a*f-o*u;return t*(M*b-g*A+p*v)-n*(m*b-g*w+p*S)+s*(m*A-M*w+p*C)-r*(m*v-M*S+g*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],m=e[12],M=e[13],g=e[14],p=e[15],b=t*o-n*a,A=t*l-s*a,v=t*c-r*a,w=n*l-s*o,S=n*c-r*o,C=s*c-r*l,_=u*M-f*m,y=u*g-h*m,R=u*p-d*m,L=f*g-h*M,I=f*p-d*M,B=h*p-d*g,U=b*B-A*I+v*L+w*R-S*y+C*_;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/U;return e[0]=(o*B-l*I+c*L)*G,e[1]=(s*I-n*B-r*L)*G,e[2]=(M*C-g*S+p*w)*G,e[3]=(h*S-f*C-d*w)*G,e[4]=(l*R-a*B-c*y)*G,e[5]=(t*B-s*R+r*y)*G,e[6]=(g*v-m*C-p*A)*G,e[7]=(u*C-h*v+d*A)*G,e[8]=(a*I-o*R+c*_)*G,e[9]=(n*R-t*I-r*_)*G,e[10]=(m*S-M*v+p*b)*G,e[11]=(f*v-u*S-d*b)*G,e[12]=(o*y-a*L-l*_)*G,e[13]=(t*L-n*y+s*_)*G,e[14]=(M*A-m*w-g*b)*G,e[15]=(u*w-f*A+h*b)*G,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,h=r*c,d=r*u,m=r*f,M=a*u,g=a*f,p=o*f,b=l*c,A=l*u,v=l*f,w=n.x,S=n.y,C=n.z;return s[0]=(1-(M+p))*w,s[1]=(d+v)*w,s[2]=(m-A)*w,s[3]=0,s[4]=(d-v)*S,s[5]=(1-(h+p))*S,s[6]=(g+b)*S,s[7]=0,s[8]=(m+A)*C,s[9]=(g-b)*C,s[10]=(1-(h+M))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Hi.set(s[0],s[1],s[2]).length(),o=Hi.set(s[4],s[5],s[6]).length(),l=Hi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),vn.copy(this);let c=1/a,u=1/o,f=1/l;return vn.elements[0]*=c,vn.elements[1]*=c,vn.elements[2]*=c,vn.elements[4]*=u,vn.elements[5]*=u,vn.elements[6]*=u,vn.elements[8]*=f,vn.elements[9]*=f,vn.elements[10]*=f,t.setFromRotationMatrix(vn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=bn,l=!1){let c=this.elements,u=2*r/(t-e),f=2*r/(n-s),h=(t+e)/(t-e),d=(n+s)/(n-s),m,M;if(l)m=r/(a-r),M=a*r/(a-r);else if(o===bn)m=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===ss)m=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=bn,l=!1){let c=this.elements,u=2/(t-e),f=2/(n-s),h=-(t+e)/(t-e),d=-(n+s)/(n-s),m,M;if(l)m=1/(a-r),M=a/(a-r);else if(o===bn)m=-2/(a-r),M=-(a+r)/(a-r);else if(o===ss)m=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ga.prototype.isMatrix4=!0;var tt=Ga,Hi=new P,vn=new tt,Ud=new P(0,0,0),Fd=new P(1,1,1),jn=new P,Nr=new P,rn=new P,Jc=new tt,Kc=new Ft,tn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(it(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-it(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(it(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-it(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(it(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-it(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Jc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kc.setFromEuler(this),this.setFromQuaternion(Kc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};tn.DEFAULT_ORDER="XYZ";var qs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Bd=0,$c=new P,Vi=new Ft,Gn=new tt,Dr=new P,Cs=new P,Od=new P,zd=new Ft,jc=new P(1,0,0),Qc=new P(0,1,0),eu=new P(0,0,1),tu={type:"added"},Hd={type:"removed"},Gi={type:"childadded",child:null},$o={type:"childremoved",child:null},Gt=class i extends Dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bd++}),this.uuid=Ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new tn,n=new Ft,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new tt},normalMatrix:{value:new qe}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(jc,e)}rotateY(e){return this.rotateOnAxis(Qc,e)}rotateZ(e){return this.rotateOnAxis(eu,e)}translateOnAxis(e,t){return $c.copy(e).applyQuaternion(this.quaternion),this.position.add($c.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(jc,e)}translateY(e){return this.translateOnAxis(Qc,e)}translateZ(e){return this.translateOnAxis(eu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Dr.copy(e):Dr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(Cs,Dr,this.up):Gn.lookAt(Dr,Cs,this.up),this.quaternion.setFromRotationMatrix(Gn),s&&(Gn.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(Gn),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ve("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tu),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):Ve("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hd),$o.child=e,this.dispatchEvent($o),$o.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tu),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,e,Od),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Gt.DEFAULT_UP=new P(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Qt=class extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Vd={type:"move"},ls=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let M of e.hand.values()){let g=t.getJointPose(M,n),p=this._getHandJoint(c,M);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&h>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Qt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},Ur={h:0,s:0,l:0};function jo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=at.workingColorSpace){return this.r=e,this.g=t,this.b=n,at.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=at.workingColorSpace){if(e=jl(e,1),t=it(t,0,1),n=it(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=jo(a,r,e+1/3),this.g=jo(a,r,e),this.b=jo(a,r,e-1/3)}return at.colorSpaceToWorking(this,s),this}setStyle(e,t=Zt){function n(r){r!==void 0&&parseFloat(r)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Oe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zt){let n=uh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Yn(e.r),this.g=Yn(e.g),this.b=Yn(e.b),this}copyLinearToSRGB(e){return this.r=es(e.r),this.g=es(e.g),this.b=es(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zt){return at.workingToColorSpace(Yt.copy(this),e),Math.round(it(Yt.r*255,0,255))*65536+Math.round(it(Yt.g*255,0,255))*256+Math.round(it(Yt.b*255,0,255))}getHexString(e=Zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.workingToColorSpace(Yt.copy(this),t);let n=Yt.r,s=Yt.g,r=Yt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=at.workingColorSpace){return at.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=Zt){at.workingToColorSpace(Yt.copy(this),e);let t=Yt.r,n=Yt.g,s=Yt.b;return e!==Zt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Qn),this.setHSL(Qn.h+e,Qn.s+t,Qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qn),e.getHSL(Ur);let n=Os(Qn.h,Ur.h,t),s=Os(Qn.s,Ur.s,t),r=Os(Qn.l,Ur.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Yt=new ge;ge.NAMES=uh;var Ti=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ge(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},Ys=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ge(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},It=class extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},yn=new P,kn=new P,Qo=new P,Wn=new P,ki=new P,Wi=new P,nu=new P,el=new P,tl=new P,nl=new P,il=new Tt,sl=new Tt,rl=new Tt,ii=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),yn.subVectors(e,t),s.cross(yn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){yn.subVectors(s,t),kn.subVectors(n,t),Qo.subVectors(e,t);let a=yn.dot(yn),o=yn.dot(kn),l=yn.dot(Qo),c=kn.dot(kn),u=kn.dot(Qo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let h=1/f,d=(c*l-o*u)*h,m=(a*u-o*l)*h;return r.set(1-d-m,m,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Wn)===null?!1:Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Wn.x),l.addScaledVector(a,Wn.y),l.addScaledVector(o,Wn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return il.setScalar(0),sl.setScalar(0),rl.setScalar(0),il.fromBufferAttribute(e,t),sl.fromBufferAttribute(e,n),rl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(il,r.x),a.addScaledVector(sl,r.y),a.addScaledVector(rl,r.z),a}static isFrontFacing(e,t,n,s){return yn.subVectors(n,t),kn.subVectors(e,t),yn.cross(kn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return yn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),yn.cross(kn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ki.subVectors(s,n),Wi.subVectors(r,n),el.subVectors(e,n);let l=ki.dot(el),c=Wi.dot(el);if(l<=0&&c<=0)return t.copy(n);tl.subVectors(e,s);let u=ki.dot(tl),f=Wi.dot(tl);if(u>=0&&f<=u)return t.copy(s);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ki,a);nl.subVectors(e,r);let d=ki.dot(nl),m=Wi.dot(nl);if(m>=0&&d<=m)return t.copy(r);let M=d*c-l*m;if(M<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Wi,o);let g=u*m-d*f;if(g<=0&&f-u>=0&&d-m>=0)return nu.subVectors(r,s),o=(f-u)/(f-u+(d-m)),t.copy(s).addScaledVector(nu,o);let p=1/(g+M+h);return a=M*p,o=h*p,t.copy(n).addScaledVector(ki,a).addScaledVector(Wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Un=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Mn):Mn.fromBufferAttribute(r,a),Mn.applyMatrix4(e.matrixWorld),this.expandByPoint(Mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fr.copy(n.boundingBox)),Fr.applyMatrix4(e.matrixWorld),this.union(Fr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mn),Mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ps),Br.subVectors(this.max,Ps),Xi.subVectors(e.a,Ps),qi.subVectors(e.b,Ps),Yi.subVectors(e.c,Ps),ei.subVectors(qi,Xi),ti.subVectors(Yi,qi),yi.subVectors(Xi,Yi);let t=[0,-ei.z,ei.y,0,-ti.z,ti.y,0,-yi.z,yi.y,ei.z,0,-ei.x,ti.z,0,-ti.x,yi.z,0,-yi.x,-ei.y,ei.x,0,-ti.y,ti.x,0,-yi.y,yi.x,0];return!al(t,Xi,qi,Yi,Br)||(t=[1,0,0,0,1,0,0,0,1],!al(t,Xi,qi,Yi,Br))?!1:(Or.crossVectors(ei,ti),t=[Or.x,Or.y,Or.z],al(t,Xi,qi,Yi,Br))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Xn=[new P,new P,new P,new P,new P,new P,new P,new P],Mn=new P,Fr=new Un,Xi=new P,qi=new P,Yi=new P,ei=new P,ti=new P,yi=new P,Ps=new P,Br=new P,Or=new P,Mi=new P;function al(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Mi.fromArray(i,r);let o=s.x*Math.abs(Mi.x)+s.y*Math.abs(Mi.y)+s.z*Math.abs(Mi.z),l=e.dot(Mi),c=t.dot(Mi),u=n.dot(Mi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Dt=new P,zr=new Te,Gd=0,ot=class extends Dn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=rh,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)zr.fromBufferAttribute(this,t),zr.applyMatrix3(e),this.setXY(t,zr.x,zr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Qi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qi(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qi(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qi(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Zs=class extends ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Js=class extends ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var st=class extends ot{constructor(e,t,n){super(new Float32Array(e),t,n)}},kd=new Un,Is=new P,ol=new P,Fn=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):kd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Is.subVectors(e,this.center);let t=Is.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Is.copy(e.center).add(ol)),this.expandByPoint(Is.copy(e.center).sub(ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Wd=0,dn=new tt,ll=new Gt,Zi=new P,an=new Un,Ls=new Un,Ht=new P,ut=class i extends Dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(pd(e)?Js:Zs)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return dn.makeRotationFromQuaternion(e),this.applyMatrix4(dn),this}rotateX(e){return dn.makeRotationX(e),this.applyMatrix4(dn),this}rotateY(e){return dn.makeRotationY(e),this.applyMatrix4(dn),this}rotateZ(e){return dn.makeRotationZ(e),this.applyMatrix4(dn),this}translate(e,t,n){return dn.makeTranslation(e,t,n),this.applyMatrix4(dn),this}scale(e,t,n){return dn.makeScale(e,t,n),this.applyMatrix4(dn),this}lookAt(e){return ll.lookAt(e),ll.updateMatrix(),this.applyMatrix4(ll.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zi).negate(),this.translate(Zi.x,Zi.y,Zi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new st(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ve('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ve("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(an.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(an.min,Ls.min),an.expandByPoint(Ht),Ht.addVectors(an.max,Ls.max),an.expandByPoint(Ht)):(an.expandByPoint(Ls.min),an.expandByPoint(Ls.max))}an.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ht.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ht));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ht.fromBufferAttribute(o,c),l&&(Zi.fromBufferAttribute(e,c),Ht.add(Zi)),s=Math.max(s,n.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ve('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ve("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ot(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new P,l[_]=new P;let c=new P,u=new P,f=new P,h=new Te,d=new Te,m=new Te,M=new P,g=new P;function p(_,y,R){c.fromBufferAttribute(n,_),u.fromBufferAttribute(n,y),f.fromBufferAttribute(n,R),h.fromBufferAttribute(r,_),d.fromBufferAttribute(r,y),m.fromBufferAttribute(r,R),u.sub(c),f.sub(c),d.sub(h),m.sub(h);let L=1/(d.x*m.y-m.x*d.y);isFinite(L)&&(M.copy(u).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(L),g.copy(f).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(L),o[_].add(M),o[y].add(M),o[R].add(M),l[_].add(g),l[y].add(g),l[R].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let _=0,y=b.length;_<y;++_){let R=b[_],L=R.start,I=R.count;for(let B=L,U=L+I;B<U;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let A=new P,v=new P,w=new P,S=new P;function C(_){w.fromBufferAttribute(s,_),S.copy(w);let y=o[_];A.copy(y),A.sub(w.multiplyScalar(w.dot(y))).normalize(),v.crossVectors(S,y);let L=v.dot(l[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,L)}for(let _=0,y=b.length;_<y;++_){let R=b[_],L=R.start,I=R.count;for(let B=L,U=L+I;B<U;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let h=0,d=e.count;h<d;h+=3){let m=e.getX(h+0),M=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u),d=0,m=0;for(let M=0,g=l.length;M<g;M++){o.isInterleavedBufferAttribute?d=l[M]*o.data.stride+o.offset:d=l[M]*u;for(let p=0;p<u;p++)h[m++]=c[d++]}return new ot(h,u,f)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=e(h,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],f=r[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var cl=new P,Xd=new P,qd=new qe,Sn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=cl.subVectors(n,t).cross(Xd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(cl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||qd.getNormalMatrix(e),s=this.coplanarPoint(cl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Yd=0,Bn=class extends Dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=Ni(),this.name="",this.type="Material",this.blending=Ms,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dl,this.blendDst=Ul,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ge(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ju,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=aa,this.stencilZFail=aa,this.stencilZPass=aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Oe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Oe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Sn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Te().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var qn=new P,ul=new P,Hr=new P,Vr=new P,cs=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qn.copy(this.origin).addScaledVector(this.direction,t),qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ul.copy(e).add(t).multiplyScalar(.5),Hr.copy(t).sub(e).normalize(),Vr.copy(this.origin).sub(ul);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Hr),o=Vr.dot(this.direction),l=-Vr.dot(Hr),c=Vr.lengthSq(),u=Math.abs(1-a*a),f,h,d,m;if(u>0)if(f=a*l-o,h=a*o-l,m=r*u,f>=0)if(h>=-m)if(h<=m){let M=1/u;f*=M,h*=M,d=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-m?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c):h<=m?(f=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ul).addScaledVector(Hr,h),d}intersectSphere(e,t){if(e.radius<0)return null;qn.subVectors(e.center,this.origin);let n=qn.dot(this.direction),s=qn.dot(qn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,qn)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,f=e.x-a.x,h=e.y-a.y,d=e.z-a.z,m=t.x-a.x,M=t.y-a.y,g=t.z-a.z,p=n.x-a.x,b=n.y-a.y,A=n.z-a.z,v=Math.abs(l),w=Math.abs(c),S=Math.abs(u),C,_,y,R,L,I,B,U,G,K,V,Z;if(v>=w&&v>=S?(y=l,I=f,G=m,Z=p,l>=0?(C=c,_=u,R=h,L=d,B=M,U=g,K=b,V=A):(C=u,_=c,R=d,L=h,B=g,U=M,K=A,V=b)):w>=S?(y=c,I=h,G=M,Z=b,c>=0?(C=u,_=l,R=d,L=f,B=g,U=m,K=A,V=p):(C=l,_=u,R=f,L=d,B=m,U=g,K=p,V=A)):(y=u,I=d,G=g,Z=A,u>=0?(C=l,_=c,R=f,L=h,B=m,U=M,K=p,V=b):(C=c,_=l,R=h,L=f,B=M,U=m,K=b,V=p)),y===0)return null;let k=C/y,j=_/y,ee=1/y,Se=R-k*I,ye=L-j*I,et=B-k*G,Xe=U-j*G,Ye=K-k*Z,te=V-j*Z,ne=Ye*Xe-te*et,he=Se*te-ye*Ye,Fe=et*ye-Xe*Se;if(s){if(ne<0||he<0||Fe<0)return null}else if((ne<0||he<0||Fe<0)&&(ne>0||he>0||Fe>0))return null;let de=ne+he+Fe;if(de===0)return null;let Ge=ee*(ne*I+he*G+Fe*Z);return(de>0?Ge<0:Ge>0)?null:this.at(Ge/de,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Lt=class extends Bn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=Fl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},iu=new tt,Si=new cs,Gr=new Fn,su=new P,kr=new P,Wr=new P,Xr=new P,hl=new P,qr=new P,ru=new P,Yr=new P,Ee=class extends Gt{constructor(e=new ut,t=new Lt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){qr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],f=r[l];u!==0&&(hl.fromBufferAttribute(f,e),a?qr.addScaledVector(hl,u):qr.addScaledVector(hl.sub(t),u))}t.add(qr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Gr.copy(n.boundingSphere),Gr.applyMatrix4(r),Si.copy(e.ray).recast(e.near),!(Gr.containsPoint(Si.origin)===!1&&(Si.intersectSphere(Gr,su)===null||Si.origin.distanceToSquared(su)>(e.far-e.near)**2))&&(iu.copy(r).invert(),Si.copy(e.ray).applyMatrix4(iu),!(n.boundingBox!==null&&Si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Si)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,M=h.length;m<M;m++){let g=h[m],p=a[g.materialIndex],b=Math.max(g.start,d.start),A=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=b,w=A;v<w;v+=3){let S=o.getX(v),C=o.getX(v+1),_=o.getX(v+2);s=Zr(this,p,e,n,c,u,f,S,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(o.count,d.start+d.count);for(let g=m,p=M;g<p;g+=3){let b=o.getX(g),A=o.getX(g+1),v=o.getX(g+2);s=Zr(this,a,e,n,c,u,f,b,A,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,M=h.length;m<M;m++){let g=h[m],p=a[g.materialIndex],b=Math.max(g.start,d.start),A=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=b,w=A;v<w;v+=3){let S=v,C=v+1,_=v+2;s=Zr(this,p,e,n,c,u,f,S,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(l.count,d.start+d.count);for(let g=m,p=M;g<p;g+=3){let b=g,A=g+1,v=g+2;s=Zr(this,a,e,n,c,u,f,b,A,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Zd(i,e,t,n,s,r,a,o){let l;if(e.side===Et?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===di,o),l===null)return null;Yr.copy(o),Yr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Yr);return c<t.near||c>t.far?null:{distance:c,point:Yr.clone(),object:i}}function Zr(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,kr),i.getVertexPosition(l,Wr),i.getVertexPosition(c,Xr);let u=Zd(i,e,t,n,kr,Wr,Xr,ru);if(u){let f=new P;ii.getBarycoord(ru,kr,Wr,Xr,f),s&&(u.uv=ii.getInterpolatedAttribute(s,o,l,c,f,new Te)),r&&(u.uv1=ii.getInterpolatedAttribute(r,o,l,c,f,new Te)),a&&(u.normal=ii.getInterpolatedAttribute(a,o,l,c,f,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new P,materialIndex:0};ii.getNormal(kr,Wr,Xr,h.normal),u.face=h,u.barycoord=f}return u}var Ks=class extends en{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Vt,u=Vt,f,h){super(null,a,o,l,c,u,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var si=class extends ot{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ji=new tt,au=new tt,Jr=[],ou=new Un,Jd=new tt,Ns=new Ee,Ds=new Fn,on=class extends Ee{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new si(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Jd)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Un),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),ou.copy(e.boundingBox).applyMatrix4(Ji),this.boundingBox.union(ou)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),Ds.copy(e.boundingSphere).applyMatrix4(Ji),this.boundingSphere.union(Ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Ns.geometry=this.geometry,Ns.material=this.material,Ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ds.copy(this.boundingSphere),Ds.applyMatrix4(n),e.ray.intersectsSphere(Ds)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ji),au.multiplyMatrices(n,Ji),Ns.matrixWorld=au,Ns.raycast(e,Jr);for(let a=0,o=Jr.length;a<o;a++){let l=Jr[a];l.instanceId=r,l.object=this,t.push(l)}Jr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new si(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ks(new Float32Array(s*this.count),s,this.count,Ja,fn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},bi=new Fn,Kd=new Te(.5,.5),Kr=new P,us=class{constructor(e=new Sn,t=new Sn,n=new Sn,s=new Sn,r=new Sn,a=new Sn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],h=r[6],d=r[7],m=r[8],M=r[9],g=r[10],p=r[11],b=r[12],A=r[13],v=r[14],w=r[15];if(s[0].setComponents(c-a,d-u,p-m,w-b).normalize(),s[1].setComponents(c+a,d+u,p+m,w+b).normalize(),s[2].setComponents(c+o,d+f,p+M,w+A).normalize(),s[3].setComponents(c-o,d-f,p-M,w-A).normalize(),n)s[4].setComponents(l,h,g,v).normalize(),s[5].setComponents(c-l,d-h,p-g,w-v).normalize();else if(s[4].setComponents(c-l,d-h,p-g,w-v).normalize(),t===bn)s[5].setComponents(c+l,d+h,p+g,w+v).normalize();else if(t===ss)s[5].setComponents(l,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bi)}intersectsSprite(e){bi.center.set(0,0,0);let t=Kd.distanceTo(e.center);return bi.radius=.7071067811865476+t,bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(bi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Kr.x=s.normal.x>0?e.max.x:e.min.x,Kr.y=s.normal.y>0?e.max.y:e.min.y,Kr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Kr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var hs=class extends Bn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},va=new P,ya=new P,lu=new tt,Us=new cs,$r=new Fn,dl=new P,cu=new P,ds=class extends Gt{constructor(e=new ut,t=new hs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)va.fromBufferAttribute(t,s-1),ya.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=va.distanceTo(ya);e.setAttribute("lineDistance",new st(n,1))}else Oe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$r.copy(n.boundingSphere),$r.applyMatrix4(s),$r.radius+=r,e.ray.intersectsSphere($r)===!1)return;lu.copy(s).invert(),Us.copy(e.ray).applyMatrix4(lu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let d=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let M=d,g=m-1;M<g;M+=c){let p=u.getX(M),b=u.getX(M+1),A=jr(this,e,Us,l,p,b,M);A&&t.push(A)}if(this.isLineLoop){let M=u.getX(m-1),g=u.getX(d),p=jr(this,e,Us,l,M,g,m-1);p&&t.push(p)}}else{let d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let M=d,g=m-1;M<g;M+=c){let p=jr(this,e,Us,l,M,M+1,M);p&&t.push(p)}if(this.isLineLoop){let M=jr(this,e,Us,l,m-1,d,m-1);M&&t.push(M)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function jr(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(va.fromBufferAttribute(o,s),ya.fromBufferAttribute(o,r),t.distanceSqToSegment(va,ya,dl,cu)>n)return;dl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(dl);if(!(c<e.near||c>e.far))return{distance:c,point:cu.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var uu=new P,hu=new P,wi=class extends ds{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)uu.fromBufferAttribute(t,s),hu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+uu.distanceTo(hu);e.setAttribute("lineDistance",new st(n,1))}else Oe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var On=class extends Bn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},du=new tt,Sl=new cs,Qr=new Fn,ea=new P,En=class extends Gt{constructor(e=new ut,t=new On){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(s),Qr.radius+=r,e.ray.intersectsSphere(Qr)===!1)return;du.copy(s).invert(),Sl.copy(e.ray).applyMatrix4(du);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=h,M=d;m<M;m++){let g=c.getX(m);ea.fromBufferAttribute(f,g),fu(ea,g,l,s,e,t,this)}}else{let h=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let m=h,M=d;m<M;m++)ea.fromBufferAttribute(f,m),fu(ea,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function fu(i,e,t,n,s,r,a){let o=Sl.distanceSqToPoint(i);if(o<t){let l=new P;Sl.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var $s=class extends en{constructor(e=[],t=fi,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ai=class extends en{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ri=class extends en{constructor(e,t,n=wn,s,r,a,o=Vt,l=Vt,c,u=Nn,f=1){if(u!==Nn&&u!==mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new os(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ma=class extends ri{constructor(e,t=wn,n=fi,s,r,a=Vt,o=Vt,l,c=Nn){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},js=class extends en{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},fs=class i extends ut{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],f=[],h=0,d=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(f,2));function m(M,g,p,b,A,v,w,S,C,_,y){let R=v/C,L=w/_,I=v/2,B=w/2,U=S/2,G=C+1,K=_+1,V=0,Z=0,k=new P;for(let j=0;j<K;j++){let ee=j*L-B;for(let Se=0;Se<G;Se++){let ye=Se*R-I;k[M]=ye*b,k[g]=ee*A,k[p]=U,c.push(k.x,k.y,k.z),k[M]=0,k[g]=0,k[p]=S>0?1:-1,u.push(k.x,k.y,k.z),f.push(Se/C),f.push(1-j/_),V+=1}}for(let j=0;j<_;j++)for(let ee=0;ee<C;ee++){let Se=h+ee+G*j,ye=h+ee+G*(j+1),et=h+(ee+1)+G*(j+1),Xe=h+(ee+1)+G*j;l.push(Se,ye,Xe),l.push(ye,et,Xe),Z+=6}o.addGroup(d,Z,y),d+=Z,h+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Qs=class i extends ut{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new P,u=new Te;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=t;f++,h+=3){let d=n+f/t*s;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(o,3)),this.setAttribute("uv",new st(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Jt=class i extends ut{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],h=[],d=[],m=0,M=[],g=n/2,p=0;b(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new st(f,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(d,2));function b(){let v=new P,w=new P,S=0,C=(t-e)/n;for(let _=0;_<=r;_++){let y=[],R=_/r,L=R*(t-e)+e;for(let I=0;I<=s;I++){let B=I/s,U=B*l+o,G=Math.sin(U),K=Math.cos(U);w.x=L*G,w.y=-R*n+g,w.z=L*K,f.push(w.x,w.y,w.z),v.set(G,C,K).normalize(),h.push(v.x,v.y,v.z),d.push(B,1-R),y.push(m++)}M.push(y)}for(let _=0;_<s;_++)for(let y=0;y<r;y++){let R=M[y][_],L=M[y+1][_],I=M[y+1][_+1],B=M[y][_+1];(e>0||y!==0)&&(u.push(R,L,B),S+=3),(t>0||y!==r-1)&&(u.push(L,I,B),S+=3)}c.addGroup(p,S,0),p+=S}function A(v){let w=m,S=new Te,C=new P,_=0,y=v===!0?e:t,R=v===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*R,0),h.push(0,R,0),d.push(.5,.5),m++;let L=m;for(let I=0;I<=s;I++){let U=I/s*l+o,G=Math.cos(U),K=Math.sin(U);C.x=y*K,C.y=g*R,C.z=y*G,f.push(C.x,C.y,C.z),h.push(0,R,0),S.x=G*.5+.5,S.y=K*.5*R+.5,d.push(S.x,S.y),m++}for(let I=0;I<s;I++){let B=w+I,U=L+I;v===!0?u.push(U,U+1,B):u.push(U+1,U,B),_+=3}c.addGroup(p,_,v===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},er=class i extends Jt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Sa=class i extends ut{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new st(r,3)),this.setAttribute("normal",new st(r.slice(),3)),this.setAttribute("uv",new st(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){let A=new P,v=new P,w=new P;for(let S=0;S<t.length;S+=3)d(t[S+0],A),d(t[S+1],v),d(t[S+2],w),l(A,v,w,b)}function l(b,A,v,w){let S=w+1,C=[];for(let _=0;_<=S;_++){C[_]=[];let y=b.clone().lerp(v,_/S),R=A.clone().lerp(v,_/S),L=S-_;for(let I=0;I<=L;I++)I===0&&_===S?C[_][I]=y:C[_][I]=y.clone().lerp(R,I/L)}for(let _=0;_<S;_++)for(let y=0;y<2*(S-_)-1;y++){let R=Math.floor(y/2);y%2===0?(h(C[_][R+1]),h(C[_+1][R]),h(C[_][R])):(h(C[_][R+1]),h(C[_+1][R+1]),h(C[_+1][R]))}}function c(b){let A=new P;for(let v=0;v<r.length;v+=3)A.x=r[v+0],A.y=r[v+1],A.z=r[v+2],A.normalize().multiplyScalar(b),r[v+0]=A.x,r[v+1]=A.y,r[v+2]=A.z}function u(){let b=new P;for(let A=0;A<r.length;A+=3){b.x=r[A+0],b.y=r[A+1],b.z=r[A+2];let v=g(b)/2/Math.PI+.5,w=p(b)/Math.PI+.5;a.push(v,1-w)}m(),f()}function f(){for(let b=0;b<a.length;b+=6){let A=a[b+0],v=a[b+2],w=a[b+4],S=Math.max(A,v,w),C=Math.min(A,v,w);S>.9&&C<.1&&(A<.2&&(a[b+0]+=1),v<.2&&(a[b+2]+=1),w<.2&&(a[b+4]+=1))}}function h(b){r.push(b.x,b.y,b.z)}function d(b,A){let v=b*3;A.x=e[v+0],A.y=e[v+1],A.z=e[v+2]}function m(){let b=new P,A=new P,v=new P,w=new P,S=new Te,C=new Te,_=new Te;for(let y=0,R=0;y<r.length;y+=9,R+=6){b.set(r[y+0],r[y+1],r[y+2]),A.set(r[y+3],r[y+4],r[y+5]),v.set(r[y+6],r[y+7],r[y+8]),S.set(a[R+0],a[R+1]),C.set(a[R+2],a[R+3]),_.set(a[R+4],a[R+5]),w.copy(b).add(A).add(v).divideScalar(3);let L=g(w);M(S,R+0,b,L),M(C,R+2,A,L),M(_,R+4,v,L)}}function M(b,A,v,w){w<0&&b.x===1&&(a[A]=b.x-1),v.x===0&&v.z===0&&(a[A]=w/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var ln=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Oe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],h=n[s+1]-u,d=(a-u)/h;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Te:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,l=new tt;for(let d=0;d<=e;d++){let m=d/e;s[d]=this.getTangentAt(m,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(it(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(it(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ps=class extends ln{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Te){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*f+this.aX,c=h*f+d*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ba=class extends ps{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ql(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;h*=u,d*=u,s(a,o,h,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var pu=new P,mu=new P,fl=new Ql,pl=new Ql,ml=new Ql,ms=class extends ln{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(mu.subVectors(s[0],s[1]).add(s[0]),c=mu);let f=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(pu.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=pu),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(f),d),M=Math.pow(f.distanceToSquared(h),d),g=Math.pow(h.distanceToSquared(u),d);M<1e-4&&(M=1),m<1e-4&&(m=M),g<1e-4&&(g=M),fl.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,m,M,g),pl.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,m,M,g),ml.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,m,M,g)}else this.curveType==="catmullrom"&&(fl.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),pl.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),ml.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return n.set(fl.calc(l),pl.calc(l),ml.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function gu(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function $d(i,e){let t=1-i;return t*t*e}function jd(i,e){return 2*(1-i)*i*e}function Qd(i,e){return i*i*e}function zs(i,e,t,n){return $d(i,e)+jd(i,t)+Qd(i,n)}function ef(i,e){let t=1-i;return t*t*t*e}function tf(i,e){let t=1-i;return 3*t*t*i*e}function nf(i,e){return 3*(1-i)*i*i*e}function sf(i,e){return i*i*i*e}function Hs(i,e,t,n,s){return ef(i,e)+tf(i,t)+nf(i,n)+sf(i,s)}var tr=class extends ln{constructor(e=new Te,t=new Te,n=new Te,s=new Te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Te){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Hs(e,s.x,r.x,a.x,o.x),Hs(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ea=class extends ln{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Hs(e,s.x,r.x,a.x,o.x),Hs(e,s.y,r.y,a.y,o.y),Hs(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},nr=class extends ln{constructor(e=new Te,t=new Te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Te){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ta=class extends ln{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ir=class extends ln{constructor(e=new Te,t=new Te,n=new Te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Te){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(zs(e,s.x,r.x,a.x),zs(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},sr=class extends ln{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(zs(e,s.x,r.x,a.x),zs(e,s.y,r.y,a.y),zs(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},rr=class extends ln{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Te){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(gu(o,l.x,c.x,u.x,f.x),gu(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Te().fromArray(s))}return this}},bl=Object.freeze({__proto__:null,ArcCurve:ba,CatmullRomCurve3:ms,CubicBezierCurve:tr,CubicBezierCurve3:Ea,EllipseCurve:ps,LineCurve:nr,LineCurve3:Ta,QuadraticBezierCurve:ir,QuadraticBezierCurve3:sr,SplineCurve:rr}),wa=class extends ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new bl[s.type]().fromJSON(s))}return this}},ar=class extends wa{constructor(e){super(),this.type="Path",this.currentPoint=new Te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new nr(this.currentPoint.clone(),new Te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ir(this.currentPoint.clone(),new Te(e,t),new Te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new tr(this.currentPoint.clone(),new Te(e,t),new Te(n,s),new Te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new rr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new ps(e,t,n,s,r,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},gs=class extends ar{constructor(e){super(e),this.uuid=Ni(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ar().fromJSON(s))}return this}};function rf(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=hh(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=uf(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let u=o,f=l;for(let h=t;h<s;h+=t){let d=i[h],m=i[h+1];d<o&&(o=d),m<l&&(l=m),d>u&&(u=d),m>f&&(f=m)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return or(r,a,t,o,l,c,0),a}function hh(i,e,t,n,s){let r;if(s===Mf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=xu(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=xu(a/n|0,i[a],i[a+1],r);return r&&xs(r,r.next)&&(cr(r),r=r.next),r}function Ri(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(xs(t,t.next)||At(t.prev,t,t.next)===0)){if(cr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function or(i,e,t,n,s,r,a){if(!i)return;!a&&r&&mf(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?of(i,n,s,r):af(i)){e.push(l.i,i.i,c.i),cr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=lf(Ri(i),e),or(i,e,t,n,s,r,2)):a===2&&cf(i,e,t,n,s,r):or(Ri(i),e,t,n,s,r,1);break}}}function af(i){let e=i.prev,t=i,n=i.next;if(At(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(s,r,a),f=Math.min(o,l,c),h=Math.max(s,r,a),d=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=u&&m.x<=h&&m.y>=f&&m.y<=d&&Fs(s,o,r,l,a,c,m.x,m.y)&&At(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function of(i,e,t,n){let s=i.prev,r=i,a=i.next;if(At(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,u=s.y,f=r.y,h=a.y,d=Math.min(o,l,c),m=Math.min(u,f,h),M=Math.max(o,l,c),g=Math.max(u,f,h),p=El(d,m,e,t,n),b=El(M,g,e,t,n),A=i.prevZ,v=i.nextZ;for(;A&&A.z>=p&&v&&v.z<=b;){if(A.x>=d&&A.x<=M&&A.y>=m&&A.y<=g&&A!==s&&A!==a&&Fs(o,u,l,f,c,h,A.x,A.y)&&At(A.prev,A,A.next)>=0||(A=A.prevZ,v.x>=d&&v.x<=M&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Fs(o,u,l,f,c,h,v.x,v.y)&&At(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;A&&A.z>=p;){if(A.x>=d&&A.x<=M&&A.y>=m&&A.y<=g&&A!==s&&A!==a&&Fs(o,u,l,f,c,h,A.x,A.y)&&At(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;v&&v.z<=b;){if(v.x>=d&&v.x<=M&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Fs(o,u,l,f,c,h,v.x,v.y)&&At(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function lf(i,e){let t=i;do{let n=t.prev,s=t.next.next;!xs(n,s)&&fh(n,t,t.next,s)&&lr(n,s)&&lr(s,n)&&(e.push(n.i,t.i,s.i),cr(t),cr(t.next),t=i=s),t=t.next}while(t!==i);return Ri(t)}function cf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&_f(a,o)){let l=ph(a,o);a=Ri(a,a.next),l=Ri(l,l.next),or(a,e,t,n,s,r,0),or(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function uf(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=hh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(xf(c))}s.sort(hf);for(let r=0;r<s.length;r++)t=df(s[r],t);return t}function hf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function df(i,e){let t=ff(i,e);if(!t)return e;let n=ph(t,i);return Ri(n,n.next),Ri(t,t.next)}function ff(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(xs(i,t))return t;do{if(xs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&dh(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let f=Math.abs(s-t.y)/(n-t.x);lr(t,i)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&pf(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function pf(i,e){return At(i.prev,i,e.prev)<0&&At(e.next,i,i.next)<0}function mf(i,e,t,n){let s=i;do s.z===0&&(s.z=El(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,gf(s)}function gf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function El(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function xf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function dh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Fs(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&dh(i,e,t,n,s,r,a,o)}function _f(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!vf(i,e)&&(lr(i,e)&&lr(e,i)&&yf(i,e)&&(At(i.prev,i,e.prev)||At(i,e.prev,e))||xs(i,e)&&At(i.prev,i,i.next)>0&&At(e.prev,e,e.next)>0)}function At(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function xs(i,e){return i.x===e.x&&i.y===e.y}function fh(i,e,t,n){let s=na(At(i,e,t)),r=na(At(i,e,n)),a=na(At(t,n,i)),o=na(At(t,n,e));return!!(s!==r&&a!==o||s===0&&ta(i,t,e)||r===0&&ta(i,n,e)||a===0&&ta(t,i,n)||o===0&&ta(t,e,n))}function ta(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function na(i){return i>0?1:i<0?-1:0}function vf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&fh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function lr(i,e){return At(i.prev,i,i.next)<0?At(i,e,i.next)>=0&&At(i,i.prev,e)>=0:At(i,e,i.prev)<0||At(i,i.next,e)<0}function yf(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function ph(i,e){let t=Tl(i.i,i.x,i.y),n=Tl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function xu(i,e,t,n){let s=Tl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function cr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Tl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var wl=class{static triangulate(e,t,n=2){return rf(e,t,n)}},ts=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];_u(e),vu(n,e);let a=e.length;t.forEach(_u);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,vu(n,t[l]);let o=wl.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function _u(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function vu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ai=class i extends Sa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Je=class i extends ut{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,f=e/o,h=t/l,d=[],m=[],M=[],g=[];for(let p=0;p<u;p++){let b=p*h-a;for(let A=0;A<c;A++){let v=A*f-r;m.push(v,-b,0),M.push(0,0,1),g.push(A/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){let A=b+c*p,v=b+c*(p+1),w=b+1+c*(p+1),S=b+1+c*p;d.push(A,v,S),d.push(v,w,S)}this.setIndex(d),this.setAttribute("position",new st(m,3)),this.setAttribute("normal",new st(M,3)),this.setAttribute("uv",new st(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},_s=class i extends ut{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],u=[],f=e,h=(t-e)/s,d=new P,m=new Te;for(let M=0;M<=s;M++){for(let g=0;g<=n;g++){let p=r+g/n*a;d.x=f*Math.cos(p),d.y=f*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),m.x=(d.x/t+1)/2,m.y=(d.y/t+1)/2,u.push(m.x,m.y)}f+=h}for(let M=0;M<s;M++){let g=M*(n+1);for(let p=0;p<n;p++){let b=p+g,A=b,v=b+n+1,w=b+n+2,S=b+1;o.push(A,v,S),o.push(v,w,S)}}this.setIndex(o),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},ur=class i extends ut{constructor(e=new gs([new Te(0,.5),new Te(-.5,-.5),new Te(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new st(s,3)),this.setAttribute("normal",new st(r,3)),this.setAttribute("uv",new st(a,2));function c(u){let f=s.length/3,h=u.extractPoints(t),d=h.shape,m=h.holes;ts.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){let b=m[g];ts.isClockWise(b)===!0&&(m[g]=b.reverse())}let M=ts.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){let b=m[g];d=d.concat(b)}for(let g=0,p=d.length;g<p;g++){let b=d[g];s.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let g=0,p=M.length;g<p;g++){let b=M[g],A=b[0]+f,v=b[1]+f,w=b[2]+f;n.push(A,v,w),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Sf(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Sf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Rt=class i extends ut{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],f=new P,h=new P,d=[],m=[],M=[],g=[];for(let p=0;p<=n;p++){let b=[],A=p/n,v=a+A*o,w=e*Math.cos(v),S=Math.sqrt(e*e-w*w),C=0;p===0&&a===0?C=.5/t:p===n&&l===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){let y=_/t,R=s+y*r;f.x=-S*Math.cos(R),f.y=w,f.z=S*Math.sin(R),m.push(f.x,f.y,f.z),h.copy(f).normalize(),M.push(h.x,h.y,h.z),g.push(y+C,1-A),b.push(c++)}u.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){let A=u[p][b+1],v=u[p][b],w=u[p+1][b],S=u[p+1][b+1];(p!==0||a>0)&&d.push(A,v,S),(p!==n-1||l<Math.PI)&&d.push(v,w,S)}this.setIndex(d),this.setAttribute("position",new st(m,3)),this.setAttribute("normal",new st(M,3)),this.setAttribute("uv",new st(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var hr=class i extends ut{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],f=[],h=new P,d=new P,m=new P;for(let M=0;M<=n;M++){let g=a+M/n*o;for(let p=0;p<=s;p++){let b=p/s*r;d.x=(e+t*Math.cos(g))*Math.cos(b),d.y=(e+t*Math.cos(g))*Math.sin(b),d.z=t*Math.sin(g),c.push(d.x,d.y,d.z),h.x=e*Math.cos(b),h.y=e*Math.sin(b),m.subVectors(d,h).normalize(),u.push(m.x,m.y,m.z),f.push(p/s),f.push(M/n)}}for(let M=1;M<=n;M++)for(let g=1;g<=s;g++){let p=(s+1)*M+g-1,b=(s+1)*(M-1)+g-1,A=(s+1)*(M-1)+g,v=(s+1)*M+g;l.push(p,b,v),l.push(b,A,v)}this.setIndex(l),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var dr=class i extends ut{constructor(e=new sr(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,l=new P,c=new Te,u=new P,f=[],h=[],d=[],m=[];M(),this.setIndex(m),this.setAttribute("position",new st(f,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(d,2));function M(){for(let A=0;A<t;A++)g(A);g(r===!1?t:0),b(),p()}function g(A){u=e.getPointAt(A/t,u);let v=a.normals[A],w=a.binormals[A];for(let S=0;S<=s;S++){let C=S/s*Math.PI*2,_=Math.sin(C),y=-Math.cos(C);l.x=y*v.x+_*w.x,l.y=y*v.y+_*w.y,l.z=y*v.z+_*w.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function p(){for(let A=1;A<=t;A++)for(let v=1;v<=s;v++){let w=(s+1)*(A-1)+(v-1),S=(s+1)*A+(v-1),C=(s+1)*A+v,_=(s+1)*(A-1)+v;m.push(w,S,_),m.push(S,C,_)}}function b(){for(let A=0;A<=t;A++)for(let v=0;v<=s;v++)c.x=A/t,c.y=v/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new bl[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Ui(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(yu(s))s.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(yu(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Kt(i){let e={};for(let t=0;t<i.length;t++){let n=Ui(i[t]);for(let s in n)e[s]=n[s]}return e}function yu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function bf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ec(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}var mh={clone:Ui,merge:Kt},Ef=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,We=class extends Bn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ef,this.fragmentShader=Tf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ui(e.uniforms),this.uniformsGroups=bf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new ge().setHex(s.value);break;case"v2":this.uniforms[n].value=new Te().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Tt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new qe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new tt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Aa=class extends We{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},xt=class extends Bn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Po,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ra=class extends Bn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ku,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ca=class extends Bn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ki(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function gl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var oi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Pa=class extends oi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:vl,endingEnd:vl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case yl:r=e,o=2*t-n;break;case Ml:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case yl:a=e,l=2*n-t;break;case Ml:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,m=(n-t)/(s-t),M=m*m,g=M*m,p=-h*g+2*h*M-h*m,b=(1+h)*g+(-1.5-2*h)*M+(-.5+h)*m+1,A=(-1-d)*g+(1.5+d)*M+.5*m,v=d*g-d*M;for(let w=0;w!==o;++w)r[w]=p*a[u+w]+b*a[c+w]+A*a[l+w]+v*a[f+w];return r}},Ia=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),f=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*f+a[l+h]*u;return r}},La=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Na=class extends oi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,f=this.outTangents;if(!u||!f){let m=(n-t)/(s-t),M=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*M+a[l+g]*m;return r}let h=o*2,d=e-1;for(let m=0;m!==o;++m){let M=a[c+m],g=a[l+m],p=d*h+m*2,b=f[p],A=f[p+1],v=e*h+m*2,w=u[v],S=u[v+1],C=Af(n,t,b,w,s);r[m]=gh(C,M,A,S,g)}return r}};function gh(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function wf(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Af(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=gh(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=wf(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var cn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ki(t,this.TimeBufferType),this.values=Ki(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ki(e.times,Array),values:Ki(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),gl(e.settings)&&(n.settings={inTangents:Ki(e.settings.inTangents,Array),outTangents:Ki(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new La(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ia(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Pa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Na(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Vs:t=this.InterpolantFactoryMethodDiscrete;break;case ma:t=this.InterpolantFactoryMethodLinear;break;case ra:t=this.InterpolantFactoryMethodSmooth;break;case _l:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Oe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vs;case this.InterpolantFactoryMethodLinear:return ma;case this.InterpolantFactoryMethodSmooth:return ra;case this.InterpolantFactoryMethodBezier:return _l}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;gl(this.settings)&&(Mu(this.settings.inTangents,e),Mu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ve("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ve("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ve("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ve("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&md(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ve("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ra,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let f=o*n,h=f-n,d=f+n;for(let m=0;m!==n;++m){let M=t[f+m];if(M!==t[h+m]||M!==t[d+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let f=o*n,h=a*n;for(let d=0;d!==n;++d)t[h+d]=t[f+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,gl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Mu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}cn.prototype.ValueTypeName="";cn.prototype.TimeBufferType=Float32Array;cn.prototype.ValueBufferType=Float32Array;cn.prototype.DefaultInterpolation=ma;var li=class extends cn{constructor(e,t,n){super(e,t,n)}};li.prototype.ValueTypeName="bool";li.prototype.ValueBufferType=Array;li.prototype.DefaultInterpolation=Vs;li.prototype.InterpolantFactoryMethodLinear=void 0;li.prototype.InterpolantFactoryMethodSmooth=void 0;var Da=class extends cn{constructor(e,t,n,s){super(e,t,n,s)}};Da.prototype.ValueTypeName="color";var Ua=class extends cn{constructor(e,t,n,s){super(e,t,n,s)}};Ua.prototype.ValueTypeName="number";var Fa=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)Ft.slerpFlat(r,0,a,c-o,a,c,l);return r}},fr=class extends cn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Fa(this.times,this.values,this.getValueSize(),e)}};fr.prototype.ValueTypeName="quaternion";fr.prototype.InterpolantFactoryMethodSmooth=void 0;var ci=class extends cn{constructor(e,t,n){super(e,t,n)}};ci.prototype.ValueTypeName="string";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=Vs;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends cn{constructor(e,t,n,s){super(e,t,n,s)}};Ba.prototype.ValueTypeName="vector";var Oa=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},xh=new Oa,za=class{constructor(e){this.manager=e!==void 0?e:xh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};za.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ci=class extends Gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ge(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Pi=class extends Ci{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},xl=new tt,Su=new P,bu=new P,pr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=sn,this.map=null,this.mapPass=null,this.matrix=new tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new us,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Su.setFromMatrixPosition(e.matrixWorld),t.position.copy(Su),bu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(bu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){xl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(xl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===ss||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(xl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ia=new P,sa=new Ft,In=new P,mr=class extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ia,sa,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,In.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ia,sa,In),In.x===1&&In.y===1&&In.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ia,sa,In.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ni=new P,Eu=new Te,Tu=new Te,ht=class extends mr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=as*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Bs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return as*2*Math.atan(Math.tan(Bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ni.x,ni.y).multiplyScalar(-e/ni.z),ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ni.x,ni.y).multiplyScalar(-e/ni.z)}getViewSize(e,t){return this.getViewBounds(e,Eu,Tu),t.subVectors(Tu,Eu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Bs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Al=class extends pr{constructor(){super(new ht(90,1,.5,500)),this.isPointLightShadow=!0}},vs=class extends Ci{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Al}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ui=class extends mr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Rl=class extends pr{constructor(){super(new ui(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},hi=class extends Ci{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.target=new Gt,this.shadow=new Rl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},gr=class extends Ci{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var $i=-90,ji=1,Ha=class extends Gt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ht($i,ji,e,t);s.layers=this.layers,this.add(s);let r=new ht($i,ji,e,t);r.layers=this.layers,this.add(r);let a=new ht($i,ji,e,t);a.layers=this.layers,this.add(a);let o=new ht($i,ji,e,t);o.layers=this.layers,this.add(o);let l=new ht($i,ji,e,t);l.layers=this.layers,this.add(l);let c=new ht($i,ji,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,h,d),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Va=class extends ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var tc="\\[\\]\\.:\\/",Rf=new RegExp("["+tc+"]","g"),nc="[^"+tc+"]",Cf="[^"+tc.replace("\\.","")+"]",Pf=/((?:WC+[\/:])*)/.source.replace("WC",nc),If=/(WCOD+)?/.source.replace("WCOD",Cf),Lf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nc),Nf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nc),Df=new RegExp("^"+Pf+If+Lf+Nf+"$"),Uf=["material","materials","bones","map"],Cl=class{constructor(e,t,n){let s=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Rf,"")}static parseTrackName(e){let t=Df.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Uf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Oe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ve("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ve("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ve("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ve("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ve("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ve("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ve("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ve("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=Cl;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Hx=new Float32Array(1);var lc=class lc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};lc.prototype.isMatrix2=!0;var Pl=lc;function ic(i,e,t,n){let s=Ff(n);switch(t){case Zl:return i*e;case Ja:return i*e/s.components*s.byteLength;case Ka:return i*e/s.components*s.byteLength;case gi:return i*e*2/s.components*s.byteLength;case $a:return i*e*2/s.components*s.byteLength;case Jl:return i*e*3/s.components*s.byteLength;case pn:return i*e*4/s.components*s.byteLength;case ja:return i*e*4/s.components*s.byteLength;case Mr:case Sr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case br:case Er:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case eo:case no:return Math.max(i,16)*Math.max(e,8)/4;case Qa:case to:return Math.max(i,8)*Math.max(e,8)/2;case io:case so:case ao:case oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ro:case Tr:case lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case uo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case mo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case go:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case vo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case yo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case So:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case bo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Eo:case To:case wo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ao:case Ro:return Math.ceil(i/4)*Math.ceil(e/4)*8;case wr:case Co:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ff(i){switch(i){case sn:case Wl:return{byteLength:1,components:1};case Ss:case Xl:case An:return{byteLength:2,components:1};case Ya:case Za:return{byteLength:2,components:4};case wn:case qa:case fn:return{byteLength:4,components:1};case ql:case Yl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window!="undefined"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function zh(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Of(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<f.length;d++){let m=f[h],M=f[d];M.start<=m.start+m.count+1?m.count=Math.max(m.count,M.start+M.count-m.start):(++h,f[h]=M)}f.length=h+1;for(let d=0,m=f.length;d<m;d++){let M=f[d];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var zf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hf=`#ifdef USE_ALPHAHASH
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
#endif`,Vf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xf=`#ifdef USE_AOMAP
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
#endif`,qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
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
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Zf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Jf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Kf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$f=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jf=`#ifdef USE_IRIDESCENCE
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
#endif`,Qf=`#ifdef USE_BUMPMAP
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
#endif`,ep=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ip=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,lp=`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,cp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,up=`vec3 transformedNormal = objectNormal;
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
#endif`,hp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mp="gl_FragColor = linearToOutputTexel( gl_FragColor );",gp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,_p=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
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
#endif`,yp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wp=`#ifdef USE_GRADIENTMAP
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
}`,Ap=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pp=`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#endif
#include <lightprobes_pars_fragment>`,Ip=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
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
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Lp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Up=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,Bp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Op=`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Hp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jp=`#if defined( USE_POINTS_UV )
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
#endif`,Kp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$p=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,em=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
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
#endif`,nm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,im=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,om=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,lm=`#ifdef USE_NORMALMAP
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
#endif`,cm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,um=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_m=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ym=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Mm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Sm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
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
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,Em=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Tm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wm=`#ifdef USE_SKINNING
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
#endif`,Am=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Rm=`#ifdef USE_SKINNING
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
#endif`,Cm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Im=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Lm=`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nm=`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dm=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Om=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,zm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hm=`uniform sampler2D t2D;
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
}`,Vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xm=`#include <common>
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
}`,qm=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ym=`#define DISTANCE
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
}`,Zm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Km=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$m=`uniform float scale;
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
}`,jm=`uniform vec3 diffuse;
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
}`,Qm=`#include <common>
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
}`,e0=`uniform vec3 diffuse;
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
}`,t0=`#define LAMBERT
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
}`,n0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,i0=`#define MATCAP
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
}`,s0=`#define MATCAP
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
}`,r0=`#define NORMAL
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
}`,a0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,o0=`#define PHONG
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
}`,l0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,c0=`#define STANDARD
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
}`,u0=`#define STANDARD
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
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,h0=`#define TOON
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
}`,d0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,f0=`uniform float size;
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
}`,p0=`uniform vec3 diffuse;
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
}`,m0=`#include <common>
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
}`,g0=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,x0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,_0=`uniform vec3 diffuse;
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
}`,Qe={alphahash_fragment:zf,alphahash_pars_fragment:Hf,alphamap_fragment:Vf,alphamap_pars_fragment:Gf,alphatest_fragment:kf,alphatest_pars_fragment:Wf,aomap_fragment:Xf,aomap_pars_fragment:qf,batching_pars_vertex:Yf,batching_vertex:Zf,begin_vertex:Jf,beginnormal_vertex:Kf,bsdfs:$f,iridescence_fragment:jf,bumpmap_pars_fragment:Qf,clipping_planes_fragment:ep,clipping_planes_pars_fragment:tp,clipping_planes_pars_vertex:np,clipping_planes_vertex:ip,color_fragment:sp,color_pars_fragment:rp,color_pars_vertex:ap,color_vertex:op,common:lp,cube_uv_reflection_fragment:cp,defaultnormal_vertex:up,displacementmap_pars_vertex:hp,displacementmap_vertex:dp,emissivemap_fragment:fp,emissivemap_pars_fragment:pp,colorspace_fragment:mp,colorspace_pars_fragment:gp,envmap_fragment:xp,envmap_common_pars_fragment:_p,envmap_pars_fragment:vp,envmap_pars_vertex:yp,envmap_physical_pars_fragment:Ip,envmap_vertex:Mp,fog_vertex:Sp,fog_pars_vertex:bp,fog_fragment:Ep,fog_pars_fragment:Tp,gradientmap_pars_fragment:wp,lightmap_pars_fragment:Ap,lights_lambert_fragment:Rp,lights_lambert_pars_fragment:Cp,lights_pars_begin:Pp,lights_toon_fragment:Lp,lights_toon_pars_fragment:Np,lights_phong_fragment:Dp,lights_phong_pars_fragment:Up,lights_physical_fragment:Fp,lights_physical_pars_fragment:Bp,lights_fragment_begin:Op,lights_fragment_maps:zp,lights_fragment_end:Hp,lightprobes_pars_fragment:Vp,logdepthbuf_fragment:Gp,logdepthbuf_pars_fragment:kp,logdepthbuf_pars_vertex:Wp,logdepthbuf_vertex:Xp,map_fragment:qp,map_pars_fragment:Yp,map_particle_fragment:Zp,map_particle_pars_fragment:Jp,metalnessmap_fragment:Kp,metalnessmap_pars_fragment:$p,morphinstance_vertex:jp,morphcolor_vertex:Qp,morphnormal_vertex:em,morphtarget_pars_vertex:tm,morphtarget_vertex:nm,normal_fragment_begin:im,normal_fragment_maps:sm,normal_pars_fragment:rm,normal_pars_vertex:am,normal_vertex:om,normalmap_pars_fragment:lm,clearcoat_normal_fragment_begin:cm,clearcoat_normal_fragment_maps:um,clearcoat_pars_fragment:hm,iridescence_pars_fragment:dm,opaque_fragment:fm,packing:pm,premultiplied_alpha_fragment:mm,project_vertex:gm,dithering_fragment:xm,dithering_pars_fragment:_m,roughnessmap_fragment:vm,roughnessmap_pars_fragment:ym,shadowmap_pars_fragment:Mm,shadowmap_pars_vertex:Sm,shadowmap_vertex:bm,shadowmask_pars_fragment:Em,skinbase_vertex:Tm,skinning_pars_vertex:wm,skinning_vertex:Am,skinnormal_vertex:Rm,specularmap_fragment:Cm,specularmap_pars_fragment:Pm,tonemapping_fragment:Im,tonemapping_pars_fragment:Lm,transmission_fragment:Nm,transmission_pars_fragment:Dm,uv_pars_fragment:Um,uv_pars_vertex:Fm,uv_vertex:Bm,worldpos_vertex:Om,background_vert:zm,background_frag:Hm,backgroundCube_vert:Vm,backgroundCube_frag:Gm,cube_vert:km,cube_frag:Wm,depth_vert:Xm,depth_frag:qm,distance_vert:Ym,distance_frag:Zm,equirect_vert:Jm,equirect_frag:Km,linedashed_vert:$m,linedashed_frag:jm,meshbasic_vert:Qm,meshbasic_frag:e0,meshlambert_vert:t0,meshlambert_frag:n0,meshmatcap_vert:i0,meshmatcap_frag:s0,meshnormal_vert:r0,meshnormal_frag:a0,meshphong_vert:o0,meshphong_frag:l0,meshphysical_vert:c0,meshphysical_frag:u0,meshtoon_vert:h0,meshtoon_frag:d0,points_vert:f0,points_frag:p0,shadow_vert:m0,shadow_frag:g0,sprite_vert:x0,sprite_frag:_0},xe={common:{diffuse:{value:new ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new ge(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Vn={basic:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new ge(0)},envMapIntensity:{value:1}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Kt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new ge(0)},specular:{value:new ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Kt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Kt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new ge(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Kt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Kt([xe.points,xe.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Kt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Kt([xe.common,xe.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Kt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Kt([xe.sprite,xe.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distance:{uniforms:Kt([xe.common,xe.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distance_vert,fragmentShader:Qe.distance_frag},shadow:{uniforms:Kt([xe.lights,xe.fog,{color:{value:new ge(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};Vn.physical={uniforms:Kt([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new ge(0)},specularColor:{value:new ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};var No={r:0,b:0,g:0},v0=new tt,Hh=new qe;Hh.set(-1,0,0,0,1,0,0,0,1);function y0(i,e,t,n,s,r){let a=new ge(0),o=s===!0?0:1,l,c,u=null,f=0,h=null;function d(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){let v=b.backgroundBlurriness>0;A=e.get(A,v)}return A}function m(b){let A=!1,v=d(b);v===null?g(a,o):v&&v.isColor&&(g(v,1),A=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(b,A){let v=d(A);v&&(v.isCubeTexture||v.mapping===vr)?(c===void 0&&(c=new Ee(new fs(1,1,1),new We({name:"BackgroundCubeMaterial",uniforms:Ui(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:Et,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,S,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(v0.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Hh),c.material.toneMapped=at.getTransfer(v.colorSpace)!==pt,(u!==v||f!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Ee(new Je(2,2),new We({name:"BackgroundMaterial",uniforms:Ui(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=at.getTransfer(v.colorSpace)!==pt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function g(b,A){b.getRGB(No,ec(i)),t.buffers.color.setClear(No.r,No.g,No.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,A=1){a.set(b),o=A,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,g(a,o)},render:m,addToRenderList:M,dispose:p}}function M0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(L,I,B,U,G){let K=!1,V=f(L,U,B,I);r!==V&&(r=V,c(r.object)),K=d(L,U,B,G),K&&m(L,U,B,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,v(L,I,B,U),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function u(L){return i.deleteVertexArray(L)}function f(L,I,B,U){let G=U.wireframe===!0,K=n[I.id];K===void 0&&(K={},n[I.id]=K);let V=L.isInstancedMesh===!0?L.id:0,Z=K[V];Z===void 0&&(Z={},K[V]=Z);let k=Z[B.id];k===void 0&&(k={},Z[B.id]=k);let j=k[G];return j===void 0&&(j=h(l()),k[G]=j),j}function h(L){let I=[],B=[],U=[];for(let G=0;G<t;G++)I[G]=0,B[G]=0,U[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:B,attributeDivisors:U,object:L,attributes:{},index:null}}function d(L,I,B,U){let G=r.attributes,K=I.attributes,V=0,Z=B.getAttributes();for(let k in Z)if(Z[k].location>=0){let ee=G[k],Se=K[k];if(Se===void 0&&(k==="instanceMatrix"&&L.instanceMatrix&&(Se=L.instanceMatrix),k==="instanceColor"&&L.instanceColor&&(Se=L.instanceColor)),ee===void 0||ee.attribute!==Se||Se&&ee.data!==Se.data)return!0;V++}return r.attributesNum!==V||r.index!==U}function m(L,I,B,U){let G={},K=I.attributes,V=0,Z=B.getAttributes();for(let k in Z)if(Z[k].location>=0){let ee=K[k];ee===void 0&&(k==="instanceMatrix"&&L.instanceMatrix&&(ee=L.instanceMatrix),k==="instanceColor"&&L.instanceColor&&(ee=L.instanceColor));let Se={};Se.attribute=ee,ee&&ee.data&&(Se.data=ee.data),G[k]=Se,V++}r.attributes=G,r.attributesNum=V,r.index=U}function M(){let L=r.newAttributes;for(let I=0,B=L.length;I<B;I++)L[I]=0}function g(L){p(L,0)}function p(L,I){let B=r.newAttributes,U=r.enabledAttributes,G=r.attributeDivisors;B[L]=1,U[L]===0&&(i.enableVertexAttribArray(L),U[L]=1),G[L]!==I&&(i.vertexAttribDivisor(L,I),G[L]=I)}function b(){let L=r.newAttributes,I=r.enabledAttributes;for(let B=0,U=I.length;B<U;B++)I[B]!==L[B]&&(i.disableVertexAttribArray(B),I[B]=0)}function A(L,I,B,U,G,K,V){V===!0?i.vertexAttribIPointer(L,I,B,G,K):i.vertexAttribPointer(L,I,B,U,G,K)}function v(L,I,B,U){M();let G=U.attributes,K=B.getAttributes(),V=I.defaultAttributeValues;for(let Z in K){let k=K[Z];if(k.location>=0){let j=G[Z];if(j===void 0&&(Z==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),Z==="instanceColor"&&L.instanceColor&&(j=L.instanceColor)),j!==void 0){let ee=j.normalized,Se=j.itemSize,ye=e.get(j);if(ye===void 0)continue;let et=ye.buffer,Xe=ye.type,Ye=ye.bytesPerElement,te=Xe===i.INT||Xe===i.UNSIGNED_INT||j.gpuType===qa;if(j.isInterleavedBufferAttribute){let ne=j.data,he=ne.stride,Fe=j.offset;if(ne.isInstancedInterleavedBuffer){for(let de=0;de<k.locationSize;de++)p(k.location+de,ne.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let de=0;de<k.locationSize;de++)g(k.location+de);i.bindBuffer(i.ARRAY_BUFFER,et);for(let de=0;de<k.locationSize;de++)A(k.location+de,Se/k.locationSize,Xe,ee,he*Ye,(Fe+Se/k.locationSize*de)*Ye,te)}else{if(j.isInstancedBufferAttribute){for(let ne=0;ne<k.locationSize;ne++)p(k.location+ne,j.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ne=0;ne<k.locationSize;ne++)g(k.location+ne);i.bindBuffer(i.ARRAY_BUFFER,et);for(let ne=0;ne<k.locationSize;ne++)A(k.location+ne,Se/k.locationSize,Xe,ee,Se*Ye,Se/k.locationSize*ne*Ye,te)}}else if(V!==void 0){let ee=V[Z];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(k.location,ee);break;case 3:i.vertexAttrib3fv(k.location,ee);break;case 4:i.vertexAttrib4fv(k.location,ee);break;default:i.vertexAttrib1fv(k.location,ee)}}}}b()}function w(){y();for(let L in n){let I=n[L];for(let B in I){let U=I[B];for(let G in U){let K=U[G];for(let V in K)u(K[V].object),delete K[V];delete U[G]}}delete n[L]}}function S(L){if(n[L.id]===void 0)return;let I=n[L.id];for(let B in I){let U=I[B];for(let G in U){let K=U[G];for(let V in K)u(K[V].object),delete K[V];delete U[G]}}delete n[L.id]}function C(L){for(let I in n){let B=n[I];for(let U in B){let G=B[U];if(G[L.id]===void 0)continue;let K=G[L.id];for(let V in K)u(K[V].object),delete K[V];delete G[L.id]}}}function _(L){for(let I in n){let B=n[I],U=L.isInstancedMesh===!0?L.id:0,G=B[U];if(G!==void 0){for(let K in G){let V=G[K];for(let Z in V)u(V[Z].object),delete V[Z];delete G[K]}delete B[U],Object.keys(B).length===0&&delete n[I]}}}function y(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:y,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:g,disableUnusedAttributes:b}}function S0(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function b0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==pn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===An&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==sn&&C!==fn&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Oe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:M,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:v,maxSamples:w,samples:S}}function E0(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Sn,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||n!==0||s;return s=h,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,d){let m=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,p=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{let b=r?0:n,A=b*4,v=p.clippingState||null;l.value=v,v=u(m,h,A,d);for(let w=0;w!==A;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,h,d,m){let M=f!==null?f.length:0,g=null;if(M!==0){if(g=l.value,m!==!0||g===null){let p=d+M*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let A=0,v=d;A!==M;++A,v+=4)a.copy(f[A]).applyMatrix4(b,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}var Ts=4,T0=6,w0=20,A0=256,Ar=new ui,_h=new ge,cc=null,uc=0,hc=0,dc=!1,R0=new P,Fi=new P,Uo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=R0}=r;cc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),hc=this._renderer.getActiveMipmapLevel(),dc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(cc,uc,hc),this._renderer.xr.enabled=dc,e.scissorTest=!1,Es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fi||e.mapping===Li?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),hc=this._renderer.getActiveMipmapLevel(),dc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:An,format:pn,colorSpace:Gs,depthBuffer:!1},s=vh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vh(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=C0(r)),this._blurMaterial=I0(r,e,t),this._ggxMaterial=P0(r,e,t)}return s}_compileMaterial(e){let t=new Ee(new ut,e);this._renderer.compile(t,Ar)}_sceneToCubeUV(e,t,n,s,r){let l=new ht(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(_h),f.toneMapping=Tn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ee(new fs,new Lt({name:"PMREM.Background",side:Et,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,g=M.material,p=!1,b=e.background;b?b.isColor&&(g.color.copy(b),e.background=null,p=!0):(g.color.copy(_h),p=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[A],r.y,r.z)):v===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[A]));let w=this._cubeSize;Es(s,v*w,A>2?w:0,w,w),f.setRenderTarget(s),p&&f.render(M,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===fi||e.mapping===Li;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Es(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ar)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:m}=this,M=this._sizeLods[n],g=3*M*(n>m-Ts?n-m+Ts:0),p=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=m-t,Es(r,g,p,3*M,2*M),s.setRenderTarget(r),s.render(o,Ar),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Es(e,g,p,3*M,2*M),s.setRenderTarget(e),s.render(o,Ar)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],f=3*u*(s>this._lodMax-Ts?s-this._lodMax+Ts:0),h=4*(this._cubeSize-u);Es(t,f,h,3*u,2*u),a.setRenderTarget(t),a.render(l,Ar)}};function C0(i){let e=[],t=[],n=i,s=i-Ts+1+T0;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,m=new Float32Array(d*h*f),M=new Float32Array(d*h*f);for(let p=0;p<f;p++){let b=p%3*2/3-1,A=p>2?0:-1,v=[b,A,0,b+2/3,A,0,b+2/3,A+1,0,b,A,0,b+2/3,A+1,0,b,A+1,0];m.set(v,d*h*p);for(let w=0;w<h;w++){let S=u[w*2]*2-1,C=u[w*2+1]*2-1;p===0?Fi.set(1,C,S):p===1?Fi.set(-S,1,-C):p===2?Fi.set(-S,C,1):p===3?Fi.set(-1,C,-S):p===4?Fi.set(-S,-1,C):Fi.set(S,C,-1),Fi.toArray(M,(p*h+w)*d)}}let g=new ut;g.setAttribute("position",new ot(m,d)),g.setAttribute("outputDirection",new ot(M,d)),t.push(new Ee(g,null)),n>Ts&&n--}return{lodMeshes:t,sizeLods:e}}function vh(i,e,t){let n=new nn(i,e,t);return n.texture.mapping=vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Es(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function P0(i,e,t){return new We({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:A0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Oo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function I0(i,e,t){return new We({name:"SphericalGaussianBlur",defines:{SAMPLES:w0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Oo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function yh(){return new We({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oo(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Mh(){return new We({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Oo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Fo=class extends nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new $s(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fs(5,5,5),r=new We({name:"CubemapFromEquirect",uniforms:Ui(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Et,blending:zn});r.uniforms.tEquirect.value=t;let a=new Ee(s,r),o=t.minFilter;return t.minFilter===pi&&(t.minFilter=Ut),new Ha(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function L0(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){let d=h.mapping;if(d===ka||d===Wa)if(e.has(h)){let m=e.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let M=new Fo(m.height);return M.fromEquirectangularTexture(i,h),e.set(h,M),h.addEventListener("dispose",c),o(M.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let d=h.mapping,m=d===ka||d===Wa,M=d===fi||d===Li;if(m||M){let g=t.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new Uo(i)),g=m?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let b=h.image;return m&&b&&b.height>0||M&&b&&l(b)?(n===null&&(n=new Uo(i)),g=m?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,d){return d===ka?h.mapping=fi:d===Wa&&(h.mapping=Li),h}function l(h){let d=0,m=6;for(let M=0;M<m;M++)h[M]!==void 0&&d++;return d===m}function c(h){let d=h.target;d.removeEventListener("dispose",c);let m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function N0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ei("WebGLRenderer: "+n+" extension not supported."),s}}}function D0(i,e,t,n){let s={},r=new WeakMap;function a(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",a),delete s[h.id];let d=r.get(h);d&&(e.remove(d),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)e.update(h[d],i.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,m=f.attributes.position,M=0;if(m===void 0)return;if(d!==null){let b=d.array;M=d.version;for(let A=0,v=b.length;A<v;A+=3){let w=b[A+0],S=b[A+1],C=b[A+2];h.push(w,S,S,C,C,w)}}else{let b=m.array;M=m.version;for(let A=0,v=b.length/3-1;A<v;A+=3){let w=A+0,S=A+1,C=A+2;h.push(w,S,S,C,C,w)}}let g=new(m.count>=65535?Js:Zs)(h,1);g.version=M;let p=r.get(f);p&&e.remove(p),r.set(f,g)}function u(f){let h=r.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function U0(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,r,f*a),t.update(h,n,1)}function c(f,h,d){d!==0&&(i.drawElementsInstanced(n,h,r,f*a,d),t.update(h,n,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,d);let M=0;for(let g=0;g<d;g++)M+=h[g];t.update(M,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function F0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ve("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function B0(i,e,t){let n=new WeakMap,s=new Tt;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==f){let y=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",y)};h!==void 0&&h.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],A=0;d===!0&&(A=1),m===!0&&(A=2),M===!0&&(A=3);let v=o.attributes.position.count*A,w=1;v>e.maxTextureSize&&(w=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let S=new Float32Array(v*w*4*f),C=new Xs(S,v,w,f);C.type=fn,C.needsUpdate=!0;let _=A*4;for(let R=0;R<f;R++){let L=g[R],I=p[R],B=b[R],U=v*w*4*R;for(let G=0;G<L.count;G++){let K=G*_;d===!0&&(s.fromBufferAttribute(L,G),S[U+K+0]=s.x,S[U+K+1]=s.y,S[U+K+2]=s.z,S[U+K+3]=0),m===!0&&(s.fromBufferAttribute(I,G),S[U+K+4]=s.x,S[U+K+5]=s.y,S[U+K+6]=s.z,S[U+K+7]=0),M===!0&&(s.fromBufferAttribute(B,G),S[U+K+8]=s.x,S[U+K+9]=s.y,S[U+K+10]=s.z,S[U+K+11]=B.itemSize===4?s.w:1)}}h={count:f,texture:C,size:new Te(v,w)},n.set(o,h),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let M=0;M<c.length;M++)d+=c[M];let m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function O0(i,e,t,n,s){let r=new WeakMap;function a(c){let u=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var z0={[Bl]:"LINEAR_TONE_MAPPING",[Ol]:"REINHARD_TONE_MAPPING",[zl]:"CINEON_TONE_MAPPING",[_r]:"ACES_FILMIC_TONE_MAPPING",[Vl]:"AGX_TONE_MAPPING",[Gl]:"NEUTRAL_TONE_MAPPING",[Hl]:"CUSTOM_TONE_MAPPING"};function H0(i,e,t,n,s,r){let a=new nn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new ut;c.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new st([0,2,0,0,2,0],2));let u=new Aa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Ee(c,u),h=new ui(-1,1,1,-1,0,1),d=null,m=null,M=!1,g,p=null,b=[],A=!1;this.setSize=function(v,w){a.setSize(v,w),o!==null&&o.setSize(v,w),l!==null&&l.setSize(v,w);for(let S=0;S<b.length;S++){let C=b[S];C.setSize&&C.setSize(v,w)}},this.setEffects=function(v){b=v,A=b.length>0&&b[0].isRenderPass===!0;let w=a.width,S=a.height;b.length>0&&o===null&&(o=new nn(w,S,{type:An,depthBuffer:!1,stencilBuffer:!1}),l=new nn(w,S,{type:An,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<b.length;C++){let _=b[C];_.setSize&&_.setSize(w,S)}},this.begin=function(v,w){if(M||v.toneMapping===Tn&&b.length===0)return!1;if(p=w,w!==null){let S=w.width,C=w.height;(a.width!==S||a.height!==C)&&this.setSize(S,C)}return A===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=Tn,!0},this.hasRenderPass=function(){return A},this.end=function(v,w){v.toneMapping=g,M=!0;let S=a,C=o;for(let _=0;_<b.length;_++){let y=b[_];y.enabled!==!1&&(y.render(v,C,S,w),y.needsSwap!==!1&&(S=C,C=C===o?l:o))}if(d!==v.outputColorSpace||m!==v.toneMapping){d=v.outputColorSpace,m=v.toneMapping,u.defines={},at.getTransfer(d)===pt&&(u.defines.SRGB_TRANSFER="");let _=z0[m];_&&(u.defines[_]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=S.texture,v.setRenderTarget(p),v.render(f,h),p=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Vh=new en,mc=new ri(1,1),Gh=new Xs,kh=new _a,Wh=new $s,Sh=[],bh=[],Eh=new Float32Array(16),Th=new Float32Array(9),wh=new Float32Array(4);function As(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Sh[s];if(r===void 0&&(r=new Float32Array(s),Sh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Bt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function zo(i,e){let t=bh[e];t===void 0&&(t=new Int32Array(e),bh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function V0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function G0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function k0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Bt(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function W0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function X0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;wh.set(n),i.uniformMatrix2fv(this.addr,!1,wh),Ot(t,n)}}function q0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;Th.set(n),i.uniformMatrix3fv(this.addr,!1,Th),Ot(t,n)}}function Y0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Bt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Bt(t,n))return;Eh.set(n),i.uniformMatrix4fv(this.addr,!1,Eh),Ot(t,n)}}function Z0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function J0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function K0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function $0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function j0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Q0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Bt(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function eg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Bt(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function tg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Bt(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function ng(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(mc.compareFunction=t.isReversedDepthBuffer()?Lo:Io,r=mc):r=Vh,t.setTexture2D(e||r,s)}function ig(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||kh,s)}function sg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Wh,s)}function rg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Gh,s)}function ag(i){switch(i){case 5126:return V0;case 35664:return G0;case 35665:return k0;case 35666:return W0;case 35674:return X0;case 35675:return q0;case 35676:return Y0;case 5124:case 35670:return Z0;case 35667:case 35671:return J0;case 35668:case 35672:return K0;case 35669:case 35673:return $0;case 5125:return j0;case 36294:return Q0;case 36295:return eg;case 36296:return tg;case 35678:case 36198:case 36298:case 36306:case 35682:return ng;case 35679:case 36299:case 36307:return ig;case 35680:case 36300:case 36308:case 36293:return sg;case 36289:case 36303:case 36311:case 36292:return rg}}function og(i,e){i.uniform1fv(this.addr,e)}function lg(i,e){let t=As(e,this.size,2);i.uniform2fv(this.addr,t)}function cg(i,e){let t=As(e,this.size,3);i.uniform3fv(this.addr,t)}function ug(i,e){let t=As(e,this.size,4);i.uniform4fv(this.addr,t)}function hg(i,e){let t=As(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dg(i,e){let t=As(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function fg(i,e){let t=As(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function pg(i,e){i.uniform1iv(this.addr,e)}function mg(i,e){i.uniform2iv(this.addr,e)}function gg(i,e){i.uniform3iv(this.addr,e)}function xg(i,e){i.uniform4iv(this.addr,e)}function _g(i,e){i.uniform1uiv(this.addr,e)}function vg(i,e){i.uniform2uiv(this.addr,e)}function yg(i,e){i.uniform3uiv(this.addr,e)}function Mg(i,e){i.uniform4uiv(this.addr,e)}function Sg(i,e,t){let n=this.cache,s=e.length,r=zo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=mc:a=Vh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function bg(i,e,t){let n=this.cache,s=e.length,r=zo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||kh,r[a])}function Eg(i,e,t){let n=this.cache,s=e.length,r=zo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Wh,r[a])}function Tg(i,e,t){let n=this.cache,s=e.length,r=zo(t,s);Bt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Gh,r[a])}function wg(i){switch(i){case 5126:return og;case 35664:return lg;case 35665:return cg;case 35666:return ug;case 35674:return hg;case 35675:return dg;case 35676:return fg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return xg;case 5125:return _g;case 36294:return vg;case 36295:return yg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return Sg;case 35679:case 36299:case 36307:return bg;case 35680:case 36300:case 36308:case 36293:return Eg;case 36289:case 36303:case 36311:case 36292:return Tg}}var gc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ag(t.type)}},xc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wg(t.type)}},_c=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},fc=/(\w+)(\])?(\[|\.)?/g;function Ah(i,e){i.seq.push(e),i.map[e.id]=e}function Ag(i,e,t){let n=i.name,s=n.length;for(fc.lastIndex=0;;){let r=fc.exec(n),a=fc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ah(t,c===void 0?new gc(o,i,e):new xc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new _c(o),Ah(t,f)),t=f}}}var ws=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ag(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Rh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Rg=37297,Cg=0;function Pg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Ch=new qe;function Ig(i){at._getMatrix(Ch,at.workingColorSpace,i);let e=`mat3( ${Ch.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(i)){case ks:return[e,"LinearTransferOETF"];case pt:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ph(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Pg(i.getShaderSource(e),o)}else return r}function Lg(i,e){let t=Ig(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Ng={[Bl]:"Linear",[Ol]:"Reinhard",[zl]:"Cineon",[_r]:"ACESFilmic",[Vl]:"AgX",[Gl]:"Neutral",[Hl]:"Custom"};function Dg(i,e){let t=Ng[e];return t===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Do=new P;function Ug(){at.getLuminanceCoefficients(Do);let i=Do.x.toFixed(4),e=Do.y.toFixed(4),t=Do.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Fg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cr).join(`
`)}function Bg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Og(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Cr(i){return i!==""}function Ih(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Lh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var zg=/^[ \t]*#include +<([\w\d./]+)>/gm;function vc(i){return i.replace(zg,Vg)}var Hg=new Map;function Vg(i,e){let t=Qe[e];if(t===void 0){let n=Hg.get(e);if(n!==void 0)t=Qe[n],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return vc(t)}var Gg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nh(i){return i.replace(Gg,kg)}function kg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Dh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var Wg={[xr]:"SHADOWMAP_TYPE_PCF",[ys]:"SHADOWMAP_TYPE_VSM"};function Xg(i){return Wg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var qg={[fi]:"ENVMAP_TYPE_CUBE",[Li]:"ENVMAP_TYPE_CUBE",[vr]:"ENVMAP_TYPE_CUBE_UV"};function Yg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":qg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Zg={[Li]:"ENVMAP_MODE_REFRACTION"};function Jg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Zg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Kg={[Fl]:"ENVMAP_BLENDING_MULTIPLY",[Yu]:"ENVMAP_BLENDING_MIX",[Zu]:"ENVMAP_BLENDING_ADD"};function $g(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Kg[i.combine]||"ENVMAP_BLENDING_NONE"}function jg(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Qg(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Xg(t),c=Yg(t),u=Jg(t),f=$g(t),h=jg(t),d=Fg(t),m=Bg(r),M=s.createProgram(),g,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Cr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Cr).join(`
`),p.length>0&&(p+=`
`)):(g=[Dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cr).join(`
`),p=[Dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tn?"#define TONE_MAPPING":"",t.toneMapping!==Tn?Qe.tonemapping_pars_fragment:"",t.toneMapping!==Tn?Dg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,Lg("linearToOutputTexel",t.outputColorSpace),Ug(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cr).join(`
`)),a=vc(a),a=Ih(a,t),a=Lh(a,t),o=vc(o),o=Ih(o,t),o=Lh(o,t),a=Nh(a),o=Nh(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let A=b+g+a,v=b+p+o,w=Rh(s,s.VERTEX_SHADER,A),S=Rh(s,s.FRAGMENT_SHADER,v);s.attachShader(M,w),s.attachShader(M,S),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function C(L){if(i.debug.checkShaderErrors){let I=s.getProgramInfoLog(M)||"",B=s.getShaderInfoLog(w)||"",U=s.getShaderInfoLog(S)||"",G=I.trim(),K=B.trim(),V=U.trim(),Z=!0,k=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,w,S);else{let j=Ph(s,w,"vertex"),ee=Ph(s,S,"fragment");Ve("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+G+`
`+j+`
`+ee)}else G!==""?Oe("WebGLProgram: Program Info Log:",G):(K===""||V==="")&&(k=!1);k&&(L.diagnostics={runnable:Z,programLog:G,vertexShader:{log:K,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(w),s.deleteShader(S),_=new ws(s,M),y=Og(s,M)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(M,Rg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Cg++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=S,this}var ex=0,yc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Mc(e),t.set(e,n)),n}},Mc=class{constructor(e){this.id=ex++,this.code=e,this.usedTimes=0}};function tx(i){return i===gi||i===Tr||i===wr}function nx(i,e,t,n,s,r){let a=new qs,o=new yc,l=new Set,c=[],u=new Map,f=n.logarithmicDepthBuffer,h=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function M(_,y,R,L,I,B){let U=L.fog,G=I.geometry,K=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?L.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Z=e.get(_.envMap||K,V),k=Z&&Z.mapping===vr?Z.image.height:null,j=d[_.type];_.precision!==null&&(h=n.getMaxPrecision(_.precision),h!==_.precision&&Oe("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let ee=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Se=ee!==void 0?ee.length:0,ye=0;G.morphAttributes.position!==void 0&&(ye=1),G.morphAttributes.normal!==void 0&&(ye=2),G.morphAttributes.color!==void 0&&(ye=3);let et,Xe,Ye,te;if(j){let yt=Vn[j];et=yt.vertexShader,Xe=yt.fragmentShader}else{et=_.vertexShader,Xe=_.fragmentShader;let yt=o.getVertexShaderStage(_),dt=o.getFragmentShaderStage(_);o.update(_,yt,dt),Ye=yt.id,te=dt.id}let ne=i.getRenderTarget(),he=i.state.buffers.depth.getReversed(),Fe=I.isInstancedMesh===!0,de=I.isBatchedMesh===!0,Ge=!!_.map,mt=!!_.matcap,ke=!!Z,nt=!!_.aoMap,lt=!!_.lightMap,ae=!!_.bumpMap&&_.wireframe===!1,ie=!!_.normalMap,Ie=!!_.displacementMap,ze=!!_.emissiveMap,Ne=!!_.metalnessMap,_e=!!_.roughnessMap,F=_.anisotropy>0,Ke=_.clearcoat>0,J=_.dispersion>0,E=_.retroreflectivity>0,x=_.iridescence>0,D=_.sheen>0,N=_.transmission>0,z=F&&!!_.anisotropyMap,re=Ke&&!!_.clearcoatMap,oe=Ke&&!!_.clearcoatNormalMap,q=Ke&&!!_.clearcoatRoughnessMap,Q=x&&!!_.iridescenceMap,ce=x&&!!_.iridescenceThicknessMap,we=D&&!!_.sheenColorMap,ue=D&&!!_.sheenRoughnessMap,fe=!!_.specularMap,Ue=!!_.specularColorMap,He=!!_.specularIntensityMap,Ze=N&&!!_.transmissionMap,H=N&&!!_.thicknessMap,pe=!!_.gradientMap,se=!!_.alphaMap,me=_.alphaTest>0,be=!!_.alphaHash,le=!!_.extensions,Be=Tn;_.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Be=i.toneMapping);let Le={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:et,fragmentShader:Xe,defines:_.defines,customVertexShaderID:Ye,customFragmentShaderID:te,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:de,batchingColor:de&&I._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&I.instanceColor!==null,instancingMorph:Fe&&I.morphTexture!==null,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:at.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ge,matcap:mt,envMap:ke,envMapMode:ke&&Z.mapping,envMapCubeUVHeight:k,aoMap:nt,lightMap:lt,bumpMap:ae,normalMap:ie,displacementMap:Ie,emissiveMap:ze,normalMapObjectSpace:ie&&_.normalMapType===$u,normalMapTangentSpace:ie&&_.normalMapType===Po,packedNormalMap:ie&&_.normalMapType===Po&&tx(_.normalMap.format),metalnessMap:Ne,roughnessMap:_e,anisotropy:F,anisotropyMap:z,clearcoat:Ke,clearcoatMap:re,clearcoatNormalMap:oe,clearcoatRoughnessMap:q,dispersion:J,retroreflection:E,iridescence:x,iridescenceMap:Q,iridescenceThicknessMap:ce,sheen:D,sheenColorMap:we,sheenRoughnessMap:ue,specularMap:fe,specularColorMap:Ue,specularIntensityMap:He,transmission:N,transmissionMap:Ze,thicknessMap:H,gradientMap:pe,opaque:_.transparent===!1&&_.blending===Ms&&_.alphaToCoverage===!1,alphaMap:se,alphaTest:me,alphaHash:be,combine:_.combine,mapUv:Ge&&m(_.map.channel),aoMapUv:nt&&m(_.aoMap.channel),lightMapUv:lt&&m(_.lightMap.channel),bumpMapUv:ae&&m(_.bumpMap.channel),normalMapUv:ie&&m(_.normalMap.channel),displacementMapUv:Ie&&m(_.displacementMap.channel),emissiveMapUv:ze&&m(_.emissiveMap.channel),metalnessMapUv:Ne&&m(_.metalnessMap.channel),roughnessMapUv:_e&&m(_.roughnessMap.channel),anisotropyMapUv:z&&m(_.anisotropyMap.channel),clearcoatMapUv:re&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:oe&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:q&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:ue&&m(_.sheenRoughnessMap.channel),specularMapUv:fe&&m(_.specularMap.channel),specularColorMapUv:Ue&&m(_.specularColorMap.channel),specularIntensityMapUv:He&&m(_.specularIntensityMap.channel),transmissionMapUv:Ze&&m(_.transmissionMap.channel),thicknessMapUv:H&&m(_.thicknessMap.channel),alphaMapUv:se&&m(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ie||F),vertexNormals:!!G.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!G.attributes.uv&&(Ge||se),fog:!!U,useFog:_.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||G.attributes.normal===void 0&&ie===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:he,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:ye,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Be,decodeVideoTexture:Ge&&_.map.isVideoTexture===!0&&at.getTransfer(_.map.colorSpace)===pt,decodeVideoTextureEmissive:ze&&_.emissiveMap.isVideoTexture===!0&&at.getTransfer(_.emissiveMap.colorSpace)===pt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===wt,flipSided:_.side===Et,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:le&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&_.extensions.multiDraw===!0||de)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Le.vertexUv1s=l.has(1),Le.vertexUv2s=l.has(2),Le.vertexUv3s=l.has(3),l.clear(),Le}function g(_){let y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)y.push(R),y.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(y,_),b(y,_),y.push(i.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function p(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapCubeUVHeight),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.morphAttributeCount),_.push(y.numSunLights),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numSunLightShadows),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function b(_,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){let y=d[_.type],R;if(y){let L=Vn[y];R=mh.clone(L.uniforms)}else R=_.uniforms;return R}function v(_,y){let R=u.get(y);return R!==void 0?++R.usedTimes:(R=new Qg(i,y,_,s),c.push(R),u.set(y,R)),R}function w(_){if(--_.usedTimes===0){let y=c.indexOf(_);c[y]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function S(_){o.remove(_)}function C(){o.dispose()}return{getParameters:M,getProgramCacheKey:g,getUniforms:A,acquireProgram:v,releaseProgram:w,releaseShaderCache:S,programs:c,dispose:C}}function ix(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function sx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Uh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Fh(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,m,M,g,p){let b=i[e];return b===void 0?(b={id:h.id,object:h,geometry:d,material:m,materialVariant:a(h),groupOrder:M,renderOrder:h.renderOrder,z:g,group:p},i[e]=b):(b.id=h.id,b.object=h,b.geometry=d,b.material=m,b.materialVariant=a(h),b.groupOrder=M,b.renderOrder=h.renderOrder,b.z=g,b.group=p),e++,b}function l(h,d,m,M,g,p,b){b.reversedDepth===!0&&(g=-g);let A=o(h,d,m,M,g,p);m.transmission>0?n.push(A):m.transparent===!0?s.push(A):t.push(A)}function c(h,d,m,M,g,p){let b=o(h,d,m,M,g,p);m.transmission>0?n.unshift(b):m.transparent===!0?s.unshift(b):t.unshift(b)}function u(h,d){t.length>1&&t.sort(h||sx),n.length>1&&n.sort(d||Uh),s.length>1&&s.sort(d||Uh)}function f(){for(let h=e,d=i.length;h<d;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:u}}function rx(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Fh,i.set(n,[a])):s>=r.length?(a=new Fh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function ax(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new ge};break;case"SpotLight":t={position:new P,direction:new P,color:new ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ge,groundColor:new ge};break;case"RectAreaLight":t={color:new ge,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function ox(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var lx=0;function cx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ux(i){let e=new ax,t=ox(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new tt,a=new tt;function o(c){let u=0,f=0,h=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let d=0,m=0,M=0,g=0,p=0,b=0,A=0,v=0,w=0,S=0,C=0,_=0,y=0,R=0;c.sort(cx);for(let I=0,B=c.length;I<B;I++){let U=c[I],G=U.color,K=U.intensity,V=U.distance,Z=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===gi?Z=U.shadow.map.texture:Z=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=G.r*K,f+=G.g*K,h+=G.b*K;else if(U.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(U.sh.coefficients[k],K);R++}else if(U.isSunLight){let k=e.get(U);if(k.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[m]=ee,n.sunShadowMap[m]=Z;let Se=j.getViewportCount();for(let ye=0;ye<Se;ye++)n.sunShadowMatrix[M+ye]=j.getMatrix(ye),n.sunShadowCascade[M+ye]=j._cascadeData[ye];M+=Se,m++}n.sun[d]=k,d++}else if(U.isDirectionalLight){let k=e.get(U);if(k.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,n.directionalShadow[g]=ee,n.directionalShadowMap[g]=Z,n.directionalShadowMatrix[g]=U.shadow.matrix,w++}n.directional[g]=k,g++}else if(U.isSpotLight){let k=e.get(U);k.position.setFromMatrixPosition(U.matrixWorld),k.color.copy(G).multiplyScalar(K),k.distance=V,k.coneCos=Math.cos(U.angle),k.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),k.decay=U.decay,n.spot[b]=k;let j=U.shadow;if(U.map&&(n.spotLightMap[_]=U.map,_++,j.updateMatrices(U),U.castShadow&&y++),n.spotLightMatrix[b]=j.matrix,U.castShadow){let ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,n.spotShadow[b]=ee,n.spotShadowMap[b]=Z,C++}b++}else if(U.isRectAreaLight){let k=e.get(U);k.color.copy(G).multiplyScalar(K),k.halfWidth.set(U.width*.5,0,0),k.halfHeight.set(0,U.height*.5,0),n.rectArea[A]=k,A++}else if(U.isPointLight){let k=e.get(U);if(k.color.copy(U.color).multiplyScalar(U.intensity),k.distance=U.distance,k.decay=U.decay,U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,ee.shadowCameraNear=j.camera.near,ee.shadowCameraFar=j.camera.far,n.pointShadow[p]=ee,n.pointShadowMap[p]=Z,n.pointShadowMatrix[p]=U.shadow.matrix,S++}n.point[p]=k,p++}else if(U.isHemisphereLight){let k=e.get(U);k.skyColor.copy(U.color).multiplyScalar(K),k.groundColor.copy(U.groundColor).multiplyScalar(K),n.hemi[v]=k,v++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;let L=n.hash;(L.sunLength!==d||L.directionalLength!==g||L.pointLength!==p||L.spotLength!==b||L.rectAreaLength!==A||L.hemiLength!==v||L.numSunShadows!==m||L.numDirectionalShadows!==w||L.numPointShadows!==S||L.numSpotShadows!==C||L.numSpotMaps!==_||L.numLightProbes!==R)&&(n.sun.length=d,n.directional.length=g,n.spot.length=b,n.rectArea.length=A,n.point.length=p,n.hemi.length=v,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-y,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=R,L.sunLength=d,L.directionalLength=g,L.pointLength=p,L.spotLength=b,L.rectAreaLength=A,L.hemiLength=v,L.numSunShadows=m,L.numDirectionalShadows=w,L.numPointShadows=S,L.numSpotShadows=C,L.numSpotMaps=_,L.numLightProbes=R,n.version=lx++)}function l(c,u){let f=0,h=0,d=0,m=0,M=0,g=0,p=u.matrixWorldInverse;for(let b=0,A=c.length;b<A;b++){let v=c[b];if(v.isSunLight){let w=n.sun[f];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),f++}else if(v.isDirectionalLight){let w=n.directional[h];w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),h++}else if(v.isSpotLight){let w=n.spot[m];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let w=n.rectArea[M];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),M++}else if(v.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:n}}function Bh(i){let e=new ux(i),t=[],n=[],s=[];function r(h){f.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function hx(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Bh(i),e.set(s,[o])):r>=a.length?(o=new Bh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var dx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,px=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],mx=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Oh=new tt,Rr=new P,pc=new P;function gx(i,e,t){let n=new us,s=new Te,r=new Te,a=new Tt,o=new Ra,l=new Ca,c={},u=t.maxTextureSize,f={[di]:Et,[Et]:di,[wt]:wt},h=new We({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:dx,fragmentShader:fx}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let m=new ut;m.setAttribute("position",new ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Ee(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xr;let p=this.type;this.render=function(S,C,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;this.type===Ru&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=xr);let y=i.getRenderTarget(),R=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),I=i.state;I.setBlending(zn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let B=p!==this.type;B&&C.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(G=>G.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,G=S.length;U<G;U++){let K=S[U],V=K.shadow;if(V===void 0){Oe("WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let Z=V.getFrameExtents();s.multiply(Z),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Z.x),s.x=r.x*Z.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Z.y),s.y=r.y*Z.y,V.mapSize.y=r.y));let k=i.state.buffers.depth.getReversed();if(V.camera._reversedDepth=k,V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===ys){if(K.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new nn(s.x,s.y,{format:gi,type:An,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),V.map.texture.name=K.name+".shadowMap",V.map.depthTexture=new ri(s.x,s.y,fn),V.map.depthTexture.name=K.name+".shadowMapDepth",V.map.depthTexture.format=Nn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt}else K.isPointLight?(V.map=new Fo(s.x),V.map.depthTexture=new Ma(s.x,wn)):(V.map=new nn(s.x,s.y),V.map.depthTexture=new ri(s.x,s.y,wn)),V.map.depthTexture.name=K.name+".shadowMap",V.map.depthTexture.format=Nn,this.type===xr?(V.map.depthTexture.compareFunction=k?Lo:Io,V.map.depthTexture.minFilter=Ut,V.map.depthTexture.magFilter=Ut):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Vt,V.map.depthTexture.magFilter=Vt);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==s.x||V.map.height!==s.y)&&V.map.setSize(s.x,s.y);let j=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();K.isPointLight!==!0&&V.updateMatrices(K,_);for(let ee=0;ee<j;ee++){let Se=V.getCamera(ee);if(K.isPointLight){let ye=V.camera,et=V.matrix,Xe=K.distance||ye.far;Xe!==ye.far&&(ye.far=Xe,ye.updateProjectionMatrix()),Rr.setFromMatrixPosition(K.matrixWorld),ye.position.copy(Rr),pc.copy(ye.position),pc.add(px[ee]),ye.up.copy(mx[ee]),ye.lookAt(pc),ye.updateMatrixWorld(),et.makeTranslation(-Rr.x,-Rr.y,-Rr.z),Oh.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Oh,ye.coordinateSystem,ye.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)i.setRenderTarget(V.map,ee),i.clear();else{ee===0&&(i.setRenderTarget(V.map),i.clear());let ye=V.getViewport(ee);a.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),I.viewport(a)}n=V.getFrustum(ee),v(C,_,Se,K,this.type)}V.isPointLightShadow!==!0&&this.type===ys&&b(V,_),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,R,L)};function b(S,C){let _=e.update(M);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null?S.mapPass=new nn(s.x,s.y,{format:gi,type:An}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),h.uniforms.shadow_pass.value=S.map.depthTexture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(C,null,_,h,M,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(C,null,_,d,M,null)}function A(S,C,_,y){let R=null,L=_.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(L!==void 0)R=L;else if(R=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let I=R.uuid,B=C.uuid,U=c[I];U===void 0&&(U={},c[I]=U);let G=U[B];G===void 0&&(G=R.clone(),U[B]=G,C.addEventListener("dispose",w)),R=G}if(R.visible=C.visible,R.wireframe=C.wireframe,y===ys?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:f[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let I=i.properties.get(R);I.light=_}return R}function v(S,C,_,y,R){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&R===ys)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,S.matrixWorld);let B=e.update(S),U=S.material;if(Array.isArray(U)){let G=B.groups;for(let K=0,V=G.length;K<V;K++){let Z=G[K],k=U[Z.materialIndex];if(k&&k.visible){let j=A(S,k,y,R);S.onBeforeShadow(i,S,C,_,B,j,Z),i.renderBufferDirect(_,null,B,j,S,Z),S.onAfterShadow(i,S,C,_,B,j,Z)}}}else if(U.visible){let G=A(S,U,y,R);S.onBeforeShadow(i,S,C,_,B,G,null),i.renderBufferDirect(_,null,B,G,S,null),S.onAfterShadow(i,S,C,_,B,G,null)}}let I=S.children;for(let B=0,U=I.length;B<U;B++)v(I[B],C,_,y,R)}function w(S){S.target.removeEventListener("dispose",w);for(let _ in c){let y=c[_],R=S.target.uuid;R in y&&(y[R].dispose(),delete y[R])}}}function xx(i,e){function t(){let H=!1,pe=new Tt,se=null,me=new Tt(0,0,0,0);return{setMask:function(be){se!==be&&!H&&(i.colorMask(be,be,be,be),se=be)},setLocked:function(be){H=be},setClear:function(be,le,Be,Le,yt){yt===!0&&(be*=Le,le*=Le,Be*=Le),pe.set(be,le,Be,Le),me.equals(pe)===!1&&(i.clearColor(be,le,Be,Le),me.copy(pe))},reset:function(){H=!1,se=null,me.set(-1,0,0,0)}}}function n(){let H=!1,pe=!1,se=null,me=null,be=null;return{setReversed:function(le){if(pe!==le){let Be=e.get("EXT_clip_control");le?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT),pe=le;let Le=be;be=null,this.setClear(Le)}},getReversed:function(){return pe},setTest:function(le){le?ne(i.DEPTH_TEST):he(i.DEPTH_TEST)},setMask:function(le){se!==le&&!H&&(i.depthMask(le),se=le)},setFunc:function(le){if(pe&&(le=ch[le]),me!==le){switch(le){case oa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case ns:i.depthFunc(i.LEQUAL);break;case ua:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}me=le}},setLocked:function(le){H=le},setClear:function(le){be!==le&&(be=le,pe&&(le=1-le),i.clearDepth(le))},reset:function(){H=!1,se=null,me=null,be=null,pe=!1}}}function s(){let H=!1,pe=null,se=null,me=null,be=null,le=null,Be=null,Le=null,yt=null;return{setTest:function(dt){H||(dt?ne(i.STENCIL_TEST):he(i.STENCIL_TEST))},setMask:function(dt){pe!==dt&&!H&&(i.stencilMask(dt),pe=dt)},setFunc:function(dt,_n,Cn){(se!==dt||me!==_n||be!==Cn)&&(i.stencilFunc(dt,_n,Cn),se=dt,me=_n,be=Cn)},setOp:function(dt,_n,Cn){(le!==dt||Be!==_n||Le!==Cn)&&(i.stencilOp(dt,_n,Cn),le=dt,Be=_n,Le=Cn)},setLocked:function(dt){H=dt},setClear:function(dt){yt!==dt&&(i.clearStencil(dt),yt=dt)},reset:function(){H=!1,pe=null,se=null,me=null,be=null,le=null,Be=null,Le=null,yt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,m=[],M=null,g=!1,p=null,b=null,A=null,v=null,w=null,S=null,C=null,_=new ge(0,0,0),y=0,R=!1,L=null,I=null,B=null,U=null,G=null,K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,Z=0,k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(k)[1]),V=Z>=1):k.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),V=Z>=2);let j=null,ee={},Se=i.getParameter(i.SCISSOR_BOX),ye=i.getParameter(i.VIEWPORT),et=new Tt().fromArray(Se),Xe=new Tt().fromArray(ye);function Ye(H,pe,se,me){let be=new Uint8Array(4),le=i.createTexture();i.bindTexture(H,le),i.texParameteri(H,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(H,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Be=0;Be<se;Be++)H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,me,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(pe+Be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return le}let te={};te[i.TEXTURE_2D]=Ye(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=Ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=Ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=Ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(ns),ae(!1),ie(Il),ne(i.CULL_FACE),nt(zn);function ne(H){u[H]!==!0&&(i.enable(H),u[H]=!0)}function he(H){u[H]!==!1&&(i.disable(H),u[H]=!1)}function Fe(H,pe){return h[H]!==pe?(i.bindFramebuffer(H,pe),h[H]=pe,H===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pe),H===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function de(H,pe){let se=m,me=!1;if(H){se=d.get(pe),se===void 0&&(se=[],d.set(pe,se));let be=H.textures;if(se.length!==be.length||se[0]!==i.COLOR_ATTACHMENT0){for(let le=0,Be=be.length;le<Be;le++)se[le]=i.COLOR_ATTACHMENT0+le;se.length=be.length,me=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,me=!0);me&&i.drawBuffers(se)}function Ge(H){return M!==H?(i.useProgram(H),M=H,!0):!1}let mt={[Ii]:i.FUNC_ADD,[Pu]:i.FUNC_SUBTRACT,[Iu]:i.FUNC_REVERSE_SUBTRACT};mt[Lu]=i.MIN,mt[Nu]=i.MAX;let ke={[Du]:i.ZERO,[Uu]:i.ONE,[Fu]:i.SRC_COLOR,[Dl]:i.SRC_ALPHA,[Gu]:i.SRC_ALPHA_SATURATE,[Hu]:i.DST_COLOR,[Ou]:i.DST_ALPHA,[Bu]:i.ONE_MINUS_SRC_COLOR,[Ul]:i.ONE_MINUS_SRC_ALPHA,[Vu]:i.ONE_MINUS_DST_COLOR,[zu]:i.ONE_MINUS_DST_ALPHA,[ku]:i.CONSTANT_COLOR,[Wu]:i.ONE_MINUS_CONSTANT_COLOR,[Xu]:i.CONSTANT_ALPHA,[qu]:i.ONE_MINUS_CONSTANT_ALPHA};function nt(H,pe,se,me,be,le,Be,Le,yt,dt){if(H===zn){g===!0&&(he(i.BLEND),g=!1);return}if(g===!1&&(ne(i.BLEND),g=!0),H!==Cu){if(H!==p||dt!==R){if((b!==Ii||w!==Ii)&&(i.blendEquation(i.FUNC_ADD),b=Ii,w=Ii),dt)switch(H){case Ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vt:i.blendFunc(i.ONE,i.ONE);break;case Ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Nl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ve("WebGLState: Invalid blending: ",H);break}else switch(H){case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ll:Ve("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nl:Ve("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ve("WebGLState: Invalid blending: ",H);break}A=null,v=null,S=null,C=null,_.set(0,0,0),y=0,p=H,R=dt}return}be=be||pe,le=le||se,Be=Be||me,(pe!==b||be!==w)&&(i.blendEquationSeparate(mt[pe],mt[be]),b=pe,w=be),(se!==A||me!==v||le!==S||Be!==C)&&(i.blendFuncSeparate(ke[se],ke[me],ke[le],ke[Be]),A=se,v=me,S=le,C=Be),(Le.equals(_)===!1||yt!==y)&&(i.blendColor(Le.r,Le.g,Le.b,yt),_.copy(Le),y=yt),p=H,R=!1}function lt(H,pe){H.side===wt?he(i.CULL_FACE):ne(i.CULL_FACE);let se=H.side===Et;pe&&(se=!se),ae(se),H.blending===Ms&&H.transparent===!1?nt(zn):nt(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),r.setMask(H.colorWrite);let me=H.stencilWrite;o.setTest(me),me&&(o.setMask(H.stencilWriteMask),o.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),o.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),ze(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):he(i.SAMPLE_ALPHA_TO_COVERAGE)}function ae(H){L!==H&&(H?i.frontFace(i.CW):i.frontFace(i.CCW),L=H)}function ie(H){H!==wu?(ne(i.CULL_FACE),H!==I&&(H===Il?i.cullFace(i.BACK):H===Au?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):he(i.CULL_FACE),I=H}function Ie(H){H!==B&&(V&&i.lineWidth(H),B=H)}function ze(H,pe,se){H?(ne(i.POLYGON_OFFSET_FILL),(U!==pe||G!==se)&&(U=pe,G=se,a.getReversed()&&(pe=-pe),i.polygonOffset(pe,se))):he(i.POLYGON_OFFSET_FILL)}function Ne(H){H?ne(i.SCISSOR_TEST):he(i.SCISSOR_TEST)}function _e(H){H===void 0&&(H=i.TEXTURE0+K-1),j!==H&&(i.activeTexture(H),j=H)}function F(H,pe,se){se===void 0&&(j===null?se=i.TEXTURE0+K-1:se=j);let me=ee[se];me===void 0&&(me={type:void 0,texture:void 0},ee[se]=me),(me.type!==H||me.texture!==pe)&&(j!==se&&(i.activeTexture(se),j=se),i.bindTexture(H,pe||te[H]),me.type=H,me.texture=pe)}function Ke(){let H=ee[j];H!==void 0&&H.type!==void 0&&(i.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function J(){try{i.compressedTexImage2D(...arguments)}catch(H){Ve("WebGLState:",H)}}function E(){try{i.compressedTexImage3D(...arguments)}catch(H){Ve("WebGLState:",H)}}function x(){try{i.texSubImage2D(...arguments)}catch(H){Ve("WebGLState:",H)}}function D(){try{i.texSubImage3D(...arguments)}catch(H){Ve("WebGLState:",H)}}function N(){try{i.compressedTexSubImage2D(...arguments)}catch(H){Ve("WebGLState:",H)}}function z(){try{i.compressedTexSubImage3D(...arguments)}catch(H){Ve("WebGLState:",H)}}function re(){try{i.texStorage2D(...arguments)}catch(H){Ve("WebGLState:",H)}}function oe(){try{i.texStorage3D(...arguments)}catch(H){Ve("WebGLState:",H)}}function q(){try{i.texImage2D(...arguments)}catch(H){Ve("WebGLState:",H)}}function Q(){try{i.texImage3D(...arguments)}catch(H){Ve("WebGLState:",H)}}function ce(H){return f[H]!==void 0?f[H]:i.getParameter(H)}function we(H,pe){f[H]!==pe&&(i.pixelStorei(H,pe),f[H]=pe)}function ue(H){et.equals(H)===!1&&(i.scissor(H.x,H.y,H.z,H.w),et.copy(H))}function fe(H){Xe.equals(H)===!1&&(i.viewport(H.x,H.y,H.z,H.w),Xe.copy(H))}function Ue(H,pe){let se=c.get(pe);se===void 0&&(se=new WeakMap,c.set(pe,se));let me=se.get(H);me===void 0&&(me=i.getUniformBlockIndex(pe,H.name),se.set(H,me))}function He(H,pe){let me=c.get(pe).get(H);l.get(pe)!==me&&(i.uniformBlockBinding(pe,me,H.__bindingPointIndex),l.set(pe,me))}function Ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},j=null,ee={},h={},d=new WeakMap,m=[],M=null,g=!1,p=null,b=null,A=null,v=null,w=null,S=null,C=null,_=new ge(0,0,0),y=0,R=!1,L=null,I=null,B=null,U=null,G=null,et.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:he,bindFramebuffer:Fe,drawBuffers:de,useProgram:Ge,setBlending:nt,setMaterial:lt,setFlipSided:ae,setCullFace:ie,setLineWidth:Ie,setPolygonOffset:ze,setScissorTest:Ne,activeTexture:_e,bindTexture:F,unbindTexture:Ke,compressedTexImage2D:J,compressedTexImage3D:E,texImage2D:q,texImage3D:Q,pixelStorei:we,getParameter:ce,updateUBOMapping:Ue,uniformBlockBinding:He,texStorage2D:re,texStorage3D:oe,texSubImage2D:x,texSubImage3D:D,compressedTexSubImage2D:N,compressedTexSubImage3D:z,scissor:ue,viewport:fe,reset:Ze}}function _x(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Te,u=new WeakMap,f=new Set,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(E,x){return m?new OffscreenCanvas(E,x):Ws("canvas")}function g(E,x,D){let N=1,z=J(E);if((z.width>D||z.height>D)&&(N=D/Math.max(z.width,z.height)),N<1)if(typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&E instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&E instanceof ImageBitmap||typeof VideoFrame!="undefined"&&E instanceof VideoFrame){let re=Math.floor(N*z.width),oe=Math.floor(N*z.height);h===void 0&&(h=M(re,oe));let q=x?M(re,oe):h;return q.width=re,q.height=oe,q.getContext("2d").drawImage(E,0,0,re,oe),Oe("WebGLRenderer: Texture has been resized from ("+z.width+"x"+z.height+") to ("+re+"x"+oe+")."),q}else return"data"in E&&Oe("WebGLRenderer: Image in DataTexture is too big ("+z.width+"x"+z.height+")."),E;return E}function p(E){return E.generateMipmaps}function b(E){i.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(E,x,D,N,z,re=!1){if(E!==null){if(i[E]!==void 0)return i[E];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let oe;N&&(oe=e.get("EXT_texture_norm16"),oe||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let q=x;if(x===i.RED&&(D===i.FLOAT&&(q=i.R32F),D===i.HALF_FLOAT&&(q=i.R16F),D===i.UNSIGNED_BYTE&&(q=i.R8),D===i.UNSIGNED_SHORT&&oe&&(q=oe.R16_EXT),D===i.SHORT&&oe&&(q=oe.R16_SNORM_EXT)),x===i.RED_INTEGER&&(D===i.UNSIGNED_BYTE&&(q=i.R8UI),D===i.UNSIGNED_SHORT&&(q=i.R16UI),D===i.UNSIGNED_INT&&(q=i.R32UI),D===i.BYTE&&(q=i.R8I),D===i.SHORT&&(q=i.R16I),D===i.INT&&(q=i.R32I)),x===i.RG&&(D===i.FLOAT&&(q=i.RG32F),D===i.HALF_FLOAT&&(q=i.RG16F),D===i.UNSIGNED_BYTE&&(q=i.RG8),D===i.UNSIGNED_SHORT&&oe&&(q=oe.RG16_EXT),D===i.SHORT&&oe&&(q=oe.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(D===i.UNSIGNED_BYTE&&(q=i.RG8UI),D===i.UNSIGNED_SHORT&&(q=i.RG16UI),D===i.UNSIGNED_INT&&(q=i.RG32UI),D===i.BYTE&&(q=i.RG8I),D===i.SHORT&&(q=i.RG16I),D===i.INT&&(q=i.RG32I)),x===i.RGB_INTEGER&&(D===i.UNSIGNED_BYTE&&(q=i.RGB8UI),D===i.UNSIGNED_SHORT&&(q=i.RGB16UI),D===i.UNSIGNED_INT&&(q=i.RGB32UI),D===i.BYTE&&(q=i.RGB8I),D===i.SHORT&&(q=i.RGB16I),D===i.INT&&(q=i.RGB32I)),x===i.RGBA_INTEGER&&(D===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),D===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),D===i.UNSIGNED_INT&&(q=i.RGBA32UI),D===i.BYTE&&(q=i.RGBA8I),D===i.SHORT&&(q=i.RGBA16I),D===i.INT&&(q=i.RGBA32I)),x===i.RGB&&(D===i.UNSIGNED_SHORT&&oe&&(q=oe.RGB16_EXT),D===i.SHORT&&oe&&(q=oe.RGB16_SNORM_EXT),D===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),D===i.UNSIGNED_INT_10F_11F_11F_REV&&(q=i.R11F_G11F_B10F)),x===i.RGBA){let Q=re?ks:at.getTransfer(z);D===i.FLOAT&&(q=i.RGBA32F),D===i.HALF_FLOAT&&(q=i.RGBA16F),D===i.UNSIGNED_BYTE&&(q=Q===pt?i.SRGB8_ALPHA8:i.RGBA8),D===i.UNSIGNED_SHORT&&oe&&(q=oe.RGBA16_EXT),D===i.SHORT&&oe&&(q=oe.RGBA16_SNORM_EXT),D===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),D===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function w(E,x){let D;return E?x===null||x===wn||x===bs?D=i.DEPTH24_STENCIL8:x===fn?D=i.DEPTH32F_STENCIL8:x===Ss&&(D=i.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===wn||x===bs?D=i.DEPTH_COMPONENT24:x===fn?D=i.DEPTH_COMPONENT32F:x===Ss&&(D=i.DEPTH_COMPONENT16),D}function S(E,x){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==Vt&&E.minFilter!==Ut?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function C(E){let x=E.target;x.removeEventListener("dispose",C),y(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&f.delete(x)}function _(E){let x=E.target;x.removeEventListener("dispose",_),L(x)}function y(E){let x=n.get(E);if(x.__webglInit===void 0)return;let D=E.source,N=d.get(D);if(N){let z=N[x.__cacheKey];z.usedTimes--,z.usedTimes===0&&R(E),Object.keys(N).length===0&&d.delete(D)}n.remove(E)}function R(E){let x=n.get(E);i.deleteTexture(x.__webglTexture);let D=E.source,N=d.get(D);delete N[x.__cacheKey],a.memory.textures--}function L(E){let x=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let N=0;N<6;N++){if(Array.isArray(x.__webglFramebuffer[N]))for(let z=0;z<x.__webglFramebuffer[N].length;z++)i.deleteFramebuffer(x.__webglFramebuffer[N][z]);else i.deleteFramebuffer(x.__webglFramebuffer[N]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[N])}else{if(Array.isArray(x.__webglFramebuffer))for(let N=0;N<x.__webglFramebuffer.length;N++)i.deleteFramebuffer(x.__webglFramebuffer[N]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let N=0;N<x.__webglColorRenderbuffer.length;N++)x.__webglColorRenderbuffer[N]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[N]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let D=E.textures;for(let N=0,z=D.length;N<z;N++){let re=n.get(D[N]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(D[N])}n.remove(E)}let I=0;function B(){I=0}function U(){return I}function G(E){I=E}function K(){let E=I;return E>=s.maxTextures&&Oe("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),I+=1,E}function V(E){let x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function Z(E,x){let D=n.get(E);if(E.isVideoTexture&&F(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&D.__version!==E.version){let N=E.image;if(N===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(N.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{he(D,E,x);return}}else E.isExternalTexture&&(D.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,D.__webglTexture,i.TEXTURE0+x)}function k(E,x){let D=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&D.__version!==E.version){he(D,E,x);return}else E.isExternalTexture&&(D.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,D.__webglTexture,i.TEXTURE0+x)}function j(E,x){let D=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&D.__version!==E.version){he(D,E,x);return}t.bindTexture(i.TEXTURE_3D,D.__webglTexture,i.TEXTURE0+x)}function ee(E,x){let D=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&D.__version!==E.version){Fe(D,E,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+x)}let Se={[is]:i.REPEAT,[Ln]:i.CLAMP_TO_EDGE,[pa]:i.MIRRORED_REPEAT},ye={[Vt]:i.NEAREST,[Ju]:i.NEAREST_MIPMAP_NEAREST,[yr]:i.NEAREST_MIPMAP_LINEAR,[Ut]:i.LINEAR,[Xa]:i.LINEAR_MIPMAP_NEAREST,[pi]:i.LINEAR_MIPMAP_LINEAR},et={[Qu]:i.NEVER,[sh]:i.ALWAYS,[eh]:i.LESS,[Io]:i.LEQUAL,[th]:i.EQUAL,[Lo]:i.GEQUAL,[nh]:i.GREATER,[ih]:i.NOTEQUAL};function Xe(E,x){if(x.type===fn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ut||x.magFilter===Xa||x.magFilter===yr||x.magFilter===pi||x.minFilter===Ut||x.minFilter===Xa||x.minFilter===yr||x.minFilter===pi)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,Se[x.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Se[x.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Se[x.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ye[x.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ye[x.minFilter]),x.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,et[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Vt||x.minFilter!==yr&&x.minFilter!==pi||x.type===fn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let D=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Ye(E,x){let D=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",C));let N=x.source,z=d.get(N);z===void 0&&(z={},d.set(N,z));let re=V(x);if(re!==E.__cacheKey){z[re]===void 0&&(z[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,D=!0),z[re].usedTimes++;let oe=z[E.__cacheKey];oe!==void 0&&(z[E.__cacheKey].usedTimes--,oe.usedTimes===0&&R(x)),E.__cacheKey=re,E.__webglTexture=z[re].texture}return D}function te(E,x,D){return Math.floor(Math.floor(E/D)/x)}function ne(E,x,D,N){let re=E.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,D,N,x.data);else{re.sort((we,ue)=>we.start-ue.start);let oe=0;for(let we=1;we<re.length;we++){let ue=re[oe],fe=re[we],Ue=ue.start+ue.count,He=te(fe.start,x.width,4),Ze=te(ue.start,x.width,4);fe.start<=Ue+1&&He===Ze&&te(fe.start+fe.count-1,x.width,4)===He?ue.count=Math.max(ue.count,fe.start+fe.count-ue.start):(++oe,re[oe]=fe)}re.length=oe+1;let q=t.getParameter(i.UNPACK_ROW_LENGTH),Q=t.getParameter(i.UNPACK_SKIP_PIXELS),ce=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let we=0,ue=re.length;we<ue;we++){let fe=re[we],Ue=Math.floor(fe.start/4),He=Math.ceil(fe.count/4),Ze=Ue%x.width,H=Math.floor(Ue/x.width),pe=He,se=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(i.UNPACK_SKIP_ROWS,H),t.texSubImage2D(i.TEXTURE_2D,0,Ze,H,pe,se,D,N,x.data)}E.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,q),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(i.UNPACK_SKIP_ROWS,ce)}}function he(E,x,D){let N=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(N=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(N=i.TEXTURE_3D);let z=Ye(E,x),re=x.source;t.bindTexture(N,E.__webglTexture,i.TEXTURE0+D);let oe=n.get(re);if(re.version!==oe.__version||z===!0){if(t.activeTexture(i.TEXTURE0+D),(typeof ImageBitmap!="undefined"&&x.image instanceof ImageBitmap)===!1){let se=at.getPrimaries(at.workingColorSpace),me=x.colorSpace===Zn?null:at.getPrimaries(x.colorSpace),be=x.colorSpace===Zn||se===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=g(x.image,!1,s.maxTextureSize);Q=Ke(x,Q);let ce=r.convert(x.format,x.colorSpace),we=r.convert(x.type),ue=v(x.internalFormat,ce,we,x.normalized,x.colorSpace,x.isVideoTexture);Xe(N,x);let fe,Ue=x.mipmaps,He=x.isVideoTexture!==!0,Ze=oe.__version===void 0||z===!0,H=re.dataReady,pe=S(x,Q);if(x.isDepthTexture)ue=w(x.format===mi,x.type),Ze&&(He?t.texStorage2D(i.TEXTURE_2D,1,ue,Q.width,Q.height):t.texImage2D(i.TEXTURE_2D,0,ue,Q.width,Q.height,0,ce,we,null));else if(x.isDataTexture)if(Ue.length>0){He&&Ze&&t.texStorage2D(i.TEXTURE_2D,pe,ue,Ue[0].width,Ue[0].height);for(let se=0,me=Ue.length;se<me;se++)fe=Ue[se],He?H&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,fe.width,fe.height,ce,we,fe.data):t.texImage2D(i.TEXTURE_2D,se,ue,fe.width,fe.height,0,ce,we,fe.data);x.generateMipmaps=!1}else He?(Ze&&t.texStorage2D(i.TEXTURE_2D,pe,ue,Q.width,Q.height),H&&ne(x,Q,ce,we)):t.texImage2D(i.TEXTURE_2D,0,ue,Q.width,Q.height,0,ce,we,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){He&&Ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ue,Ue[0].width,Ue[0].height,Q.depth);for(let se=0,me=Ue.length;se<me;se++)if(fe=Ue[se],x.format!==pn)if(ce!==null)if(He){if(H)if(x.layerUpdates.size>0){let be=ic(fe.width,fe.height,x.format,x.type);for(let le of x.layerUpdates){let Be=fe.data.subarray(le*be/fe.data.BYTES_PER_ELEMENT,(le+1)*be/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,le,fe.width,fe.height,1,ce,Be)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,fe.width,fe.height,Q.depth,ce,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,ue,fe.width,fe.height,Q.depth,0,fe.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else He?H&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,fe.width,fe.height,Q.depth,ce,we,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,ue,fe.width,fe.height,Q.depth,0,ce,we,fe.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{He&&Ze&&t.texStorage2D(i.TEXTURE_2D,pe,ue,Ue[0].width,Ue[0].height);for(let se=0,me=Ue.length;se<me;se++)fe=Ue[se],x.format!==pn?ce!==null?He?H&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,fe.width,fe.height,ce,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,se,ue,fe.width,fe.height,0,fe.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?H&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,fe.width,fe.height,ce,we,fe.data):t.texImage2D(i.TEXTURE_2D,se,ue,fe.width,fe.height,0,ce,we,fe.data)}else if(x.isDataArrayTexture)if(He){if(Ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ue,Q.width,Q.height,Q.depth),H)if(x.layerUpdates.size>0){let se=ic(Q.width,Q.height,x.format,x.type);for(let me of x.layerUpdates){let be=Q.data.subarray(me*se/Q.data.BYTES_PER_ELEMENT,(me+1)*se/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,me,Q.width,Q.height,1,ce,we,be)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ce,we,Q.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ue,Q.width,Q.height,Q.depth,0,ce,we,Q.data);else if(x.isData3DTexture)He?(Ze&&t.texStorage3D(i.TEXTURE_3D,pe,ue,Q.width,Q.height,Q.depth),H&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ce,we,Q.data)):t.texImage3D(i.TEXTURE_3D,0,ue,Q.width,Q.height,Q.depth,0,ce,we,Q.data);else if(x.isFramebufferTexture){if(Ze)if(He)t.texStorage2D(i.TEXTURE_2D,pe,ue,Q.width,Q.height);else{let se=Q.width,me=Q.height;for(let be=0;be<pe;be++)t.texImage2D(i.TEXTURE_2D,be,ue,se,me,0,ce,we,null),se>>=1,me>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let se=i.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),Q.parentNode!==se){se.appendChild(Q),f.add(x),se.onpaint=me=>{let be=me.changedElements;for(let le of f)be.includes(le.image)&&(le.needsUpdate=!0)},se.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Q);else{let be=i.RGBA,le=i.RGBA,Be=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,le,Be,Q)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ue.length>0){if(He&&Ze){let se=J(Ue[0]);t.texStorage2D(i.TEXTURE_2D,pe,ue,se.width,se.height)}for(let se=0,me=Ue.length;se<me;se++)fe=Ue[se],He?H&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ce,we,fe):t.texImage2D(i.TEXTURE_2D,se,ue,ce,we,fe);x.generateMipmaps=!1}else if(He){if(Ze){let se=J(Q);t.texStorage2D(i.TEXTURE_2D,pe,ue,se.width,se.height)}H&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,we,Q)}else t.texImage2D(i.TEXTURE_2D,0,ue,ce,we,Q);p(x)&&b(N),oe.__version=re.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function Fe(E,x,D){if(x.image.length!==6)return;let N=Ye(E,x),z=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+D);let re=n.get(z);if(z.version!==re.__version||N===!0){t.activeTexture(i.TEXTURE0+D);let oe=at.getPrimaries(at.workingColorSpace),q=x.colorSpace===Zn?null:at.getPrimaries(x.colorSpace),Q=x.colorSpace===Zn||oe===q?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let ce=x.isCompressedTexture||x.image[0].isCompressedTexture,we=x.image[0]&&x.image[0].isDataTexture,ue=[];for(let le=0;le<6;le++)!ce&&!we?ue[le]=g(x.image[le],!0,s.maxCubemapSize):ue[le]=we?x.image[le].image:x.image[le],ue[le]=Ke(x,ue[le]);let fe=ue[0],Ue=r.convert(x.format,x.colorSpace),He=r.convert(x.type),Ze=v(x.internalFormat,Ue,He,x.normalized,x.colorSpace),H=x.isVideoTexture!==!0,pe=re.__version===void 0||N===!0,se=z.dataReady,me=S(x,fe);Xe(i.TEXTURE_CUBE_MAP,x);let be;if(ce){H&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,me,Ze,fe.width,fe.height);for(let le=0;le<6;le++){be=ue[le].mipmaps;for(let Be=0;Be<be.length;Be++){let Le=be[Be];x.format!==pn?Ue!==null?H?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,0,0,Le.width,Le.height,Ue,Le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,Ze,Le.width,Le.height,0,Le.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,0,0,Le.width,Le.height,Ue,He,Le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,Ze,Le.width,Le.height,0,Ue,He,Le.data)}}}else{if(be=x.mipmaps,H&&pe){be.length>0&&me++;let le=J(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,me,Ze,le.width,le.height)}for(let le=0;le<6;le++)if(we){H?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ue[le].width,ue[le].height,Ue,He,ue[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ze,ue[le].width,ue[le].height,0,Ue,He,ue[le].data);for(let Be=0;Be<be.length;Be++){let yt=be[Be].image[le].image;H?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,0,0,yt.width,yt.height,Ue,He,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,Ze,yt.width,yt.height,0,Ue,He,yt.data)}}else{H?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Ue,He,ue[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ze,Ue,He,ue[le]);for(let Be=0;Be<be.length;Be++){let Le=be[Be];H?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,0,0,Ue,He,Le.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,Ze,Ue,He,Le.image[le])}}}p(x)&&b(i.TEXTURE_CUBE_MAP),re.__version=z.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function de(E,x,D,N,z,re){let oe=r.convert(D.format,D.colorSpace),q=r.convert(D.type),Q=v(D.internalFormat,oe,q,D.normalized,D.colorSpace),ce=n.get(x),we=n.get(D);if(we.__renderTarget=x,!ce.__hasExternalTextures){let ue=Math.max(1,x.width>>re),fe=Math.max(1,x.height>>re);z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?t.texImage3D(z,re,Q,ue,fe,x.depth,0,oe,q,null):t.texImage2D(z,re,Q,ue,fe,0,oe,q,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),_e(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,N,z,we.__webglTexture,0,Ne(x)):(z===i.TEXTURE_2D||z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,N,z,we.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(E,x,D){if(i.bindRenderbuffer(i.RENDERBUFFER,E),x.depthBuffer){let N=x.depthTexture,z=N&&N.isDepthTexture?N.type:null,re=w(x.stencilBuffer,z),oe=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;_e(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne(x),re,x.width,x.height):D?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne(x),re,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,re,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,E)}else{let N=x.textures;for(let z=0;z<N.length;z++){let re=N[z],oe=r.convert(re.format,re.colorSpace),q=r.convert(re.type),Q=v(re.internalFormat,oe,q,re.normalized,re.colorSpace);_e(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne(x),Q,x.width,x.height):D?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne(x),Q,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Q,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function mt(E,x,D){let N=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let z=n.get(x.depthTexture);if(z.__renderTarget=x,(!z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),N){if(z.__webglInit===void 0&&(z.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),z.__webglTexture===void 0){z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,x.depthTexture);let ce=r.convert(x.depthTexture.format),we=r.convert(x.depthTexture.type),ue;x.depthTexture.format===Nn?ue=i.DEPTH_COMPONENT24:x.depthTexture.format===mi&&(ue=i.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ue,x.width,x.height,0,ce,we,null)}}else Z(x.depthTexture,0);let re=z.__webglTexture,oe=Ne(x),q=N?i.TEXTURE_CUBE_MAP_POSITIVE_X+D:i.TEXTURE_2D,Q=x.depthTexture.format===mi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Nn)_e(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,q,re,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,Q,q,re,0);else if(x.depthTexture.format===mi)_e(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,q,re,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,Q,q,re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(E){let x=n.get(E),D=E.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==E.depthTexture){let N=E.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),N){let z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,N.removeEventListener("dispose",z)};N.addEventListener("dispose",z),x.__depthDisposeCallback=z}x.__boundDepthTexture=N}if(E.depthTexture&&!x.__autoAllocateDepthBuffer)if(D)for(let N=0;N<6;N++)mt(x.__webglFramebuffer[N],E,N);else{let N=E.texture.mipmaps;N&&N.length>0?mt(x.__webglFramebuffer[0],E,0):mt(x.__webglFramebuffer,E,0)}else if(D){x.__webglDepthbuffer=[];for(let N=0;N<6;N++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[N]),x.__webglDepthbuffer[N]===void 0)x.__webglDepthbuffer[N]=i.createRenderbuffer(),Ge(x.__webglDepthbuffer[N],E,!1);else{let z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=x.__webglDepthbuffer[N];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,re)}}else{let N=E.texture.mipmaps;if(N&&N.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ge(x.__webglDepthbuffer,E,!1);else{let z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,z,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(E,x,D){let N=n.get(E);x!==void 0&&de(N.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),D!==void 0&&ke(E)}function lt(E){let x=E.texture,D=n.get(E),N=n.get(x);E.addEventListener("dispose",_);let z=E.textures,re=E.isWebGLCubeRenderTarget===!0,oe=z.length>1;if(oe||(N.__webglTexture===void 0&&(N.__webglTexture=i.createTexture()),N.__version=x.version,a.memory.textures++),re){D.__webglFramebuffer=[];for(let q=0;q<6;q++)if(x.mipmaps&&x.mipmaps.length>0){D.__webglFramebuffer[q]=[];for(let Q=0;Q<x.mipmaps.length;Q++)D.__webglFramebuffer[q][Q]=i.createFramebuffer()}else D.__webglFramebuffer[q]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){D.__webglFramebuffer=[];for(let q=0;q<x.mipmaps.length;q++)D.__webglFramebuffer[q]=i.createFramebuffer()}else D.__webglFramebuffer=i.createFramebuffer();if(oe)for(let q=0,Q=z.length;q<Q;q++){let ce=n.get(z[q]);ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&_e(E)===!1){D.__webglMultisampledFramebuffer=i.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let q=0;q<z.length;q++){let Q=z[q];D.__webglColorRenderbuffer[q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,D.__webglColorRenderbuffer[q]);let ce=r.convert(Q.format,Q.colorSpace),we=r.convert(Q.type),ue=v(Q.internalFormat,ce,we,Q.normalized,Q.colorSpace,E.isXRRenderTarget===!0),fe=Ne(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,ue,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+q,i.RENDERBUFFER,D.__webglColorRenderbuffer[q])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(D.__webglDepthRenderbuffer=i.createRenderbuffer(),Ge(D.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,x);for(let q=0;q<6;q++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)de(D.__webglFramebuffer[q][Q],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q);else de(D.__webglFramebuffer[q],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);p(x)&&b(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let q=0,Q=z.length;q<Q;q++){let ce=z[q],we=n.get(ce),ue=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ue=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,we.__webglTexture),Xe(ue,ce),de(D.__webglFramebuffer,E,ce,i.COLOR_ATTACHMENT0+q,ue,0),p(ce)&&b(ue)}t.unbindTexture()}else{let q=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(q=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(q,N.__webglTexture),Xe(q,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)de(D.__webglFramebuffer[Q],E,x,i.COLOR_ATTACHMENT0,q,Q);else de(D.__webglFramebuffer,E,x,i.COLOR_ATTACHMENT0,q,0);p(x)&&b(q),t.unbindTexture()}E.depthBuffer&&ke(E)}function ae(E){let x=E.textures;for(let D=0,N=x.length;D<N;D++){let z=x[D];if(p(z)){let re=A(E),oe=n.get(z).__webglTexture;t.bindTexture(re,oe),b(re),t.unbindTexture()}}}let ie=[],Ie=[];function ze(E){if(E.samples>0){if(_e(E)===!1){let x=E.textures,D=E.width,N=E.height,z=i.COLOR_BUFFER_BIT,re=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=n.get(E),q=x.length>1;if(q)for(let ce=0;ce<x.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);let Q=E.texture.mipmaps;Q&&Q.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let ce=0;ce<x.length;ce++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(z|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(z|=i.STENCIL_BUFFER_BIT)),q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,oe.__webglColorRenderbuffer[ce]);let we=n.get(x[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,we,0)}i.blitFramebuffer(0,0,D,N,0,0,D,N,z,i.NEAREST),l===!0&&(ie.length=0,Ie.length=0,ie.push(i.COLOR_ATTACHMENT0+ce),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(ie.push(re),Ie.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ie)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ie))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),q)for(let ce=0;ce<x.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,oe.__webglColorRenderbuffer[ce]);let we=n.get(x[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,we,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&l){let x=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Ne(E){return Math.min(s.maxSamples,E.samples)}function _e(E){let x=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function F(E){let x=a.render.frame;u.get(E)!==x&&(u.set(E,x),E.update())}function Ke(E,x){let D=E.colorSpace,N=E.format,z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||D!==Gs&&D!==Zn&&(at.getTransfer(D)===pt?(N!==pn||z!==sn)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ve("WebGLTextures: Unsupported texture color space:",D)),x}function J(E){return typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame!="undefined"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=K,this.resetTextureUnits=B,this.getTextureUnits=U,this.setTextureUnits=G,this.setTexture2D=Z,this.setTexture2DArray=k,this.setTexture3D=j,this.setTextureCube=ee,this.rebindTextures=nt,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=de,this.useMultisampledRTT=_e,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function vx(i,e){function t(n,s=Zn){let r,a=at.getTransfer(s);if(n===sn)return i.UNSIGNED_BYTE;if(n===Ya)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Za)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ql)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Yl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Wl)return i.BYTE;if(n===Xl)return i.SHORT;if(n===Ss)return i.UNSIGNED_SHORT;if(n===qa)return i.INT;if(n===wn)return i.UNSIGNED_INT;if(n===fn)return i.FLOAT;if(n===An)return i.HALF_FLOAT;if(n===Zl)return i.ALPHA;if(n===Jl)return i.RGB;if(n===pn)return i.RGBA;if(n===Nn)return i.DEPTH_COMPONENT;if(n===mi)return i.DEPTH_STENCIL;if(n===Ja)return i.RED;if(n===Ka)return i.RED_INTEGER;if(n===gi)return i.RG;if(n===$a)return i.RG_INTEGER;if(n===ja)return i.RGBA_INTEGER;if(n===Mr||n===Sr||n===br||n===Er)if(a===pt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Mr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Mr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qa||n===eo||n===to||n===no)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===to)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===Tr||n===lo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===io||n===so)return a===pt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ro)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ao)return r.COMPRESSED_R11_EAC;if(n===oo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Tr)return r.COMPRESSED_RG11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===co||n===uo||n===ho||n===fo||n===po||n===mo||n===go||n===xo||n===_o||n===vo||n===yo||n===Mo||n===So||n===bo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===co)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===uo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ho)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===po)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===go)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_o)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===yo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===So)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bo)return a===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Eo||n===To||n===wo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Eo)return a===pt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ao||n===Ro||n===wr||n===Co)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ao)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var yx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Mx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Sc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new js(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new We({vertexShader:yx,fragmentShader:Mx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ee(new Je(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},bc=class extends Dn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,m=null,M=typeof XRWebGLBinding!="undefined",g=new Sc,p={},b=t.getContextAttributes(),A=null,v=null,w=[],S=[],C=new Te,_=null,y=null,R=new ht;R.viewport=new Tt;let L=new ht;L.viewport=new Tt;let I=[R,L],B=new Va,U=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let ne=w[te];return ne===void 0&&(ne=new ls,w[te]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(te){let ne=w[te];return ne===void 0&&(ne=new ls,w[te]=ne),ne.getGripSpace()},this.getHand=function(te){let ne=w[te];return ne===void 0&&(ne=new ls,w[te]=ne),ne.getHandSpace()};function K(te){let ne=S.indexOf(te.inputSource);if(ne===-1)return;let he=w[ne];he!==void 0&&(he.update(te.inputSource,te.frame,c||a),he.dispatchEvent({type:te.type,data:te.inputSource}))}function V(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",Z);for(let te=0;te<w.length;te++){let ne=S[te];ne!==null&&(S[te]=null,w[te].disconnect(ne))}U=null,G=null,g.reset();for(let te in p)delete p[te];if(e.setRenderTarget(A),d=null,h=null,f=null,s=null,v=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),y!==null){let te=y.camera;te.fov=y.fov,te.zoom=y.zoom,te.updateProjectionMatrix(),y=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,n.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){o=te,n.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(te){c=te},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",V),s.addEventListener("inputsourceschange",Z),b.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,Fe=null,de=null;b.depth&&(de=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=b.stencil?mi:Nn,Fe=b.stencil?bs:wn);let Ge={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Ge),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new nn(h.textureWidth,h.textureHeight,{format:pn,type:sn,depthTexture:new ri(h.textureWidth,h.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let he={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,he),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new nn(d.framebufferWidth,d.framebufferHeight,{format:pn,type:sn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(te){for(let ne=0;ne<te.removed.length;ne++){let he=te.removed[ne],Fe=S.indexOf(he);Fe>=0&&(S[Fe]=null,w[Fe].disconnect(he))}for(let ne=0;ne<te.added.length;ne++){let he=te.added[ne],Fe=S.indexOf(he);if(Fe===-1){for(let Ge=0;Ge<w.length;Ge++)if(Ge>=S.length){S.push(he),Fe=Ge;break}else if(S[Ge]===null){S[Ge]=he,Fe=Ge;break}if(Fe===-1)break}let de=w[Fe];de&&de.connect(he)}}let k=new P,j=new P;function ee(te,ne,he){k.setFromMatrixPosition(ne.matrixWorld),j.setFromMatrixPosition(he.matrixWorld);let Fe=k.distanceTo(j),de=ne.projectionMatrix.elements,Ge=he.projectionMatrix.elements,mt=de[14]/(de[10]-1),ke=de[14]/(de[10]+1),nt=(de[9]+1)/de[5],lt=(de[9]-1)/de[5],ae=(de[8]-1)/de[0],ie=(Ge[8]+1)/Ge[0],Ie=mt*ae,ze=mt*ie,Ne=Fe/(-ae+ie),_e=Ne*-ae;if(ne.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(_e),te.translateZ(Ne),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),de[10]===-1)te.projectionMatrix.copy(ne.projectionMatrix),te.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let F=mt+Ne,Ke=ke+Ne,J=Ie-_e,E=ze+(Fe-_e),x=nt*ke/Ke*F,D=lt*ke/Ke*F;te.projectionMatrix.makePerspective(J,E,x,D,F,Ke),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function Se(te,ne){ne===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(ne.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let ne=te.near,he=te.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(he=g.depthFar)),B.near=L.near=R.near=ne,B.far=L.far=R.far=he,(U!==B.near||G!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),U=B.near,G=B.far),B.layers.mask=te.layers.mask|6,R.layers.mask=B.layers.mask&-5,L.layers.mask=B.layers.mask&-3;let Fe=te.parent,de=B.cameras;Se(B,Fe);for(let Ge=0;Ge<de.length;Ge++)Se(de[Ge],Fe);de.length===2?ee(B,R,L):B.projectionMatrix.copy(R.projectionMatrix),y===null&&te.isPerspectiveCamera&&(y={camera:te,fov:te.fov,zoom:te.zoom}),ye(te,B,Fe)};function ye(te,ne,he){he===null?te.matrix.copy(ne.matrixWorld):(te.matrix.copy(he.matrixWorld),te.matrix.invert(),te.matrix.multiply(ne.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(ne.projectionMatrix),te.projectionMatrixInverse.copy(ne.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=as*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(te){l=te,h!==null&&(h.fixedFoveation=te),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=te)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(B)},this.getCameraTexture=function(te){return p[te]};let et=null;function Xe(te,ne){if(u=ne.getViewerPose(c||a),m=ne,u!==null){let he=u.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let Fe=!1;he.length!==B.cameras.length&&(B.cameras.length=0,Fe=!0);for(let ke=0;ke<he.length;ke++){let nt=he[ke],lt=null;if(d!==null)lt=d.getViewport(nt);else{let ie=f.getViewSubImage(h,nt);lt=ie.viewport,ke===0&&(e.setRenderTargetTextures(v,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(v))}let ae=I[ke];ae===void 0&&(ae=new ht,ae.layers.enable(ke),ae.viewport=new Tt,I[ke]=ae),ae.matrix.fromArray(nt.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(nt.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(lt.x,lt.y,lt.width,lt.height),ke===0&&(B.matrix.copy(ae.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Fe===!0&&B.cameras.push(ae)}let de=s.enabledFeatures;if(de&&de.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=n.getBinding();let ke=f.getDepthInformation(he[0]);ke&&ke.isValid&&ke.texture&&g.init(ke,s.renderState)}if(de&&de.includes("camera-access")&&M){e.state.unbindTexture(),f=n.getBinding();for(let ke=0;ke<he.length;ke++){let nt=he[ke].camera;if(nt){let lt=p[nt];lt||(lt=new js,p[nt]=lt);let ae=f.getCameraImage(nt);lt.sourceTexture=ae}}}}for(let he=0;he<w.length;he++){let Fe=S[he],de=w[he];Fe!==null&&de!==void 0&&de.update(Fe,ne,c||a)}et&&et(te,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),m=null}let Ye=new zh;Ye.setAnimationLoop(Xe),this.setAnimationLoop=function(te){et=te},this.dispose=function(){}}},Sx=new tt,Xh=new qe;Xh.set(-1,0,0,0,1,0,0,0,1);function bx(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,ec(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,b,A,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&d(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),M(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,b,A):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Et&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Et&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let b=e.get(p),A=b.envMap,v=b.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(Sx.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Xh),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,b,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=A*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Et&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function M(g,p){let b=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ex(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,w){let S=w.program;n.uniformBlockBinding(v,S)}function c(v,w){let S=s[v.id];S===void 0&&(g(v),S=u(v),s[v.id]=S,v.addEventListener("dispose",b));let C=w.program;n.updateUBOMapping(v,C);let _=e.render.frame;r[v.id]!==_&&(h(v),r[v.id]=_)}function u(v){let w=f();v.__bindingPointIndex=w;let S=i.createBuffer(),C=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,S),S}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ve("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let w=s[v.id],S=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let _=0,y=S.length;_<y;_++){let R=S[_];if(Array.isArray(R))for(let L=0,I=R.length;L<I;L++)d(R[L],_,L,C);else d(R,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,w,S,C){if(M(v,w,S,C)===!0){let _=v.__offset,y=v.value;if(Array.isArray(y)){let R=0;for(let L=0;L<y.length;L++){let I=y[L],B=p(I);m(I,v.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(y,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function m(v,w,S){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,S)}function M(v,w,S,C){let _=v.value,y=w+"_"+S;if(C[y]===void 0)return typeof _=="number"||typeof _=="boolean"?C[y]=_:ArrayBuffer.isView(_)?C[y]=_.slice():C[y]=_.clone(),!0;{let R=C[y];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[y]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(v){let w=v.uniforms,S=0,C=16;for(let y=0,R=w.length;y<R;y++){let L=Array.isArray(w[y])?w[y]:[w[y]];for(let I=0,B=L.length;I<B;I++){let U=L[I],G=Array.isArray(U.value)?U.value:[U.value];for(let K=0,V=G.length;K<V;K++){let Z=G[K],k=p(Z),j=S%C,ee=j%k.boundary,Se=j+ee;S+=ee,Se!==0&&C-Se<k.storage&&(S+=C-Se),U.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=S,S+=k.storage}}}let _=S%C;return _>0&&(S+=C-_),v.__size=S,v.__cache={},this}function p(v){let w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",v),w}function b(v){let w=v.target;w.removeEventListener("dispose",b);let S=a.indexOf(w.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function A(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}var Tx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Hn=null;function wx(){return Hn===null&&(Hn=new Ks(Tx,16,16,gi,An),Hn.name="DFG_LUT",Hn.minFilter=Ut,Hn.magFilter=Ut,Hn.wrapS=Ln,Hn.wrapT=Ln,Hn.generateMipmaps=!1,Hn.needsUpdate=!0),Hn}var Bo=class{constructor(e={}){let{canvas:t=ah(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=sn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let M=d,g=new Set([ja,$a,Ka]),p=new Set([sn,wn,Ss,bs,Ya,Za]),b=new Uint32Array(4),A=new Int32Array(4),v=new P,w=null,S=null,C=[],_=[],y=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,L=!1,I=null,B=null,U=null,G=null;this._outputColorSpace=Zt;let K=0,V=0,Z=null,k=-1,j=null,ee=new Tt,Se=new Tt,ye=null,et=new ge(0),Xe=0,Ye=t.width,te=t.height,ne=1,he=null,Fe=null,de=new Tt(0,0,Ye,te),Ge=new Tt(0,0,Ye,te),mt=!1,ke=new us,nt=!1,lt=!1,ae=new tt,ie=new P,Ie=new Tt,ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function _e(){return Z===null?ne:1}let F=n;function Ke(T,O){return t.getContext(T,O)}let J,E,x,D,N,z,re,oe,q,Q,ce,we,ue,fe,Ue,He,Ze,H,pe,se,me,be,le;try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",yt,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",_n,!1),F===null){let O="webgl2";if(F=Ke(O,T),F===null)throw Ke(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Be()}catch(T){throw t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",_n,!1),Ve("WebGLRenderer: "+T.message),T}function Be(){J=new N0(F),J.init(),me=new vx(F,J),E=new b0(F,J,e,me),x=new xx(F,J),E.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),B=F.createFramebuffer(),U=F.createFramebuffer(),G=F.createFramebuffer(),D=new F0(F),N=new ix,z=new _x(F,J,x,N,E,me,D),re=new L0(R),oe=new Of(F),be=new M0(F,oe),q=new D0(F,oe,D,be),Q=new O0(F,q,oe,be,D),H=new B0(F,E,z),Ue=new E0(N),ce=new nx(R,re,J,E,be,Ue),we=new bx(R,N),ue=new rx,fe=new hx(J),Ze=new y0(R,re,x,Q,m,l),He=new gx(R,Q,E),le=new Ex(F,D,E,x),pe=new S0(F,J,D),se=new U0(F,J,D),D.programs=ce.programs,R.capabilities=E,R.extensions=J,R.properties=N,R.renderLists=ue,R.shadowMap=He,R.state=x,R.info=D}M!==sn&&(y=new H0(M,t.width,t.height,o,s,r));let Le=new bc(R,F);this.xr=Le,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let T=J.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=J.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(T){T!==void 0&&(ne=T,this.setSize(Ye,te,!1))},this.getSize=function(T){return T.set(Ye,te)},this.setSize=function(T,O,$=!0){if(Le.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Ye=T,te=O,t.width=Math.floor(T*ne),t.height=Math.floor(O*ne),$===!0&&(t.style.width=T+"px",t.style.height=O+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(Ye*ne,te*ne).floor()},this.setDrawingBufferSize=function(T,O,$){Ye=T,te=O,ne=$,t.width=Math.floor(T*$),t.height=Math.floor(O*$),this.setViewport(0,0,T,O)},this.setEffects=function(T){if(M===sn){Ve("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let O=0;O<T.length;O++)if(T[O].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(ee)},this.getViewport=function(T){return T.copy(de)},this.setViewport=function(T,O,$,W){T.isVector4?de.set(T.x,T.y,T.z,T.w):de.set(T,O,$,W),x.viewport(ee.copy(de).multiplyScalar(ne).round())},this.getScissor=function(T){return T.copy(Ge)},this.setScissor=function(T,O,$,W){T.isVector4?Ge.set(T.x,T.y,T.z,T.w):Ge.set(T,O,$,W),x.scissor(Se.copy(Ge).multiplyScalar(ne).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(T){x.setScissorTest(mt=T)},this.setOpaqueSort=function(T){he=T},this.setTransparentSort=function(T){Fe=T},this.getClearColor=function(T){return T.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,$=!0){let W=0;if(T){let X=!1;if(Z!==null){let Me=Z.texture.format;X=g.has(Me)}if(X){let Me=Z.texture.type,Re=p.has(Me),ve=Ze.getClearColor(),Ce=Ze.getClearAlpha(),De=ve.r,je=ve.g,rt=ve.b;Re?(b[0]=De,b[1]=je,b[2]=rt,b[3]=Ce,F.clearBufferuiv(F.COLOR,0,b)):(A[0]=De,A[1]=je,A[2]=rt,A[3]=Ce,F.clearBufferiv(F.COLOR,0,A))}else W|=F.COLOR_BUFFER_BIT}O&&(W|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(W|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&F.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),I=T},this.dispose=function(){t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",_n,!1),Ze.dispose(),ue.dispose(),fe.dispose(),N.dispose(),re.dispose(),Q.dispose(),be.dispose(),le.dispose(),ce.dispose(),Le.dispose(),Le.removeEventListener("sessionstart",Uc),Le.removeEventListener("sessionend",Fc),vi.stop()};function yt(T){T.preventDefault(),$l("WebGLRenderer: Context Lost."),L=!0}function dt(){$l("WebGLRenderer: Context Restored."),L=!1;let T=D.autoReset,O=He.enabled,$=He.autoUpdate,W=He.needsUpdate,X=He.type;Be(),D.autoReset=T,He.enabled=O,He.autoUpdate=$,He.needsUpdate=W,He.type=X}function _n(T){Ve("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Cn(T){let O=T.target;O.removeEventListener("dispose",Cn),od(O)}function od(T){ld(T),N.remove(T)}function ld(T){let O=N.get(T).programs;O!==void 0&&(O.forEach(function($){ce.releaseProgram($)}),T.isShaderMaterial&&ce.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,$,W,X,Me){O===null&&(O=ze);let Re=X.isMesh&&X.matrixWorld.determinantAffine()<0,ve=hd(T,O,$,W,X);x.setMaterial(W,Re);let Ce=$.index,De=1;if(W.wireframe===!0){if(Ce=q.getWireframeAttribute($),Ce===void 0)return;De=2}let je=$.drawRange,rt=$.attributes.position,Pe=je.start*De,ft=(je.start+je.count)*De;Me!==null&&(Pe=Math.max(Pe,Me.start*De),ft=Math.min(ft,(Me.start+Me.count)*De)),Ce!==null?(Pe=Math.max(Pe,0),ft=Math.min(ft,Ce.count)):rt!=null&&(Pe=Math.max(Pe,0),ft=Math.min(ft,rt.count));let Nt=ft-Pe;if(Nt<0||Nt===1/0)return;be.setup(X,W,ve,$,Ce);let St,_t=pe;if(Ce!==null&&(St=oe.get(Ce),_t=se,_t.setIndex(St)),X.isMesh)W.wireframe===!0?(x.setLineWidth(W.wireframeLinewidth*_e()),_t.setMode(F.LINES)):_t.setMode(F.TRIANGLES);else if(X.isLine){let Xt=W.linewidth;Xt===void 0&&(Xt=1),x.setLineWidth(Xt*_e()),X.isLineSegments?_t.setMode(F.LINES):X.isLineLoop?_t.setMode(F.LINE_LOOP):_t.setMode(F.LINE_STRIP)}else X.isPoints?_t.setMode(F.POINTS):X.isSprite&&_t.setMode(F.TRIANGLES);if(X.isBatchedMesh)if(J.get("WEBGL_multi_draw"))_t.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Xt=X._multiDrawStarts,Ae=X._multiDrawCounts,$t=X._multiDrawCount,ct=Ce?oe.get(Ce).bytesPerElement:1,hn=N.get(W).currentProgram.getUniforms();for(let Pn=0;Pn<$t;Pn++)hn.setValue(F,"_gl_DrawID",Pn),_t.render(Xt[Pn]/ct,Ae[Pn])}else if(X.isInstancedMesh)_t.renderInstances(Pe,Nt,X.count);else if($.isInstancedBufferGeometry){let Xt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ae=Math.min($.instanceCount,Xt);_t.renderInstances(Pe,Nt,Ae)}else _t.render(Pe,Nt)};function Dc(T,O,$,W){I!==null&&T.isNodeMaterial&&I.setObject(W,T),nt===!0&&Ue.setState(T,$,!1),T.transparent===!0&&T.side===wt&&T.forceSinglePass===!1?(T.side=Et,T.needsUpdate=!0,Lr(T,O,W),T.side=di,T.needsUpdate=!0,Lr(T,O,W),T.side=wt):Lr(T,O,W)}this.compile=function(T,O,$=null){$===null&&($=T),I!==null&&I.renderStart(T,O,$),S=fe.get($),S.init(O),_.push(S),$.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),T!==$&&T.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),S.setupLights(),I!==null&&I.updateLights(S.state.lightsArray),lt=this.localClippingEnabled,nt=Ue.init(this.clippingPlanes,lt),nt===!0&&Ue.setGlobalState(this.clippingPlanes,O),I!==null&&He.render(S.state.shadowsArray,$,O);let W=new Set;return T.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let Me=X.material;if(Me)if(Array.isArray(Me))for(let Re=0;Re<Me.length;Re++){let ve=Me[Re];Dc(ve,$,O,X),W.add(ve)}else Dc(Me,$,O,X),W.add(Me)}),S=_.pop(),I!==null&&I.renderEnd(),W},this.compileAsync=function(T,O,$=null){let W=this.compile(T,O,$);return new Promise(X=>{function Me(){if(W.forEach(function(Re){let Ce=N.get(Re).currentProgram;(Ce===void 0||Ce.isReady())&&W.delete(Re)}),W.size===0){X(T);return}setTimeout(Me,10)}J.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let Xo=null;function cd(T){Xo&&Xo(T)}function Uc(){vi.stop()}function Fc(){vi.start()}let vi=new zh;vi.setAnimationLoop(cd),typeof self!="undefined"&&vi.setContext(self),this.setAnimationLoop=function(T){Xo=T,Le.setAnimationLoop(T),T===null?vi.stop():vi.start()},Le.addEventListener("sessionstart",Uc),Le.addEventListener("sessionend",Fc),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){Ve("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;I!==null&&I.renderStart(T,O);let $=Le.enabled===!0&&Le.isPresenting===!0,W=y!==null&&(Z===null||$)&&y.begin(R,Z);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Le.enabled===!0&&Le.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Le.cameraAutoUpdate===!0&&Le.updateCamera(O),O=Le.getCamera()),T.isScene===!0&&T.onBeforeRender(R,T,O,Z),S=fe.get(T,_.length),S.init(O),S.state.textureUnits=z.getTextureUnits(),_.push(S),ae.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ke.setFromProjectionMatrix(ae,bn,O.reversedDepth),lt=this.localClippingEnabled,nt=Ue.init(this.clippingPlanes,lt),w=ue.get(T,C.length),w.init(),C.push(w),Le.enabled===!0&&Le.isPresenting===!0){let Re=R.xr.getDepthSensingMesh();Re!==null&&qo(Re,O,-1/0,R.sortObjects)}qo(T,O,0,R.sortObjects),w.finish(),I!==null&&I.updateLights(S.state.lightsArray),R.sortObjects===!0&&w.sort(he,Fe),Ne=Le.enabled===!1||Le.isPresenting===!1||Le.hasDepthSensing()===!1,Ne&&Ze.addToRenderList(w,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),nt===!0&&Ue.beginShadows();let X=S.state.shadowsArray;if(He.render(X,T,O),nt===!0&&Ue.endShadows(),(W&&y.hasRenderPass())===!1){let Re=w.opaque,ve=w.transmissive;if(S.setupLights(),O.isArrayCamera){let Ce=O.cameras;if(ve.length>0)for(let De=0,je=Ce.length;De<je;De++){let rt=Ce[De];Oc(Re,ve,T,rt)}Ne&&Ze.render(T);for(let De=0,je=Ce.length;De<je;De++){let rt=Ce[De];Bc(w,T,rt,rt.viewport)}}else ve.length>0&&Oc(Re,ve,T,O),Ne&&Ze.render(T),Bc(w,T,O)}Z!==null&&V===0&&(z.updateMultisampleRenderTarget(Z),z.updateRenderTargetMipmap(Z)),W&&y.end(R),T.isScene===!0&&T.onAfterRender(R,T,O),be.resetDefaultState(),k=-1,j=null,_.pop(),_.length>0?(S=_[_.length-1],z.setTextureUnits(S.state.textureUnits),nt===!0&&Ue.setGlobalState(R.clippingPlanes,S.state.camera)):S=null,C.pop(),C.length>0?w=C[C.length-1]:w=null,I!==null&&I.renderEnd()};function qo(T,O,$,W){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLightProbeGrid)S.pushLightProbeGrid(T);else if(T.isLight)S.pushLight(T),T.castShadow&&S.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||T.intersectsFrustum(ke)){W&&Ie.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ae);let Re=Q.update(T),ve=T.material;ve.visible&&w.push(T,Re,ve,$,Ie.z,null,O)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||T.intersectsFrustum(ke))){let Re=Q.update(T),ve=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ie.copy(T.boundingSphere.center)):(Re.boundingSphere===null&&Re.computeBoundingSphere(),Ie.copy(Re.boundingSphere.center)),Ie.applyMatrix4(T.matrixWorld).applyMatrix4(ae)),Array.isArray(ve)){let Ce=Re.groups;for(let De=0,je=Ce.length;De<je;De++){let rt=Ce[De],Pe=ve[rt.materialIndex];Pe&&Pe.visible&&w.push(T,Re,Pe,$,Ie.z,rt,O)}}else ve.visible&&w.push(T,Re,ve,$,Ie.z,null,O)}}let Me=T.children;for(let Re=0,ve=Me.length;Re<ve;Re++)qo(Me[Re],O,$,W)}function Bc(T,O,$,W){let{opaque:X,transmissive:Me,transparent:Re}=T;S.setupLightsView($),nt===!0&&Ue.setGlobalState(R.clippingPlanes,$),W&&x.viewport(ee.copy(W)),X.length>0&&Ir(X,O,$),Me.length>0&&Ir(Me,O,$),Re.length>0&&Ir(Re,O,$),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Oc(T,O,$,W){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[W.id]===void 0){let Pe=J.has("EXT_color_buffer_half_float")||J.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[W.id]=new nn(1,1,{generateMipmaps:!0,type:Pe?An:sn,minFilter:pi,samples:Math.max(4,E.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:at.workingColorSpace})}let Me=S.state.transmissionRenderTarget[W.id],Re=W.viewport||ee;Me.setSize(Re.z*R.transmissionResolutionScale,Re.w*R.transmissionResolutionScale);let ve=R.getRenderTarget(),Ce=R.getActiveCubeFace(),De=R.getActiveMipmapLevel();R.setRenderTarget(Me),R.getClearColor(et),Xe=R.getClearAlpha(),Xe<1&&R.setClearColor(16777215,.5),R.clear(),Ne&&Ze.render($);let je=R.toneMapping;R.toneMapping=Tn;let rt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),S.setupLightsView(W),nt===!0&&Ue.setGlobalState(R.clippingPlanes,W),Ir(T,$,W),z.updateMultisampleRenderTarget(Me),z.updateRenderTargetMipmap(Me),J.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let ft=0,Nt=O.length;ft<Nt;ft++){let St=O[ft],{object:_t,geometry:Xt,material:Ae,group:$t}=St;if(Ae.side===wt&&_t.layers.test(W.layers)){let ct=Ae.side;Ae.side=Et,Ae.needsUpdate=!0,zc(_t,$,W,Xt,Ae,$t),Ae.side=ct,Ae.needsUpdate=!0,Pe=!0}}Pe===!0&&(z.updateMultisampleRenderTarget(Me),z.updateRenderTargetMipmap(Me))}R.setRenderTarget(ve,Ce,De),R.setClearColor(et,Xe),rt!==void 0&&(W.viewport=rt),R.toneMapping=je}function Ir(T,O,$){let W=O.isScene===!0?O.overrideMaterial:null;for(let X=0,Me=T.length;X<Me;X++){let Re=T[X],{object:ve,geometry:Ce,group:De}=Re,je=Re.material;je.allowOverride===!0&&W!==null&&(je=W),ve.layers.test($.layers)&&zc(ve,O,$,Ce,je,De)}}function zc(T,O,$,W,X,Me){I!==null&&X.isNodeMaterial&&I.setObject(T,X),T.onBeforeRender(R,O,$,W,X,Me),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(R,O,$,W,T,Me),X.transparent===!0&&X.side===wt&&X.forceSinglePass===!1?(X.side=Et,X.needsUpdate=!0,R.renderBufferDirect($,O,W,X,T,Me),X.side=di,X.needsUpdate=!0,R.renderBufferDirect($,O,W,X,T,Me),X.side=wt):R.renderBufferDirect($,O,W,X,T,Me),T.onAfterRender(R,O,$,W,X,Me)}function Lr(T,O,$){O.isScene!==!0&&(O=ze);let W=N.get(T),X=S.state.lights,Me=S.state.shadowsArray,Re=X.state.version,ve=ce.getParameters(T,X.state,Me,O,$,S.state.lightProbeGridArray),Ce=ce.getProgramCacheKey(ve),De=W.programs;W.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?O.environment:null,W.fog=O.fog;let je=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;W.envMap=re.get(T.envMap||W.environment,je),W.envMapRotation=W.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,De===void 0&&(T.addEventListener("dispose",Cn),De=new Map,W.programs=De);let rt=De.get(Ce);if(rt!==void 0){if(W.currentProgram===rt&&W.lightsStateVersion===Re)return Vc(T,ve),rt}else ve.uniforms=ce.getUniforms(T),I!==null&&T.isNodeMaterial&&I.build(T,$,ve),T.onBeforeCompile(ve,R),rt=ce.acquireProgram(ve,Ce),De.set(Ce,rt),W.uniforms=ve.uniforms;let Pe=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Pe.clippingPlanes=Ue.uniform),Vc(T,ve),W.needsLights=fd(T),W.lightsStateVersion=Re,W.needsLights&&(Pe.ambientLightColor.value=X.state.ambient,Pe.lightProbe.value=X.state.probe,Pe.sunLights.value=X.state.sun,Pe.sunLightShadows.value=X.state.sunShadow,Pe.directionalLights.value=X.state.directional,Pe.directionalLightShadows.value=X.state.directionalShadow,Pe.spotLights.value=X.state.spot,Pe.spotLightShadows.value=X.state.spotShadow,Pe.rectAreaLights.value=X.state.rectArea,Pe.ltc_1.value=X.state.rectAreaLTC1,Pe.ltc_2.value=X.state.rectAreaLTC2,Pe.pointLights.value=X.state.point,Pe.pointLightShadows.value=X.state.pointShadow,Pe.hemisphereLights.value=X.state.hemi,Pe.sunShadowMatrix.value=X.state.sunShadowMatrix,Pe.sunShadowCascade.value=X.state.sunShadowCascade,Pe.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Pe.spotLightMatrix.value=X.state.spotLightMatrix,Pe.spotLightMap.value=X.state.spotLightMap,Pe.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=S.state.lightProbeGridArray.length>0,W.currentProgram=rt,W.uniformsList=null,rt}function Hc(T){if(T.uniformsList===null){let O=T.currentProgram.getUniforms();T.uniformsList=ws.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Vc(T,O){let $=N.get(T);$.outputColorSpace=O.outputColorSpace,$.batching=O.batching,$.batchingColor=O.batchingColor,$.instancing=O.instancing,$.instancingColor=O.instancingColor,$.instancingMorph=O.instancingMorph,$.skinning=O.skinning,$.morphTargets=O.morphTargets,$.morphNormals=O.morphNormals,$.morphColors=O.morphColors,$.morphTargetsCount=O.morphTargetsCount,$.numClippingPlanes=O.numClippingPlanes,$.numIntersection=O.numClipIntersection,$.vertexAlphas=O.vertexAlphas,$.vertexTangents=O.vertexTangents,$.toneMapping=O.toneMapping}function ud(T,O){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;v.setFromMatrixPosition(O.matrixWorld);for(let $=0,W=T.length;$<W;$++){let X=T[$];if(X.texture!==null&&X.boundingBox.containsPoint(v))return X}return null}function hd(T,O,$,W,X){O.isScene!==!0&&(O=ze),z.resetTextureUnits();let Me=O.fog,Re=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?O.environment:null,ve=Z===null?R.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:at.workingColorSpace,Ce=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,De=re.get(W.envMap||Re,Ce),je=W.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,rt=!!$.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pe=!!$.morphAttributes.position,ft=!!$.morphAttributes.normal,Nt=!!$.morphAttributes.color,St=Tn;W.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(St=R.toneMapping);let _t=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Xt=_t!==void 0?_t.length:0,Ae=N.get(W),$t=S.state.lights;if(nt===!0&&(lt===!0||T!==j)){let Mt=T===j&&W.id===k;Ue.setState(W,T,Mt)}let ct=!1;W.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==$t.state.version||Ae.outputColorSpace!==ve||X.isBatchedMesh&&Ae.batching===!1||!X.isBatchedMesh&&Ae.batching===!0||X.isBatchedMesh&&Ae.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Ae.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Ae.instancing===!1||!X.isInstancedMesh&&Ae.instancing===!0||X.isSkinnedMesh&&Ae.skinning===!1||!X.isSkinnedMesh&&Ae.skinning===!0||X.isInstancedMesh&&Ae.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ae.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ae.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ae.instancingMorph===!1&&X.morphTexture!==null||Ae.envMap!==De||W.fog===!0&&Ae.fog!==Me||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==Ue.numPlanes||Ae.numIntersection!==Ue.numIntersection)||Ae.vertexAlphas!==je||Ae.vertexTangents!==rt||Ae.morphTargets!==Pe||Ae.morphNormals!==ft||Ae.morphColors!==Nt||Ae.toneMapping!==St||Ae.morphTargetsCount!==Xt||!!Ae.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(ct=!0):(ct=!0,Ae.__version=W.version);let hn=Ae.currentProgram;ct===!0&&(hn=Lr(W,O,X),I&&W.isNodeMaterial&&I.onUpdateProgram(W,hn,Ae));let Pn=!1,Jn=!1,Bi=!1,gt=hn.getUniforms(),Pt=Ae.uniforms;if(x.useProgram(hn.program)&&(Pn=!0,Jn=!0,Bi=!0),W.id!==k&&(k=W.id,Jn=!0),Ae.needsLights){let Mt=ud(S.state.lightProbeGridArray,X);Ae.lightProbeGrid!==Mt&&(Ae.lightProbeGrid=Mt,Jn=!0)}if(Pn||j!==T){x.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),gt.setValue(F,"projectionMatrix",T.projectionMatrix),gt.setValue(F,"viewMatrix",T.matrixWorldInverse);let $n=gt.map.cameraPosition;$n!==void 0&&$n.setValue(F,ie.setFromMatrixPosition(T.matrixWorld)),E.logarithmicDepthBuffer&&gt.setValue(F,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&gt.setValue(F,"isOrthographic",T.isOrthographicCamera===!0),j!==T&&(j=T,Jn=!0,Bi=!0)}if(Ae.needsLights&&($t.state.sunShadowMap.length>0&&gt.setValue(F,"sunShadowMap",$t.state.sunShadowMap,z),$t.state.directionalShadowMap.length>0&&gt.setValue(F,"directionalShadowMap",$t.state.directionalShadowMap,z),$t.state.spotShadowMap.length>0&&gt.setValue(F,"spotShadowMap",$t.state.spotShadowMap,z),$t.state.pointShadowMap.length>0&&gt.setValue(F,"pointShadowMap",$t.state.pointShadowMap,z)),X.isSkinnedMesh){gt.setOptional(F,X,"bindMatrix"),gt.setOptional(F,X,"bindMatrixInverse");let Mt=X.skeleton;Mt&&(Mt.boneTexture===null&&Mt.computeBoneTexture(),gt.setValue(F,"boneTexture",Mt.boneTexture,z))}X.isBatchedMesh&&(gt.setOptional(F,X,"batchingTexture"),gt.setValue(F,"batchingTexture",X._matricesTexture,z),gt.setOptional(F,X,"batchingIdTexture"),gt.setValue(F,"batchingIdTexture",X._indirectTexture,z),gt.setOptional(F,X,"batchingColorTexture"),X._colorsTexture!==null&&gt.setValue(F,"batchingColorTexture",X._colorsTexture,z));let Kn=$.morphAttributes;if((Kn.position!==void 0||Kn.normal!==void 0||Kn.color!==void 0)&&H.update(X,$,hn),(Jn||Ae.receiveShadow!==X.receiveShadow)&&(Ae.receiveShadow=X.receiveShadow,gt.setValue(F,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&O.environment!==null&&(Pt.envMapIntensity.value=O.environmentIntensity),Pt.dfgLUT!==void 0&&(Pt.dfgLUT.value=wx()),Jn){if(gt.setValue(F,"toneMappingExposure",R.toneMappingExposure),Ae.needsLights&&dd(Pt,Bi),Me&&W.fog===!0&&we.refreshFogUniforms(Pt,Me),we.refreshMaterialUniforms(Pt,W,ne,te,S.state.transmissionRenderTarget[T.id]),Ae.needsLights&&Ae.lightProbeGrid){let Mt=Ae.lightProbeGrid;Pt.probesSH.value=Mt.texture,Pt.probesMin.value.copy(Mt.boundingBox.min),Pt.probesMax.value.copy(Mt.boundingBox.max),Pt.probesResolution.value.copy(Mt.resolution)}ws.upload(F,Hc(Ae),Pt,z)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ws.upload(F,Hc(Ae),Pt,z),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&gt.setValue(F,"center",X.center),gt.setValue(F,"modelViewMatrix",X.modelViewMatrix),gt.setValue(F,"normalMatrix",X.normalMatrix),gt.setValue(F,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){let Mt=W.uniformsGroups;for(let $n=0,Oi=Mt.length;$n<Oi;$n++){let kc=Mt[$n];le.update(kc,hn),le.bind(kc,hn)}}return hn}function dd(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.sunLights.needsUpdate=O,T.sunLightShadows.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function fd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(T,O,$){let W=N.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),N.get(T.texture).__webglTexture=O,N.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:$,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){let $=N.get(T);$.__webglFramebuffer=O,$.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,$=0){Z=T,K=O,V=$;let W=null,X=!1,Me=!1;if(T){let ve=N.get(T);if(ve.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(F.FRAMEBUFFER,ve.__webglFramebuffer),ee.copy(T.viewport),Se.copy(T.scissor),ye=T.scissorTest,x.viewport(ee),x.scissor(Se),x.setScissorTest(ye),k=-1;return}else if(ve.__webglFramebuffer===void 0)z.setupRenderTarget(T);else if(ve.__hasExternalTextures)z.rebindTextures(T,N.get(T.texture).__webglTexture,N.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let je=T.depthTexture;if(ve.__boundDepthTexture!==je){if(je!==null&&N.has(je)&&(T.width!==je.image.width||T.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(T)}}let Ce=T.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(Me=!0);let De=N.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(De[O])?W=De[O][$]:W=De[O],X=!0):T.samples>0&&z.useMultisampledRTT(T)===!1?W=N.get(T).__webglMultisampledFramebuffer:Array.isArray(De)?W=De[$]:W=De,ee.copy(T.viewport),Se.copy(T.scissor),ye=T.scissorTest}else ee.copy(de).multiplyScalar(ne).floor(),Se.copy(Ge).multiplyScalar(ne).floor(),ye=mt;if($!==0&&(W=B),x.bindFramebuffer(F.FRAMEBUFFER,W)&&x.drawBuffers(T,W),x.viewport(ee),x.scissor(Se),x.setScissorTest(ye),X){let ve=N.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+O,ve.__webglTexture,$)}else if(Me){let ve=O;for(let Ce=0;Ce<T.textures.length;Ce++){let De=N.get(T.textures[Ce]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ce,De.__webglTexture,$,ve)}}else if(T!==null&&$!==0){let ve=N.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ve.__webglTexture,$)}k=-1};function Gc(T){let O=N.get(T);return(O.__readFormat!==T.format||O.__readType!==T.type)&&(O.__readFormat=T.format,O.__readType=T.type,O.__formatReadable=E.textureFormatReadable(T.format),O.__typeReadable=E.textureTypeReadable(T.type)),O}this.readRenderTargetPixels=function(T,O,$,W,X,Me,Re,ve=0){if(!(T&&T.isWebGLRenderTarget)){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=N.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Re!==void 0&&(Ce=Ce[Re]),Ce){x.bindFramebuffer(F.FRAMEBUFFER,Ce);try{let De=T.textures[ve],je=De.format,rt=De.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ve);let Pe=Gc(De);if(Pe.__formatReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pe.__typeReadable===!1){Ve("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-W&&$>=0&&$<=T.height-X&&F.readPixels(O,$,W,X,me.convert(je),me.convert(rt),Me)}finally{let De=Z!==null?N.get(Z).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(T,O,$,W,X,Me,Re,ve=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=N.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Re!==void 0&&(Ce=Ce[Re]),Ce)if(O>=0&&O<=T.width-W&&$>=0&&$<=T.height-X){x.bindFramebuffer(F.FRAMEBUFFER,Ce);let De=T.textures[ve],je=De.format,rt=De.type;T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ve);let Pe=Gc(De);if(Pe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ft=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ft),F.bufferData(F.PIXEL_PACK_BUFFER,Me.byteLength,F.STREAM_READ),F.readPixels(O,$,W,X,me.convert(je),me.convert(rt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Nt=Z!==null?N.get(Z).__webglFramebuffer:null;x.bindFramebuffer(F.FRAMEBUFFER,Nt);let St=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await lh(F,St,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ft),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Me),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(ft),F.deleteSync(St),Me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,$=0){let W=Math.pow(2,-$),X=Math.floor(T.image.width*W),Me=Math.floor(T.image.height*W),Re=O!==null?O.x:0,ve=O!==null?O.y:0;z.setTexture2D(T,0),F.copyTexSubImage2D(F.TEXTURE_2D,$,0,0,Re,ve,X,Me),x.unbindTexture()},this.copyTextureToTexture=function(T,O,$=null,W=null,X=0,Me=0){let Re,ve,Ce,De,je,rt,Pe,ft,Nt,St=T.isCompressedTexture?T.mipmaps[Me]:T.image;if($!==null)Re=$.max.x-$.min.x,ve=$.max.y-$.min.y,Ce=$.isBox3?$.max.z-$.min.z:1,De=$.min.x,je=$.min.y,rt=$.isBox3?$.min.z:0;else{let Pt=Math.pow(2,-X);Re=Math.floor(St.width*Pt),ve=Math.floor(St.height*Pt),T.isDataArrayTexture?Ce=St.depth:T.isData3DTexture?Ce=Math.floor(St.depth*Pt):Ce=1,De=0,je=0,rt=0}W!==null?(Pe=W.x,ft=W.y,Nt=W.z):(Pe=0,ft=0,Nt=0);let _t=me.convert(O.format),Xt=me.convert(O.type),Ae;O.isData3DTexture?(z.setTexture3D(O,0),Ae=F.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(z.setTexture2DArray(O,0),Ae=F.TEXTURE_2D_ARRAY):(z.setTexture2D(O,0),Ae=F.TEXTURE_2D),x.activeTexture(F.TEXTURE0),x.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,O.flipY),x.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),x.pixelStorei(F.UNPACK_ALIGNMENT,O.unpackAlignment);let $t=x.getParameter(F.UNPACK_ROW_LENGTH),ct=x.getParameter(F.UNPACK_IMAGE_HEIGHT),hn=x.getParameter(F.UNPACK_SKIP_PIXELS),Pn=x.getParameter(F.UNPACK_SKIP_ROWS),Jn=x.getParameter(F.UNPACK_SKIP_IMAGES);x.pixelStorei(F.UNPACK_ROW_LENGTH,St.width),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,St.height),x.pixelStorei(F.UNPACK_SKIP_PIXELS,De),x.pixelStorei(F.UNPACK_SKIP_ROWS,je),x.pixelStorei(F.UNPACK_SKIP_IMAGES,rt);let Bi=T.isDataArrayTexture||T.isData3DTexture,gt=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){let Pt=N.get(T),Kn=N.get(O),Mt=N.get(Pt.__renderTarget),$n=N.get(Kn.__renderTarget);x.bindFramebuffer(F.READ_FRAMEBUFFER,Mt.__webglFramebuffer),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,$n.__webglFramebuffer);for(let Oi=0;Oi<Ce;Oi++)Bi&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,N.get(T).__webglTexture,X,rt+Oi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,N.get(O).__webglTexture,Me,Nt+Oi)),F.blitFramebuffer(De,je,Re,ve,Pe,ft,Re,ve,F.DEPTH_BUFFER_BIT,F.NEAREST);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(X!==0||T.isRenderTargetTexture||N.has(T)){let Pt=N.get(T),Kn=N.get(O);x.bindFramebuffer(F.READ_FRAMEBUFFER,U),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,G);for(let Mt=0;Mt<Ce;Mt++)Bi?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Pt.__webglTexture,X,rt+Mt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Pt.__webglTexture,X),gt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Kn.__webglTexture,Me,Nt+Mt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Kn.__webglTexture,Me),X!==0?F.blitFramebuffer(De,je,Re,ve,Pe,ft,Re,ve,F.COLOR_BUFFER_BIT,F.NEAREST):gt?F.copyTexSubImage3D(Ae,Me,Pe,ft,Nt+Mt,De,je,Re,ve):F.copyTexSubImage2D(Ae,Me,Pe,ft,De,je,Re,ve);x.bindFramebuffer(F.READ_FRAMEBUFFER,null),x.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else gt?T.isDataTexture||T.isData3DTexture?F.texSubImage3D(Ae,Me,Pe,ft,Nt,Re,ve,Ce,_t,Xt,St.data):O.isCompressedArrayTexture?F.compressedTexSubImage3D(Ae,Me,Pe,ft,Nt,Re,ve,Ce,_t,St.data):F.texSubImage3D(Ae,Me,Pe,ft,Nt,Re,ve,Ce,_t,Xt,St):T.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Me,Pe,ft,Re,ve,_t,Xt,St.data):T.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Me,Pe,ft,St.width,St.height,_t,St.data):F.texSubImage2D(F.TEXTURE_2D,Me,Pe,ft,Re,ve,_t,Xt,St);x.pixelStorei(F.UNPACK_ROW_LENGTH,$t),x.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ct),x.pixelStorei(F.UNPACK_SKIP_PIXELS,hn),x.pixelStorei(F.UNPACK_SKIP_ROWS,Pn),x.pixelStorei(F.UNPACK_SKIP_IMAGES,Jn),Me===0&&O.generateMipmaps&&F.generateMipmap(Ae),x.unbindTexture()},this.initRenderTarget=function(T){N.get(T).__webglFramebuffer===void 0&&z.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?z.setTextureCube(T,0):T.isData3DTexture?z.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?z.setTexture2DArray(T,0):z.setTexture2D(T,0),x.unbindTexture()},this.resetState=function(){K=0,V=0,Z=null,x.reset(),be.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}};var $e=Math.PI*2,Y=(i,e)=>i+Math.random()*(e-i),zt=(i,e,t)=>i<e?e:i>t?t:i,qh=(i,e,t)=>i+(e-i)*t,Ct=(i,e,t)=>{let n=zt((t-i)/(e-i),0,1);return n*n*(3-2*n)},Ax=`
float igCaustic(vec2 p, float t){
  vec2 q = p;
  q += 0.60 * vec2(sin(p.y * 1.30 + t * 0.80), sin(p.x * 1.10 - t * 0.60));
  q += 0.30 * vec2(sin(q.y * 2.70 - t * 1.10), sin(q.x * 2.30 + t * 0.90));
  float s = sin(q.x * 2.0) + sin(q.y * 2.0) + sin((q.x + q.y) * 1.4 + t * 0.5);
  float c = 1.0 - smoothstep(0.0, 0.45, abs(s));
  return c * c * c;
}`;function Ho(i,e,t=1,n=.55){return i.onBeforeCompile=s=>{s.uniforms.uTime=e.uTime,s.uniforms.uCausColor=e.uCausColor,s.uniforms.uCausK={value:t},s.uniforms.uCausScale={value:n},s.vertexShader=s.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vIgW;
varying vec3 vIgN;`).replace("#include <project_vertex>",`#include <project_vertex>
vIgW = (modelMatrix * vec4(transformed, 1.0)).xyz;
vIgN = normalize(mat3(modelMatrix) * objectNormal);`),s.fragmentShader=s.fragmentShader.replace("#include <common>",`#include <common>
uniform float uTime; uniform vec3 uCausColor; uniform float uCausK; uniform float uCausScale;
varying vec3 vIgW; varying vec3 vIgN;
`+Ax).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  float igUp = clamp(vIgN.y * 0.8 + 0.2, 0.0, 1.0);
  totalEmissiveRadiance += uCausColor * igCaustic(vIgW.xz * uCausScale + vIgW.y * 0.15, uTime) * uCausK * igUp;`)},i.customProgramCacheKey=()=>"igcaus"+t+"_"+n,i}function kt(i,e,t,n=!0){let s=document.createElement("canvas");s.width=i,s.height=e;let r=s.getContext("2d");t(r,i,e);let a=new Ai(s);return n&&(a.colorSpace=Zt),a.anisotropy=4,a}function Rx(i,e,t){let n=Math.sin(i*127.1+e*311.7+t*74.7)*43758.5453;return n-Math.floor(n)}function Cx(i,e,t){let n=Math.floor(i),s=Math.floor(e),r=Math.floor(t),a=i-n,o=e-s,l=t-r,c=a*a*(3-2*a),u=o*o*(3-2*o),f=l*l*(3-2*l),h=0;for(let d=0;d<2;d++)for(let m=0;m<2;m++)for(let M=0;M<2;M++){let g=Rx(n+d,s+m,r+M);h+=g*(d?c:1-c)*(m?u:1-u)*(M?f:1-f)}return h}function xi(i,e,t,n=4){let s=.5,r=0;for(let a=0;a<n;a++)r+=s*Cx(i,e,t),i*=2.03,e*=2.03,t*=2.03,s*=.5;return r}function Vo(){return new We({transparent:!0,depthWrite:!1,blending:vt,uniforms:{uTint:{value:new ge(.85,.95,1)},uOpacity:{value:1}},vertexShader:`
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
      }`})}function Go(){return kt(64,256,(i,e,t)=>{let n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,"rgba(255,255,240,0.55)"),n.addColorStop(.6,"rgba(255,255,240,0.18)"),n.addColorStop(1,"rgba(255,255,240,0)"),i.fillStyle=n,i.fillRect(0,0,e,t);let s=i.getImageData(0,0,e,t);for(let r=0;r<t;r++)for(let a=0;a<e;a++){let o=Math.sin(Math.PI*a/(e-1)),l=(r*e+a)*4+3;s.data[l]=s.data[l]*o*o}i.putImageData(s,0,0)})}function Yh(i){let e=new Bo({canvas:i,antialias:!0,alpha:!1,powerPreference:"low-power"});return e.outputColorSpace=Zt,e.toneMapping=_r,e.toneMappingExposure=1.05,e}var mn=`
float igH2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float igN2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(igH2(i), igH2(i + vec2(1.0, 0.0)), u.x), mix(igH2(i + vec2(0.0, 1.0)), igH2(i + vec2(1.0, 1.0)), u.x), u.y); }
float igF2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * igN2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
`;function Zh(i,e=256,t=256){return kt(e,t,(n,s,r)=>{let a=n.createImageData(s,r);for(let o=0;o<r;o++){let l=1-o/(r-1);for(let c=0;c<s;c++){let u=c/s,f=Math.cos(u*$e),h=Math.sin(u*$e),d=i(l,f,h,u),m=(o*s+c)*4;a.data[m]=d[0],a.data[m+1]=d[1],a.data[m+2]=d[2],a.data[m+3]=255}}n.putImageData(a,0,0)})}var un=(i,e,t)=>[i[0]+(e[0]-i[0])*t,i[1]+(e[1]-i[1])*t,i[2]+(e[2]-i[2])*t],gn=(i,e,t,n)=>Ct(e-n,e+n,i)*(1-Ct(t-n,t+n,i));function Ec(i,e,t){return Math.sin(i*310+e*47)*Math.sin(i*173-e*91)*t}var Px={neon:{color(i,e){let t=un([228,232,226],[128,138,118],Ct(-.2,.9,e)),n=gn(e,-.72,-.08,.07)*(1-Ct(.48,.56,i))*Ct(.04,.12,i);t=un(t,[214,38,52],n*.95);let s=gn(e,.08,.42,.06)*Ct(.12,.22,i)*(1-Ct(.86,.94,i));t=un(t,[40,190,255],s);let r=Ec(i,e,8);return[t[0]+r,t[1]+r,t[2]+r]},glow(i,e){let t=gn(e,.08,.42,.06)*Ct(.12,.22,i)*(1-Ct(.86,.94,i)),n=gn(e,-.72,-.08,.07)*(1-Ct(.48,.56,i))*Ct(.04,.12,i);return[20+20*t+60*n,20+150*t,20+230*t]}},angel:{color(i,e){let t=un([232,230,214],[168,166,150],Ct(-.3,1,e)),n=gn(i,.76,.82,.015)+gn(i,.55,.63,.02)+gn(i,.33,.4,.02)+gn(i,.12,.17,.015)*.8;t=un(t,[34,32,28],zt(n,0,1)*.85);let s=gn(e,.1,.5,.2)*.25;t=un(t,[250,250,245],s);let r=Ec(i,e,6);return[t[0]+r,t[1]+r,t[2]+r]}},discus:{color(i,e){let t=un([214,110,48],[170,72,34],Ct(-.6,1,e)),n=Math.abs(Math.sin(e*11+Math.sin(i*13)*1.2+i*4));t=un(t,[60,190,200],(1-Ct(.05,.3,n))*.85);let s=gn(i,.74,.8,.02)*.35;return t=un(t,[60,30,20],s),t}},guppy:{color(i,e){let t=un([224,222,206],[132,140,118],Ct(-.3,.9,e)),n=gn(i,.18,.42,.05)*gn(e,-.5,.5,.2);return t=un(t,[255,150,60],n*.7),t}},cory:{color(i,e){let t=un([236,226,204],[124,116,100],Ct(-.6,.6,e)),n=Math.sin(i*60)*Math.sin(e*22+i*9)>.55?1:0;t=un(t,[58,52,44],n*.6*Ct(-.4,.2,e));let s=Ec(i,e,10);return[t[0]+s,t[1]+s,t[2]+s]}}},ko={};function Ix(i){if(ko[i])return ko[i];let e=Px[i];return ko[i]={map:Zh(e.color),emissive:e.glow?Zh(e.glow,128,128):null},ko[i]}var Wo=null;function Lx(){return Wo||(Wo=kt(256,256,(i,e,t)=>{let n=i.createRadialGradient(0,t/2,0,0,t/2,e*1.05);n.addColorStop(0,"rgba(255,255,255,0.85)"),n.addColorStop(.7,"rgba(255,255,255,0.45)"),n.addColorStop(1,"rgba(255,255,255,0.12)"),i.fillStyle=n,i.fillRect(0,0,e,t),i.globalCompositeOperation="destination-out",i.strokeStyle="rgba(0,0,0,0.35)",i.lineWidth=3;for(let s=0;s<22;s++){let r=-1.2+s*.11428571428571428;i.beginPath(),i.moveTo(0,t/2),i.lineTo(Math.cos(r)*e*1.2,t/2+Math.sin(r)*e*1.2),i.stroke()}}),Wo)}function Nx(i,e=!0){let t=new gs;t.moveTo(i[0][0],i[0][1]);for(let o=1;o<i.length;o++){let l=i[o];l.length===4?t.quadraticCurveTo(l[0],l[1],l[2],l[3]):t.lineTo(l[0],l[1])}let n=new ur(t,16);n.computeBoundingBox();let s=n.boundingBox,r=n.attributes.uv,a=n.attributes.position;for(let o=0;o<r.count;o++)r.setXY(o,(a.getX(o)-s.min.x)/(s.max.x-s.min.x||1),(a.getY(o)-s.min.y)/(s.max.y-s.min.y||1));return n}function Tc(i,e=.85){return new xt({color:i,map:Lx(),transparent:!0,opacity:e,side:wt,roughness:.5,metalness:0,depthWrite:!1})}var Pr={slim:i=>Math.pow(Math.sin(Math.PI*zt(i*1.02,0,1)),.72)*(.16+.84*Ct(0,.34,i)),deep:i=>Math.pow(Math.sin(Math.PI*zt(i,0,1)),.85)*(.14+.86*Ct(0,.3,i)),round:i=>Math.sqrt(Math.max(0,1-Math.pow(2.05*i-1.08,2)))*(.14+.86*Ct(0,.18,i)),flat:i=>Math.pow(Math.sin(Math.PI*zt(i*1.02,0,1)),.6)*(.2+.8*Ct(0,.3,i))};function Dx(i,e,t,n,s=1){let r=new Rt(1,56,36);r.rotateZ(-Math.PI/2);let a=r.attributes.position;for(let o=0;o<a.count;o++){let l=a.getX(o),c=a.getY(o),u=a.getZ(o),f=(l+1)/2,h=n(f),d=c*e*h;c<0&&(d*=s);let m=Ct(.85,1,f);a.setXYZ(o,l*i/2,d+m*e*.04,u*t*h*(.55+.45*Math.sqrt(Math.max(0,1-c*c))))}return r.computeVertexNormals(),r}function Ux(i,e,t,n){var r,a;let s=new xt({map:i.map,roughness:(r=n.rough)!=null?r:.42,metalness:(a=n.metal)!=null?a:.08,emissiveMap:i.emissive||null,emissive:i.emissive?new ge(1,1,1):new ge(0,0,0),emissiveIntensity:i.emissive?.55:0});return s.onBeforeCompile=o=>{o.uniforms.uSwim=e.uSwim,o.uniforms.uAmp=e.uAmp,o.uniforms.uHalf={value:t/2},o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
uniform float uSwim; uniform float uAmp; uniform float uHalf;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        float xn = transformed.x / uHalf;
        float tail = clamp((0.45 - xn) / 1.45, 0.0, 1.0);
        transformed.z += sin(uSwim - xn * 2.6) * uAmp * uHalf * tail * tail;`)},s.customProgramCacheKey=()=>"igswim",s}function Fx(i,e,t,n,s){let r=new xt({color:14275256,roughness:.3,metalness:.2}),a=new xt({color:328965,roughness:.05,metalness:0}),o=new Rt(s,16,12),l=new Rt(s*.62,16,12);[1,-1].forEach(c=>{let u=new Ee(o,r);u.position.set(e,t,n*c),u.scale.set(1,1,.55),i.add(u);let f=new Ee(l,a);f.position.set(e+s*.08,t,n*c+c*s*.3),f.scale.set(1,1,.6),i.add(f)})}function Jh(i){let e={uSwim:{value:Y(0,$e)},uAmp:{value:.12}},t=new Qt,n=Ix(i),s,r,a,o,l,c,u=1,f={};i==="neon"?(s=.72,r=.145,a=.085,o=Pr.slim,c=14213862,f={rough:.32,metal:.18}):i==="angel"?(s=1.35,r=.62,a=.12,o=Pr.deep,c=15263448,f={rough:.35,metal:.2}):i==="discus"?(s=1.55,r=.78,a=.17,o=Pr.round,c=13662780,f={rough:.4,metal:.1}):i==="guppy"?(s=.55,r=.13,a=.07,o=Pr.slim,c=16747068,f={rough:.35,metal:.15}):(s=.72,r=.2,a=.15,o=Pr.flat,c=13616301,u=.55,f={rough:.6,metal:.05});let h=new Ee(Dx(s,r,a,o,u),Ux(n,e,s,f));t.add(h),Fx(t,s*.34,r*.14,a*.62,r*(i==="angel"||i==="discus"?.1:.2));let d=s/2,m=(S,C,_)=>new Ee(Nx(S),Tc(C,_)),M=new Qt;M.position.x=-d*.98,t.add(M);let g;if(i==="guppy"){let S=[16742958,3116287,16727930,16763194,10181887];c=S[Math.floor(Math.random()*S.length)],g=[[0,0],[-.1,.16,-.46,.2],[-.52,0,-.46,-.2],[-.1,-.16,0,0]]}else i==="angel"?g=[[0,0],[-.1,.1,-.38,.26],[-.26,0,-.38,-.26],[-.1,-.1,0,0]]:i==="discus"?g=[[0,0],[-.06,.08,-.2,.14],[-.16,0,-.2,-.14],[-.06,-.08,0,0]]:g=[[0,0],[-.06,.05,-.22*s/.72,.13*s/.72],[-.12*s/.72,0,-.22*s/.72,-.13*s/.72],[-.06,-.05,0,0]];let p=m(g,c,i==="guppy"?.95:.75);if(M.add(p),i==="angel"){t.add(m([[d*.25,r*.5],[-d*.1,r*1.6,-d*.95,r*2.1],[-d*.6,r*1,-d*.55,r*.35]],c,.7)),t.add(m([[d*.25,-r*.5],[-d*.1,-r*1.6,-d*.95,-r*2.1],[-d*.6,-r*1,-d*.55,-r*.35]],c,.7));let S=new Ee(new Je(.015,r*2.2),Tc(15789794,.8));S.position.set(d*.35,-r*1.3,.02),S.rotation.z=.25,t.add(S);let C=S.clone();C.position.z=-.02,t.add(C)}else if(i==="discus")t.add(m([[d*.55,r*.62],[0,r*1.12,-d*.8,r*.55],[-d*.75,r*.35]],c,.6)),t.add(m([[d*.45,-r*.62],[0,-r*1.12,-d*.8,-r*.55],[-d*.75,-r*.35]],c,.6));else if(i==="guppy")t.add(m([[d*.05,r*.55],[-d*.3,r*1.8,-d*.75,r*1.2],[-d*.5,r*.4]],c,.9));else if(i==="cory"){t.add(m([[d*.15,r*.6],[0,r*1.9,-d*.25,r*1.5],[-d*.3,r*.55]],c,.75));let S=new Ee(new Je(.06,.008),Tc(15129798,.9));S.position.set(d*1.02,-r*.35,a*.3),S.rotation.z=-.5,t.add(S);let C=S.clone();C.position.z=-a*.3,t.add(C)}else t.add(m([[d*.05,r*.62],[-d*.15,r*1.3,-d*.35,r*1.1],[-d*.3,r*.5]],c,.65)),t.add(m([[-d*.05,-r*.55],[-d*.25,-r*1.05,-d*.55,-r*.85],[-d*.5,-r*.4]],c,.6));let b=m([[0,0],[-.04*s,.06*s,-.16*s,.02*s],[-.1*s,-.04*s,0,0]],c,.5),A=b.clone(),v=b.clone();A.position.set(d*.45,-r*.25,a*.75),v.position.set(d*.45,-r*.25,-a*.75),A.rotation.y=-.6,v.rotation.y=.6,t.add(A),t.add(v);let w=(S,C,_)=>{let y=zt((.45-S)/1.45,0,1);return Math.sin(C-S*2.6)*_*d*y*y};return{kind:i,group:t,len:s,h:r,uniforms:e,caudal:M,pl:A,pr:v,animate(S,C){e.uSwim.value=S,e.uAmp.value=C;let _=w(-.98,S,C),y=w(-.9,S,C);M.position.z=_,M.rotation.y=Math.atan2(_-y,d*.08)*1.4,A.rotation.y=-.6+Math.sin(S*1.3)*.25,v.rotation.y=.6-Math.sin(S*1.3)*.25}}}var wc={blue:{fog:1923191,top:7323872,deep:535104,caus:[.55,.62,.55],sun:16774108,hemi:9425134},green:{fog:2054732,top:8834480,deep:535588,caus:[.55,.6,.45],sun:16187356,hemi:10936512},violet:{fog:2959974,top:10261984,deep:854828,caus:[.5,.48,.62],sun:15788287,hemi:12103935}},_i={x:11,yTop:8.6,zBack:-5,zFront:3.2,floor:0};function Kh(i,e){let t=new It,n=new ht(40,16/9,.1,80);n.position.set(0,4.1,13.2);let s=new P(0,3.5,-.8);n.lookAt(s);let r={uTime:{value:0},uCausColor:{value:new ge(.55,.62,.55)}},a=wc.blue;t.fog=new Ti(a.fog,.048);let o=new We({side:Et,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new ge(a.top)},uDeep:{value:new ge(a.deep)},uTime:r.uTime},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uTop; uniform vec3 uDeep; uniform float uTime; varying vec3 vP;
      void main(){ float h = clamp(normalize(vP).y * 1.6 + 0.35, 0.0, 1.0); vec3 c = mix(uDeep, uTop, pow(h, 1.4));
      gl_FragColor = vec4(c, 1.0); }`});t.add(new Ee(new Rt(40,32,16),o));let l=new Pi(a.hemi,9075290,1.1);t.add(l);let c=new hi(a.sun,2.4);c.position.set(-3,14,6),t.add(c);let u=new hi(10475775,.5);u.position.set(6,3,10),t.add(u);let f=kt(512,512,(J,E,x)=>{J.fillStyle="#cdb893",J.fillRect(0,0,E,x);for(let D=0;D<26e3;D++){let N=Math.random();J.fillStyle=N<.45?`rgba(110,90,62,${.18+Math.random()*.25})`:N<.9?`rgba(245,236,214,${.2+Math.random()*.3})`:`rgba(60,55,50,${.3})`;let z=Math.random()*1.8+.4;J.fillRect(Math.random()*E,Math.random()*x,z,z)}});f.wrapS=f.wrapT=is,f.repeat.set(6,4);let h=new Je(34,22,170,110);h.rotateX(-Math.PI/2);{let J=h.attributes.position;for(let E=0;E<J.count;E++){let x=J.getX(E),D=J.getZ(E);J.setY(E,(xi(x*.18,0,D*.25)-.5)*.9+Math.max(0,-D-2)*.12)}h.computeVertexNormals()}let d=new Ee(h,Ho(new xt({map:f,roughness:.95,metalness:0,color:12101772}),r,.55,1.35));d.position.set(0,0,0),t.add(d);let m=Ho(new xt({color:7828331,roughness:.88,metalness:.02,flatShading:!1}),r,.22,2.6);function M(J,E,x,D){let N=new ai(1,5),z=N.attributes.position,re=Y(0,50);for(let q=0;q<z.count;q++){let Q=new P(z.getX(q),z.getY(q),z.getZ(q)),ce=xi(Q.x*1.4+re,Q.y*1.4,Q.z*1.4,5);Q.multiplyScalar(.75+ce*.55),Q.y*=D,Q.y<-.2&&(Q.y=-.2+(Q.y+.2)*.2),z.setXYZ(q,Q.x,Q.y,Q.z)}N.computeVertexNormals();let oe=new Ee(N,m);return oe.position.set(J,.1*x,E),oe.scale.setScalar(x),oe.rotation.y=Y(0,$e),t.add(oe),oe}M(-5.8,-1.2,1.25,.72),M(-4.5,-2.2,.8,.9),M(3.2,-.6,1,.65),M(6.8,-2.6,1.5,.85),M(1.2,-3.4,.7,.8),M(-1.8,.8,.45,.6);let g=Ho(new xt({color:5914152,roughness:.85}),r,.18,2.6),p=(J,E)=>{let x=new ms(J.map(oe=>new P(...oe))),D=new dr(x,48,E,10,!1),N=D.attributes.position,z=48,re=11;for(let oe=0;oe<=z;oe++){let q=1-oe/z*.75,Q=x.getPointAt(oe/z);for(let ce=0;ce<re;ce++){let we=oe*re+ce;if(we>=N.count)continue;let ue=new P(N.getX(we),N.getY(we),N.getZ(we)).sub(Q).multiplyScalar(q).add(Q);N.setXYZ(we,ue.x,ue.y,ue.z)}}return D.computeVertexNormals(),t.add(new Ee(D,g)),x},b=p([[-3.6,.1,-1.4],[-2.2,.8,-1.8],[-1,2.3,-2.4],[-.2,4,-2.9],[.3,5.4,-3.2]],.34);p([[-1.2,2.1,-2.3],[.4,2.8,-2],[1.8,3.9,-2.2],[2.6,4.6,-2.5]],.18),p([[-2.6,.6,-1.6],[-4,1.3,-2.2],[-5,2.4,-2.8]],.16);{let J=new xt({color:4155948,roughness:1}),E=new ai(.045,0),x=new on(E,J,900),D=new tt,N=new Ft;for(let z=0;z<900;z++){let re=b.getPointAt(Math.random()*.85);D.compose(new P(re.x+Y(-.26,.26),re.y+Y(.12,.3),re.z+Y(-.26,.26)),N.setFromEuler(new tn(Y(0,3),Y(0,3),0)),new P(1,1,1).multiplyScalar(Y(.6,1.4))),x.setMatrixAt(z,D)}t.add(x)}function A(J,E,x,D={}){let N=new xt({color:16777215,side:wt,roughness:.6,metalness:0,...D});return N.onBeforeCompile=z=>{z.uniforms.uTime=r.uTime,z.uniforms.uLow={value:new ge(J)},z.uniforms.uHigh={value:new ge(E)},z.uniforms.uAmp={value:x},z.vertexShader=z.vertexShader.replace("#include <common>",`#include <common>
attribute float aPhase; attribute float aHue; uniform float uTime; uniform float uAmp; varying float vH; varying float vHue;`).replace("#include <begin_vertex>",`#include <begin_vertex>
          vH = uv.y; vHue = aHue;
          float bend = uv.y * uv.y;
          transformed.x += sin(uTime * 0.7 + aPhase + uv.y * 2.0) * uAmp * bend;
          transformed.z += cos(uTime * 0.55 + aPhase * 1.3 + uv.y * 1.5) * uAmp * 0.6 * bend;`),z.fragmentShader=z.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uLow; uniform vec3 uHigh; varying float vH; varying float vHue;`).replace("#include <color_fragment>",`#include <color_fragment>
  diffuseColor.rgb *= mix(uLow, uHigh, smoothstep(0.0, 1.0, vH)) * (0.85 + 0.3 * vHue);`)},N.customProgramCacheKey=()=>"igsway"+J+E+x,N}function v(J,E,x,D){let N=new on(J,E,x),z=new Float32Array(x),re=new Float32Array(x),oe=new tt;for(let q=0;q<x;q++)D(oe,q),N.setMatrixAt(q,oe),z[q]=Y(0,$e),re[q]=Math.random();return J.setAttribute("aPhase",new si(z,1)),J.setAttribute("aHue",new si(re,1)),t.add(N),N}let w=new Ft,S=new tn,C=new P,_=new P,y=new Je(1,1,1,14);y.translate(0,.5,0);{let J=y.attributes.position;for(let E=0;E<J.count;E++){let x=J.getY(E);J.setX(E,J.getX(E)*(1-x*.7))}}v(y,A(3041850,8831088,.9),150,(J,E)=>{let x=Y(-12,12),D=Y(-5.2,-3.2);J.compose(C.set(x,0,D),w.setFromEuler(S.set(0,Y(-.8,.8),Y(-.08,.08))),_.set(Y(.12,.2),Y(4.5,8.2),1))});let R=new Je(1,1,4,10);R.translate(0,.5,0);{let J=R.attributes.position;for(let E=0;E<J.count;E++){let x=J.getY(E),D=J.getX(E);J.setX(E,D*Math.sin(Math.PI*Math.min(1,x*1.05))*1),J.setZ(E,-x*x*.35+Math.abs(D)*.08)}R.computeVertexNormals()}let L=[[-7.8,-1.6],[4.6,-1.8],[8.9,-.6],[-2.8,-.2]];v(R,A(2910772,8372322,.12),L.length*16,(J,E)=>{let x=L[Math.floor(E/16)],D=E%16/16*$e+Y(-.2,.2);w.setFromEuler(S.set(Y(.35,.75),D,0,"YXZ")),J.compose(C.set(x[0],0,x[1]),w,_.set(Y(.45,.6),Y(1.7,2.6),1))});let I=new Je(.34,.1,2,1),B=[[-9.6,-2.4,1],[-6.6,-3.2,0],[-.8,-3.6,1],[5.6,-3,0],[9.8,-3.4,1],[2.4,-2.8,0],[-4.2,-3.8,0]],U=new xt({color:4876852,roughness:.8});B.forEach(([J,E,x])=>{let D=3+Math.floor(Math.random()*3),N=28;for(let z=0;z<D;z++){let re=3.6+z*.5,oe=new Ee(new Jt(.018,.025,re,5),x?new xt({color:8010282,roughness:.8}):U);oe.position.set(J+z*.28-D*.14,re/2+.1,E+z%2*.2),t.add(oe)}v(I.clone(),A(x?6965802:3832376,x?14177854:10146410,.35),D*N,(z,re)=>{let oe=Math.floor(re/N),q=re%N/N,Q=Y(3.2,5.2)*0+(3.6+oe*.5)*q;w.setFromEuler(S.set(0,re%2*Math.PI+re*1.3%1*.6,(re%2?1:-1)*.35)),z.compose(C.set(J+oe*.28-D*.14+Math.sin(q*5)*.05,.1+Q,E+oe%2*.2),w,_.set(1-q*.3,1,1))})});let G=new Je(.035,1,1,3);G.translate(0,.5,0),v(G,A(3107376,9227618,.05),4200,(J,E)=>{let x=Math.floor(E/300),D=-10+x*1.6+Y(-.6,.6),N=Y(.2,2.8);J.compose(C.set(D+Y(-.7,.7),-.05,N),w.setFromEuler(S.set(Y(-.2,.2),Y(0,$e),Y(-.25,.25))),_.set(1,Y(.18,.42),1))});let K=new Lt({map:Go(),transparent:!0,blending:vt,depthWrite:!1,fog:!1,opacity:.22,side:wt}),V=[];for(let J=0;J<7;J++){let E=new Ee(new Je(Y(1.2,2.4),12),K.clone());E.position.set(-10+J*3.3+Y(-.6,.6),4.2,Y(-4,-1)),E.rotation.z=-.25,E.userData.ph=Y(0,$e),t.add(E),V.push(E)}let Z=new We({transparent:!0,depthWrite:!1,blending:vt,side:wt,fog:!1,uniforms:{uTime:r.uTime},vertexShader:"varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW,1.0); }",fragmentShader:`uniform float uTime; varying vec3 vW;
      
      float c2(vec2 p, float t){ vec2 q = p + 0.6*vec2(sin(p.y*1.3+t*0.8), sin(p.x*1.1-t*0.6)); float s = sin(q.x*2.0)+sin(q.y*2.0)+sin((q.x+q.y)*1.4+t*0.5); float c = 1.0 - smoothstep(0.0,0.6,abs(s)); return c*c; }
      void main(){ float c = c2(vW.xz*1.4, uTime*1.1); float fade = smoothstep(-8.0, 3.0, vW.z); gl_FragColor = vec4(vec3(0.75,0.9,1.0) * (0.06 + c*0.22) * fade, 1.0); }`}),k=new Ee(new Je(40,14,1,1),Z);k.rotation.x=Math.PI/2,k.position.set(0,_i.yTop+.2,-1),t.add(k);let j=160,ee=new on(new Rt(1,16,12),Vo(),j),Se=[];for(let J=0;J<j;J++)Se.push({y:Y(0,8.5),x:0,z:0,r:Y(.025,.07),v:Y(.9,1.6),w:Y(0,$e)});t.add(ee);let ye=new Ee(new Jt(.28,.32,.18,20),new xt({color:5659230,roughness:.9}));ye.position.set(8.2,.25,-2.2),t.add(ye);let et=500,Xe=new Float32Array(et*3);for(let J=0;J<et;J++)Xe[J*3]=Y(-12,12),Xe[J*3+1]=Y(0,9),Xe[J*3+2]=Y(-5,4);let Ye=new ut;Ye.setAttribute("position",new ot(Xe,3));let te=new En(Ye,new On({color:16776168,size:.035,transparent:!0,opacity:.55,depthWrite:!1}));t.add(te);let ne=[];function he(J,E,x,D){let N=Jh(J);return N.pos=new P(E,x,D),N.vel=new P(Y(-1,1),0,Y(-.3,.3)),N.swim=Y(0,$e),N.wander=Y(0,$e),N.rest=0,N.speed={neon:1.25,angel:.55,discus:.45,guppy:.95,cory:.35}[J]*Y(.85,1.15),N.group.position.copy(N.pos),t.add(N.group),ne.push(N),N}let Fe=new P(0,4,-1),de=new P(0,4,-1);for(let J=0;J<34;J++)he("neon",Y(-3,3),Y(2.8,5.4),Y(-2.5,1));he("angel",-3,5,-1.5),he("angel",2.5,4.4,-.8),he("discus",4.5,3.2,-1.2);for(let J=0;J<6;J++)he("guppy",Y(-8,8),Y(5.5,7.5),Y(-2,1.5));for(let J=0;J<4;J++)he("cory",Y(-6,6),.35,Y(-.5,1.8)).vel.set(Y(-.3,.3),0,0);let Ge=new P,mt=new P,ke=new Ft().setFromAxisAngle(new P(0,1,0),Math.PI/2),nt=new Ft,lt=new tt,ae=new P(0,1,0),ie=new P,Ie=new P;function ze(J,E){let x=J.pos,D=J.vel;if(ie.set(0,0,0),J.kind==="neon"){ie.copy(de).sub(x).multiplyScalar(.18),Ie.set(0,0,0);let oe=0,q=new P;for(let Q of ne){if(Q===J||Q.kind!=="neon")continue;let ce=x.distanceTo(Q.pos);ce<.75&&Ie.add(x.clone().sub(Q.pos).multiplyScalar((.75-ce)*5)),ce<1.4&&(q.add(Q.vel),oe++)}ie.add(Ie),oe&&ie.add(q.multiplyScalar(.4/oe))}else if(J.kind==="cory"){if(J.rest>0){J.rest-=E,D.multiplyScalar(.92);return}J.wander+=Y(-1,1)*E*2,ie.set(Math.cos(J.wander),0,Math.sin(J.wander)*.4),Math.random()<E*.3&&(J.rest=Y(1.5,4))}else J.wander+=Y(-1,1)*E*.9,ie.set(Math.cos(J.wander),Math.sin(J.wander*.7)*.25,Math.sin(J.wander*.6)*.35);let N=_i.x-1.2;x.x>N&&(ie.x-=(x.x-N)*2),x.x<-N&&(ie.x+=(-N-x.x)*2);let z=J.kind==="cory"?.3:1.4,re=J.kind==="cory"?.45:_i.yTop-.9;x.y>re&&(ie.y-=(x.y-re)*2),x.y<z&&(ie.y+=(z-x.y)*2),x.z>_i.zFront-.8&&(ie.z-=(x.z-_i.zFront+.8)*2),x.z<_i.zBack+1.2&&(ie.z+=(_i.zBack+1.2-x.z)*2),ie.normalize().multiplyScalar(J.speed),D.lerp(ie,zt(E*1.2,0,1)),J.kind==="cory"&&(D.y=0,x.y=qh(x.y,.38,.1))}let Ne=0,_e=0;function F(J,E,x){Ne+=J*E,r.uTime.value=Ne,Math.random()<J*E*.2&&Fe.set(Y(-7,7),Y(2.4,6.2),Y(-3,1)),de.lerp(Fe,zt(J*E*.25,0,1));for(let N of ne){ze(N,J*E),N.pos.addScaledVector(N.vel,J*E),N.group.position.copy(N.pos);let z=N.vel.length();z>.02&&(mt.copy(N.vel).normalize(),mt.y=zt(mt.y,-.35,.35),mt.normalize(),lt.lookAt(Ge,mt,ae),nt.setFromRotationMatrix(lt).multiply(ke),N.group.quaternion.slerp(nt,zt(J*E*2.5,0,1))),N.swim+=J*E*(5+z*6),N.animate(N.swim,.06+Math.min(.12,z*.08))}for(let N=0;N<j;N++){let z=Se[N];z.y+=z.v*J*E,z.y>_i.yTop&&(z.y=.3,z.w=Y(0,$e)),z.x=ye.position.x+Math.sin(z.y*2.2+z.w)*.12*(.3+z.y*.08),z.z=ye.position.z+Math.cos(z.y*1.7+z.w)*.1;let re=z.r*(1+z.y*.04);lt.makeScale(re,re*.9,re).setPosition(z.x,z.y,z.z),ee.setMatrixAt(N,lt)}ee.instanceMatrix.needsUpdate=!0;let D=Ye.attributes.position;for(let N=0;N<et;N++){let z=D.getY(N)+Math.sin(Ne*.3+N)*.002*E;D.setY(N,z),D.setX(N,D.getX(N)+Math.cos(Ne*.2+N*.7)*.0015*E)}D.needsUpdate=!0,V.forEach(N=>{N.material.opacity=.14+Math.sin(Ne*.35+N.userData.ph)*.08,N.position.x+=Math.sin(Ne*.1+N.userData.ph)*.002}),x||(_e+=J*.08,n.position.x=Math.sin(_e)*.6,n.position.y=4.3+Math.sin(_e*.7)*.15,n.lookAt(s))}function Ke(J){let E=wc[J]||wc.blue;E!==a&&(a=E,t.fog.color.set(E.fog),o.uniforms.uTop.value.set(E.top),o.uniforms.uDeep.value.set(E.deep),r.uCausColor.value.setRGB(...E.caus),l.color.set(E.hemi),c.color.set(E.sun))}Ke("blue"),a=null,Ke("blue");for(let J=0;J<90;J++)F(1/30,1,!0);return{scene:t,camera:n,update:F,setWater:Ke,resize(J,E){n.aspect=J/Math.max(1,E),n.fov=n.aspect<1.2?55:40,n.updateProjectionMatrix()}}}var Rs={blue:3844351,green:3727526,violet:10648575};function Ac(i,e){let t=new It;t.background=new ge(461590);let n=new ht(38,16/9,.1,60);n.position.set(0,4.4,15),n.lookAt(0,4.3,0);let s={value:new ge(Rs.blue)},r={value:0},a=kt(256,256,(V,Z,k)=>{let j=V.createRadialGradient(Z/2,k/2,0,Z/2,k/2,Z/2);j.addColorStop(0,"rgba(255,255,255,1)"),j.addColorStop(.35,"rgba(255,255,255,0.35)"),j.addColorStop(1,"rgba(255,255,255,0)"),V.fillStyle=j,V.fillRect(0,0,Z,k)},!1),o=new Ee(new Je(40,20),new xt({color:1382950,roughness:.95}));o.position.set(0,8,-4),t.add(o);let l=new Ee(new Je(40,20),new xt({color:921881,roughness:.55,metalness:.1}));l.rotation.x=-Math.PI/2,t.add(l);let c=new Ee(new Je(12,16),new Lt({map:a,transparent:!0,blending:vt,depthWrite:!1,opacity:.35}));c.position.set(0,5,-3.95),t.add(c);let u=new Ee(new Je(9,5),new Lt({map:a,transparent:!0,blending:vt,depthWrite:!1,opacity:.55}));u.rotation.x=-Math.PI/2,u.position.y=.01,t.add(u);let f=new vs(Rs.blue,30,18,1.6);f.position.set(0,1.2,.5),t.add(f);let h=new vs(Rs.blue,12,14,1.6);h.position.set(0,6,.8),t.add(h),t.add(new gr(2240580,.6));let d=1.05,m=8.4,M=.7,g=new We({transparent:!0,depthWrite:!1,uniforms:{uColor:s,uTime:r},vertexShader:"varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uColor; uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        float h = (vP.y + ${(m/2).toFixed(2)}) / ${m.toFixed(2)};
        float fall = mix(1.0, 0.35, pow(h, 0.8));
        float facing = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float core = pow(facing, 1.6);
        float ripple = 0.9 + 0.1 * sin(vP.y * 3.0 - uTime * 1.5 + vP.x * 4.0);
        vec3 c = uColor * (0.25 + core * 1.1) * fall * ripple;
        gl_FragColor = vec4(c, 0.78);
      }`}),p=new Ee(new Jt(d*.96,d*.96,m,64,1,!0),g);p.position.y=M+m/2,t.add(p);let b=new We({transparent:!0,depthWrite:!1,blending:vt,uniforms:{uColor:s},vertexShader:"varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uColor; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = 1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(f, 3.0) * 0.9;
        float streak = smoothstep(0.62, 0.7, vN.x) * (1.0 - smoothstep(0.7, 0.8, vN.x)) * 0.35 + smoothstep(-0.5,-0.45,vN.x)*(1.0-smoothstep(-0.45,-0.4,vN.x))*0.15;
        gl_FragColor = vec4(vec3(rim) * mix(vec3(1.0), uColor, 0.4) + vec3(streak), 1.0); }`}),A=new Ee(new Jt(d,d,m,64,1,!0),b);A.position.y=M+m/2,t.add(A);let v=new xt({color:1777448,roughness:.35,metalness:.8}),w=new Ee(new Jt(d*1.35,d*1.45,M,48),v);w.position.y=M/2,t.add(w);let S=new Ee(new Jt(d*1.12,d*1.12,.3,48),v);S.position.y=M+m+.15,t.add(S);let C=new Ee(new hr(d*1.02,.05,12,64),new Lt({color:Rs.blue}));C.rotation.x=Math.PI/2,C.position.y=M+.02,t.add(C);let _=220,y=Vo(),R=new on(new Rt(1,20,14),y,_);t.add(R);let L=[];function I(V,Z){let k=Y(0,$e),j=Math.sqrt(Math.random())*d*.55;V.x=Math.cos(k)*j,V.z=Math.sin(k)*j,V.y=Z!=null?Z:M+Y(0,.3),V.r=Math.random()<.15?Y(.16,.28):Y(.04,.12),V.v=.9+(.3-V.r)*1.8,V.w=Y(0,$e)}for(let V=0;V<_;V++){let Z={};I(Z,M+Y(0,m)),L.push(Z)}let B=new tt,U=0;function G(V,Z){U+=V*Z,r.value=U;for(let j=0;j<_;j++){let ee=L[j];ee.y+=ee.v*V*Z,ee.y>M+m-ee.r&&I(ee);let Se=ee.x+Math.sin(ee.y*1.6+ee.w)*.12,ye=ee.z+Math.cos(ee.y*1.3+ee.w)*.1,et=1+Math.sin(U*6+ee.w)*.06;B.makeScale(ee.r*et,ee.r/et*.92,ee.r*et).setPosition(zt(Se,-d*.8,d*.8),ee.y,zt(ye,-d*.8,d*.8)),R.setMatrixAt(j,B)}R.instanceMatrix.needsUpdate=!0;let k=.9+Math.sin(U*.6)*.1;f.intensity=30*k,c.material.opacity=.32*k}function K(V){let Z=Rs[V]||Rs.blue;s.value.set(Z),f.color.set(Z),h.color.set(Z),C.material.color.set(Z),c.material.color.set(Z),u.material.color.set(Z),y.uniforms.uTint.value.set(Z).lerp(new ge(1,1,1),.55)}K("blue");for(let V=0;V<30;V++)G(1/30,1);return{scene:t,camera:n,update:G,setWater:K,resize(V,Z){n.aspect=V/Math.max(1,Z),n.fov=n.aspect<1.2?60:38,n.updateProjectionMatrix()}}}function $h(i,e){let t=new It,n=new ht(35,1,.1,50);n.position.set(0,0,10);let s=new Ee(new Je(30,30),new We({depthWrite:!1,uniforms:{uA:{value:new ge(993861)},uB:{value:new ge(2828902)},uC:{value:new ge(2056075)}},vertexShader:"varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec2 vU;
      void main(){ float r = distance(vU, vec2(0.5)); vec3 c = mix(uC, uA, smoothstep(0.0, 0.35, r)); c = mix(c, uB, smoothstep(0.25, 0.7, vU.y) * 0.45);
      gl_FragColor = vec4(c, 1.0); }`}));s.position.z=-8,t.add(s);let r={value:0},a={value:0},o=new Ee(new Rt(1,128,96),new We({transparent:!0,uniforms:{uT:r,uBreath:a},vertexShader:`uniform float uT; uniform float uBreath; varying vec3 vN; varying vec3 vV; varying vec3 vP;
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
      }`}));t.add(o);let l=kt(256,256,(R,L,I)=>{let B=R.createRadialGradient(L/2,I/2,0,L/2,I/2,L/2);B.addColorStop(0,"rgba(255,255,255,0.9)"),B.addColorStop(.25,"rgba(255,255,255,0.35)"),B.addColorStop(1,"rgba(255,255,255,0)"),R.fillStyle=B,R.fillRect(0,0,L,I)},!1),c=new Ee(new Je(1,1),new Lt({map:l,color:9426687,transparent:!0,blending:vt,depthWrite:!1,opacity:.55}));c.position.z=-.5,t.add(c);let u={value:0},f={value:1},h=new Ee(new _s(2.35,2.4,160,1),new We({transparent:!0,depthWrite:!1,uniforms:{uP:u,uIn:f},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform float uP; uniform float uIn; varying vec2 vP;
      void main(){ float a = atan(vP.x, vP.y); a = a < 0.0 ? a + 6.2831853 : a; float k = a / 6.2831853;
        float on = step(k, uP);
        vec3 c = mix(vec3(0.6, 0.72, 0.86), mix(vec3(0.95, 0.85, 1.0), vec3(0.75, 0.95, 1.0), uIn), on);
        gl_FragColor = vec4(c, mix(0.18, 0.85, on)); }`}));t.add(h);let d=[];for(let R=0;R<3;R++){let L=new Ee(new _s(.98,1,128),new Lt({color:12576511,transparent:!0,opacity:0,depthWrite:!1,blending:vt}));t.add(L),d.push({m:L,life:1})}let m=0,M=420,g=new Float32Array(M*3),p=[];for(let R=0;R<M;R++){let L=Y(0,$e),I=Y(1.4,4.2),B=Y(-2,1);p.push({a:L,r:I,z:B,s:Y(.02,.08),w:Y(0,$e)})}let b=new ut;b.setAttribute("position",new ot(g,3));let A=kt(64,64,(R,L,I)=>{let B=R.createRadialGradient(L/2,I/2,0,L/2,I/2,L/2);B.addColorStop(0,"rgba(255,255,255,1)"),B.addColorStop(1,"rgba(255,255,255,0)"),R.fillStyle=B,R.fillRect(0,0,L,I)},!1),v=new En(b,new On({map:A,color:13625599,size:.09,transparent:!0,opacity:.8,depthWrite:!1,blending:vt}));t.add(v);let w=0,S=0,C=null,_=R=>.5-.5*Math.cos(Math.PI*zt(R,0,1));function y(R,L,I,B){let U=B.guiding&&!I;U&&(w+=R),r.value=w;let G;B.guiding?G=B.inhale?_(B.progress):1-_(B.progress):G=.35,S=I?G:S+(G-S)*zt(R*6,0,1),a.value=S;let K=1.05+S*.75;o.scale.setScalar(K),c.scale.setScalar(K*5.2),c.material.opacity=.38+S*.22,u.value=B.guiding?zt(B.progress,0,1):0,f.value=B.inhale?1:0,h.visible=B.guiding;let V=B.guiding?B.inhale?"in":"out":"idle";if(V!==C){if(B.guiding&&!I){let k=d[m++%d.length];k.life=0}C=V}d.forEach(k=>{k.life<1?(k.life=Math.min(1,k.life+R/3.5),k.m.scale.setScalar(K*(1+k.life*1.6)),k.m.material.opacity=(1-k.life)*.45):k.m.material.opacity=0});let Z=b.attributes.position;for(let k=0;k<M;k++){let j=p[k],ee=j.r*(.85+S*.3)+(U?Math.sin(w*.4+j.w)*.08:0),Se=j.a+(U?w*.02*(k%2?1:-1):0);Z.setXYZ(k,Math.cos(Se)*ee,Math.sin(Se)*ee*.95,j.z)}Z.needsUpdate=!0}return{scene:t,camera:n,update:y,setWater(){},resize(R,L){n.aspect=R/Math.max(1,L);let I=n.aspect<1?1/n.aspect:1;n.position.z=10*I,n.updateProjectionMatrix()}}}var Rc={blue:{top:1855366,deep:132623,glow:[.55,.8,1],rim:[.75,.9,1]},green:{top:1335386,deep:133641,glow:[.5,1,.85],rim:[.75,1,.9]},violet:{top:4860550,deep:328463,glow:[.85,.65,1],rim:[1,.8,1]}};function jh(i,e){let t=new It,n=new ht(42,16/9,.1,80);n.position.set(0,0,14);let s=Rc.blue;t.fog=new Ti(s.deep,.028);let r={value:0},a={value:new ge().setRGB(...s.glow)},o={value:new ge().setRGB(...s.rim)},l=new We({side:Et,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new ge(s.top)},uDeep:{value:new ge(s.deep)},uT:r},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 uTop; uniform vec3 uDeep; uniform float uT; varying vec3 vP;
      void main(){ vec3 n = normalize(vP); float h = clamp(n.y * 1.1 + 0.55, 0.0, 1.0);
        float wave = 0.08 * sin(n.x * 5.0 + uT * 0.2) * sin(n.y * 3.0 - uT * 0.15);
        vec3 c = mix(uDeep, uTop, pow(h, 1.6) + wave);
        gl_FragColor = vec4(c, 1.0); }`});t.add(new Ee(new Rt(40,32,16),l));let c=new Rt(1,72,28,0,$e,0,Math.PI*.55);{let _=c.attributes.position;for(let y=0;y<_.count;y++)_.setY(y,_.getY(y)*.62);c.computeVertexNormals()}let u=new We({transparent:!0,depthWrite:!1,side:wt,blending:vt,uniforms:{uT:r,uGlow:a,uRim:o,uPulse:{value:0}},vertexShader:`uniform float uPulse; varying vec3 vN; varying vec3 vV; varying vec3 vP;
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
        gl_FragColor = vec4(c, 1.0); }`}),f=new Je(.22,2.6,1,24);f.translate(0,-1.3,0);let h=new We({transparent:!0,depthWrite:!1,side:wt,blending:vt,uniforms:{uT:r,uGlow:a},vertexShader:`uniform float uT; varying float vY; varying vec2 vU;
      void main(){ vU = uv; vec3 p = position; float k = -p.y / 2.6; vY = k;
        p.x += sin(uT * 1.2 + k * 5.0) * 0.18 * k; p.z += cos(uT * 0.9 + k * 4.0) * 0.12 * k;
        p.x *= 1.0 + sin(k * 18.0 + uT) * 0.25;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:`uniform vec3 uGlow; varying float vY; varying vec2 vU;
      void main(){ float edge = 1.0 - abs(vU.x - 0.5) * 2.0; float a = (1.0 - vY) * edge * 0.55;
        gl_FragColor = vec4(uGlow * a * 0.6 + vec3(0.9, 0.8, 1.0) * a * 0.15, 1.0); }`});function d(_){let R=new Float32Array(_*18*2*3),L=new Float32Array(_*18*2),I=new Float32Array(_*18*2),B=0;for(let G=0;G<_;G++){let K=G/_*$e,V=Math.cos(K)*.97,Z=Math.sin(K)*.97,k=Y(1.6,3.2),j=Y(0,$e);for(let ee=0;ee<18;ee++)for(let Se=0;Se<2;Se++){let ye=(ee+Se)/18;R[B*3]=V,R[B*3+1]=-ye*k,R[B*3+2]=Z,L[B]=ye,I[B]=j,B++}}let U=new ut;return U.setAttribute("position",new ot(R,3)),U.setAttribute("aK",new ot(L,1)),U.setAttribute("aPh",new ot(I,1)),U}let m=new We({transparent:!0,depthWrite:!1,blending:vt,uniforms:{uT:r,uGlow:a,uPulse:{value:0}},vertexShader:`uniform float uT; uniform float uPulse; attribute float aK; attribute float aPh; varying float vK;
      void main(){ vK = aK; vec3 p = position;
        p.xz *= 1.0 - uPulse * 0.2;
        p.x += sin(uT * 0.9 + aPh + aK * 4.0) * 0.35 * aK; p.z += cos(uT * 0.7 + aPh + aK * 3.0) * 0.3 * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:"uniform vec3 uGlow; varying float vK; void main(){ gl_FragColor = vec4(uGlow * (1.0 - vK) * 0.4, 1.0); }"}),M=[];for(let _=0;_<9;_++){let y=new Qt,R=u.clone();R.uniforms={uT:r,uGlow:a,uRim:o,uPulse:{value:0}};let L=new Ee(c,R);y.add(L);for(let U=0;U<4;U++){let G=new Ee(f,h);G.rotation.y=U/4*$e+.4,G.position.y=.05,y.add(G)}let I=m.clone();I.uniforms={uT:r,uGlow:a,uPulse:R.uniforms.uPulse},y.add(new wi(d(40),I));let B=Y(.55,1.15);y.scale.setScalar(B),y.position.set(-8.5+_%5*4.2+Y(-1,1),(_%2?2.6:-2.2)+Y(-1.2,1.2),Y(-8,1.5)),y.rotation.z=Y(-.35,.35),y.rotation.x=Y(.2,.55),t.add(y),M.push({g:y,pulse:R.uniforms.uPulse,ph:Y(0,$e),per:Y(3.2,4.6),drift:new P(Y(-.08,.08),0,Y(-.03,.03)),s:B})}let g=900,p=new Float32Array(g*3);for(let _=0;_<g;_++)p[_*3]=Y(-16,16),p[_*3+1]=Y(-9,9),p[_*3+2]=Y(-14,6);let b=new ut;b.setAttribute("position",new ot(p,3));let A=kt(32,32,(_,y,R)=>{let L=_.createRadialGradient(y/2,R/2,0,y/2,R/2,y/2);L.addColorStop(0,"rgba(255,255,255,1)"),L.addColorStop(1,"rgba(255,255,255,0)"),_.fillStyle=L,_.fillRect(0,0,y,R)},!1),v=new En(b,new On({map:A,size:.07,color:13625087,transparent:!0,opacity:.55,depthWrite:!1,blending:vt}));t.add(v);let w=0;function S(_,y,R){w+=_*y,r.value=w;for(let I of M){let B=(w+I.ph)%I.per/I.per,U=B<.35?Math.sin(B/.35*Math.PI*.5):Math.cos((B-.35)/.65*Math.PI*.5);I.pulse.value=U;let G=new P(0,1,0).applyEuler(I.g.rotation),K=(B<.35?.55:.08)-.1;I.g.position.addScaledVector(G,K*_*y*.9*I.s),I.g.position.addScaledVector(I.drift,_*y),I.g.rotation.z+=Math.sin(w*.1+I.ph)*6e-4*y,I.g.position.y>7&&(I.g.position.y=-7),I.g.position.y<-7.5&&(I.g.position.y=7),I.g.position.x>11&&(I.g.position.x=-11),I.g.position.x<-11&&(I.g.position.x=11)}let L=b.attributes.position;for(let I=0;I<g;I++){let B=L.getY(I)-.05*_*y;B<-9&&(B=9),L.setY(I,B)}L.needsUpdate=!0,R||(n.position.x=Math.sin(w*.03)*.8,n.lookAt(0,0,0))}function C(_){let y=Rc[_]||Rc.blue;y!==s&&(s=y,l.uniforms.uTop.value.set(y.top),l.uniforms.uDeep.value.set(y.deep),t.fog.color.set(y.deep),a.value.setRGB(...y.glow),o.value.setRGB(...y.rim))}for(let _=0;_<60;_++)S(1/30,1,!0);return{scene:t,camera:n,update:S,setWater:C,resize(_,y){n.aspect=_/Math.max(1,y),n.fov=n.aspect<1.2?60:42,n.updateProjectionMatrix()}}}var Qh={blue:[[.2,.6,1],[.55,.35,1],[.1,.9,.9]],green:[[.2,1,.6],[.9,1,.3],[.1,.8,.9]],violet:[[.75,.35,1],[1,.4,.75],[.35,.5,1]]};function ed(i,e){let t=new It;t.background=new ge(263435);let n=new ht(40,16/9,.1,60);n.position.set(0,3.2,12),n.lookAt(0,3.4,0);let s={value:0},r={value:new P},a={value:new P},o={value:new P},l=420,c=26,u=8.2,f=new Float32Array(l*c*2*3),h=new Float32Array(l*c*2),d=new Float32Array(l*c*2),m=new Float32Array(l*c*2),M=new Float32Array(l*3),g=new Float32Array(l),p=new Float32Array(l),b=0,A=[];for(let V=0;V<l;V++){let Z=Y(0,$e),k=Math.sqrt(Math.random())*.35,j=Math.cos(Z)*k,ee=Math.sin(Z)*k,Se=Y(-5.5,5.5),ye=Y(-2.5,2.5),et=Y(6.5,8.2),Xe=Math.random(),Ye=Y(0,$e);A.push({sx:j,sz:ee,spread:Se,depth:ye,len:et});let te=he=>{let Fe=u-he*et,de=Math.pow(he,1.6);return[j+Se*de*(.3+.7*he),Fe,ee+ye*de*.8]};for(let he=0;he<c;he++)for(let Fe=0;Fe<2;Fe++){let de=(he+Fe)/c,Ge=te(de);f[b*3]=Ge[0],f[b*3+1]=Ge[1],f[b*3+2]=Ge[2],h[b]=de,d[b]=Xe,m[b]=Ye,b++}let ne=te(1);M[V*3]=ne[0],M[V*3+1]=ne[1],M[V*3+2]=ne[2],g[V]=Xe,p[V]=Ye}let v=new ut;v.setAttribute("position",new ot(f,3)),v.setAttribute("aK",new ot(h,1)),v.setAttribute("aH",new ot(d,1)),v.setAttribute("aPh",new ot(m,1));let w=`
    uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uT;
    vec3 pal(float x){ x = fract(x); return x < 0.333 ? mix(uA, uB, x * 3.0) : x < 0.666 ? mix(uB, uC, (x - 0.333) * 3.0) : mix(uC, uA, (x - 0.666) * 3.0); }`,S=new We({transparent:!0,depthWrite:!1,blending:vt,uniforms:{uT:s,uA:r,uB:a,uC:o},vertexShader:`uniform float uT; attribute float aK; attribute float aH; attribute float aPh; varying float vK; varying float vH; varying float vPh;
      void main(){ vK = aK; vH = aH; vPh = aPh; vec3 p = position;
        p.x += sin(uT * 0.35 + aPh) * 0.12 * aK * aK; p.z += cos(uT * 0.3 + aPh) * 0.1 * aK * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,fragmentShader:`${w} varying float vK; varying float vH; varying float vPh;
      void main(){ vec3 c = pal(vH * 0.35 + uT * 0.02);
        float pulse = 0.55 + 0.45 * smoothstep(0.7, 1.0, sin(vK * 9.0 - uT * 0.6 + vPh));
        gl_FragColor = vec4(c * (0.12 + 0.35 * vK) * pulse, 1.0); }`}),C=new wi(v,S);t.add(C);let _=new ut;_.setAttribute("position",new ot(M,3)),_.setAttribute("aH",new ot(g,1)),_.setAttribute("aPh",new ot(p,1));let y=new We({transparent:!0,depthWrite:!1,blending:vt,uniforms:{uT:s,uA:r,uB:a,uC:o,uSize:{value:16}},vertexShader:`uniform float uT; uniform float uSize; attribute float aH; attribute float aPh; varying float vH; varying float vPh;
      void main(){ vH = aH; vPh = aPh; vec3 p = position; p.x += sin(uT * 0.35 + aPh) * 0.12; p.z += cos(uT * 0.3 + aPh) * 0.1;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = uSize * (8.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${w} varying float vH; varying float vPh;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
        float tw = 0.7 + 0.3 * sin(uT * 0.8 + vPh * 3.0);
        vec3 c = pal(vH * 0.35 + uT * 0.02) * a * tw + vec3(1.0) * pow(a, 6.0) * 0.6;
        gl_FragColor = vec4(c, 1.0); }`});t.add(new En(_,y));let R=kt(256,256,(V,Z,k)=>{let j=V.createRadialGradient(Z/2,k/2,0,Z/2,k/2,Z/2);j.addColorStop(0,"rgba(255,255,255,0.9)"),j.addColorStop(1,"rgba(255,255,255,0)"),V.fillStyle=j,V.fillRect(0,0,Z,k)},!1),L=new Ee(new Je(16,7),new Lt({map:R,transparent:!0,blending:vt,depthWrite:!1,opacity:.35}));L.rotation.x=-Math.PI/2,L.position.y=-.2,t.add(L);let I=new Ee(new Jt(.55,.7,.35,32),new Lt({color:1382434}));I.position.y=u+.15,t.add(I);let B=0,U=null;function G(V){if(V===U)return;U=V;let Z=Qh[V]||Qh.blue;r.value.set(...Z[0]),a.value.set(...Z[1]),o.value.set(...Z[2]),L.material.color.setRGB(...Z[0])}G("blue");function K(V,Z,k){B+=V*Z,s.value=B,k||(n.position.x=Math.sin(B*.04)*1.2,n.lookAt(0,3.4,0))}return{scene:t,camera:n,update:K,setWater:G,resize(V,Z){n.aspect=V/Math.max(1,Z),n.fov=n.aspect<1.2?62:40,n.updateProjectionMatrix(),y.uniforms.uSize.value=Math.max(10,Math.min(22,Z/30))}}}var Cc={blue:{top:[.16,.34,.62],hor:[.78,.86,.93],sun:[1,.95,.82],sunY:.16,deep:[.03,.17,.28],shallow:[.1,.42,.48],sand:[.8,.72,.58]},green:{top:[.1,.28,.4],hor:[.72,.88,.82],sun:[1,.97,.86],sunY:.2,deep:[.02,.18,.2],shallow:[.08,.46,.4],sand:[.78,.73,.6]},violet:{top:[.2,.16,.42],hor:[1,.62,.48],sun:[1,.78,.52],sunY:.05,deep:[.06,.08,.2],shallow:[.24,.22,.38],sand:[.72,.58,.52]}},Pc=`
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
}`;function td(i,e){let t=new It,n=new ht(45,16/9,.1,400);n.position.set(0,1.55,9),n.lookAt(0,1.2,-40);let s=Cc.blue,r="blue",a={value:0},o={uT:a,uTop:{value:new P(...s.top)},uHor:{value:new P(...s.hor)},uSun:{value:new P(...s.sun)},uSunDir:{value:new P(.2,s.sunY,-1).normalize()},uDeep:{value:new P(...s.deep)},uShallow:{value:new P(...s.shallow)},uSand:{value:new P(...s.sand)}},l=new Ee(new Rt(300,48,24),new We({side:Et,depthWrite:!1,uniforms:o,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:mn+Pc+"varying vec3 vD; void main(){ gl_FragColor = vec4(igSky(normalize(vD)), 1.0); }"}));t.add(l);let c=`
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
  }`,u=new Je(260,250,320,260);u.rotateX(-Math.PI/2),u.translate(0,0,-122);let f=new Ee(u,new We({uniforms:o,vertexShader:mn+c+`
      varying vec3 vW; varying vec3 vN; varying float vShore;
      void main(){
        vec3 p = position; vec3 n;
        float shoreK = smoothstep(4.5, -6.0, p.z);             // olas m\xE1s bajas cerca de la orilla
        vec3 o = igWave(p.xz, n);
        p += o * mix(0.25, 1.0, shoreK);
        n = normalize(mix(vec3(0.0, 1.0, 0.0), n, mix(0.35, 1.0, shoreK)));
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; vN = n; vShore = p.z;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:mn+Pc+`
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
      }`}));t.add(f);let h=new Je(80,16,200,60);h.rotateX(-Math.PI/2),h.translate(0,0,8);{let p=h.attributes.position;for(let b=0;b<p.count;b++){let A=p.getZ(b);p.setY(b,(A-3.5)*.07)}h.computeVertexNormals()}let d=new Ee(h,new We({uniforms:o,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:mn+Pc+`
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
      }`}));t.add(d);let m=0;function M(p,b,A){m+=p*b*.9,a.value=m,A||(n.position.y=1.55+Math.sin(m*.12)*.05,n.lookAt(Math.sin(m*.03)*1.2,1.2,-40))}function g(p){p!==r&&(r=p,s=Cc[p]||Cc.blue,o.uTop.value.set(...s.top),o.uHor.value.set(...s.hor),o.uSun.value.set(...s.sun),o.uSunDir.value.set(.2,s.sunY,-1).normalize(),o.uDeep.value.set(...s.deep),o.uShallow.value.set(...s.shallow),o.uSand.value.set(...s.sand))}return M(0,1,!0),{scene:t,camera:n,update:M,setWater:g,resize(p,b){n.aspect=p/Math.max(1,b),n.fov=n.aspect<1.2?65:45,n.updateProjectionMatrix()}}}var Ic={blue:{a:[.03,.05,.11],b:[.1,.16,.3],l1:[1,.72,.38],l2:[.55,.75,1],l3:[1,.9,.75]},green:{a:[.02,.06,.05],b:[.1,.22,.18],l1:[1,.85,.45],l2:[.6,.95,.75],l3:[1,.95,.8]},violet:{a:[.06,.03,.1],b:[.26,.14,.34],l1:[1,.6,.45],l2:[.85,.6,1],l3:[1,.82,.9]}};function Bx(i){let e=document.createElement("canvas");e.width=e.height=i;let t=e.getContext("2d"),n=t.createImageData(i,i),s=i/2;for(let r=0;r<i;r++)for(let a=0;a<i;a++){let o=(a+.5-s)/s,l=(r+.5-s)/s,c=Math.sqrt(o*o+l*l),u=(r*i+a)*4;if(c>=1){n.data[u+3]=0;continue}let f=Math.sqrt(1-c*c);n.data[u]=128+o*127*(1-f*.3),n.data[u+1]=128+l*127*(1-f*.3),n.data[u+2]=255*f,n.data[u+3]=255*Math.min(1,(1-c)*6)}return t.putImageData(n,0,0),e}function nd(i,e){let t=new It,n=new ui(-1,1,1,-1,0,1),s=640,r=360,a=document.createElement("canvas");a.width=s,a.height=r;let o=a.getContext("2d"),l=Bx(64),c=new Ai(a);c.minFilter=Ut,c.generateMipmaps=!1;let u=Ic.blue,f="blue",h={uT:{value:0},uDrops:{value:c},uAspect:{value:16/9},uA:{value:new P(...u.a)},uB:{value:new P(...u.b)},uL1:{value:new P(...u.l1)},uL2:{value:new P(...u.l2)},uL3:{value:new P(...u.l3)}},d=new Ee(new Je(2,2),new We({uniforms:h,depthWrite:!1,depthTest:!1,vertexShader:"varying vec2 vU; void main(){ vU = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:mn+`
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
      }`}));t.add(d);let m=[],M=[];function g(y){for(let R=0;R<y;R++)m.push({x:Y(0,s),y:Y(0,r),r:Math.pow(Math.random(),2.5)*7+1.3,life:Y(20,90)})}function p(y){return{x:Y(10,s-10),y:y?Y(-40,-5):Y(0,r*.8),r:Y(7,12),v:0,hold:Y(1,7),wob:Y(0,6),trail:0}}function b(){m=[],g(420),M=[];for(let y=0;y<14;y++)M.push(p(!1))}b();let A=0,v=0;function w(){o.clearRect(0,0,s,r);for(let y of m)o.drawImage(l,y.x-y.r,y.y-y.r,y.r*2,y.r*2);for(let y of M)o.drawImage(l,y.x-y.r,y.y-y.r*1.15,y.r*2,y.r*2.3);c.needsUpdate=!0}function S(y){for(let R=m.length-1;R>=0;R--)m[R].life-=y,m[R].life<=0&&m.splice(R,1);m.length<420&&g(Math.min(6,420-m.length));for(let R of M){if(R.hold>0){R.hold-=y;continue}R.v=Math.min(R.v+y*30,26+R.r*2);let L=R.v*y;R.y+=L,R.wob+=y*1.3,R.x+=Math.sin(R.wob)*y*3,R.trail+=L,R.trail>7&&(R.trail=0,m.push({x:R.x+Y(-1.5,1.5),y:R.y-R.r*1.6,r:Y(1.2,2.6),life:Y(8,30)}));for(let I=m.length-1;I>=0;I--){let B=m[I];Math.abs(B.x-R.x)<R.r&&B.y>R.y-2&&B.y<R.y+R.r&&(m.splice(I,1),R.r=Math.min(13,R.r+.05))}Math.random()<y*.15&&(R.hold=Y(.5,3)),R.y-R.r>r+10&&Object.assign(R,p(!0))}}function C(y,R,L){A+=y*R,h.uT.value=A;let I=L?.35:1;v+=y,S(y*R*I),v>1/30&&(v=0,w())}function _(y){y!==f&&(f=y,u=Ic[y]||Ic.blue,h.uA.value.set(...u.a),h.uB.value.set(...u.b),h.uL1.value.set(...u.l1),h.uL2.value.set(...u.l2),h.uL3.value.set(...u.l3))}for(let y=0;y<30;y++)S(.1);return w(),{scene:t,camera:n,update:C,setWater:_,resize(y,R){h.uAspect.value=y/Math.max(1,R);let L=Math.round(s/h.uAspect.value);if(L!==r&&L>50&&L<2e3){r=L,a.height=r,c.dispose(),b();for(let I=0;I<30;I++)S(.1);w()}}}}var Lc={blue:{top:[.004,.01,.035],hor:[.02,.05,.1],a1:[.15,.95,.65],a2:[.25,.45,1]},green:{top:[.004,.02,.02],hor:[.02,.07,.06],a1:[.25,1,.45],a2:[.1,.7,.8]},violet:{top:[.02,.008,.04],hor:[.07,.03,.1],a1:[.75,.35,1],a2:[1,.35,.65]}},id=`
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
}`;function sd(i,e){let t=new It,n=new ht(55,16/9,.1,500);n.position.set(0,1.4,6),n.lookAt(0,4.5,-30);let s=Lc.blue,r="blue",a={uT:{value:0},uTop:{value:new P(...s.top)},uHor:{value:new P(...s.hor)},uA1:{value:new P(...s.a1)},uA2:{value:new P(...s.a2)}};t.add(new Ee(new Rt(300,64,32),new We({side:Et,depthWrite:!1,uniforms:a,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:mn+id+"varying vec3 vD; void main(){ vec3 d = normalize(vD); gl_FragColor = vec4(igNight(d), 1.0); }"})));let o=new Je(400,300);o.rotateX(-Math.PI/2),o.translate(0,0,-140),t.add(new Ee(o,new We({uniforms:a,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:mn+id+`
      varying vec3 vW;
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 q = vW.xz * 0.3;
        vec2 rip = vec2(igN2(q * 2.0 + vec2(uT * 0.08, 0.0)) - 0.5, igN2(q * 2.0 + vec2(3.3, uT * 0.06)) - 0.5);
        vec3 R = normalize(vec3(V.x + rip.x * 0.03, -V.y, V.z + rip.y * 0.03));
        float fres = 0.45 + 0.55 * pow(1.0 - abs(V.y), 3.0);
        vec3 c = igNight(R) * fres * 0.85 + uHor * 0.15;
        gl_FragColor = vec4(c, 1.0);
      }`})));let l=new Lt({color:197898}),c=new Qt;t.add(c);for(let S of[-1,1]){let C=new Ee(new Qs(1,40),l);C.rotation.x=-Math.PI/2,C.scale.set(13,6.5,1),C.position.set(S*16.5,.02,-2.2),c.add(C)}let u=new er(1,1,7);for(let S=0;S<26;S++){let C=S%2?1:-1,_=C*Y(4.2,15),y=Y(-5,.5),R=Y(2.5,6.5),L=new Qt;for(let I=0;I<4;I++){let B=new Ee(u,l),U=R*(.42-I*.08);B.scale.set(U*.55,R*.38,U*.55),B.position.y=R*(.3+I*.2),L.add(B)}L.position.set(_,0,y),c.add(L)}let f=new ut;f.setAttribute("position",new ot(new Float32Array(6),3));let h=new hs({color:16777215,transparent:!0,opacity:0}),d=new ds(f,h);t.add(d);let m=-1,M=Y(20,40),g=0,p=0,b=0,A=0;function v(S,C,_){if(A+=S*C,a.uT.value=A,!_&&(n.position.x=Math.sin(A*.02)*.6,n.lookAt(0,4.5,-30),M-=S,M<=0&&m<0&&(m=0,M=Y(25,60),g=Y(-60,20),p=Y(60,90),b=-150),m>=0)){m+=S;let y=m/1.2,R=f.attributes.position;R.setXYZ(0,g+y*40,p-y*14,b),R.setXYZ(1,g+y*40-10,p-y*14+3.5,b),R.needsUpdate=!0,h.opacity=Math.sin(Math.min(1,y)*Math.PI)*.7,y>=1&&(m=-1,h.opacity=0)}}function w(S){S!==r&&(r=S,s=Lc[S]||Lc.blue,a.uTop.value.set(...s.top),a.uHor.value.set(...s.hor),a.uA1.value.set(...s.a1),a.uA2.value.set(...s.a2))}return{scene:t,camera:n,update:v,setWater:w,resize(S,C){n.aspect=S/Math.max(1,C),n.fov=n.aspect<1.2?75:55,n.updateProjectionMatrix()}}}function rd(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},c={},u=[],f=["getX","getY","getZ","getW"],h=["setX","setY","setZ","setW"];for(let b=0,A=o.length;b<A;b++){let v=o[b],w=i.attributes[v];l[v]=new w.constructor(new w.array.constructor(w.count*w.itemSize),w.itemSize,w.normalized);let S=i.morphAttributes[v];S&&(c[v]||(c[v]=[]),S.forEach((C,_)=>{let y=new C.array.constructor(C.count*C.itemSize);c[v][_]=new C.constructor(y,C.itemSize,C.normalized)}))}let d=e*.5,m=Math.log10(1/e),M=Math.pow(10,m),g=d*M;for(let b=0;b<r;b++){let A=n?n.getX(b):b,v="";for(let w=0,S=o.length;w<S;w++){let C=o[w],_=i.getAttribute(C),y=_.itemSize;for(let R=0;R<y;R++)v+=`${Math.trunc(_[f[R]](A)*M+g)},`}if(v in t)u.push(t[v]);else{for(let w=0,S=o.length;w<S;w++){let C=o[w],_=i.getAttribute(C),y=i.morphAttributes[C],R=_.itemSize,L=l[C],I=c[C];for(let B=0;B<R;B++){let U=f[B],G=h[B];if(L[G](a,_[U](A)),y)for(let K=0,V=y.length;K<V;K++)I[K][G](a,y[K][U](A))}}t[v]=a,u.push(a),a++}}let p=i.clone();for(let b in i.attributes){let A=l[b];if(p.setAttribute(b,new A.constructor(A.array.slice(0,a*A.itemSize),A.itemSize,A.normalized)),b in c)for(let v=0;v<c[b].length;v++){let w=c[b][v];p.morphAttributes[b][v]=new w.constructor(w.array.slice(0,a*w.itemSize),w.itemSize,w.normalized)}}return p.setIndex(u),p}var Nc={blue:{skyT:9419224,skyH:14411746,fog:11125698,sun:16773590,leaf:[3107642,4160831,5212741,2776636],grass:[.24,.45,.2],water:[.05,.2,.19],fall:10259004},green:{skyT:8369888,skyH:15266012,fog:12177584,sun:16774876,leaf:[3898674,5151290,6203972,3107374],grass:[.3,.55,.22],water:[.06,.22,.16],fall:9415228},violet:{skyT:7036830,skyH:15845288,fog:13084580,sun:16765600,leaf:[12082218,13666867,10370858,8022570],grass:[.42,.4,.2],water:[.1,.14,.2],fall:13662762}},xn=i=>1.3*Math.sin(i*.09)+.5*Math.sin(i*.23+1),Wt=2.4;function ad(i,e){let t=new It,n=new ht(50,16/9,.1,300);n.position.set(0,1.7,9.5),n.lookAt(0,.2,-12);let s=Nc.blue,r="blue";t.fog=new Ys(s.fog,18,75);let a={value:0},o={uTop:{value:new ge(s.skyT)},uHor:{value:new ge(s.skyH)}};t.add(new Ee(new Rt(200,32,16),new We({side:Et,depthWrite:!1,fog:!1,uniforms:o,vertexShader:"varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"uniform vec3 uTop; uniform vec3 uHor; varying vec3 vD; void main(){ gl_FragColor = vec4(mix(uHor, uTop, smoothstep(0.0, 0.5, vD.y)), 1.0); }"})));let l=new Pi(14675680,3820074,1.1);t.add(l);let c=new hi(s.sun,1.6);c.position.set(-8,14,-6),t.add(c);let u=new Je(70,90,180,220);u.rotateX(-Math.PI/2),u.translate(0,0,-30);let f=new Float32Array(u.attributes.position.count*3);function h(ae,ie){let Ie=Math.abs(ae-xn(ie)),ze=Di.smoothstep(Ie,Wt-.4,Wt+2.8)*1.1+Di.smoothstep(Ie,6,22)*3.5,Ne=(xi(ae*.25,0,ie*.25)-.5)*(.4+Di.smoothstep(Ie,3,10)*1.2),_e=Ie<Wt?-.35+Ie/Wt*.2:0;return ze+Ne+_e}{let ae=u.attributes.position;for(let ie=0;ie<ae.count;ie++){let Ie=ae.getX(ie),ze=ae.getZ(ie),Ne=h(Ie,ze);ae.setY(ie,Ne);let _e=Math.abs(Ie-xn(ze)),F=Di.smoothstep(_e,Wt+.2,Wt+1.4),Ke=.7+xi(Ie*.6,1,ze*.6,3)*.55,J=[.2*Ke,.19*Ke,.15*Ke],E=s.grass.map(x=>x*Ke);for(let x=0;x<3;x++)f[ie*3+x]=J[x]+(E[x]-J[x])*F}u.setAttribute("color",new ot(f,3)),u.computeVertexNormals()}let d=new Ee(u,new xt({vertexColors:!0,roughness:.95}));t.add(d);function m(){let ae=u.attributes.position;for(let ie=0;ie<ae.count;ie++){let Ie=ae.getX(ie),ze=ae.getZ(ie),Ne=Math.abs(Ie-xn(ze)),_e=Di.smoothstep(Ne,Wt+.2,Wt+1.4),F=.7+xi(Ie*.6,1,ze*.6,3)*.55,Ke=[.2*F,.19*F,.15*F],J=s.grass.map(E=>E*F);for(let E=0;E<3;E++)f[ie*3+E]=Ke[E]+(J[E]-Ke[E])*_e}u.attributes.color.needsUpdate=!0}let M=new xt({color:8025964,roughness:.85}),g=new xt({color:5990970,roughness:.95}),p=[];function b(ae,ie,Ie,ze,Ne){let _e=rd(new ai(1,4)),F=_e.attributes.position,Ke=Y(0,50);for(let x=0;x<F.count;x++){let D=new P(F.getX(x),F.getY(x),F.getZ(x));D.multiplyScalar(.75+xi(D.x*1.3+Ke,D.y*1.3,D.z*1.3,4)*.55),D.y*=ze,F.setXYZ(x,D.x,D.y,D.z)}_e.computeVertexNormals();let J=Math.abs(ae-xn(ie))<Wt,E=new Ee(_e,Ne?g:M);return E.position.set(ae,J?-.3:h(ae,ie)-.1,ie),E.scale.setScalar(Ie),E.rotation.y=Y(0,$e),t.add(E),E}[[.4,3,.45],[-1.2,-1.5,.6],[1.6,-5.5,.5],[.2,-9,.7],[-.9,-14,.55],[1.5,1,.3]].forEach(([ae,ie,Ie])=>{let ze=xn(ie)+ae;b(ze,ie,Ie,.55,!1),p.push(new P(ze,ie,Ie))});for(let ae=0;ae<16;ae++){let ie=Y(-40,7),Ie=ae%2?1:-1;b(xn(ie)+Ie*Y(Wt+.1,Wt+1.2),ie,Y(.3,.8),.6,Math.random()<.5)}let A=new Je(1,1,30,200);A.rotateX(-Math.PI/2);{let ae=A.attributes.position;for(let ie=0;ie<ae.count;ie++){let Ie=ae.getX(ie),Ne=9-(ae.getZ(ie)+.5)*70;ae.setXYZ(ie,xn(Ne)+Ie*(Wt*2+.6),-.12,Ne)}A.computeVertexNormals()}let v={uT:a,uWater:{value:new P(...s.water)},uSky:{value:new ge(s.skyH)},uSun:{value:new ge(s.sun)},uRocks:{value:p.map(ae=>new P(ae.x,ae.y,ae.z))},uFogC:{value:new ge(s.fog)}},w=new Ee(A,new We({uniforms:v,transparent:!0,side:wt,depthWrite:!1,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:mn+`
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
      }`}));w.renderOrder=2,t.add(w);let S=new Je(.04,.42,1,4);S.translate(0,.21,0);{let ae=S.attributes.position;for(let ie=0;ie<ae.count;ie++){let Ie=ae.getY(ie)/.42;ae.setX(ie,ae.getX(ie)*(1-Ie*.9))}}let C={uT:a,uCol:{value:new P(...s.grass)},uFogC:{value:new ge(s.fog)}},_=22e3,y=new on(S,new We({side:wt,uniforms:C,vertexShader:`
      uniform float uT; varying float vY; varying float vS; varying float vF;
      void main(){
        vec3 p = position; vY = uv.y;
        vec4 w0 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vS = fract(w0.x * 13.1 + w0.z * 7.3);
        float sway = sin(uT * 1.1 + w0.x * 0.7 + w0.z * 0.5) * 0.12 + sin(uT * 2.3 + w0.z) * 0.04;
        vec4 w = instanceMatrix * vec4(p, 1.0);
        w.x += sway * vY * vY; w.z += sway * 0.5 * vY * vY;
        vec4 ww = modelMatrix * w; vF = smoothstep(18.0, 75.0, length(ww.xyz - cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * ww;
      }`,fragmentShader:"uniform vec3 uCol; uniform vec3 uFogC; varying float vY; varying float vS; varying float vF; void main(){ vec3 c = uCol * (0.55 + vY * 0.7) * (0.85 + vS * 0.3); gl_FragColor = vec4(mix(c, uFogC, vF), 1.0); }"}),_);{let ae=new tt,ie=new Ft,Ie=new P,ze=new P,Ne=0;for(;Ne<_;){let _e=9-Math.pow(Math.random(),1.6)*44,F=Y(-13,13),Ke=Math.abs(F-xn(_e));if(Ke<Wt+.3)continue;ze.set(F,h(F,_e)-.02,_e),ie.setFromAxisAngle(new P(0,1,0),Y(0,$e));let J=Y(.6,1.2)*(Ke<Wt+1.5?1.25:1);Ie.set(J,J*Y(.6,1.4),J),ae.compose(ze,ie,Ie),y.setMatrixAt(Ne++,ae)}}t.add(y);let R=new xt({color:4864556,roughness:.95}),L=new Jt(.1,.2,1,10,4);L.translate(0,.5,0);{let ae=L.attributes.position;for(let ie=0;ie<ae.count;ie++){let Ie=ae.getY(ie);ae.setX(ie,ae.getX(ie)+Math.sin(Ie*3)*.03)}L.computeVertexNormals()}function I(ae){return kt(256,256,(ie,Ie,ze)=>{ie.clearRect(0,0,Ie,ze);for(let Ne=0;Ne<260;Ne++){let _e=Math.random()*$e,F=Math.sqrt(Math.random())*105,Ke=Ie/2+Math.cos(_e)*F,J=ze/2+Math.sin(_e)*F;ie.save(),ie.translate(Ke,J),ie.rotate(Y(0,$e)),ie.fillStyle=ae[Math.random()*ae.length|0],ie.globalAlpha=1,ie.beginPath(),ie.ellipse(0,0,Y(7,12),Y(3.5,6),0,0,$e),ie.fill(),ie.fillStyle="rgba(255,255,255,0.12)",ie.beginPath(),ie.ellipse(-2,-1,Y(3,5),1.5,0,0,$e),ie.fill(),ie.restore()}})}let B=ae=>"#"+ae.toString(16).padStart(6,"0"),U=I(s.leaf.map(B)),G=new xt({map:U,alphaTest:.5,side:wt,roughness:.85}),K=new Je(1,1),V=[];for(let ae=0;ae<46;ae++){let ie=Y(-60,4),Ie=ae%2?1:-1,ze=xn(ie)+Ie*Y(Wt+3,20);V.push([ze,ie,Y(4.5,9)])}let Z=70,k=new on(K,G,V.length*Z),j=[];{let ae=new tt,ie=new Ft,Ie=new tn,ze=new P,Ne=new P,_e=new ge,F=0;V.forEach(([Ke,J,E])=>{let x=h(Ke,J)-.1,D=new Ee(L,R);D.position.set(Ke,x,J),D.scale.set(E*.17,E*.7,E*.17),t.add(D);let N=x+E*.72,z=E*.32,re=E*.36;for(let oe=0;oe<Z;oe++){let q=Y(-1,1),Q=Y(0,$e),ce=Math.cbrt(Math.random());Ne.set(Ke+Math.cos(Q)*Math.sqrt(1-q*q)*z*ce,N+q*re*ce,J+Math.sin(Q)*Math.sqrt(1-q*q)*z*ce),Ie.set(Y(-.6,.6),Y(0,$e),Y(-.6,.6)),ie.setFromEuler(Ie);let we=E*Y(.26,.4);ze.set(we,we,we),ae.compose(Ne,ie,ze),k.setMatrixAt(F,ae);let ue=.6+.4*(q*.5+.5);_e.setRGB(ue,ue,ue),k.setColorAt(F,_e),F++}})}t.add(k);let ee=Go(),Se=[];for(let ae=0;ae<5;ae++){let ie=new Ee(new Je(1.4,14),new Lt({map:ee,transparent:!0,depthWrite:!1,blending:vt,opacity:.12,color:s.sun,fog:!1}));ie.position.set(Y(-6,6),5,Y(-18,-4)),ie.rotation.z=.45,ie.rotation.y=Y(-.3,.3),t.add(ie),Se.push(ie)}let ye=24,et=new Je(.14,.09),Xe=new xt({color:s.fall,side:wt,roughness:.8}),Ye=new on(et,Xe,ye);t.add(Ye);let te=[];function ne(ae){let ie=Y(-25,6);return{x:xn(ie)+Y(-6,6),y:ae?Y(0,5):Y(4,5.5),z:ie,rx:Y(0,$e),ry:Y(0,$e),vx:Y(-.2,.2),onWater:!1,ph:Y(0,$e)}}for(let ae=0;ae<ye;ae++)te.push(ne(!0));let he=new tt,Fe=new Ft,de=new tn,Ge=new P(1,1,1),mt=new P,ke=0;function nt(ae,ie,Ie){ke+=ae*ie,a.value=ke;let ze=ae*ie;for(let Ne=0;Ne<ye;Ne++){let _e=te[Ne];if(_e.onWater)_e.z+=ze*1.1,_e.x+=(xn(_e.z)-_e.x)*ze*.05+Math.sin(ke+_e.ph)*ze*.1,_e.ry+=ze*.3,_e.z>10&&(te[Ne]=ne(!1));else{_e.y-=ze*.45,_e.x+=Math.sin(ke*.8+_e.ph)*ze*.3+_e.vx*ze,_e.rx+=ze*1.2,_e.ry+=ze*.7;let F=Math.abs(_e.x-xn(_e.z)),Ke=F<Wt?-.1:h(_e.x,_e.z);_e.y<=Ke+.02&&(F<Wt?(_e.onWater=!0,_e.y=-.1,_e.rx=-Math.PI/2):te[Ne]=ne(!1))}de.set(_e.rx,_e.ry,0),Fe.setFromEuler(de),mt.set(_e.x,_e.y,_e.z),he.compose(mt,Fe,Ge),Ye.setMatrixAt(Ne,he)}Ye.instanceMatrix.needsUpdate=!0,Se.forEach((Ne,_e)=>{Ne.material.opacity=.09+.04*Math.sin(ke*.2+_e*1.7)}),Ie||(n.position.x=Math.sin(ke*.04)*.4,n.lookAt(0,.2,-12))}function lt(ae){ae!==r&&(r=ae,s=Nc[ae]||Nc.blue,o.uTop.value.set(s.skyT),o.uHor.value.set(s.skyH),t.fog.color.set(s.fog),c.color.set(s.sun),v.uWater.value.set(...s.water),v.uSky.value.set(s.skyH),v.uSun.value.set(s.sun),v.uFogC.value.set(s.fog),C.uCol.value.set(...s.grass),C.uFogC.value.set(s.fog),G.map.dispose(),G.map=I(s.leaf.map(B)),G.needsUpdate=!0,Xe.color.set(s.fall),Se.forEach(ie=>ie.material.color.set(s.sun)),m())}return nt(.016,1,!0),{scene:t,camera:n,update:nt,setWater:lt,resize(ae,ie){n.aspect=ae/Math.max(1,ie),n.fov=n.aspect<1.2?70:50,n.updateProjectionMatrix()}}}function Ox(){try{let i=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(i.getContext("webgl2")||i.getContext("webgl")))}catch{return!1}}function zx(i,e,t){let n=Yh(e),s=Math.min(window.devicePixelRatio||1,1.75);n.setPixelRatio(s);let a=({aquarium:Kh,pause:$h,jellies:jh,fibre:ed,sea:td,rain:nd,night:sd,river:ad,bubbles:Ac}[i]||Ac)(e,n),o=0,l=s,c=0,u=0;function f(A){if(c+=A,u++,u<45&&c<1.5)return;let v=c/u;c=0,u=0;let w=v>.045?Math.max(.75,l*.8):v<.022?Math.min(s,l*1.15):l;Math.abs(w-l)>.05&&(l=w,n.setPixelRatio(l),M())}let h=0,d=performance.now(),m=!0;function M(){let A=e.parentElement.getBoundingClientRect();n.setSize(Math.max(1,A.width),Math.max(1,A.height),!1),a.resize(A.width,A.height)}M();let g=window.ResizeObserver?new ResizeObserver(M):null;g&&g.observe(e.parentElement);function p(A){if(!m)return;if(!e.isConnected){b();return}let v=(A-d)/1e3,w=Math.min(.05,v);if(d=A,!document.hidden){let S=t.phase?t.phase():null,C=S&&!S.guiding;(!C||A-o>400)&&(o=A,t.color&&a.setWater(t.color()),a.update(w,t.speed?t.speed():1,t.reduced(),S),C||f(v),n.render(a.scene,a.camera))}h=requestAnimationFrame(p)}h=requestAnimationFrame(p);function b(){m&&(m=!1,cancelAnimationFrame(h),g&&g.disconnect(),a.scene.traverse(A=>{A.geometry&&A.geometry.dispose(),A.material&&(Array.isArray(A.material)?A.material:[A.material]).forEach(v=>{Object.values(v).forEach(w=>{w&&w.isTexture&&w.dispose()}),v.dispose()})}),n.dispose(),n.forceContextLoss&&n.forceContextLoss())}return{stop:b}}window.IGScenes3D={supported:Ox,start:zx};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
