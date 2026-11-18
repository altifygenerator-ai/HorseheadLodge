import type {MetadataRoute} from 'next';
import {SITE,INTERNAL_PATHS} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{
  if(process.env.NEXT_PUBLIC_SITE_LIVE!=='true')return [];
  return INTERNAL_PATHS.map(p=>({url:new URL(p,SITE.url).toString(),changeFrequency:'monthly' as const,priority:p==='/'?1:0.7}));
}
