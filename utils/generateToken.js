
const jwt = require('jsonwebtoken')
const db = require("../configs/DBconnection");

let generateToken = async (user) => {
	try {
		const payload = { ...user };
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		db.query(`DELETE FROM user WHERE id='${user.id}');`, function (err, result){

		})

		db.query(`INSERT INTO tokens VALUES ('${user.id}', "${accessToken}");`, function (err, result){

		})

		return accessToken;
		
	} catch (err) {
		console.log("unable to generate token.")
	}
};

module.exports = {generateToken}