const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
    },
    precio: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    stockMinimo: {
      type: Number,
      default: 0,
      min: [0, 'Minimum stock cannot be negative'],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'Category is required'],
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for search
productoSchema.index({ name: 'text', descripcion: 'text', sku: 'text' });

module.exports = mongoose.model('Producto', productoSchema);
