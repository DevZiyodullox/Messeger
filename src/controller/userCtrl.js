const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")
const { v4 } = require("uuid")
const userCtrl = {
    getAll: async (req, res) => {
        try {
            let users = await User.find()
            users = users.map(user => {
                const { password, ...other } = user._doc
                return other
            })
            res.status(200).json({ message: "all users", users })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params
            let user = await User.findById(id)
            if (!user) {
                res.status(404).json({ message: "user not found" })
            }
            const { password, ...other } = user._doc

            res.status(200).json({ message: "get user", user: other })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params
            if (id == req.user._id || req.userIsAdmin) {
                let user = await User.findByIdAndDelete(id)
                if (!user) {
                    return res.status(404).json({ message: "user not found" })
                }
                if(user.profilePicture!=""){
                    fs.unlink(path.join(__dirname,"../","public",user.profilePicture),(err)=>{
                        if(err)throw err
                    })
                }
                if(user.coverPicture!=""){
                    fs.unlink(path.join(__dirname,"../","public",user.coverPicture),(err)=>{
                        if(err)throw err
                    })
                }



        return res.status(200).json({ message: "delete user", user })
            }
            res.status(405).json({ message: "Access defied" })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    }, 
    updateUser: async (req, res) => {
        try {
            const { id } = req.params
            if (id == req.user._id || req.userIsAdmin) {
                let user = await User.findById(id)
                if (!user) {
                    return res.status(404).json({ message: "user not found" })
                }
                if(req.body.password && req.body.password.length > 0){
                    const hashedPassword= await bcrypt.hash(req.body.password,10)
                    req.body.password=hashedPassword
                }else{
                    delete req.body.password
                }
              if(req.files){
                if(req.files.profilePicture){
                    const {profilePicture}=req.files
                    const format=path.extname(profilePicture.name)
                    if(format!==".png" && format!==".jpg" &&format!==".jpeg"){
        return res.status(403).json({ message: "file format trash"})   
                    }
                    const nameImg= v4()+format
                    profilePicture.mv(path.join(__dirname,"../","public",nameImg),(err)=>{
                        if(err)throw err
                    })
                    req.body.profilePicture=nameImg
                    if(user.profilePicture!=""){
                        fs.unlink(path.join(__dirname,"../","public",user.profilePicture),(err)=>{
                            if(err)throw err
                        })
                    }

                }
                 //coverPicture
                if(req.files.coverPicture){
                    const {coverPicture}=req.files
                    const format=path.extname(coverPicture.name)
                    if(format!==".png" && format!==".jpg" &&format!==".jpeg"){
        return res.status(403).json({ message: "file format trash"})   
                    }
                    const nameImg= v4()+format
                    coverPicture.mv(path.join(__dirname,"../","public",nameImg),(err)=>{
                        if(err)throw err
                    })
                    req.body.coverPicture=nameImg
                    if(user.coverPicture!=""){
                        fs.unlink(path.join(__dirname,"../","public",user.coverPicture),(err)=>{
                            if(err)throw err
                        })
                    }

                }

              } //end files 
                 

           

                const updateUser=await User.findByIdAndUpdate(id,req.body,{new:true})
                return res.status(200).json({ message: "update user", user:updateUser })
            }
            res.status(405).json({ message: "Access defied" })
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: error.message })
        }
    },
}
module.exports = userCtrl