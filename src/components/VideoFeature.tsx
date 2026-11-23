'use client';
import {useState} from 'react';

type Props={videoId:string;title:string;credit:string;description?:string};
/** Only loads YouTube when explicitly clicked: fast pages, fewer third-party requests. */
export function VideoFeature({videoId,title,credit,description}:Props){
 const [play,setPlay]=useState(false);
 const safeId=/^[a-zA-Z0-9_-]{11}$/.test(videoId)?videoId:null;
 if(!safeId)return null;
 return <figure className="video-feature">
   <div className="video-feature-frame">
    {play?<iframe src={`https://www.youtube-nocookie.com/embed/${safeId}?autoplay=1&rel=0`} title={title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />:
    <button className="video-feature-poster" type="button" onClick={()=>setPlay(true)} aria-label={`Play video: ${title}`}>
     <img src={`https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`} alt="" loading="lazy" />
     <span className="video-feature-play" aria-hidden="true">▶</span>
     <span className="video-feature-prompt">Watch the film</span>
    </button>}
   </div>
   <figcaption><strong>{title}</strong><span>{credit}</span>{description&&<p>{description}</p>}
    <a href={`https://www.youtube.com/watch?v=${safeId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
   </figcaption>
 </figure>
}
