const jwt = require('jsonwebtoken')
const db = require("../configs/DBconnection");

const authorize = (roles = []) =>{
    return (req, res, next)=>{

            const token = req.headers['authorization'].replace("Bearer ", "")
            if(!token){
                res.status(401).send({error: 'Unauthorized'})
            }
            try{
                const data = jwt.verify(token, process.env.JWT_SECRET)
                req.user = data;
                if(roles.length && !roles.includes(req.user.role)){
                    res.status(401).send({error: 'Unauthorized'})
                }

                db.query(`SELECT * FROM user WHERE id="${req.user.id}" AND role="${req.user.role}";`, function(err, result){
                    if(result.lenght !== 0)
                        next();
                })
            }
            catch(err){
                res.status(401).send({error: 'Unauthorized'})
            }
            
        }
}
module.exports =  authorize;