import data from './experience-photos.json';

export type ExperienceCategory =
  | 'Landscape & lake'
  | 'Ceremony spaces'
  | 'Reception & gatherings'
  | 'Real wedding moments'
  | 'Stay & explore';

export type ExperiencePhoto = {
  id: string;
  src: string;
  source: string;
  category: ExperienceCategory;
  alt: string;
  caption: string;
  width: number;
  height: number;
  bytes: number;
};

export const experiencePhotos = data.photos as ExperiencePhoto[];
export const featured = data.featured;
export const experienceCategories: ExperienceCategory[] = [
  'Landscape & lake',
  'Ceremony spaces',
  'Reception & gatherings',
  'Real wedding moments',
  'Stay & explore',
];
const photoById = new Map(experiencePhotos.map(photo => [photo.id, photo]));
export const getExperiencePhoto = (id: string): ExperiencePhoto => {
  const photo = photoById.get(id);
  if (!photo) throw new Error(`Missing curated experience photo: ${id}`);
  return photo;
};
export const getExperiencePhotos = (ids: readonly string[]): ExperiencePhoto[] => ids.map(getExperiencePhoto);
