const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Categoria', categoriaSchema);
