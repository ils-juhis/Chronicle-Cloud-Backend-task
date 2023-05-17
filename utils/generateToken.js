
const jwt = require('jsonwebtoken')
const db = require("../configs/DBconnection");

let generateToken = async (user) => {
	try {
		const payload = { ...user };
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "30s" }
		);

		const newRefreshToken = jwt.sign(
			payload,
			process.env.REFRESH_JWT_SECRET,
			{ expiresIn: "1d" }
		);

		db.query(`INSERT INTO tokens VALUES ('${user.id}', "${newRefreshToken}");`, function (err, result){

		})

		return [accessToken, newRefreshToken];
		
	} catch (err) {
		console.log(err)
	}
};

module.exports = {generateToken}