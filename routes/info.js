const router=require('express').Router()
const veryitoken=require('../function/middlewarejwt')

router.get('/',veryitoken,(req,res)=>{
    res.json({info:{name:'amalser',email:'amalser@gmail.com'}})
})

module.exports=router