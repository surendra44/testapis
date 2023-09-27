const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    if (!req.headers.authorization) {
        return res.status(403).send('authorization Is Not In headers')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token == 'null') {
        return res.status(403).send('Forbidden')
    }
    let payload = jwt.verify(token, process.env.SECRET_KEY)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    console.log(payload.userId);
    next()
    
}

function adminVerify(req,res,next){
    if (!req.headers.authorization) {
        return res.status(403).send('authorization Is Not In headers')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token == 'null') {
        return res.status(403).send('Forbidden')
    }
    let payload = jwt.verify(token, process.env.SECRET_KEY)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    if (payload.isAdmin == false){
        return res.status(401).send('Unauthorized request')
    }
    if (payload.accessRole != "superAdmin"){
        return res.status(401).send('Access Denied')
    }
    else{
        // console.log(payload.isAdmin+payload.userId+"login success");
        next()
    }
}

module.exports = {
    verifyToken,adminVerify
}