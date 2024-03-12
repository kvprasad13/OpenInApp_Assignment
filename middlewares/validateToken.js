const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.headers.Authorization || req.headers.authorization;
    console.log("access token" + accessToken);
    if (!accessToken) {
        throw new Error("Access Token is required");
    }
    else {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw err;
            console.log(decoded);
            req.user = decoded;
            next();

        });

    }


}
module.exports = validateToken;