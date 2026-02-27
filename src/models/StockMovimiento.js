const mongoose = require('mongoose');

const stockMovimientoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'Product is required'],
    },
    tipo: {
      type: String,
      enum: {
        values: ['entrada', 'salida', 'ajuste'],
        message: 'Type must be: entrada, salida, or ajuste',
      },
      required: [true, 'Movement type is required'],
    },
    cantidad: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    motivo: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    stockAntes: {
      type: Number,
      required: true,
    },
    stockDespues: {
      type: Number,
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovimiento', stockMovimientoSchema);
