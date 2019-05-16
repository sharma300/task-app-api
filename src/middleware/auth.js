const jwt = require('jsonwebtoken')
var User = require('../models/user')

const jwtMessage = process.env.JWT_SECRET
const auth = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,jwtMessage)
        const user =await User.findOne({'_id':decoded._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }
           
        req.token=token
        req.user = user
        next()
    } catch (e){
        res.status(401).send({error: 'please authenticate'})
    }
    
    
    
}

module.exports = auth