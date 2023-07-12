const express = require('express')
const router = express.Router()
const User = require("../models/userModel.cjs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function genToken(user){
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password
    }
    const key = "qnWmmdNaYVmJy9H8WZ9rDLGuyolV7lGg"
    return jwt.sign(payload, key, {
        expiresIn: "2 hours"
    })
}
function authToken(req, res, next) {
    const token = req.header.auth
    if(!token){
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, "qnWmmdNaYVmJy9H8WZ9rDLGuyolV7lGg", (err, user) => {
        if(err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user
        next()
    })
}
router.post("/signup", async (req, res)=>{
    try {
        const {name, email, password} = req.body
        const existingUser = await User.findOne({
            where: {
                email
            }
        })
        if (!existingUser) {
            const passHashed = await bcrypt.hash(password, 10)
            const newUser = {
                name,
                email,
                password: passHashed
            }
            await User.create(newUser)
            res.status(200).json({
                status: "success"
            })
        } else {
            res.status(403).json({
                status: "failure",
                message: "User already exists"
            })
        }
    } catch (e){
        console.log(e)
    }
})
router.post("/signin", async (req, res)=>{
    try {
        const {email, password} = req.body
        const userExists = await User.findOne({
            where: {
                email
            }
        })
        if(userExists){
            let passwordCorrect = bcrypt.compare(password, userExists.password)
            if(passwordCorrect){
                const token = genToken(userExists)
                return res.status(200).json({
                    status: "success",
                    token
                })
            } else {
                return res.status(403).json({
                    status: "failure",
                    message: "Incorrect password"
                })
            }
        } else {
            return res.status(403).json({
                status: "failure",
                message: "User does not exist"
            })
        }
    } catch (e) {
        console.log(e)
    }
})