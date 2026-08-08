const { Building } = require('../models');
const slugify = require('../utils/slugify');

async function list(req, res, next) {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;

    const buildings = await Building.findAll({
      where,
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });
    res.json(buildings);
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const building = await Building.findOne({ where: { slug: req.params.slug } });
    if (!building) return res.status(404).json({ message: 'Edificio no encontrado' });
    res.json(building);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, category, sizeM2, address, description, featured, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: 'El nombre es requerido' });

    let slug = slugify(name);
    const existing = await Building.findOne({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const building = await Building.create({
      name,
      slug,
      category: category || 'finalizado',
      sizeM2: sizeM2 || null,
      address: address || null,
      description: description || null,
      featured: featured === true || featured === 'true',
      displayOrder: displayOrder || 0,
    });

    res.status(201).json(building);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Edificio no encontrado' });

    const { name, category, sizeM2, address, description, featured, displayOrder } = req.body;

    if (name && name !== building.name) {
      building.name = name;
      let slug = slugify(name);
      const existing = await Building.findOne({ where: { slug } });
      if (existing && existing.id !== building.id) slug = `${slug}-${building.id}`;
      building.slug = slug;
    }

    if (category !== undefined) building.category = category;
    if (sizeM2 !== undefined) building.sizeM2 = sizeM2;
    if (address !== undefined) building.address = address;
    if (description !== undefined) building.description = description;
    if (featured !== undefined) building.featured = featured === true || featured === 'true';
    if (displayOrder !== undefined) building.displayOrder = displayOrder;

    await building.save();
    res.json(building);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Edificio no encontrado' });
    await building.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function uploadCoverImage(req, res, next) {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Edificio no encontrado' });
    if (!req.file) return res.status(400).json({ message: 'No se recibio ninguna imagen' });

    building.coverImage = `/uploads/buildings/${req.file.filename}`;
    await building.save();
    res.json(building);
  } catch (err) {
    next(err);
  }
}

async function uploadGalleryImage(req, res, next) {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Edificio no encontrado' });
    if (!req.file) return res.status(400).json({ message: 'No se recibio ninguna imagen' });

    const gallery = Array.isArray(building.gallery) ? building.gallery : [];
    gallery.push(`/uploads/buildings/${req.file.filename}`);
    building.gallery = gallery;
    await building.save();
    res.json(building);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getBySlug,
  create,
  update,
  remove,
  uploadCoverImage,
  uploadGalleryImage,
};
