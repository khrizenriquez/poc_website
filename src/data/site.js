export const countries = [
  { slug: 'guatemala', code: 'GT', name: 'Guatemala', city: 'Guatemala', x: 18, y: 24 },
  { slug: 'el-salvador', code: 'SV', name: 'El Salvador', city: 'San Salvador', x: 32, y: 42 },
  { slug: 'honduras', code: 'HN', name: 'Honduras', city: 'Tegucigalpa', x: 43, y: 28 },
  { slug: 'nicaragua', code: 'NI', name: 'Nicaragua', city: 'Managua', x: 54, y: 48 },
  { slug: 'costa-rica', code: 'CR', name: 'Costa Rica', city: 'San José', x: 66, y: 67 },
  { slug: 'panama', code: 'PA', name: 'Panamá', city: 'Panamá', x: 85, y: 77 },
];
export const corporatePages = [
  '',
  'nosotros',
  'servicios',
  'infraestructura',
  'presencia-regional',
  'aliados',
  'novedades',
  'contacto',
];
export const countryPages = [
  '',
  'quienes-somos',
  'servicios',
  'productos',
  'novedades',
  'contacto',
  'consultas',
  'pedidos',
  'devoluciones',
  'farmacovigilancia',
  'etica-y-denuncias',
  'trabaja-con-nosotros',
];
export const legalPages = ['privacidad', 'terminos'];
export const formPages = [
  'contacto',
  'consultas',
  'pedidos',
  'devoluciones',
  'farmacovigilancia',
  'etica-y-denuncias',
  'trabaja-con-nosotros',
];
export const editorialPages = [
  'nosotros',
  'quienes-somos',
  'servicios',
  'infraestructura',
  'aliados',
];
export const services = ['distribution', 'storage', 'commercial'];
export const products = [
  { id: 'P01', category: 'wellness', nameKey: 'daily', formatKey: 'box' },
  { id: 'P02', category: 'care', nameKey: 'skin', formatKey: 'tube' },
  { id: 'P03', category: 'nutrition', nameKey: 'balance', formatKey: 'bottle' },
  { id: 'P04', category: 'wellness', nameKey: 'active', formatKey: 'bottle' },
  { id: 'P05', category: 'care', nameKey: 'family', formatKey: 'box' },
  { id: 'P06', category: 'nutrition', nameKey: 'essential', formatKey: 'box' },
];
export const articles = [
  { id: 'network', category: 'network', image: 'distribution-center.jpg', date: '2026-10-15' },
  { id: 'people', category: 'people', image: 'people-team.jpg', date: '2026-10-10' },
  { id: 'quality', category: 'quality', image: 'quality-care.jpg', date: '2026-10-05' },
];
export const routeManifest = [
  ...corporatePages.map((page) => ({ page, country: null })),
  ...countries.flatMap((country) => countryPages.map((page) => ({ page, country }))),
  ...legalPages.map((page) => ({ page, country: null })),
];
