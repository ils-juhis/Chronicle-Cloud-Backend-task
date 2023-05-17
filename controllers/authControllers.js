
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')
const {generateToken} = require("../utils/generateToken")
const db = require("../configs/DBconnection");
const {validationResult} = require('express-validator');
const { resetPwdEmail } = require('../utils/sendEmail/resetPwdEmail');
const jwt = require('jsonwebtoken')


let signUpAdmin = async(req, res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID SIGNUP INPUT",
                errors: errors.array()
            })
        }

        let {name, email, password, cpassword, role, mobileNo} = req.body;
        db.query(`SELECT * FROM user WHERE email = LOWER('${email}')`, function (err, result){
            if(err){
                console.log(err)
            }else if(result && result.length){
                //user exist
                return res.status(409).json({
                    status: "FAILED",
                    message: "user already exists"
                })
            }else if(password !== cpassword){
                return res.status(400).json({
                    status: "FAILED",
                    message: "password doesn\'t match"
                })
            }else{
                bcrypt.hash(password, 10, (err, hash)=>{
                    if(err){
                        return res.status(500).json({
                            status: "FAILED",
                            message: err
                        })
                    }else{
                        const id = uuidv4();
                        db.query(`INSERT INTO user (id, name, email, password, role, mobileNo) VALUES ('${id}', LOWER('${name}'), LOWER('${email}'), '${hash}', '${role}', '${mobileNo}')`, async function(err, result){
                            if(err){
                                
                                return res.status(500).json({
                                    status: "FAILED",
                                    message: err
                                })
                            }

                            let user = {id, role};
                            const tokens = await generateToken(user)

                            return res.status(201).json({status:'SUCCESS', user:{
                                ID: id,
                                name,
                                email,
                                accessToken: tokens[0],
                                refreshToken: tokens[1]
                            }})
                        })
                    }
                })
            }
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

let login = async(req, res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID LOGIN INPUT",
                errors: errors.array()
            })
        }
        const {email, password, role} = req.body;

        db.query(`SELECT * FROM user WHERE email = LOWER('${email}')`, function (err, result){

            if(result && !result.length){
                console.log(result)
                return res.status(401).json({
                    status: "FAILED",
                    message: 'Invailid credintials.'
                })
            }
            
            bcrypt.compare(password, result[0].password, async function(berr, bResult){
                if(berr || result[0].role !== role){
                    return res.status(401).json({
                        status: "FAILED",
                        message: 'Invailid credintials.'
                    })
                }

                if(bResult){
                    const tokens = await generateToken({id: result[0].id, role})
                    res.cookie('jwt', tokens[1], { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                    return res.status(200).json({status:'SUCCESS', user:{
                        userID: result[0].id,
                        name: result[0].name,
                        email: result[0].email,
                        accessToken: tokens[0],
                        refreshToken: tokens[1]
                    }})
                }else{
                    return res.status(401).json({
                        status: "FAILED",
                        message: 'Invailid credintials.'
                    })
                }
            })
        })
            
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

let forgotPassword = (req, res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID LOGIN INPUT",
                errors: errors.array()
            })
        }

        const {email} = req.body;
        db.query(`SELECT * FROM user WHERE email = LOWER('${email}')`, async function (err, result){

            if(result && ! result.length){
                console.log(result)
                return res.status(404).json({
                    status: "FAILED",
                    message: 'Email not found.'
                })
            }
            
        
            const token = await generateToken({id: result[0].id, role:result[0].role})
            let send = await resetPwdEmail(email, token)
            console.log(send)
            if(!send){
                return res.status(500).json({
                    status: "FAILED",
                    message: "Internal Server Error"
                })
            }else{
                db.query(`INSERT INTO tokens VALUES ('${result[0].id}', "${token}");`, function (err, result){
                })
                return res.status(201).json({status:'SUCCESS', 
                    message:'Email sent successfully.',
                    userID: result[0].id,
                    token
            })
            }    
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

const logout = (req, res) =>{
    try{

        const cookies = req.cookies;

        if (!cookies?.jwt) return res.sendStatus(204); //No content
        const refreshToken = cookies.jwt;
        db.query(`SELECT * FROM tokens WHERE refreshToken = "${refreshToken}";`, function (err, result){
            if(result){
                db.query(`DELETE FROM tokens WHERE refreshToken = "${refreshToken}";`, function (err, result){
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.status(200).json({status: 'SUCCESS', message:'Logged out successfully.'});
                })
            }
		})

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

let refreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        //refresh token
        if (!cookies?.jwt){
            return res.status(401).json({
                status: "FAILED",
                message: "Token not available"
            })
        }
        
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        //detecting refresh token reuse
        db.query(`SELECT * FROM tokens WHERE refreshToken="${refreshToken}";`, (err, result)=>{
            if(err){
                return res.status(500).json({
                    status: "FAILED",
                    message: "some error ocurred."
                })
            }

            if(result && !result.length){
                jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async (err, decoded)=>{

                    if(err){
                        return res.status(401).json({
                            status: "FAILED",
                            message: "invalid token."
                        })
                    }

                    db.query(`DELETE FROM tokens WHERE id="${decoded.id}"`, async(err, result)=>{
                        
                    })
                })

                return res.status(403).json({
                    status: "FAILED",
                    message: "forbidden"
                })
            }

            //refreshing token
            jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async(err, decoded)=>{
                if(err){
                    return res.status(401).json({
                        status: "FAILED",
                        message: "invalid token."
                    })
                }

                db.query(`SELECT * FROM tokens WHERE refreshToken="${refreshToken}";`, (err, result)=>{
                    if(err || result[0].id !== decoded.id){
                        return res.status(403);
                    }

                    db.query(`DELETE FROM tokens WHERE refreshToken ="${refreshToken}";`, (err, result)=>{
                        if(err){
                            return res.status(500).json({
                                status: "FAILED",
                                message: "unable to delete record."
                            })
                        }
                    })
                })

                db.query(`SELECT * FROM user WHERE id="${decoded.id}";`, async(err, result)=>{
                    let {id, name, email, role} = result[0];
                    let tokens = await generateToken({id, role});
                    res.cookie('jwt', tokens[1], { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                    return res.status(201).json({status:'SUCCESS', user:{
                        ID:id,
                        name,
                        email,
                        accessToken: tokens[0],
                        refreshToken: tokens[1]
                    }})
                })
            })
        })


    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

let resetPassword = (req, res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array())
            return res.status(400).json({
                status: "INVALID LOGIN INPUT",
                errors: errors.array()
            })
        }

        const {userID, token, newPassword} = req.body;
        db.query(`SELECT * FROM tokens WHERE id = '${userID}' AND token= '${token}')`, async function (err, result){

            if(result && ! result.length){
                console.log(result)
                return res.status(400).json({
                    status: "FAILED",
                    message: 'Invalid expired.'
                })
            }else{
                bcrypt.hash(newPassword, 10, (err, hash)=>{
                    if(err){
                        return res.status(400).json({
                            status: "FAILED",
                            message: err
                        })
                    }else{
                        const id = uuidv4();
                        db.query(`UPDATE user SET password='${hash}' WHERE id= '${userID}'`, async function(err, result){
                            if(err){
                                
                                return res.status(400).json({
                                    status: "FAILED",
                                    message: err
                                })
                            }

                            return res.status(200).json({status:'SUCCESS', message:'Password changed successfully.'})
                        })
                    }
                })
            } 
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }

}

module.exports = {login, signUpAdmin, logout, forgotPassword, resetPassword, refreshToken}