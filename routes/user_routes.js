
const router = require('express').Router();
const user_controllers = require("../controllers/user_controllers")
const auth = require("../middleware/auth");


router.post('/signup', user_controllers.signup);

router.post('/verify', user_controllers.verify_email);

router.post('/login', user_controllers.login);

router.get('/auth',auth, user_controllers.auth);

router.get('/allUsers',user_controllers.getAllUsers)

module.exports = router;