const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/categoriaController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const nameValidation = body('name').trim().notEmpty().withMessage('Category name is required');

router.use(protect);

router.route('/')
  .get(ctrl.getAll)
  .post([nameValidation], validate, ctrl.create);

router.route('/:id')
  .get(ctrl.getOne)
  .put([nameValidation], validate, ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
