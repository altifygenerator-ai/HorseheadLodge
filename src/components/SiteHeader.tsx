import Link from 'next/link';
import { SITE } from '@/lib/content';
const more = [
  {name:'Corporate',href:'/corporate-retreats'},
  {name:'Video gallery',href:'/video-gallery'},
  {name:'Excursions',href:'/things-to-do'},
  {name:'Restaurants',href:'/things-to-do/restaurants'},
  {name:'Wineries',href:'/things-to-do/wineries'},
  {name:'Hiking & waterfalls',href:'/things-to-do/trails'},
  {name:'Guest information',href:'/guest-information'},
  {name:'On-site amenities',href:'/amenities'},
  {name:'Blog',href:'/blog'},
];
export function SiteHeader() {return <header className="site-header"><div className="header-inner">
  <Link className="wordmark" href="/" aria-label="Horsehead Lake Lodge homepage"><span className="wordmark-main">Horsehead Lake Lodge</span><span className="wordmark-small">&amp; Event Center</span></Link>
  <nav className="desktop-nav" aria-label="Main navigation">
    <Link href="/weddings">Weddings</Link><Link href="/the-enclave">The Enclave</Link><Link href="/cabins">Cabins</Link><Link href="/gallery">Gallery</Link>
    <details className="nav-dropdown"><summary>Explore</summary><div className="nav-dropdown-panel">{more.map(x=><Link key={x.href} href={x.href}>{x.name}</Link>)}</div></details>
    <a href={SITE.dates} target="_blank" rel="noopener noreferrer">Available dates</a><Link href="/contact">Contact</Link>
  </nav>
  <a className="header-cta" href={SITE.tour} target="_blank" rel="noopener noreferrer">Book a tour</a>
  <details className="mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><Link href="/weddings">Weddings</Link><Link href="/wedding-packages">Wedding packages</Link><Link href="/the-enclave">The Enclave</Link><Link href="/cabins">Cabins</Link><Link href="/gallery">Gallery</Link>{more.map(x=><Link key={x.href} href={x.href}>{x.name}</Link>)}<a href={SITE.dates} target="_blank" rel="noopener noreferrer">Available dates</a><Link href="/contact">Contact</Link><a href={SITE.tour} target="_blank" rel="noopener noreferrer">Book a tour</a></nav></details>
</div></header>}
