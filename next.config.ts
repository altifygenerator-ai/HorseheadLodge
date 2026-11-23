import type {NextConfig} from 'next';
const nextConfig:NextConfig={
  async redirects(){return [
    {source:'/wedding',destination:'/weddings',permanent:true},
    {source:'/booking',destination:'/cabins',permanent:true},
    {source:'/corporate',destination:'/corporate-retreats',permanent:true},
    {source:'/contact-us',destination:'/contact',permanent:true},
    {source:'/restaurant',destination:'/things-to-do/restaurants',permanent:true},
    {source:'/winery',destination:'/things-to-do/wineries',permanent:true},
    {source:'/hiking-trails-waterfalls',destination:'/things-to-do/trails',permanent:true},
    {source:'/services',destination:'/amenities',permanent:true},
    {source:'/excursions',destination:'/things-to-do',permanent:true},
    // Do NOT redirect /events, /event/*, /blog/*, /gallery or old guest RSVP paths blindly.
  ];},
};
export default nextConfig;
