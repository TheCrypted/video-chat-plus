const express = require('express')
const cors = require('cors')
const meetingDB = require('./config/db.cjs')
const routes = require('./routes/authRoutes.cjs')
const {urlencoded} = require("express");
const http = require("http");
const {Server} = require("socket.io");
const {v4 : uuidv4} = require("uuid")
const app = express();
const PORT = 3000;
let meetingRooms = {}
meetingDB.sync().then(()=>{
    console.log("DB is ready")
}).catch((err)=>{
    console.log("There was an error syncing the Database", err)
})
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use("/auth", routes)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})
io.on("connection", (socket) => {
    let roomID = uuidv4()
    let temp = roomID.split("-")
    let finalID = temp.slice(1, 4).join("-")
    console.log(finalID)
    socket.join("alpha") //replace with finalID
    socket.emit("roomAssignment", {finalID})
    socket.on("userInfo", (userInfo)=> {
        if (meetingRooms[finalID]){
            meetingRooms[finalID].users.push({
                userInfo
            })
        } else {
            meetingRooms[finalID] = {users: [userInfo]}
        }
    })
    socket.broadcast.to("alpha").emit("userJoined", {
        info: "info"
    })
    socket.on("offer", (offer)=> {
        console.log("offer received")
        socket.broadcast.to("alpha").emit("offer", {offer})
    })
    socket.on("candidate", (data)=> {
        socket.broadcast.to("alpha").emit("candidate", {data})
    })
    socket.on("userLeave", (data)=>{
        socket.leave("alpha")
    })
    socket.on("userLeave", (data)=>{
        console.log("user has left")
    })
})
const init = async () => {
    server.listen(PORT, ()=>{
        console.log(`App is running on port ${PORT}`);
    })
}
init().catch(err => {
    console.log(err)}
)