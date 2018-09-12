var router = require('express').Router();

router.use('/queues', require('./queues/queues'));
// etc.

module.exports = router;