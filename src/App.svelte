<script>
 import {onMount,onDestroy} from 'svelte';
 import {paintStamp} from './layout.js';
 let photo=null,photoUrl='',fileName='',place='',detail='',corner='bottom-left',preview,fontsReady=false,loading=false,saving=false,error='',notice='',loadVersion=0;
 const corners=[['top-left','Top left'],['top-right','Top right'],['bottom-left','Bottom left'],['bottom-right','Bottom right']];
 onMount(async()=>{try{await Promise.all([document.fonts.load('700 48px Inter'),document.fonts.load('400 32px Inter')]);fontsReady=true;}catch{error='The font could not load. Refresh to try again.';}});
 onDestroy(()=>{loadVersion++;if(photoUrl)URL.revokeObjectURL(photoUrl);});
 function redraw(target,image,p,d,c){try{paintStamp(target,image,p,d,c,true);}catch(e){error=e.message;}}
 $: if(preview&&photo&&fontsReady)redraw(preview,photo,place,detail,corner);
 async function openImage(event){
  const file=event.currentTarget.files?.[0];if(!file)return;
  const version=++loadVersion;loading=true;error='';notice='';
  const next=URL.createObjectURL(file);
  try{
   const image=new Image();image.src=next;await image.decode();
   if(version!==loadVersion){URL.revokeObjectURL(next);return;}
   if(!image.naturalWidth||!image.naturalHeight)throw new Error('Invalid image');
   if(photoUrl)URL.revokeObjectURL(photoUrl);
   photoUrl=next;photo=image;fileName=file.name;
  }catch{URL.revokeObjectURL(next);if(version===loadVersion)error='Couldn’t open this image. Choose a JPG, PNG, or WebP file.';}
  finally{if(version===loadVersion)loading=false;}
 }
 async function save(){
  if(!photo||saving||!fontsReady)return;
  saving=true;error='';notice='';
  const image=photo,p=place,d=detail,c=corner,name=fileName;
  let output;
  try{
   await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
   output=document.createElement('canvas');
   paintStamp(output,image,p,d,c,false);
   const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));
   if(!blob)throw new Error('Your browser couldn’t export this image at full resolution. Try a desktop browser.');
   const url=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=url;link.download=`${name.replace(/\.[^.]+$/,'')||'photo'}-location.png`;document.body.append(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
   notice=`Saved at ${image.naturalWidth} × ${image.naturalHeight} pixels.`;
  }catch(e){error=e.message||'Export failed. Try a desktop browser for large images.';}
  finally{if(output){output.width=1;output.height=1;}saving=false;}
 }
</script>
<header><a class="brand" href="./"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>location<span>stamp</span></a><span class="header-note">KEEP THE PLACE.</span></header>
<main>
 <section class="controls">
  <p class="eyebrow">A PHOTO. A PLACE.</p><h1>Remember where.</h1><p class="intro">Two lines. Anywhere in the frame.</p>
  <label class="upload" for="photo"><span class="upload-icon">+</span><span><strong>{photo?'Change photo':'Choose a photo'}</strong><small>{photo?fileName:'JPG, PNG or WebP'}</small></span></label>
  <input class="file-input" id="photo" type="file" accept="image/jpeg,image/png,image/webp" onchange={openImage} disabled={saving}/>
  <div class="field"><label for="place">Place name <span>Bold</span></label><input id="place" bind:value={place} placeholder="The Pizza Bakery" maxlength="160" disabled={saving}/></div>
  <div class="field"><label for="detail">Street or city</label><input id="detail" bind:value={detail} placeholder="Church Street, Bengaluru" maxlength="200" disabled={saving}/></div>
  <fieldset disabled={saving}><legend>Position</legend><div class="corners">{#each corners as [value,label]}<label class:selected={corner===value}><input type="radio" name="corner" value={value} bind:group={corner}/><span class="corner-icon {value}" aria-hidden="true"></span>{label}</label>{/each}</div></fieldset>
  <div class="feedback" aria-live="polite">{#if error}<p class="error" role="alert">{error}</p>{:else if loading}<p>Opening your photo…</p>{:else if notice}<p>{notice}</p>{/if}</div>
  <button class="save" onclick={save} disabled={!photo||!fontsReady||loading||saving||(!place.trim()&&!detail.trim())}>{saving?'Saving full-resolution PNG…':'Download PNG'}<span aria-hidden="true">↓</span></button>
  <p class="privacy">Your photo stays on your device.</p>
 </section>
 <section class="preview-panel" aria-label="Image preview"><div class="preview-header"><span>PREVIEW</span><span>{photo?`${photo.naturalWidth} × ${photo.naturalHeight} px`:'ORIGINAL RESOLUTION'}</span></div>
  <div class="stage" class:loaded={photo}>{#if photo}<canvas bind:this={preview} aria-label={`Photo preview with ${place}, ${detail} at ${corner}`}></canvas>{:else}<div class="empty"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="3"/><circle cx="17" cy="18" r="3"/><path d="m7 34 10-9 8 7 8-12 9 14"/></svg><p>Your photo, with a sense of place.</p><span>Choose an image to begin.</span></div>{/if}</div>
  <div class="preview-footer"><span>White Inter · Subtle shadow</span><span>No resizing on export</span></div>
 </section>
</main>
<footer><span>Location Stamp</span><span>Full resolution. Every time.</span></footer>
