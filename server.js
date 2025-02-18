const express = require("express")
const fileupload = require("express-fileupload")
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
const socketIo = require("socket.io")


const path = require("path")
const http = require("http")
const fs = require("fs")
dotenv.config()

//import...
const authRouter=require("./src/router/authRouter")
const userRouter=require("./src/router/userRouter")
const chatRouter=require("./src/router/chatRouter")
const messageRouter=require("./src/router/messageRouter")





const app=express()
const PORT= process.env.PORT||4001

const server=http.createServer(app)
const io = socketIo(server,{
    cors:{
        // origin:"www.netlify-chat-app.netlify.app"
        origin:"*"
        // method:["GET","POST"]
    }
})

// stiaic
app.use(express.static(path.join(__dirname,'src','public')))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileupload())
app.use(cors())

// use
app.use("/api",authRouter)
app.use("/api",userRouter)
app.use("/api",chatRouter)
app.use("/api",messageRouter)




// socket codes
let activeUsers=[]

io.on("connection", (socket)=>{
    console.log("chatga kimdir kirdi...");
   socket.on("new-user-add",(userId)=>{
    if(!activeUsers.some(user=> user.userId == userId)){
       activeUsers.push({userId,socketId:socket.id}) 
       console.log(activeUsers);
       
    }
    io.emit("get-users",activeUsers)
   })
socket.on("disconnect",()=>{
  activeUsers = activeUsers.filter(user => user.socketId !== socket.id )
  console.log(activeUsers);
  io.emit("get-users",activeUsers)
    
})

})
const MONGO_URL=process.env.MONGO_URL
mongoose.connect(MONGO_URL).then(()=>{
    server.listen(PORT,()=>{console.log(`${PORT}-working`);
    })
}).catch((err)=>{
    console.log(err);
    
})










