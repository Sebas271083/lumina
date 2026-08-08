const { SiteContent } = require('../models');

async function getByPage(req, res, next) {
  try {
    const blocks = await SiteContent.findAll({
      where: { page: req.params.page },
      order: [['displayOrder', 'ASC']],
    });
    res.json(blocks);
  } catch (err) {
    next(err);
  }
}

async function upsertBlock(req, res, next) {
  try {
    const { page, blockKey, title, body, displayOrder } = req.body;
    if (!page || !blockKey) {
      return res.status(400).json({ message: 'page y blockKey son requeridos' });
    }

    const [block] = await SiteContent.findOrCreate({
      where: { page, blockKey },
      defaults: { title, body, displayOrder: displayOrder || 0 },
    });

    block.title = title !== undefined ? title : block.title;
    block.body = body !== undefined ? body : block.body;
    if (displayOrder !== undefined) block.displayOrder = displayOrder;
    await block.save();

    res.json(block);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const block = await SiteContent.findByPk(req.params.id);
    if (!block) return res.status(404).json({ message: 'Bloque no encontrado' });
    await block.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getByPage, upsertBlock, remove };
