export function stampLayout(width,height,place,detail,corner,measure,glass=false){
 const unit=Math.min(width,height),margin=unit*.045,panelPadding=glass?unit*.022:0,available=width-margin*2-panelPadding*2;
 let size=unit*.039;
 const fit=Math.min(1,available/Math.max(1,measure(place,size,700),measure(detail,size*.66,400)+(detail?size*.66*1.25:0)));
 size*=fit;
 const detailSize=size*.66,gap=size*.32;
 const blockHeight=(place?size:0)+(place&&detail?gap:0)+(detail?detailSize:0);
 const right=corner.endsWith('right'),bottom=corner.startsWith('bottom');
 return {panelPadding,size,detailSize,gap,margin,blockHeight,x:right?width-margin-panelPadding:margin+panelPadding,y:bottom?height-margin-panelPadding-blockHeight:margin+panelPadding,align:right?'right':'left'};
}
export function paintStamp(canvas,image,place,detail,corner,preview=false,glass=false){
 const originalWidth=image.naturalWidth,originalHeight=image.naturalHeight;
 const ratio=preview?Math.min(1,1600/Math.max(originalWidth,originalHeight)):1;
 canvas.width=Math.round(originalWidth*ratio);canvas.height=Math.round(originalHeight*ratio);
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Your browser couldn’t create the image.');
 ctx.drawImage(image,0,0,canvas.width,canvas.height);
 const p=place.trim(),d=detail.trim();
 const layout=stampLayout(canvas.width,canvas.height,p,d,corner,(value,size,weight)=>{ctx.font=`${weight} ${size}px Inter`;return ctx.measureText(value).width;},glass);
 if(glass&&(p||d)){
  ctx.font=`700 ${layout.size}px Inter`;const firstWidth=ctx.measureText(p).width;
  ctx.font=`400 ${layout.detailSize}px Inter`;const secondWidth=d?ctx.measureText(d).width+layout.detailSize*1.25:0;
  const contentWidth=Math.max(firstWidth,secondWidth),pad=layout.panelPadding;
  const x=(layout.align==='right'?layout.x-contentWidth:layout.x)-pad,y=layout.y-pad;
  const w=contentWidth+pad*2,h=layout.blockHeight+pad*2;
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,pad*.8);ctx.clip();
  ctx.filter=`blur(${Math.min(canvas.width,canvas.height)*.006}px)`;
  ctx.drawImage(image,0,0,canvas.width,canvas.height);ctx.filter='none';
  ctx.fillStyle='rgba(18,23,27,.30)';ctx.fillRect(x,y,w,h);
  const shine=ctx.createLinearGradient(x,y,x+w,y+h);
  shine.addColorStop(0,'rgba(255,255,255,.22)');shine.addColorStop(1,'rgba(255,255,255,.06)');
  ctx.fillStyle=shine;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.38)';ctx.lineWidth=Math.max(1,layout.size*.022);
  ctx.beginPath();ctx.roundRect(x,y,w,h,pad*.8);ctx.stroke();ctx.restore();
 }
 ctx.textAlign=layout.align;ctx.textBaseline='top';ctx.fillStyle='white';
 ctx.shadowColor='rgba(0,0,0,.95)';ctx.shadowBlur=layout.size*.2;ctx.shadowOffsetY=layout.size*.035;
 let y=layout.y;
 if(p){ctx.font=`700 ${layout.size}px Inter`;ctx.fillText(p,layout.x,y);y+=layout.size+(d?layout.gap:0);}
 if(d){
  ctx.font=`400 ${layout.detailSize}px Inter`;
  const iconSize=layout.detailSize,space=iconSize*.25;
  const lineWidth=ctx.measureText(d).width+iconSize+space;
  const left=layout.align==='right'?layout.x-lineWidth:layout.x;
  ctx.save();ctx.translate(left,y);ctx.scale(iconSize/24,iconSize/24);
  ctx.beginPath();ctx.moveTo(12,23);ctx.bezierCurveTo(9,19,4,14,4,9);
  ctx.arc(12,9,8,Math.PI,0);ctx.bezierCurveTo(20,14,15,19,12,23);ctx.closePath();
  ctx.moveTo(15,9);ctx.arc(12,9,3,0,Math.PI*2);ctx.fill('evenodd');ctx.restore();
  ctx.textAlign='left';ctx.fillText(d,left+iconSize+space,y);
 }
 return {width:canvas.width,height:canvas.height};
}
