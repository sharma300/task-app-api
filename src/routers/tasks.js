const express = require('express')
const router = new express.Router
const auth = require('../middleware/auth')
const Task = require('../models/task.js')


router.post('/tasks', auth, async (req, res)=>{
    //const task = new Task(req.body);
    console.log(req.user);
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/tasks',auth, async (req,res)=>{
    const match = {}
    if(req.query.completed){  
        match.completed = (req.query.completed) === 'true'
    }

    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]]= parts[1] ==='desc'? -1 : 1
    }
    
    try{
        //var tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/tasks/:id', auth , async (req,res)=>{
    const _id = req.params.id

    try{
        //var task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    allowedUpdates=['description', 'completed']
    var isValidOp = updates.every((update)=> allowedUpdates.includes(update)) 
    if(!isValidOp)
    {
        return res.status(400).send({error:"not a valid update op"})
    }
    
    try{
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id})
        updates.forEach((update)=>[
            task[update]=req.body[update]
        ])
        //console.log(task2);
        
        if(!task){
            return res.status(404).send()
        }  

        await task.save()
        
        res.send(task)
    } catch(e){
        res.status(500).send(e)       
    }
    
})
router.delete('/tasks/:id',auth, async (req, res)=>{
    try{
        //var task= await Task.findByIdAndDelete(req.params.id)
        var task= await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)    
    } catch(e){
        res.status(500).send()
    }
})


module.exports = router