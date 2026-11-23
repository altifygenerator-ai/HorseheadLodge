import Image from 'next/image';
import {getExperiencePhoto} from '@/lib/experience';

type Props={id:string;className?:string;priority?:boolean;sizes?:string};
/** First-party photography supplied for the Horsehead Lake Lodge rebuild. */
export function ExperienceImage({id,className='',priority=false,sizes='(max-width: 700px) 100vw, 50vw'}:Props){
 const photo=getExperiencePhoto(id);
 return <div className={`experience-image ${className}`}>
   <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} quality={82}/>
 </div>;
}
