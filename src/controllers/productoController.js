const Producto = require('../models/Producto');

// GET /productos  (filtros: ?categoria=id&proveedor=id&search=text&activo=bool)
exports.getAll = async (req, res, next) => {
  try {
    const { categoria, proveedor, search, activo } = req.query;
    const filter = {};

    if (categoria) filter.categoria = categoria;
    if (proveedor) filter.proveedor = proveedor;
    if (activo !== undefined) filter.activo = activo === 'true';
    if (search) filter.$text = { $search: search };

    const productos = await Producto.find(filter)
      .populate('categoria', 'name')
      .populate('proveedor', 'name email')
      .sort('name');

    res.json({ success: true, count: productos.length, data: productos });
  } catch (err) {
    next(err);
  }
};

// GET /productos/:id
exports.getOne = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria', 'name')
      .populate('proveedor', 'name email telefono');
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: producto });
  } catch (err) {
    next(err);
  }
};

// POST /productos
exports.create = async (req, res, next) => {
  try {
    const { name, descripcion, sku, precio, stockMinimo, categoria, proveedor } = req.body;
    // stock starts at 0; managed only via movimientos
    const producto = await Producto.create({ name, descripcion, sku, precio, stockMinimo, categoria, proveedor });
    res.status(201).json({ success: true, data: producto });
  } catch (err) {
    next(err);
  }
};

// PUT /productos/:id
exports.update = async (req, res, next) => {
  try {
    // Prevent direct stock manipulation — use /movimientos instead
    delete req.body.stock;

    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('categoria', 'name')
      .populate('proveedor', 'name email');

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: producto });
  } catch (err) {
    next(err);
  }
};

// DELETE /productos/:id
exports.remove = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
