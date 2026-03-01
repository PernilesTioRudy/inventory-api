const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/stockMovimientoController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const createValidation = [
  body('producto').isMongoId().withMessage('Valid product ID required'),
  body('tipo').isIn(['entrada', 'salida', 'ajuste']).withMessage('Type must be: entrada, salida, or ajuste'),
  body('cantidad').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('motivo').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
];

router.use(protect);

router.route('/')
  .get(ctrl.getAll)
  .post(createValidation, validate, ctrl.create);

router.post('/batch', upload.single('factura'), ctrl.batchCreate);

router.route('/:id')
  .get(ctrl.getOne)
  .delete(ctrl.remove);

module.exports = router;
