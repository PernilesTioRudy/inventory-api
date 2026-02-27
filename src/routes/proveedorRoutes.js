const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/proveedorController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const createValidation = [
  body('name').trim().notEmpty().withMessage('Supplier name is required'),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
];

router.use(protect);

router.route('/')
  .get(ctrl.getAll)
  .post(createValidation, validate, ctrl.create);

router.route('/:id')
  .get(ctrl.getOne)
  .put(createValidation, validate, ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
