const db = require("../configs/DBconnection")
const { v4: uuidv4 } = require('uuid');
const { sendBillEmail } = require("../utils/sendEmail/sendBillEmail");
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const { customerLoginEmail } = require("../utils/sendEmail/customerLoginEmail");
const {validationResult} = require('express-validator')


const getCustomers = async (req, res)=>{
    try{
        db.query(`SELECT * FROM user WHERE role="customer";`, function (err, result){
            if(err){
                return res.status(400).json({
                    status: "FAILED",
                    message: err
                })
            }else{
                return res.status(200).json({status:'SUCCESS', data: result})
            }
        })
    }catch(err){
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

const addCustomer = async(req, res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID DATA",
                errors: errors.array()
            })
        }

        const {name, email, mobileNo, address} = req.body;
        var password = generator.generate({
            length: 10,
            numbers: true,
        });

        bcrypt.hash(password, 10, (err, hash)=>{
            if(err){
                return res.status(400).json({
                    status: "FAILED",
                    message: err
                })
            }else{
                const id = uuidv4(), meterID = uuidv4();
                db.query(`INSERT INTO user VALUES ("${id}", "${name}", "${email}", "${hash}", "customer", "${mobileNo}", "${address}", "${meterID}");`, async function(err, result){
                    if(err){
                        
                        return res.status(400).json({
                            status: "FAILED",
                            message: err
                        })
                    }

                    customerLoginEmail(name, email, password)
                    return res.status(200).json({status:'SUCCESS', user:{
                        customerID: id,
                        name,
                        email,
                        mobileNo,
                        address,
                        meterID
                    }})
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

const deleteCustomer = (req, res)=>{
    try {
        
        const customerID = req.params.customerID;
        db.query(`DELETE FROM user where id = '${customerID}'`, function (err, result){
            if(err){
                return res.status(400).json({
                    status: "FAILED",
                    message: err
                })
            }else{
                return res.status(200).json({status:'SUCCESS', message: "customer deleted successfully."})
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

const getAllBills = async (req, res)=>{
    try{
        const customerID = req.params.id;

        db.query(`SELECT * FROM bills where customerID = '${customerID}'`, function (err, result){
            if(err){
                return res.status(400).json({
                    status: "FAILED",
                    message: err
                })
            }else{
                return res.status(200).json({status:'SUCCESS', data: result})
            }
        })
    }catch(err){
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

const addBill = async(req, res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID DATA",
                errors: errors.array()
            })
        }
        
        const {customerID} = req.params;
        let billID = uuidv4();

        const {unit, billType, month, year} = req.body;
        const meter = 10, MVCA = 60, fixedChrge = 100;
        let amount;

        if((unit>=1) && (unit<=50)){
            amount = (unit*4.89)+meter+MVCA+fixedChrge;
        }else if((unit>50) && (unit<=150)){
            amount = ((50*4.89)+(unit-50)*5.4)+meter+MVCA+fixedChrge;
        }else if((unit>150) && (unit<=250)){
            amount = ((50*4.89)+((150-50)*5.4)+(unit-150)*6.41)+meter+MVCA+fixedChrge;
        }else if(unit>250){
            amount = ((50*4.89)+((150-50)*5.4)+((250-150)*6.41)+(unit-250)*7.16)+meter+MVCA+fixedChrge;;
        } else{
            amount = 0;
        }

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        var date = new Date();
        let dueDate= `${date.addDays(15).toISOString().substring(0, 10)+ " 23:59:59"}`;
        db.query(`INSERT INTO bills (customerID, billID, billType, unit_consumed, month, year, amountGen, dueDate) VALUE ('${customerID}', '${billID}', '${billType}', ${unit}, '${month}', '${year}', ${amount}, "${dueDate}");`, function (err, result){
            if(err){
                return res.status(400).json({
                    status: 'FAILED',
                    message: err
                })
            }else{
                db.query(`SELECT * FROM user WHERE id="${customerID}";`, function (err, result){
                    if(err){
                        return res.status(400).json({
                            status: 'FAILED',
                            message: err
                        })
                    }else{
                        sendBillEmail(customerID, billID, billType, unit, month, year, amount, result[0].email, result[0].meterNo, dueDate, "billGeneration");
                        setTimeout(()=>{
                            sendBillEmail(customerID, billID, billType, unit, month, year, amount, result[0].email, result[0].meterNo, dueDate, "Warning");
                        }, (40000))
                        return res.status(201).json({status:'SUCCESS', data: {
                            "customerID": customerID, 
                            "billID": billID, 
                            "billType": billType,
                            "unit_consumed": unit, 
                            "month": month, 
                            "year": year,
                            "amountGen": amount,
                            "dueDate": dueDate
                        }})
                    }
                }) 
            }
        })


    }catch(err){
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

module.exports = {getCustomers, addCustomer, deleteCustomer, getAllBills, addBill} 