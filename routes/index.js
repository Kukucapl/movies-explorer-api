const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../validators/validators');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFound = require('../middlewares/errors/notfound');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);
router.use('*', (req, res, next) => { next(new NotFound('Адрес не существует')); });

module.exports = router;
