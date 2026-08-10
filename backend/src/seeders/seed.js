require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Building, SiteContent } = require('../models');
const slugify = require('../utils/slugify');

// Fotos de stock (Unsplash) contextualizadas por edificio como reemplazo temporal
// hasta contar con fotografia real de cada propiedad.
const stockPhoto = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const buildings = [
  {
    name: 'Thames', sizeM2: 20100, availableM2: 3200, category: 'finalizado', featured: true, displayOrder: 1,
    address: 'Av. Thames 1875, San Isidro, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento cubierto', 'Seguridad 24 hs', 'Terraza verde', 'Bicicletero'],
    certifications: ['LEED Core & Shell'],
    cover: '1486406146926-c627a92ad1ab', gallery: ['1497366754035-f200968a6e72', '1541746972996-4e0b0f43e02a'],
  },
  {
    name: 'Panamericana', sizeM2: 25500, availableM2: null, category: 'finalizado', featured: true, displayOrder: 2,
    address: 'Panamericana Km 32, Villa Adelina, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento cubierto', 'Gimnasio', 'Cafetería', 'Seguridad 24 hs'],
    certifications: ['LEED Core & Shell'],
    cover: '1497366216548-37526070297c', gallery: ['1560179707-f14e90ef3623', '1497366412874-3415097a27e7'],
  },
  {
    name: 'San Isidro', sizeM2: 27800, availableM2: 5400, category: 'finalizado', featured: true, displayOrder: 3,
    address: 'Av. Centenario 1000, San Isidro, Provincia de Buenos Aires, Argentina',
    amenities: ['Auditorio', 'Estacionamiento cubierto', 'Terraza verde', 'Seguridad 24 hs'],
    certifications: ['LEED Core & Shell'],
    cover: '1560518883-ce09059eeffa', gallery: ['1531973576160-7125cd663d86', '1556761175-5973dc0f32e7'],
  },
  {
    name: 'Olivos', sizeM2: 13800, availableM2: 1200, category: 'finalizado', featured: true, displayOrder: 4,
    address: 'Av. Maipú 1300, Olivos, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento cubierto', 'Bicicletero', 'Cafetería'],
    certifications: ['LEED Core & Shell'],
    cover: '1524758631624-e2822e304c36', gallery: ['1568992688065-536aad8a12f6', '1518005020951-eccb494ad742'],
  },
  {
    name: 'Puerto de Olivos', sizeM2: 8100, availableM2: 800, category: 'finalizado', featured: true, displayOrder: 5,
    address: 'Ribera del Río de la Plata, Olivos, Provincia de Buenos Aires, Argentina',
    amenities: ['Vista al río', 'Estacionamiento cubierto', 'Seguridad 24 hs'],
    certifications: ['LEED Core & Shell'],
    cover: '1449034446853-66c86144b0ad', gallery: ['1587825140708-dfaf72ae4b04', '1449824913935-59a10b8d2000'],
  },
  {
    name: 'Optima III', sizeM2: 6700, availableM2: 2100, category: 'finalizado', featured: false, displayOrder: 6,
    address: 'Panamericana Km 28, Villa Adelina, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento cubierto', 'Seguridad 24 hs'],
    certifications: [],
    cover: '1517048676732-d65bc937f952', gallery: ['1462826303086-329426d1aef5', '1590650046871-92c887180603'],
  },
  {
    name: 'Thames 333', sizeM2: 1300, availableM2: null, category: 'finalizado', featured: false, displayOrder: 7,
    address: 'Thames 333, San Isidro, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento cubierto'],
    certifications: [],
    cover: '1554469384-e58fac16e23a', gallery: ['1524230572899-a752b3835840', '1600607687939-ce8a6c25118c'],
  },
  {
    name: 'Vicente Lopez', sizeM2: 4200, availableM2: 4200, category: 'proyecto', featured: false, displayOrder: 8,
    address: 'Av. Maipú 2200, Vicente López, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento subterráneo', 'Terraza verde'],
    certifications: ['LEED Core & Shell (en trámite)'],
    cover: '1522071820081-009f0129c71c', gallery: ['1506744038136-46273834b3fb', '1517457373958-b7bdd4587205'],
  },
  {
    name: 'Pacheco', sizeM2: 6400, availableM2: 6400, category: 'proyecto', featured: false, displayOrder: 9,
    address: 'Panamericana Km 25, General Pacheco, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento subterráneo', 'Seguridad 24 hs'],
    certifications: ['LEED Core & Shell (en trámite)'],
    cover: '1497215728101-856f4ea42174', gallery: ['1524749292158-7540c2494485', '1486406146926-c627a92ad1ab'],
  },
  {
    name: 'Florida I', sizeM2: 22600, availableM2: 22600, category: 'proyecto', featured: false, displayOrder: 10,
    address: 'Av. Florida 100, Vicente López, Provincia de Buenos Aires, Argentina',
    amenities: ['Estacionamiento subterráneo', 'Auditorio', 'Terraza verde', 'Bicicletero'],
    certifications: ['LEED Core & Shell (en trámite)'],
    cover: '1497366811353-6870744d04b2', gallery: ['1497366216548-37526070297c', '1560518883-ce09059eeffa'],
  },
];

const institucionalBlocks = [
  {
    blockKey: 'historia',
    title: 'Nuestra historia',
    body: 'Lumina cuenta con más de 20 años de trayectoria desarrollando proyectos inmobiliarios de alta gama en Argentina y la región, consolidándose como líder en edificios de oficinas categoría AAA en la zona norte del Gran Buenos Aires.',
    imageUrl: stockPhoto('1497032628192-86f99bcd76bc'),
    displayOrder: 1,
  },
  {
    blockKey: 'mision',
    title: 'Misión',
    body: 'Ofrecer soluciones inmobiliarias de clase mundial a empresas y personas, con los más altos estándares de excelencia arquitectónica, operativa y de sostenibilidad ambiental, priorizando relaciones duraderas con nuestros clientes y soluciones flexibles a sus necesidades.',
    displayOrder: 2,
  },
  {
    blockKey: 'vision',
    title: 'Visión',
    body: 'Ser la desarrolladora y administradora líder de proyectos inmobiliarios premium y de vanguardia en Argentina y la región, explorando continuamente nuevos conceptos de excelencia, comunidad, formas de trabajo y estilo de vida.',
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
    body: 'Cumplimos estándares rigurosos de construcción y operación, incorporando tecnología innovadora en todos nuestros proyectos.',
    displayOrder: 5,
  },
  {
    blockKey: 'valor-sustentabilidad',
    title: 'Sustentabilidad y responsabilidad social',
    body: 'Buscamos una integración armoniosa con la comunidad y un compromiso genuino con el medio ambiente, cumpliendo con la certificación LEED Core & Shell en nuestros desarrollos.',
    displayOrder: 6,
  },
];

const sustentabilidadBlocks = [
  {
    blockKey: 'certificacion-leed',
    title: 'Certificación LEED Core & Shell',
    body: 'Nuestros edificios cumplen con los estándares de la certificación LEED Core & Shell, que evalúa el diseño y la construcción sustentable en el uso de energía, agua, materiales y calidad ambiental interior.',
    displayOrder: 1,
  },
  {
    blockKey: 'compromiso-ambiental',
    title: 'Compromiso ambiental',
    body: 'Trabajamos para minimizar el impacto ambiental de cada desarrollo, integrando criterios de eficiencia energética y responsabilidad social en todas las etapas del proyecto.',
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
    const { cover, gallery, ...rest } = b;
    await Building.create({
      ...rest,
      slug: slugify(b.name),
      description: `Edificio de oficinas ${b.name}, ${b.sizeM2.toLocaleString('es-AR')} m², categoría ${b.category === 'finalizado' ? 'Finalizados' : 'Proyectos'}.`,
      coverImage: stockPhoto(cover),
      gallery: gallery.map((id) => stockPhoto(id, 800)),
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

  console.log('\nSeed completado con éxito.');
  console.log(`Login admin -> email: ${process.env.ADMIN_EMAIL || 'admin@luminaoffice.com.ar'} / password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
