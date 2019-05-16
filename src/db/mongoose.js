const mongoose = require('mongoose');
//const validator = require('validator');
//var conn = 
mongoose.connect(process.env.MONGODB_CONNECT_URL, {
    useNewUrlParser: true,
    useCreateIndex:true
})



// const User = mongoose.model('User',{
//     name:{
//         type: String,
//         required: true
//     },
//     email:{
//         type:String,
//         required:true,
//         validate(value){
//             //var email=;    
//             if(!validator.isEmail(value))
//             {
//                 throw new Error('Incorrect email');
//             }
//         }
//     },
//     password:{
//         type: String,
//         required: true,
//         minlength:7,
//         trim:true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password cannot contain "password"')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         validate(value){
//             if(value < 1){
//                 throw new Error('Age should be a +ve number');
//             }
//         }
//     }
// })



// const me = new User({
//     name: 'jklamqq',
//     email: 'asd@abc.com',
//     password: 'qassword123',
//     //age:24
// })

// me.save().then((res)=>{
//     console.log('result: ',res);
// }).catch((err)=>{
//     console.log('Error', err);
    
// })

// const Tasks = mongoose.model('Tasks',{
//     description:{
//         type : String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type: Boolean,
//         default: 0
//     }
// })

// const newTask = new Tasks({
    
// })

// newTask.save()
//     .then((res)=>{console.log(res);})
//     .catch((err)=>{console.log('Error: ', err);
// })