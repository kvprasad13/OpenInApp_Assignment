
const express = require('express');
const validateToken = require('../middlewares/validateToken.js');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/user.js');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/current',validateToken,getCurrentUser);

module.exports = router;