const express = require('express');
require('./db/mongoose.js')
const userRouter=require('./routers/user')
const taskRouter = require('./routers/tasks')

const app =express();
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('server is up at port '+ port);
})


