import type {MetadataRoute} from 'next';
import {SITE} from '@/lib/content';
export default function robots():MetadataRoute.Robots{
 if(process.env.NEXT_PUBLIC_SITE_LIVE==='true')return {rules:{userAgent:'*',allow:'/'},sitemap:`${SITE.url}/sitemap.xml`};
 return {rules:{userAgent:'*',disallow:'/'} };
}
