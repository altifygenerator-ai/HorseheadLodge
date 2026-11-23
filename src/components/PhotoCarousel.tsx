'use client';

import {useCallback,useEffect,useId,useRef,useState} from 'react';
import {PHOTOS,type PhotoKey} from '@/lib/content';
import {SitePhoto} from '@/components/SitePhoto';

export type PhotoSlide={photo:PhotoKey;caption:string};
type Props={slides:readonly PhotoSlide[];label:string;className?:string;autoPlay?:boolean;intervalMs?:number;showThumbnails?:boolean;hero?:boolean};

/** User-operated carousel with progressive enhancement: the first real photo is always rendered.
 * Autoplay is optional, pauses during user interaction and when the tab is hidden,
 * and never runs when the visitor requests reduced motion. */
export function PhotoCarousel({slides,label,className='',autoPlay=true,intervalMs=6500,showThumbnails=false,hero=false}:Props){
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(true);
  const [tabVisible,setTabVisible]=useState(true);
  const id=useId();
  const touchX=useRef<number|null>(null);
  const focusWithin=useRef(false);
  const count=slides.length;
  const change=useCallback((direction:number)=>setIndex(current=>(current+direction+count)%count),[count]);

  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(query.matches);
    update();query.addEventListener('change',update);
    const onVisibility=()=>setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange',onVisibility);
    return()=>{query.removeEventListener('change',update);document.removeEventListener('visibilitychange',onVisibility)};
  },[]);
  useEffect(()=>{
    if(!autoPlay||paused||reducedMotion||!tabVisible||count<2)return;
    const timer=window.setInterval(()=>change(1),Math.max(intervalMs,4000));
    return()=>window.clearInterval(timer);
  },[autoPlay,paused,reducedMotion,tabVisible,count,intervalMs,change]);

  if(!count)return null;
  return <div className={`photo-carousel ${hero?'photo-carousel-hero':''} ${className}`.trim()} role="region" aria-roledescription="carousel" aria-label={label}
    onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(focusWithin.current)}
    onFocusCapture={()=>{focusWithin.current=true;setPaused(true)}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){focusWithin.current=false;setPaused(false)}}}
    onTouchStart={event=>{touchX.current=event.touches[0]?.clientX??null}}
    onTouchEnd={event=>{if(touchX.current===null)return;const distance=event.changedTouches[0].clientX-touchX.current;touchX.current=null;if(Math.abs(distance)>55)change(distance<0?1:-1)}}
    onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();change(1)}if(event.key==='ArrowLeft'){event.preventDefault();change(-1)}}}>
    <div className="photo-carousel-stage" id={`${id}-stage`}>
      {slides.map((slide,i)=><div className={`photo-carousel-slide ${index===i?'is-current':''}`} key={`${slide.photo}-${i}`} aria-hidden={index!==i}>
        <SitePhoto photo={slide.photo} className="photo-carousel-image" loading={i<=(hero?1:0)?'eager':'lazy'} />
      </div>)}
      {hero?null:<div className="photo-carousel-caption" aria-live="off">{slides[index].caption}</div>}
      {count>1&&<div className="photo-carousel-arrows"><button className="photo-carousel-arrow" type="button" onClick={()=>change(-1)} aria-label={`Previous photograph in ${label}`}><span aria-hidden="true">‹</span></button><button className="photo-carousel-arrow" type="button" onClick={()=>change(1)} aria-label={`Next photograph in ${label}`}><span aria-hidden="true">›</span></button></div>}
    </div>
    {count>1&&<div className="photo-carousel-bottom"><div className="photo-carousel-dots" aria-label={`Choose photograph in ${label}`}>{slides.map((slide,i)=><button key={`${slide.photo}-${i}`} type="button" className={i===index?'is-current':''} aria-label={`Show ${slide.caption}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><span/></button>)}</div><span className="photo-carousel-current" aria-live="polite">{slides[index].caption}</span></div>}
    {showThumbnails&&count>1&&<div className="photo-carousel-thumbnails">{slides.map((slide,i)=><button key={`${slide.photo}-${i}`} type="button" onClick={()=>setIndex(i)} className={i===index?'is-current':''} aria-label={`View ${slide.caption}`} aria-pressed={i===index}><img src={process.env.NEXT_PUBLIC_SITE_LIVE==='true'||process.env.NEXT_PUBLIC_LOCAL_MEDIA==='true'?`/photos/${PHOTOS[slide.photo].file}`:PHOTOS[slide.photo].source} alt="" loading="lazy" /></button>)}</div>}
  </div>;
}
