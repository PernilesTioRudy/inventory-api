const Proveedor = require('../models/Proveedor');

// GET /proveedores
exports.getAll = async (req, res, next) => {
  try {
    const { activo } = req.query;
    const filter = {};
    if (activo !== undefined) filter.activo = activo === 'true';
    const proveedores = await Proveedor.find(filter).sort('name');
    res.json({ success: true, count: proveedores.length, data: proveedores });
  } catch (err) {
    next(err);
  }
};

// GET /proveedores/:id
exports.getOne = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.json({ success: true, data: proveedor });
  } catch (err) {
    next(err);
  }
};

// POST /proveedores
exports.create = async (req, res, next) => {
  try {
    const { name, email, telefono, direccion } = req.body;
    const proveedor = await Proveedor.create({ name, email, telefono, direccion });
    res.status(201).json({ success: true, data: proveedor });
  } catch (err) {
    next(err);
  }
};

// PUT /proveedores/:id
exports.update = async (req, res, next) => {
  try {
    const { name, email, telefono, direccion, activo } = req.body;
    const proveedor = await Proveedor.findByIdAndUpdate(
      req.params.id,
      { name, email, telefono, direccion, activo },
      { new: true, runValidators: true }
    );
    if (!proveedor) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.json({ success: true, data: proveedor });
  } catch (err) {
    next(err);
  }
};

// DELETE /proveedores/:id
exports.remove = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (err) {
    next(err);
  }
};
