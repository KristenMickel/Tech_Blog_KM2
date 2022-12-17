const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogRoutes = require('./blogRoutes');

router.use('/users', userRoutes);
router.use('/blog', blogRoutes);

module.exports = router;

//Routes are the controller part of MVC. Essentially, they are the middleman between the model and the view. They coordinate between them.

