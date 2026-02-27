const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/productoController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const createValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('precio').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('categoria').isMongoId().withMessage('Valid category ID required'),
  body('proveedor').optional().isMongoId().withMessage('Valid supplier ID required'),
];

router.use(protect);

router.route('/')
  .get(ctrl.getAll)
  .post(createValidation, validate, ctrl.create);

router.route('/:id')
  .get(ctrl.getOne)
  .put(
    [
      body('precio').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
      body('categoria').optional().isMongoId().withMessage('Valid category ID required'),
      body('proveedor').optional().isMongoId().withMessage('Valid supplier ID required'),
    ],
    validate,
    ctrl.update
  )
  .delete(ctrl.remove);

module.exports = router;
