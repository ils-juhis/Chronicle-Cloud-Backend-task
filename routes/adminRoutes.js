const express = require('express');
const router = express.Router();
const adminControllers= require("../controllers/adminControllers");
const authorize = require('../middlewares/authMiddleware');

//customers
router.get("/customers",authorize(["admin"]), adminControllers.getCustomers)
router.post("/customers", authorize(["admin"]), adminControllers.addCustomer)
router.delete("/customers/:customerID", authorize(["admin"]), adminControllers.deleteCustomer)

router.get('/getpreviousbills/:id',authorize(), adminControllers.getAllBills)
router.post('/addbill/:customerID',authorize(["admin"]), adminControllers.addBill)

module.exports = router;