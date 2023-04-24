const express = require('express');
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const authorize = require('../middlewares/authMiddleware');

router.post("/signup", authControllers.signUpAdmin)
router.post("/login", authControllers.login)
router.get("/loggedin", authorize(), authControllers.loggedIn)
router.get("/logout", authorize(), authControllers.logout)

module.exports = router;