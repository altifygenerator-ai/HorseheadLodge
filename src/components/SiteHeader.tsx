'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState,type Dispatch,type SetStateAction} from 'react';
import {SITE} from '@/lib/content';

type MenuItem={name:string;href:string;note?:string};
const weddingLinks:MenuItem[]=[
 {name:'Wedding venue',href:'/weddings',note:'Ceremony and reception spaces'},
 {name:'Wedding packages',href:'/wedding-packages',note:'Weekend and smaller celebrations'},
 {name:'Corporate retreats',href:'/corporate-retreats',note:'Meetings beside the lake'},
];
const stayLinks:MenuItem[]=[
 {name:'All accommodations',href:'/cabins',note:'Compare all six stays'},
 {name:'The Main Lodge',href:'/cabins/main-lodge',note:'A home above the lake'},
 {name:'Waterfall cabins',href:'/cabins/waterfall-cabins',note:'Three creekside cabins'},
 {name:'Glamping cabins',href:'/cabins/glamping-cabins',note:'Two stays under the trees'},
];
const exploreLinks:MenuItem[]=[
 {name:'Things to do',href:'/things-to-do',note:'The lake and the Ozarks'},
 {name:'Wineries',href:'/things-to-do/wineries',note:'Arkansas wine country'},
 {name:'Restaurants',href:'/things-to-do/restaurants',note:'Where to eat'},
 {name:'Hiking & waterfalls',href:'/things-to-do/trails',note:'Plan a day outdoors'},
 {name:'Amenities',href:'/amenities',note:'Around the property'},
 {name:'Films',href:'/video-gallery',note:'Real weddings and lake views'},
 {name:'Guest information',href:'/guest-information',note:'Before you arrive'},
 {name:'Journal',href:'/blog',note:'Stories and planning notes'},
];

type ActiveMenu='Weddings'|'Stay'|'Explore'|null;
function NavGroup({name,items,pathname,activeMenu,setActiveMenu}:{
 name:Exclude<ActiveMenu,null>;items:MenuItem[];pathname:string;
 activeMenu:ActiveMenu;setActiveMenu:Dispatch<SetStateAction<ActiveMenu>>;
}){
 const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const isOpen=activeMenu===name;
 function cancelClose(){
  if(closeTimer.current!==null){clearTimeout(closeTimer.current);closeTimer.current=null;}
 }
 function show(){cancelClose();setActiveMenu(name);}
 function hide(){cancelClose();setActiveMenu(current=>current===name?null:current);}
 function hideAfterPointerLeave(){
  cancelClose();
  closeTimer.current=setTimeout(()=>{setActiveMenu(current=>current===name?null:current);closeTimer.current=null;},150);
 }
 useEffect(()=>()=>{if(closeTimer.current!==null)clearTimeout(closeTimer.current)},[]);
 return <div className={'nav-dropdown'+(isOpen?' is-open':'')}
  onMouseEnter={show} onMouseLeave={hideAfterPointerLeave}
  onFocusCapture={show}
  onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))hide()}}>
  <button type="button" className={'nav-dropdown-trigger'+(items.some(x=>pathname===x.href||pathname.startsWith(x.href+'/'))?' nav-current':'')}
   aria-expanded={isOpen} aria-haspopup="true" aria-controls={'nav-panel-'+name.toLowerCase()} onClick={show}>
   {name}<span className="nav-chevron" aria-hidden="true"/>
  </button>
  <div id={'nav-panel-'+name.toLowerCase()} className="nav-dropdown-panel">
   {items.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} onClick={hide}>
    <strong>{item.name}</strong>{item.note&&<small>{item.note}</small>}
   </Link>)}
  </div>
 </div>;
}

export function SiteHeader(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const [activeMenu,setActiveMenu]=useState<ActiveMenu>(null);
 const desktopNav=useRef<HTMLElement>(null);
 useEffect(()=>{setOpen(false);setActiveMenu(null);},[pathname]);
 useEffect(()=>{
  const onOutside=(event:PointerEvent)=>{if(!desktopNav.current?.contains(event.target as Node))setActiveMenu(null)};
  const onEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setActiveMenu(null)};
  const onScroll=()=>setActiveMenu(null);
  document.addEventListener('pointerdown',onOutside);
  document.addEventListener('keydown',onEscape);
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{document.removeEventListener('pointerdown',onOutside);document.removeEventListener('keydown',onEscape);window.removeEventListener('scroll',onScroll)};
 },[]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',key)};
 },[open]);
 return <header className="site-header"><div className="header-inner">
  <Link className="wordmark" href="/" aria-label="Horsehead Lake Lodge home" onClick={()=>setOpen(false)}><span className="wordmark-main">Horsehead Lake Lodge</span><span className="wordmark-small">&amp; Event Center · Clarksville, Arkansas</span></Link>
  <nav className="desktop-nav" aria-label="Main navigation" ref={desktopNav}>
   <NavGroup name="Weddings" items={weddingLinks} pathname={pathname} activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
   <NavGroup name="Stay" items={stayLinks} pathname={pathname} activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
   <Link href="/the-enclave" aria-current={pathname==='/the-enclave'?'page':undefined}>The Enclave</Link>
   <Link href="/gallery" aria-current={pathname==='/gallery'?'page':undefined}>Gallery</Link>
   <NavGroup name="Explore" items={exploreLinks} pathname={pathname} activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
   <a href={SITE.dates} target="_blank" rel="noopener noreferrer">Available dates</a>
   <Link href="/contact" aria-current={pathname==='/contact'?'page':undefined}>Contact</Link>
  </nav>
  <a className="header-cta" href={SITE.tour} target="_blank" rel="noopener noreferrer">Book a tour <span aria-hidden="true">↗</span></a>
  <div className="mobile-menu">
   <button type="button" className="mobile-menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-controls="horsehead-mobile-nav" aria-expanded={open} onClick={()=>setOpen(value=>!value)}><span>{open?'Close':'Menu'}</span><span className="mobile-menu-glyph" aria-hidden="true">{open?'×':'☰'}</span></button>
   {open&&<nav id="horsehead-mobile-nav" className="mobile-menu-panel" aria-label="Mobile navigation">
    <div className="mobile-menu-feature"><a href={SITE.tour} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>Schedule a tour <span aria-hidden="true">↗</span></a><a href={SITE.dates} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>Available event dates <span aria-hidden="true">↗</span></a></div>
    <div className="mobile-menu-groups">
     <section><h2>Weddings &amp; events</h2>{weddingLinks.map(x=><Link key={x.href} href={x.href} onClick={()=>setOpen(false)}>{x.name}</Link>)}<Link href="/the-enclave" onClick={()=>setOpen(false)}>The Enclave</Link></section>
     <section><h2>Stay at Horsehead</h2>{stayLinks.map(x=><Link key={x.href} href={x.href} onClick={()=>setOpen(false)}>{x.name}</Link>)}</section>
     <section><h2>Explore</h2><Link href="/gallery" onClick={()=>setOpen(false)}>Photo gallery</Link>{exploreLinks.map(x=><Link key={x.href} href={x.href} onClick={()=>setOpen(false)}>{x.name}</Link>)}<Link href="/contact" onClick={()=>setOpen(false)}>Contact</Link></section>
    </div>
   </nav>}
  </div>
 </div></header>;
}