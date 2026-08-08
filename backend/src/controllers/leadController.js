const { Lead } = require('../models');

async function create(req, res, next) {
  try {
    const { name, surname, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nombre, email y mensaje son requeridos' });
    }

    const lead = await Lead.create({ name, surname, email, phone, message });
    res.status(201).json({ message: 'Consulta enviada correctamente', lead });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    res.json(leads);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Consulta no encontrada' });

    const { status } = req.body;
    if (!['nuevo', 'contactado', 'archivado'].includes(status)) {
      return res.status(400).json({ message: 'Estado invalido' });
    }

    lead.status = status;
    await lead.save();
    res.json(lead);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Consulta no encontrada' });
    await lead.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, updateStatus, remove };
