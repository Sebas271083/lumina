require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Building, SiteContent } = require('../models');
const slugify = require('../utils/slugify');

const buildings = [
  { name: 'Thames', sizeM2: 20100, category: 'finalizado', featured: true, displayOrder: 1 },
  { name: 'Panamericana', sizeM2: 25500, category: 'finalizado', featured: true, displayOrder: 2 },
  { name: 'San Isidro', sizeM2: 27800, category: 'finalizado', featured: true, displayOrder: 3 },
  { name: 'Olivos', sizeM2: 13800, category: 'finalizado', featured: true, displayOrder: 4 },
  { name: 'Puerto de Olivos', sizeM2: 8100, category: 'finalizado', featured: true, displayOrder: 5 },
  { name: 'Optima III', sizeM2: 6700, category: 'finalizado', featured: false, displayOrder: 6 },
  { name: 'Thames 333', sizeM2: 1300, category: 'finalizado', featured: false, displayOrder: 7 },
  { name: 'Vicente Lopez', sizeM2: 4200, category: 'proyecto', featured: false, displayOrder: 8 },
  { name: 'Pacheco', sizeM2: 6400, category: 'proyecto', featured: false, displayOrder: 9 },
  { name: 'Florida I', sizeM2: 22600, category: 'proyecto', featured: false, displayOrder: 10 },
];

const institucionalBlocks = [
  {
    blockKey: 'historia',
    title: 'Nuestra historia',
    body: 'Lumina cuenta con mas de 20 anios de trayectoria desarrollando proyectos inmobiliarios de alta gama en Argentina y la region, consolidandose como lider en edificios de oficinas categoria AAA en la zona norte del Gran Buenos Aires.',
    displayOrder: 1,
  },
  {
    blockKey: 'mision',
    title: 'Mision',
    body: 'Ofrecer soluciones inmobiliarias de clase mundial a empresas y personas, con los mas altos estandares de excelencia arquitectonica, operativa y de sostenibilidad ambiental, priorizando relaciones duraderas con nuestros clientes y soluciones flexibles a sus necesidades.',
    displayOrder: 2,
  },
  {
    blockKey: 'vision',
    title: 'Vision',
    body: 'Ser la desarrolladora y administradora lider de proyectos inmobiliarios premium y de vanguardia en Argentina y la region, explorando continuamente nuevos conceptos de excelencia, comunidad, formas de trabajo y estilo de vida.',
    displayOrder: 3,
  },
  {
    blockKey: 'valor-seguridad',
    title: 'Seguridad y confianza',
    body: 'Somos reconocidos como una desarrolladora experimentada y estable en el sector de oficinas AAA, lo que permite construir relaciones de largo plazo con grandes empresas nacionales y multinacionales.',
    displayOrder: 4,
  },
  {
    blockKey: 'valor-excelencia',
    title: 'Excelencia',
    body: 'Cumplimos estandares rigurosos de construccion y operacion, incorporando tecnologia innovadora en todos nuestros proyectos.',
    displayOrder: 5,
  },
  {
    blockKey: 'valor-sustentabilidad',
    title: 'Sustentabilidad y responsabilidad social',
    body: 'Buscamos una integracion armoniosa con la comunidad y un compromiso genuino con el medio ambiente, cumpliendo con la certificacion LEED Core & Shell en nuestros desarrollos.',
    displayOrder: 6,
  },
];

const sustentabilidadBlocks = [
  {
    blockKey: 'certificacion-leed',
    title: 'Certificacion LEED Core & Shell',
    body: 'Nuestros edificios cumplen con los estandares de la certificacion LEED Core & Shell, que evalua el diseno y la construccion sustentable en el uso de energia, agua, materiales y calidad ambiental interior.',
    displayOrder: 1,
  },
  {
    blockKey: 'compromiso-ambiental',
    title: 'Compromiso ambiental',
    body: 'Trabajamos para minimizar el impacto ambiental de cada desarrollo, integrando criterios de eficiencia energetica y responsabilidad social en todas las etapas del proyecto.',
    displayOrder: 2,
  },
];

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Base de datos sincronizada (tablas recreadas).');

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
  await User.create({
    name: 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@luminaoffice.com.ar',
    passwordHash,
    role: 'admin',
  });
  console.log('Usuario administrador creado.');

  for (const b of buildings) {
    await Building.create({
      ...b,
      slug: slugify(b.name),
      address: null,
      description: `Edificio de oficinas ${b.name}, ${b.sizeM2.toLocaleString('es-AR')} m2, categoria ${b.category === 'finalizado' ? 'Finalizados' : 'Proyectos'}.`,
      coverImage: null,
      gallery: [],
    });
  }
  console.log(`${buildings.length} edificios creados.`);

  for (const block of institucionalBlocks) {
    await SiteContent.create({ page: 'institucional', ...block });
  }
  for (const block of sustentabilidadBlocks) {
    await SiteContent.create({ page: 'sustentabilidad', ...block });
  }
  console.log('Contenido institucional y de sustentabilidad creado.');

  console.log('\nSeed completado con exito.');
  console.log(`Login admin -> email: ${process.env.ADMIN_EMAIL || 'admin@luminaoffice.com.ar'} / password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
