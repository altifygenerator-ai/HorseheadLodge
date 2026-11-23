'use client';
import {useCallback,useEffect,useId,useRef,useState} from 'react';
import Image from 'next/image';
import {getExperiencePhotos} from '@/lib/experience';

type Props={ids:readonly string[];label:string;className?:string;hero?:boolean;intervalMs?:number};
/** Calm photo rotation with visible arrows, like the original site's sliders. */
export function ExperienceCarousel({ids,label,className='',hero=false,intervalMs=6500}:Props){
 const slides=getExperiencePhotos(ids);
 const [index,setIndex]=useState(0);
 const [paused,setPaused]=useState(false);
 const [reducedMotion,setReducedMotion]=useState(true);
 const [visible,setVisible]=useState(true);
 const section=useRef<HTMLDivElement>(null);
 const downX=useRef<number|null>(null);
 const focusInside=useRef(false);
 const dotsId=useId();
 const move=useCallback((direction:number)=>setIndex(prev=>(prev+direction+slides.length)%slides.length),[slides.length]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange=()=>setReducedMotion(media.matches);
  const onTab=()=>setVisible(!document.hidden);
  onChange();onTab();media.addEventListener('change',onChange);document.addEventListener('visibilitychange',onTab);
  const observer=new IntersectionObserver(([entry])=>setVisible(!document.hidden && entry.isIntersecting),{threshold:.1});
  if(section.current) observer.observe(section.current);
  return()=>{media.removeEventListener('change',onChange);document.removeEventListener('visibilitychange',onTab);observer.disconnect()};
 },[]);
 useEffect(()=>{
  if(slides.length<2||paused||reducedMotion||!visible)return;
  const timer=window.setInterval(()=>move(1),Math.max(intervalMs,4000));
  return()=>window.clearInterval(timer);
 },[slides.length,paused,reducedMotion,visible,intervalMs,move]);
 if(!slides.length)return null;
 return <div ref={section} className={`experience-carousel ${hero?'experience-carousel-hero':''} ${className}`} role="region" aria-label={label} aria-roledescription="carousel"
  onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(focusInside.current)}
  onFocusCapture={()=>{focusInside.current=true;setPaused(true)}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){focusInside.current=false;setPaused(false)}}}
  onTouchStart={event=>{downX.current=event.touches[0]?.clientX??null}}
  onTouchEnd={event=>{if(downX.current===null)return;const dx=event.changedTouches[0].clientX-downX.current;downX.current=null;if(Math.abs(dx)>50)move(dx<0?1:-1)}}
  onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1)}else if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}}}>
  <div className="experience-carousel-stage">
   {slides.map((photo,i)=><div key={photo.id} className={`experience-slide ${index===i?'is-active':''}`} aria-hidden={i!==index}>
    <Image src={photo.src} alt={photo.alt} fill sizes={hero?'100vw':'(max-width: 900px) 100vw, 70vw'} quality={82} priority={i===0&&hero}/>
   </div>)}
  </div>
  {slides.length>1&&<div className="experience-carousel-navigation">
   <button type="button" aria-label={`Previous image: ${label}`} onClick={()=>move(-1)}>‹</button>
   <button type="button" aria-label={`Next image: ${label}`} onClick={()=>move(1)}>›</button>
  </div>}
  {!hero&&<div className="experience-carousel-caption"><span>{slides[index].caption}</span>
   <div className="experience-carousel-progress" id={dotsId} aria-label={`${index+1} of ${slides.length} photographs`}>
    {slides.map((photo,i)=><button key={photo.id} type="button" aria-label={`View ${photo.caption}`} aria-pressed={i===index} onClick={()=>setIndex(i)} className={i===index?'is-active':''}/>)}
   </div>
  </div>}
 </div>;
}
