import {PHOTOS, type PhotoKey} from '@/lib/content';

type Props={photo:PhotoKey;className?:string;loading?:'eager'|'lazy';sizes?:string};
/** The source URL is for staging. First-party media must be synced before DNS cutover. */
export function SitePhoto({photo,className='',loading='lazy',sizes}:Props){
  const item=PHOTOS[photo];
  const useLocalMedia = process.env.NEXT_PUBLIC_SITE_LIVE==='true' || process.env.NEXT_PUBLIC_LOCAL_MEDIA==='true';
  const src=useLocalMedia ? `/photos/${item.file}` : item.source;
  return <div className={`site-photo ${className}`}><img src={src} alt={item.alt} loading={loading} sizes={sizes} /></div>;
}
