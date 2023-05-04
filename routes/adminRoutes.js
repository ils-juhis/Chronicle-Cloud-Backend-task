const express = require('express');
const router = express.Router();
const adminControllers= require("../controllers/adminControllers");
const authorize = require('../middlewares/authMiddleware');
const {body} = require('express-validator');

let addCustomerValidation = [
    body("name").trim()
        .not().isEmpty().withMessage('Please enter the name.'),

    body("email").trim()
        .not().isEmpty().withMessage('Please enter the email.')
        .isEmail().withMessage('Please enter valid email.'),

    body("mobileNo").trim()
        .not().isEmpty().withMessage('Please enter the email.')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile Number must be of 10 characters')
        .matches(/^[0-9]+$/).withMessage('Please enter only numbers.'),

    body("address").trim()
    .not().isEmpty().withMessage('Please enter address.'),
    
]

let addBillValidation = [
    body("unit").trim()
        .not().isEmpty().withMessage('Please enter the name.')
        .isNumeric().withMessage("Please enter numeric value"),

    body("month").trim()
        .not().isEmpty().withMessage('Please enter month.'),

    body("year").trim()
        .not().isEmpty().withMessage('Please enter the year.'),

    body("billType").trim()
    .not().isEmpty().withMessage('Please enter bill type.'),
    
]

//get customers
router.get("/customers", authorize(["admin"]), adminControllers.getCustomers)

//add customers
router.post("/customers", authorize(["admin"]), addCustomerValidation, adminControllers.addCustomer)

//delete customers
router.delete("/customers/:customerID", authorize(["admin"]), adminControllers.deleteCustomer)

//get all bills of a customer
router.get('/getpreviousbills/:id',authorize(), adminControllers.getAllBills)

//add bill of a customers
router.post('/addbill/:customerID',authorize(["admin"]), addBillValidation, adminControllers.addBill)

module.exports = router;