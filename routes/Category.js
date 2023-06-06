const {CategoryModel} = require('../services/ConnectionDatabase')
const routes = require('express').Router()


routes.get("/", async (req,res)=>{
   const categories = await CategoryModel.GetCategories();
    res.send(categories);
});


module.exports = routes;