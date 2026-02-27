const Categoria = require('../models/Categoria');

// GET /categorias
exports.getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.find().sort('name');
    res.json({ success: true, count: categorias.length, data: categorias });
  } catch (err) {
    next(err);
  }
};

// GET /categorias/:id
exports.getOne = async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: categoria });
  } catch (err) {
    next(err);
  }
};

// POST /categorias
exports.create = async (req, res, next) => {
  try {
    const { name, descripcion } = req.body;
    const categoria = await Categoria.create({ name, descripcion });
    res.status(201).json({ success: true, data: categoria });
  } catch (err) {
    next(err);
  }
};

// PUT /categorias/:id
exports.update = async (req, res, next) => {
  try {
    const { name, descripcion } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { name, descripcion },
      { new: true, runValidators: true }
    );
    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: categoria });
  } catch (err) {
    next(err);
  }
};

// DELETE /categorias/:id
exports.remove = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
