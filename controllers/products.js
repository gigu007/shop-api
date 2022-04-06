const { query } = require('express')
const Product = require('../models/product')
const { search } = require('../routes/products')


const getAllProductsStatic = async (req,res)=>{
   
    // throw new Error('testing async errors')
    
        const search ='g'//any name that contains letter a
        const products = await Product.find({
        name:{$regex:search, $options:'i'}, //i means case sensitive

        
    })
    res.status(200).json({products,nbHits:products.length})
}
const getAllProducts = async(req,res)=>{
    const {featured,company,name,search} = req.query
    // console.log(re.query)
    const queryObject={}
    if(featured){
        queryObject.featured = featured === 'true'?true:false
    }
    if(company){
        queryObject.company =company
    }
    if(name){
        queryObject.name={$regex: name, $options: 'i'}
    }
    console.log(queryObject)
    const products = await Product.find(queryObject)
    res.status(200).json({products,nbHits:products.length})
    // res.status(200).json({msg:`products  route`})
}
module.exports ={
    getAllProductsStatic,
    getAllProducts,
}