const express = require('express')
const cors = require('cors')
const meetingDB = require('/config/db.cjs')
const {urlencoded} = require("express");

const app = express();
const PORT = 3000;
meetingDB.sync().then(()=>{
    console.log("DB is ready")
}).catch((err)=>{
    console.log("There was an error syncing the Database", err)
})
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended: true}))
const init = async () => {
    app.listen(PORT, ()=>{
        console.log(`App is running on port ${PORT}`);
    })
}
init().catch(err => {
    console.log(err)}
)