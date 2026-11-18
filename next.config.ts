import type {NextConfig} from 'next';
const nextConfig:NextConfig={
  async redirects(){return [
    {source:'/wedding',destination:'/weddings',permanent:true},
    {source:'/booking',destination:'/cabins',permanent:true},
    {source:'/corporate',destination:'/corporate-retreats',permanent:true},
    {source:'/contact-us',destination:'/contact',permanent:true},
    // Do NOT redirect /events, /event/*, /blog/*, /gallery or old guest RSVP paths blindly.
  ];},
};
export default nextConfig;
