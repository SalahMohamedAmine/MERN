const jwt = require('jsonwebtoken');

const config = require('config');

module.exports = (req,res, next) => {
    //Get Token From Header
    const token =req.header('x-auth-token');


    //check if not token 
    if(!token) {
        return res.status(401).json({msg : 'No token , authorization denied'});
    }

    //verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;

        next();
    }catch(error){
        console.error(error)
    }
}