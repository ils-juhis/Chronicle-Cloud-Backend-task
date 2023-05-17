const jwt = require('jsonwebtoken')
const db = require("../configs/DBconnection");

const authorize = (roles = []) =>{
    return (req, res, next)=>{

            const token = req.headers['authorization'].replace("Bearer ", "")
            
            try{
                if(!token){
                    return res.status(401).send({error: 'Unauthorized'})
                }

                jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
                    if(err)
                        return res.status(401).send({error: 'invalid token'})

                    req.user = decoded;
                    if(roles.length && !roles.includes(req.user.role)){
                        return res.status(401).send({error: 'invalid role'})
                    }

                    db.query(`SELECT * FROM user WHERE id="${req.user.id}" AND role="${req.user.role}";`, function(err, result){
                        if(result.lenght !== 0)
                            next();
                    })
                })
            }
            catch(err){
                res.status(401).send({error: 'Unauthorized'})
            }
            
        }
}
module.exports =  authorize;