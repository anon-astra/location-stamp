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
 const context={drawImage(){},measureText:s=>({width:s.length*12}),fillText(){}};
 const canvas={getContext:()=>context},image={naturalWidth:6048,naturalHeight:4024};
 paintStamp(canvas,image,'Place','City','bottom-right',false);
 assert.equal(canvas.width,6048);assert.equal(canvas.height,4024);
 paintStamp(canvas,image,'Place','City','bottom-right',true);
 assert.equal(canvas.width,1600);
});
