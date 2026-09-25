export function stampLayout(width,height,place,detail,corner,measure){
 const unit=Math.min(width,height),margin=unit*.045,available=width-margin*2;
 let size=unit*.039;
 const fit=Math.min(1,available/Math.max(1,measure(place,size,700),measure(detail,size*.66,400)));
 size*=fit;
 const detailSize=size*.66,gap=size*.32;
 const blockHeight=(place?size:0)+(place&&detail?gap:0)+(detail?detailSize:0);
 const right=corner.endsWith('right'),bottom=corner.startsWith('bottom');
 return {size,detailSize,gap,margin,blockHeight,x:right?width-margin:margin,y:bottom?height-margin-blockHeight:margin,align:right?'right':'left'};
}
export function paintStamp(canvas,image,place,detail,corner,preview=false){
 const originalWidth=image.naturalWidth,originalHeight=image.naturalHeight;
 const ratio=preview?Math.min(1,1600/Math.max(originalWidth,originalHeight)):1;
 canvas.width=Math.round(originalWidth*ratio);canvas.height=Math.round(originalHeight*ratio);
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Your browser couldn’t create the image.');
 ctx.drawImage(image,0,0,canvas.width,canvas.height);
 const p=place.trim(),d=detail.trim();
 const layout=stampLayout(canvas.width,canvas.height,p,d,corner,(value,size,weight)=>{ctx.font=`${weight} ${size}px Inter`;return ctx.measureText(value).width;});
 ctx.textAlign=layout.align;ctx.textBaseline='top';ctx.fillStyle='white';
 ctx.shadowColor='rgba(0,0,0,.95)';ctx.shadowBlur=layout.size*.2;ctx.shadowOffsetY=layout.size*.035;
 let y=layout.y;
 if(p){ctx.font=`700 ${layout.size}px Inter`;ctx.fillText(p,layout.x,y);y+=layout.size+(d?layout.gap:0);}
 if(d){ctx.font=`400 ${layout.detailSize}px Inter`;ctx.fillText(d,layout.x,y);}
 return {width:canvas.width,height:canvas.height};
}
