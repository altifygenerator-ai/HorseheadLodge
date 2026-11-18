'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {PHOTOS,type PhotoKey} from '@/lib/content';
import {SitePhoto} from '@/components/SitePhoto';

export type GalleryImage={photo:PhotoKey;caption:string;category:'Wedding spaces'|'The property'|'Accommodations'|'The Enclave'};
type Props={images:readonly GalleryImage[]};
const filters=['Everything','Wedding spaces','The property','Accommodations','The Enclave'] as const;

export function VenueGallery({images}:Props){
  const [filter,setFilter]=useState<typeof filters[number]>('Everything');
  const [active,setActive]=useState<number|null>(null);
  const close=useRef<HTMLButtonElement>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  const visible=images.filter(item=>filter==='Everything'||item.category===filter);
  const selected=active===null?null:visible[active]??null;
  const move=useCallback((direction:number)=>setActive(current=>current===null?null:(current+direction+visible.length)%visible.length),[visible.length]);
  useEffect(()=>{
    if(active===null)return;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    close.current?.focus();
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setActive(null);
      if(event.key==='ArrowRight')move(1);
      if(event.key==='ArrowLeft')move(-1);
      if(event.key==='Tab'){
        const dialog=document.querySelector<HTMLElement>('[data-gallery-dialog]');
        const candidates=Array.from(dialog?.querySelectorAll<HTMLButtonElement>('button:not([disabled])')??[]);
        if(!candidates.length)return;
        const first=candidates[0],last=candidates[candidates.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      }
    };
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=oldOverflow;window.removeEventListener('keydown',onKey);opener.current?.focus()};
  },[active===null,move]);
  return <>
    <div className="gallery-filters" aria-label="Filter venue photographs">{filters.map(item=><button key={item} type="button" className={filter===item?'is-active':''} aria-pressed={filter===item} onClick={()=>{setFilter(item);setActive(null)}}>{item}</button>)}</div>
    <div className="interactive-gallery-grid">{visible.map((item,i)=><button className={`gallery-open-photo ${i%7===0?'gallery-wide':''}`} type="button" key={`${item.photo}-${i}`} onClick={e=>{opener.current=e.currentTarget;setActive(i)}} aria-label={`Enlarge photo: ${item.caption}`}><SitePhoto photo={item.photo}/><span>{item.caption}<span aria-hidden="true"> ↗</span></span></button>)}</div>
    {selected&&<div className="gallery-lightbox-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}>
      <div className="gallery-lightbox" data-gallery-dialog role="dialog" aria-modal="true" aria-label={`Photograph: ${selected.caption}`}>
        <button ref={close} className="gallery-lightbox-close" onClick={()=>setActive(null)} aria-label="Close photograph">×</button>
        <div className="gallery-lightbox-image"><img src={process.env.NEXT_PUBLIC_SITE_LIVE==='true'||process.env.NEXT_PUBLIC_LOCAL_MEDIA==='true'?`/photos/${PHOTOS[selected.photo].file}`:PHOTOS[selected.photo].source} alt={PHOTOS[selected.photo].alt}/></div>
        <div className="gallery-lightbox-footer"><button type="button" onClick={()=>move(-1)} aria-label="Previous photograph">‹</button><span>{selected.caption} <span className="gallery-lightbox-count">{(active??0)+1} of {visible.length}</span></span><button type="button" onClick={()=>move(1)} aria-label="Next photograph">›</button></div>
      </div>
    </div>}
  </>;
}
