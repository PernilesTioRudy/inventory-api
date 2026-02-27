const StockMovimiento = require('../models/StockMovimiento');
const Producto = require('../models/Producto');

// GET /movimientos  (?producto=id&tipo=entrada|salida|ajuste)
exports.getAll = async (req, res, next) => {
  try {
    const { producto, tipo } = req.query;
    const filter = {};
    if (producto) filter.producto = producto;
    if (tipo) filter.tipo = tipo;

    const movimientos = await StockMovimiento.find(filter)
      .populate('producto', 'name sku')
      .populate('usuario', 'name email')
      .sort('-createdAt');

    res.json({ success: true, count: movimientos.length, data: movimientos });
  } catch (err) {
    next(err);
  }
};

// GET /movimientos/:id
exports.getOne = async (req, res, next) => {
  try {
    const movimiento = await StockMovimiento.findById(req.params.id)
      .populate('producto', 'name sku stock')
      .populate('usuario', 'name email');
    if (!movimiento) {
      return res.status(404).json({ success: false, message: 'Movement not found' });
    }
    res.json({ success: true, data: movimiento });
  } catch (err) {
    next(err);
  }
};

// POST /movimientos
exports.create = async (req, res, next) => {
  try {
    const { producto: productoId, tipo, cantidad, nota, motivo } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const stockAntes = producto.stock;
    let stockDespues;

    if (tipo === 'entrada') {
      stockDespues = stockAntes + cantidad;
    } else if (tipo === 'salida') {
      if (stockAntes < cantidad) {
        return res.status(422).json({
          success: false,
          message: `Stock insuficiente. Disponible: ${stockAntes}, solicitado: ${cantidad}`,
        });
      }
      stockDespues = stockAntes - cantidad;
    } else {
      stockDespues = stockAntes + cantidad;
      if (stockDespues < 0) {
        return res.status(422).json({
          success: false,
          message: `El ajuste dejaría el stock en negativo (${stockDespues})`,
        });
      }
    }

    producto.stock = stockDespues;
    await producto.save();

    const movimiento = await StockMovimiento.create({
      producto: productoId,
      tipo,
      cantidad,
      motivo: motivo || nota,
      stockAntes,
      stockDespues,
      usuario: req.user._id,
    });

    await movimiento.populate([
      { path: 'producto', select: 'name sku stock' },
      { path: 'usuario', select: 'name email' },
    ]);

    res.status(201).json({ success: true, data: movimiento });
  } catch (err) {
    next(err);
  }
};

// DELETE /movimientos/:id — revierte el cambio de stock
exports.remove = async (req, res, next) => {
  try {
    const movimiento = await StockMovimiento.findById(req.params.id);
    if (!movimiento) {
      return res.status(404).json({ success: false, message: 'Movement not found' });
    }

    const producto = await Producto.findById(movimiento.producto);
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Associated product not found' });
    }

    const delta = movimiento.stockDespues - movimiento.stockAntes;
    const stockRevertido = producto.stock - delta;

    if (stockRevertido < 0) {
      return res.status(422).json({
        success: false,
        message: `No se puede revertir: el stock quedaría negativo (${stockRevertido})`,
      });
    }

    producto.stock = stockRevertido;
    await producto.save();
    await StockMovimiento.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Movement deleted and stock reverted', stockRevertido });
  } catch (err) {
    next(err);
  }
};
