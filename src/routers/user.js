const express = require('express')
const router = new express.Router
const User = require('../models/user.js')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const email = require('../email/email')

router.post('/users', async (req, res)=>{
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken()
        await user.save()
        await email.welcomeMail(user.name,user.email)
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user:user,token})
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/logout', auth , async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })       
        await req.user.save()

        res.send()
    } catch (e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})


router.get('/users/me', auth , async (req, res)=>{
    try{
        //var users = await User.find({})
        res.send(req.user)
    }catch(e){
        res.status(404).send(e)
    }
    //await res.send(req.user)
})


//not needed
// router.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id
//     try{
//         var user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
// })

router.patch('/users/me', auth , async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    var isValidOp = updates.every((update)=> allowedUpdates.includes(update)) 
    if(!isValidOp)
    {
        return res.status(400).send({error:"not a valid update op"})
    }

    try{
        //const user = await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update] = req.body[update])
        
        await req.user.save()
        
        
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true })
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch(e){
        res.status(400).send(e)
    }
})


router.delete('/users/me',auth,  async (req, res)=>{
    try{
        // var user= await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        await email.cancellationMail(req.user.name, req.user.email)
        res.send(req.user)    
    } catch(e){
        res.status(500).send()
    }
})


const upload =multer({
    //dest : 'avatars',
    limits : {
        fileSize: 2000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|JPG|JPEG)$/)){
           return cb( new Error('Please upload image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar') , async (req, res)=>{
    
    const buffer = await sharp(req.file.buffer).png().resize({width:250, height:250}).toBuffer()
    
    req.user.avatar=buffer
    await req.user.save()
    res.send();
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth, async (req, res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch{
        res.status(400).send()
    }
    
})

router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
             throw new Error
        }
        
        res.set('content-Type','image/jpg')
        res.send(user.avatar)
    }catch{
        res.status(400).send()
    }
    
    
})

module.exports = router