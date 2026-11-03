#!/usr/bin/env node
// Gera PNGs sem dependências externas, usando apenas módulos nativos do Node.js.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const out = path.join(__dirname, "assets", "icons");
fs.mkdirSync(out, { recursive: true });

function chunk(type, data) {
  const name = Buffer.from(type);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([name, data]);
  let crc = 0xffffffff;
  for (const byte of crcInput) {
    crc ^= byte;
    for (let k=0;k<8;k++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([len,name,data,crcBuf]);
}
function png(size, pixelFn) {
  const raw = Buffer.alloc((size*4+1)*size);
  for (let y=0;y<size;y++) {
    const row=y*(size*4+1); raw[row]=0;
    for(let x=0;x<size;x++){
      const [r,g,b,a]=pixelFn(x,y,size);
      const i=row+1+x*4; raw[i]=r;raw[i+1]=g;raw[i+2]=b;raw[i+3]=a;
    }
  }
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",zlib.deflateSync(raw)),chunk("IEND",Buffer.alloc(0))]);
}
function logoPixel(x,y,size) {
  const scale=size/128, X=x/scale, Y=y/scale;
  const roundRect = (X>=0&&X<128&&Y>=0&&Y<128);
  let c=[16,24,39,255];
  // Rounded-square background, with transparent rounded corners.
  const cx=Math.max(30,Math.min(98,X)),cy=Math.max(30,Math.min(98,Y));
  if(Math.hypot(X-cx,Y-cy)>30)c=[0,0,0,0];
  const stroke=(d,w)=>Math.abs(d)<=w/2;
  const arc=Math.hypot(X-64,Y-57);
  if(arc>=31&&arc<=41&&Y<=67&&Y>=16)c=[45,170,158,255];
  if(X>=20&&X<=41&&Y>=59&&Y<=96&&Math.hypot(X-30.5,Y-69)<11)c=[232,247,245,255];
  if(X>=87&&X<=108&&Y>=59&&Y<=96&&Math.hypot(X-97.5,Y-69)<11)c=[232,247,245,255];
  // Center sound wave approximated by a bright zig-zag.
  const wave=70+13*Math.sin((X-48)/5);
  if(X>=48&&X<=80&&Math.abs(Y-wave)<2.5)c=[85,199,184,255];
  if(Y>=86&&Y<=90&&X>=57&&X<=71)c=[85,199,184,255];
  return c;
}
for (const size of [192,512]) {
  fs.writeFileSync(path.join(out,`icon-${size}x${size}.png`),png(size,logoPixel));
}
// Splash screen portrait 640x960, PNG helper supports square: produce square splash for broad compatibility.
fs.writeFileSync(path.join(out,"splash.png"),png(512,(x,y,s)=>{
  const bg=[16,24,39,255], cx=s/2,cy=s/2, r=Math.hypot(x-cx,y-cy);
  if(r< s*.31 && (Math.abs(r-s*.22)<s*.018 || (Math.abs(x-cx)<s*.16&&Math.abs(y-cy)<s*.012))) return [85,199,184,255];
  return bg;
}));
console.log("Ícones PNG gerados em assets/icons/.");
