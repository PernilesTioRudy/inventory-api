const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/categorias', require('./categoriaRoutes'));
router.use('/proveedores', require('./proveedorRoutes'));
router.use('/productos', require('./productoRoutes'));
router.use('/movimientos', require('./stockMovimientoRoutes'));

module.exports = router;
