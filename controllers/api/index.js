const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogentryRoutes = require('./blogentryRoutes');

router.use('/users', userRoutes);
router.use('/blogentry', blogentryRoutes);

module.exports = router;
