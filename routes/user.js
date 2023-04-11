const router = require('express').Router();
const userModel = require("../model/userSchema")
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')





router.get("/register", async (req, res) => {
    const allFind = await userModel.find();
    res.json(allFind)
})

// for joi validation middleware
const validatebody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }
        next()
    }
}
const bodySchema = Joi.object({
    name: Joi.string().required().min(6).max(255),
    email: Joi.string().email().required().min(6).max(255),
    password: Joi.string().required().min(4).max(10)
});

router.post("/register",validatebody( bodySchema),async (req, res) => {

    // email is already exist
   
    const emailExist = await userModel.findOne({ email:req.body.email });
    if (emailExist !== null && emailExist !== undefined) {
      return res.status(400).json({ message: "Email is already in use" });
    } 
    
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(req.body.password, salt)

    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword
    })
    try {
        const saveUser = await user.save()
        res.json(saveUser)
    } catch (error) {
        res.json(error)
    }
})


const loginSchema = Joi.object({
    email: Joi.string().email().required().min(6).max(255),
    password: Joi.string().required().min(4).max(10)
});
router.post('/login',validatebody(loginSchema), async(req,res)=>{
    const userEmail=await userModel.findOne({email:req.body.email })
    if (!userEmail ) {
        return res.status(400).json({ message: "Email is gone" });
      } 
      const validPassword=await bcrypt.compare(req.body.password,userEmail.password)
      if(!validPassword){
        return res.status(400).json({message:"Password is mismatch"})
      }

      const token=jwt.sign({_id: userEmail._id},process.env.SECRET)
      res.header('auth-token',token).send(token)
    //   res.send("logged in")
}) 

 





router.get("/register/:id", async (req, res) => {
    try {
        const findId = await userModel.findById({ _id: req.params.id })
        res.json(findId)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})
// delete by id
router.delete("/register/:id",async (req,res)=>{
    try {
        const deleteId=await userModel.deleteOne({_id:req.params.id})
        res.json({message:"this id deleted succesfully"})
    } catch (error) {
        res.json({message:error})
    }
})
module.exports = router