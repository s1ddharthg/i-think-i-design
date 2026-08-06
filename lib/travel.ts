// The route the About page's travel map flies. Order is the order it is
// travelled — Chennai is the anchor, everything after it is a hop.
//
// Chennai and the Tokyo hop lead, because the dive out of world view wants one
// long leg to make the scale legible. Everything after that reads as a single
// loop: down the Coromandel coast, inland through the hills, along the Ghats to
// the tip, back up the Malabar coast, north to Gujarat, then out to Europe.
// Ordering it that way keeps almost every leg under two degrees, which is what
// stops the camera from lurching between neighbours that are half an hour apart
// by road.

export type TravelStop = {
  slug: string;
  /** Displayed name. */
  name: string;
  /** Region line under the name — where the place actually is. */
  where: string;
  lon: number;
  lat: number;
  /**
   * Degrees of longitude the camera frames when parked here. This, not a zoom
   * factor, is what the section stores: it means the same framing on a 390px
   * phone and a 2560px display, because the scale is solved from it per
   * viewport. Small number = close in.
   *
   * Do not push the hill stations below ~8: at 1:110m the coastline carries a
   * vertex roughly every 50km, and closer than that the Kerala coast
   * straightens into a line and the whole frame fills with land.
   */
  span: number;
  /**
   * Photo filenames inside /public/images/travel/<slug>/, written by
   * scripts/travel-photos.ps1. Empty renders an undeveloped-film frame instead
   * of a broken image, so the section is honest until the scans land. Two is
   * the most that fits; the third would be shown at a size nobody can read.
   */
  photos: string[];
  /** EDIT ME — one line, in your own words. Empty renders nothing. */
  note: string;
};

export const TRAVEL_STOPS: TravelStop[] = [
  {
    slug: 'chennai',
    name: 'Chennai',
    where: 'Coromandel Coast, Tamil Nadu',
    lon: 80.2707,
    lat: 13.0827,
    span: 34,
    photos: [],
    note: '',
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    where: 'Kantō Plain, Honshu',
    lon: 139.6917,
    lat: 35.6895,
    span: 34,
    photos: ['1.jpg', '2.jpg'],
    note: '',
  },
  {
    slug: 'mahabalipuram',
    name: 'Mahabalipuram',
    where: 'Coromandel Coast · Pallava shore temples',
    lon: 80.1945,
    lat: 12.6208,
    span: 8,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'pondicherry',
    name: 'Pondicherry',
    where: 'Bay of Bengal · the old French quarter',
    lon: 79.8083,
    lat: 11.9416,
    span: 8,
    photos: ['1.jpg', '2.jpg'],
    note: '',
  },
  {
    slug: 'yelagiri',
    name: 'Yelagiri',
    where: 'Javadi Hills, Tamil Nadu · 1,110 m',
    lon: 78.6386,
    lat: 12.5769,
    span: 9.5,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'bengaluru',
    name: 'Bengaluru',
    where: 'Deccan Plateau, Karnataka · 920 m',
    lon: 77.5946,
    lat: 12.9716,
    span: 12,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'yercaud',
    name: 'Yercaud',
    where: 'Shevaroy Hills, Tamil Nadu · 1,415 m',
    lon: 78.2097,
    lat: 11.775,
    span: 9.5,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    where: 'Palani Hills · 2,130 m',
    lon: 77.4892,
    lat: 10.2381,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'munnar',
    name: 'Munnar',
    where: 'Western Ghats, Kerala · 1,600 m',
    lon: 77.0595,
    lat: 10.0889,
    span: 9,
    photos: ['1.jpg', '2.jpg'],
    note: '',
  },
  {
    slug: 'vagamon',
    name: 'Vagamon',
    where: 'Idukki, Kerala · 1,100 m',
    lon: 76.906,
    lat: 9.6857,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'alleppey',
    name: 'Alleppey',
    where: 'Kerala backwaters · sea level',
    lon: 76.3388,
    lat: 9.4981,
    span: 9,
    photos: ['1.jpg', '2.jpg'],
    note: '',
  },
  {
    slug: 'trivandrum',
    name: 'Trivandrum',
    where: 'Malabar Coast, Kerala',
    lon: 76.9366,
    lat: 8.5241,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'kanyakumari',
    name: 'Kanyakumari',
    where: 'The tip · three seas meet here',
    lon: 77.5385,
    lat: 8.0883,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'kochi',
    name: 'Kochi',
    where: 'Malabar Coast · Fort Kochi',
    lon: 76.2673,
    lat: 9.9312,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'wayanad',
    name: 'Wayanad',
    where: 'Western Ghats, Kerala · 2,100 m',
    lon: 76.132,
    lat: 11.6854,
    span: 9,
    photos: ['1.jpg'],
    note: '',
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    where: 'Gujarat, on the Sabarmati',
    lon: 72.5714,
    lat: 23.0225,
    span: 14,
    photos: ['1.jpg', '2.jpg'],
    note: '',
  },
  {
    slug: 'paris',
    name: 'Paris',
    where: 'Île-de-France, on the Seine',
    lon: 2.3522,
    lat: 48.8566,
    span: 17,
    photos: [],
    note: '',
  },
  {
    slug: 'milan',
    name: 'Milan',
    where: 'Lombardy, Po Valley',
    lon: 9.19,
    lat: 45.4642,
    span: 17,
    photos: [],
    note: '',
  },
];

/** Equirectangular, matching the canvas public/map/land.json is drawn on. */
export const MAP_W = 2000;
export const MAP_H = 1000;
export const PX_PER_DEG = MAP_W / 360;

export const toMapX = (lon: number) => ((lon + 180) / 360) * MAP_W;
export const toMapY = (lat: number) => ((90 - lat) / 180) * MAP_H;

/** Degrees formatted the way a map margin would print them. */
export function formatCoords(lon: number, lat: number) {
  const fmt = (v: number, pos: string, neg: string) =>
    `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;
  return `${fmt(lat, 'N', 'S')} / ${fmt(lon, 'E', 'W')}`;
}
