/**
 * Content is based on the currently published Horsehead Lake Lodge website and
 * its six linked Airbnb listings, checked November 18, 2026.
 * Confirm pricing and house rules with Scott immediately before production launch.
 * Never substitute fabricated claims for missing information.
 */
const automatedBooking = process.env.NEXT_PUBLIC_HORSEHEAD_AUTOMATION_LIVE === 'true';

export const SITE = {
  name: 'Horsehead Lake Lodge & Event Center',
  shortName: 'Horsehead Lake Lodge',
  url: 'https://horseheadlakelodge.com',
  address: '213 County Road 3190, Clarksville, AR 72830',
  phoneDisplay: '(479) 214-0218',
  phone: '+14792140218',
  email: 'scott@horseheadlakelodge.com',
  /** Public date-hold inquiry address; delivery and routing still need owner confirmation. */
  eventInquiryEmail: 'info@horseheadlakelodge.com',
  eventInquiry: automatedBooking ? '/event-inquiry' : null,
  tour: automatedBooking ? '/tour-booking' : 'https://app.venuexai.com/book-appointment/HF37r4yoWYHWbzUZbCHB?extended=false',
  dates: automatedBooking ? '/event-availability' : 'https://availabledates.horseheadlakelodge.com/',
} as const;

export type Stay = {
  slug: string;
  name: string;
  category: 'The lodge' | 'Waterfall cabins' | 'Glamping cabins';
  short: string;
  description: string;
  details: string[];
  notes?: string;
  guests: number;
  bedrooms: number;
  baths: number;
  bookUrl: string;
  photo: PhotoKey;
};

export const STAYS: Stay[] = [
  {
    slug: 'main-lodge', name: 'The Main Lodge', category: 'The lodge',
    short: 'A roomy lakefront home with a stone fireplace and views from the porch.',
    description: 'The Main Lodge sits above Horsehead Lake with a living area around a stone fireplace, an open kitchen, and porches looking toward the water. The forest and trails begin close to the property.',
    details: ['Three bedrooms with a king, a queen and two double beds', 'Two bathrooms', 'Stone fireplace and kitchen', 'Covered porch and upstairs balcony', 'Access to the dock, kayaks and canoe'],
    guests: 12, bedrooms: 3, baths: 2,
    bookUrl: 'https://www.airbnb.com/rooms/22246525', photo: 'lodge',
  },
  {
    slug: 'waterfall-cabin-1', name: 'Waterfall Cabin One', category: 'Waterfall cabins',
    short: 'A quiet cabin for two beside the Horsehead Creek spillway.',
    description: 'Set near the spillway where Horsehead Lake meets Horsehead Creek, Cabin One has a queen bedroom and a small kitchen area. Outside, there is porch seating, a hammock and a private hot tub in a covered area.',
    details: ['Queen bed', 'Kitchenette with small stove and microwave', 'Private hot tub in a covered area', 'Porch seating, hammock and gas grill', 'Bathroom entered separately from outside'],
    notes: 'The bathroom has its own outside entrance. The waterfall changes with the weather and can run low in dry conditions.',
    guests: 2, bedrooms: 1, baths: 1,
    bookUrl: 'https://www.airbnb.com/rooms/45281089', photo: 'waterfall',
  },
  {
    slug: 'waterfall-cabin-2', name: 'Waterfall Cabin Two', category: 'Waterfall cabins',
    short: 'Two full beds, a kitchen and a porch hot tub near the waterfall.',
    description: 'This creekside cabin has a separate bedroom with two full beds, a living room and a kitchen with a small stove and oven. The porch has seating, a gas grill and a hot tub.',
    details: ['Two full beds', 'Separate bedroom and living room', 'Kitchen with stove and oven', 'Private porch hot tub and gas grill', 'Access to the dock, kayaks and courts'],
    notes: 'Waterfall flow varies seasonally. Check the current Airbnb listing for the latest conditions and house rules.',
    guests: 4, bedrooms: 1, baths: 1,
    bookUrl: 'https://www.airbnb.com/rooms/879535773986067585', photo: 'waterfall',
  },
  {
    slug: 'waterfall-cabin-3', name: 'Waterfall Cabin Three', category: 'Waterfall cabins',
    short: 'Two queen beds with a hot tub facing the spillway.',
    description: 'Cabin Three looks toward the waterfall from its front porch. Inside are a living area and kitchen, one bedroom with two queen beds, and a full bathroom. Guests have access to the lake dock and kayaks.',
    details: ['Two queen beds', 'Living area and kitchen', 'Private porch hot tub', 'Full bathroom', 'Lake dock and kayaks nearby'],
    notes: 'The waterfall is rain-dependent and may be much quieter during dry summer periods.',
    guests: 4, bedrooms: 1, baths: 1,
    bookUrl: 'https://www.airbnb.com/rooms/907810186496081029', photo: 'waterfall',
  },
  {
    slug: 'glamping-cabin-1', name: 'Glamping Cabin One', category: 'Glamping cabins',
    short: 'A heated and cooled lakeside stay under the trees, with an outdoor kitchen.',
    description: 'This glamping cabin sits beneath trees near Horsehead Lake. The sleeping room is heated and cooled, while the porch is set up for outdoor cooking and relaxing. The dock and kayaks are nearby.',
    details: ['Two queen beds', 'Heated and cooled sleeping area', 'Covered outdoor kitchen and gas grill', 'Fire pit with firewood', 'Nearby lake access and kayaks'],
    notes: 'The approach road is steep. The current listing advises all-wheel or four-wheel drive; front-wheel-drive vehicles are not permitted down the hill.',
    guests: 5, bedrooms: 1, baths: 1,
    bookUrl: 'https://www.airbnb.com/rooms/23291812', photo: 'glamping',
  },
  {
    slug: 'glamping-cabin-2', name: 'Glamping Cabin Two', category: 'Glamping cabins',
    short: 'Lakeside glamping with two queen beds, a covered porch and a fire pit.',
    description: 'Glamping Cabin Two has a heated and cooled sleeping room with two queen beds. On the porch, guests have a refrigerator, griddle, coffee maker and cooking essentials; outside there is a gas grill and fire pit.',
    details: ['Two queen beds', 'Heated and cooled sleeping area', 'Covered porch with outdoor kitchen essentials', 'Gas grill and fire pit', 'Lake dock and kayaks'],
    notes: 'The road down to the glamping cabins is steep; the listing recommends all-wheel or four-wheel drive, with an option to park above and walk down.',
    guests: 4, bedrooms: 1, baths: 1,
    bookUrl: 'https://www.airbnb.com/rooms/815701483202479525', photo: 'glamping',
  },
];

export const PACKAGES = [
  { title: 'Full weekend', duration: 'Friday at noon through Sunday at 10 am', price: '$9,900', description: 'A published full-weekend wedding option with venue access, on-site guest quarters and lake recreation. Confirm current inclusions with the venue.', features: ['Cantilevered lake-facing ceremony deck and indoor ceremony hall', 'Reception/banquet hall, bridal suite and rooftop sky deck', 'Three-bedroom guest quarters and Main Lodge, with published lodging capacity of 26 across the event arrangements', 'Courtyard, dock, kayaks and canoes', 'Fire pits with firewood and lighted pickleball/basketball courts'] },
  { title: 'Weekday', duration: 'Monday at noon through Thursday at 10 am', price: '$6,900', description: 'A longer published weekday wedding option with spaces and accommodation described on the original site. Confirm inclusions and the current rate.', features: ['Lake-facing deck and indoor ceremony hall', 'Reception/banquet hall with commercial kitchen', 'Bridal suite, rooftop sky deck and three-bedroom guest quarters', 'Main Lodge and published event lodging arrangements', 'Courtyard, boat dock, kayaks, canoes, fire pits and courts'] },
] as const;

/** These are images from Scott's existing public website, not stock photography.
 * Run `npm run media:sync` before production DNS changes to save copies locally.
 */
export const PHOTOS = {
  ceremony: { file: 'ceremony.jpeg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/IMG_6897-1024x768.jpeg', alt: 'Wedding ceremony setup at Horsehead Lake Lodge' },
  reception: { file: 'reception.jpeg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/IMG_7181-1-1024x768.jpeg', alt: 'Reception tables inside the timber event hall' },
  lake: { file: 'lake.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/HLL_7557-1024x683.jpg', alt: 'Lake and wooded landscape at Horsehead Lake Lodge' },
  lodge: { file: 'lodge.webp', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/p1-1024x627.webp', alt: 'Main Lodge exterior among the trees' },
  waterfall: { file: 'waterfall.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/Waterfall-Cabins-.jpg', alt: 'Waterfall cabins beside the Horsehead Creek spillway' },
  glamping: { file: 'glamping.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/HLL_7470-1-1024x683.jpg', alt: 'Glamping accommodations at Horsehead Lake Lodge' },
  bridal: { file: 'bridal.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/Bridal-Suite-2-1024x683.jpg', alt: 'Bridal suite at Horsehead Lake Lodge' },
  enclave: { file: 'enclave.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2025/12/IMG_0695.jpg', alt: 'The Enclave event space overlooking Horsehead Lake' },
  walkway: { file: 'walkway.jpeg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2024/01/IMG_6946-1024x768.jpeg', alt: 'Walkway at Horsehead Lake Lodge' },
  enclaveRoom: { file: 'enclave-room.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2025/12/IMG_0696-scaled.jpg', alt: 'Interior view of The Enclave event space' },
  enclaveView: { file: 'enclave-view.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2025/12/IMG_0699-scaled.jpg', alt: 'Another view of The Enclave at Horsehead Lake Lodge' },
  enclaveSetting: { file: 'enclave-setting.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2025/12/IMG_0700-scaled.jpg', alt: 'The Enclave event area at Horsehead Lake Lodge' },
  enclaveDetails: { file: 'enclave-details.jpg', source: 'https://horseheadlakelodge.com/wp-content/uploads/2025/12/IMG_0701-scaled.jpg', alt: 'The Enclave venue details at Horsehead Lake Lodge' },
} as const;
export type PhotoKey = keyof typeof PHOTOS;

export const INTERNAL_PATHS = [
  '/', '/weddings', '/wedding-packages', '/the-enclave', '/cabins',
  ...STAYS.map(s => `/cabins/${s.slug}`), '/corporate-retreats',
  '/things-to-do', '/gallery', '/video-gallery', '/contact',
  '/cabins/waterfall-cabins','/cabins/glamping-cabins',
  '/guest-information', '/blog','/amenities','/plan-your-event',
  '/things-to-do/restaurants','/things-to-do/wineries','/things-to-do/trails',
] as const;
