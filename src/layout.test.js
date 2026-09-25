import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stampLayout,paintStamp} from './layout.js';
const measure=(s,size)=>s.length*size*.65;
test('all corners stay inside landscape, portrait and square photos',()=>{
 for(const [w,h] of [[6000,4000],[4000,6000],[2048,2048]])for(const corner of ['top-left','top-right','bottom-left','bottom-right']){
  const l=stampLayout(w,h,'Place','Street, City',corner,measure);
  assert(l.y>=0&&l.y+l.blockHeight<=h);
  assert.equal(l.align,corner.endsWith('right')?'right':'left');
  assert.equal(l.x,corner.endsWith('right')?w-l.margin:l.margin);
 }
});
test('long labels shrink without cropping or wrapping',()=>{
 const text='Long place '.repeat(20),l=stampLayout(400,800,text,'City','bottom-left',measure);
 assert(measure(text,l.size)<=400-2*l.margin+.001);
});
test('export retains original pixels while preview can be smaller',()=>{
 const context={save(){},restore(){},translate(){},scale(){},beginPath(){},moveTo(){},bezierCurveTo(){},arc(){},closePath(){},fill(){},roundRect(){},clip(){},fillRect(){},stroke(){},createLinearGradient(){return {addColorStop(){}};},drawImage(){},measureText:s=>({width:s.length*12}),fillText(){}};
 const canvas={getContext:()=>context},image={naturalWidth:6048,naturalHeight:4024};
 paintStamp(canvas,image,'Place','City','bottom-right',false,true);
 assert.equal(canvas.width,6048);assert.equal(canvas.height,4024);
 paintStamp(canvas,image,'Place','City','bottom-right',true);
 assert.equal(canvas.width,1600);
});

test('glass panel and pin fit within all four corners',()=>{
 for(const corner of ['top-left','top-right','bottom-left','bottom-right']){
 const l=stampLayout(400,800,'Place','Long street name '.repeat(20),corner,measure,true);
 const width=Math.max(measure('Place',l.size),measure('Long street name '.repeat(20),l.detailSize)+l.detailSize*1.25);
 const left=(l.align==='right'?l.x-width:l.x)-l.panelPadding;
 assert(left>=0&&left+width+2*l.panelPadding<=400.001);
 assert(l.y-l.panelPadding>=0&&l.y+l.blockHeight+l.panelPadding<=800);
 }
});
