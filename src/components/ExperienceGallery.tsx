'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Image from 'next/image';
import {experienceCategories,experiencePhotos,type ExperienceCategory} from '@/lib/experience';

const PAGE_SIZE=24;
type Filter='All photographs'|ExperienceCategory;
const categories:Filter[]=['All photographs',...experienceCategories];
export function ExperienceGallery(){
 const [filter,setFilter]=useState<Filter>('All photographs');
 const [visibleCount,setVisibleCount]=useState(PAGE_SIZE);
 const [active,setActive]=useState<number|null>(null);
 const opener=useRef<HTMLButtonElement|null>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const photos=useMemo(()=>experiencePhotos.filter(photo=>filter==='All photographs'||photo.category===filter),[filter]);
 const selected=active!==null?photos[active]??null:null;
 function applyFilter(value:Filter){setFilter(value);setVisibleCount(PAGE_SIZE);setActive(null)}
 function close(){setActive(null)}
 function open(index:number,button:HTMLButtonElement){opener.current=button;setActive(index)}
 function move(step:number){setActive(prev=>prev===null?null:(prev+step+photos.length)%photos.length)}
 useEffect(()=>{
  if(active===null)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  closeButton.current?.focus();
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();setActive(null)}
   if(e.key==='ArrowRight'){e.preventDefault();setActive(prev=>prev===null?null:(prev+1)%photos.length)}
   if(e.key==='ArrowLeft'){e.preventDefault();setActive(prev=>prev===null?null:(prev-1+photos.length)%photos.length)}
   if(e.key==='Tab'){
    const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-experience-dialog] button:not([disabled])'));
    if(!buttons.length)return;
    const first=buttons[0],last=buttons[buttons.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKey);opener.current?.focus()};
 },[active,photos.length]);
 return <div className="experience-gallery">
  <div className="experience-gallery-tabs" role="group" aria-label="Filter photographs">
   {categories.map(cat=><button key={cat} type="button" className={cat===filter?'is-active':''} aria-pressed={cat===filter} onClick={()=>applyFilter(cat)}>{cat}</button>)}
  </div>
  <div className="experience-gallery-grid">
   {photos.slice(0,visibleCount).map((photo,index)=><button key={photo.id} type="button" className={`experience-gallery-tile ${index%9===0?'is-wide':''}`} onClick={e=>open(index,e.currentTarget)} aria-label={`Enlarge: ${photo.caption}`}>
    <span className="experience-gallery-photo"><Image src={photo.src} alt={photo.alt} fill sizes={index%9===0?'(max-width: 800px) 100vw, 65vw':'(max-width: 680px) 50vw, 33vw'} loading="lazy" quality={80}/></span>
    <span className="experience-gallery-tile-label">{photo.caption}</span>
   </button>)}
  </div>
  {visibleCount<photos.length&&<div className="experience-gallery-more"><button type="button" className="button button-outline" onClick={()=>setVisibleCount(count=>count+PAGE_SIZE)}>See more photographs</button></div>}
  {selected&&<div className="experience-lightbox-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)close()}}>
    <div data-experience-dialog className="experience-lightbox" role="dialog" aria-modal="true" aria-label="Full-size Horsehead Lake Lodge photograph">
      <button ref={closeButton} type="button" className="experience-lightbox-close" onClick={close} aria-label="Close full-size photograph">×</button>
      <div className="experience-lightbox-image"><Image key={selected.id} src={selected.src} alt={selected.alt} fill sizes="100vw" quality={90}/></div>
      <div className="experience-lightbox-controls">
       <button type="button" onClick={()=>move(-1)} aria-label="Previous photograph">‹</button>
       <div><strong>{selected.caption}</strong><span>{active!==null?active+1:0} of {photos.length}</span></div>
       <button type="button" onClick={()=>move(1)} aria-label="Next photograph">›</button>
      </div>
    </div>
   </div>}
 </div>;
}
