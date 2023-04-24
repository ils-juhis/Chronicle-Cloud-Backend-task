
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')
const {generateToken} = require("../utils/generateToken")
const db = require("../configs/DBconnection");

let signUpAdmin = async(req, res)=>{
    try{
        let {name, email, password, cpassword, role, mobileNo} = req.body;
        name = name.trim()
        email = email.trim()
        password = password.trim()
        cpassword = cpassword.trim()
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
                return res.status(401).json({
                    status: "FAILED",
                    message: "password doesn\'t match"
                })
            }else{
                bcrypt.hash(password, 10, (err, hash)=>{
                    if(err){
                        return res.status(400).json({
                            status: "FAILED",
                            message: err
                        })
                    }else{
                        const id = uuidv4();
                        db.query(`INSERT INTO user (id, name, email, password, role, mobileNo) VALUES ('${uuidv4()}', LOWER('${name}'), LOWER('${email}'), '${hash}', '${role}', '${mobileNo}')`, async function(err, result){
                            if(err){
                                
                                return res.status(400).json({
                                    status: "FAILED",
                                    message: err
                                })
                            }

                            let user = {id, role};
                            const token = await generateToken(user)

                            return res.status(200).json({status:'SUCCESS', user:{
                                ID: id,
                                name,
                                email,
                                token: token
                            }})
                        })
                    }
                })
            }
        })

    }catch(err){

    }
}

let login = async(req, res) =>{

    try{
        const {email, password, role} = req.body;
        if(!email || !password){
            return res.status(400).json({
                status: "FAILED",
                message: 'Plz enter valid data.'
            })
        }
        
        db.query(`SELECT * FROM user WHERE email = LOWER('${email}')`, function (err, result){
            if(result && ! result.length){
                return res.status(400).json({
                    status: "FAILED",
                    message: 'Invailid credintials.'
                })
            }
            
            bcrypt.compare(password, result[0].password, async function(berr, bResult){
                if(berr){
                    return res.status(400).json({
                        status: "FAILED",
                        message: 'Invailid credintials.'
                    })
                }
                if(bResult){
                    const token = await generateToken({id: result[0].id, role})
                    return res.status(200).json({status:'SUCCESS', user:{
                        userID: result[0].id,
                        name: result[0].name,
                        email: result[0].email,
                        token: token
                    }})
                }else{
                    return res.status(400).json({
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

const loggedIn = (req, res)=>{
    try{
        console.log(req.user)

        if(req.user){
            return res.status(201).json({status: 'SUCCESS', user:{
                userID: req.user.id,
                role: req.user.role,
            }})
        }else{
            return res.status(400).json({status: 'FAILED', message:'Invalid Token'})
        }

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
        if(req.user){
            db.query(`DELETE FROM tokens WHERE id="${req.user.id}";`, function(err, result){
                if(!err)
                    return res.status(200).json({status: 'FAILED', message:'Logged out successfully.'})
            })
        }else{
            return res.status(400).json({status: 'FAILED', message:'Already logged out.'})
        }

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        })
    }
}

module.exports = {login, signUpAdmin, loggedIn, logout}