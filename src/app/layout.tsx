import type {Metadata,Viewport} from 'next';
import {SITE} from '@/lib/content';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import './style.css';
const isLive=process.env.NEXT_PUBLIC_SITE_LIVE==='true';
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#242220'};
export const metadata:Metadata={metadataBase:new URL(SITE.url),title:{default:'Horsehead Lake Lodge | Weddings & Lakeside Cabins in Arkansas',template:'%s | Horsehead Lake Lodge'},description:'Plan a lakeside wedding, visit the event spaces or stay in a cabin at Horsehead Lake Lodge near Clarksville, Arkansas.',robots:{index:isLive,follow:isLive},openGraph:{type:'website',siteName:SITE.name,locale:'en_US',title:'Horsehead Lake Lodge & Event Center',description:'A lakeside setting for weddings, celebrations and cabins in Clarksville, Arkansas.'}};
export default function RootLayout({children}:{children:React.ReactNode}){
const business={'@context':'https://schema.org','@type':'LocalBusiness',name:SITE.name,url:SITE.url,telephone:SITE.phone,email:SITE.email,address:{'@type':'PostalAddress',streetAddress:'213 County Road 3190',addressLocality:'Clarksville',addressRegion:'AR',postalCode:'72830',addressCountry:'US'}};
return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(business).replace(/</g,'\\u003c')}}/></body></html>}
