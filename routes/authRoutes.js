const express = require('express');
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const {body} = require('express-validator')

let signupValidation = [
    body("name").trim()
        .not().isEmpty().withMessage('Please enter the name.'),

    body("email").trim()
        .not().isEmpty().withMessage('Please enter the email.')
        .isEmail().withMessage('Please enter valid email.'),

    body("password").trim()
        .not().isEmpty().withMessage('Please enter the password.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    body("role").trim()
    .not().isEmpty().withMessage('Please enter the role.'),
    
]

let emailValidation = [
    body("email").trim()
        .not().isEmpty().withMessage('Please enter the email.')
        .isEmail().withMessage('Please enter valid email.')
]

let resetPwdValidation = [
    body("userID").trim()
        .not().isEmpty().withMessage('Please give valid ID.'),

    body("token").trim()
        .not().isEmpty().withMessage('Please give token.'),

    body("newPassword").trim()
    .not().isEmpty().withMessage('Please enter the email.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')

]

//sign up
router.post("/signup", signupValidation, authControllers.signUpAdmin)

//login
router.post("/login",  emailValidation, authControllers.login)

//refresh token
router.get("/refresh-token", authControllers.refreshToken)

//logout
router.get("/logout", authControllers.logout)

//forgot password
router.post("/forgot-pwd",emailValidation, authControllers.forgotPassword)

//reset password
router.patch("/reset-pwd", resetPwdValidation, authControllers.resetPassword)


module.exports = router;