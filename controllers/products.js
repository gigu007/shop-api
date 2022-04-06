const { query } = require('express')
const Product = require('../models/product')
const { search } = require('../routes/products')


const getAllProductsStatic = async (req,res)=>{
   
    // throw new Error('testing async errors')
    
        // const search ='g'//any name that contains letter a
        const products = await Product.find({
        // name:{$regex:search, $options:'i'}, //i means case insensitive
        

        
    }).select('name price').limit(4)// selecting a some fields only
    // .sort('-name -price')//this will sort from z-a while price will be from max - min
    res.status(200).json({products,nbHits:products.length})
}
const getAllProducts = async(req,res)=>{
    const {featured,company,name,sort,fields} = req.query//the query string
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
    // console.log(queryObject)
    let result =  Product.find(queryObject)
    //sort
    if(sort){
        const sortList = sort.split(',').join(' ')
       result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')//sorting based on time created
    }
    if(fields){
        const fieldList = fields.split(',').join(' ')
       result = result.select(fieldList)
       //.limit(3)//this will return maximum of 3 results
       //.skip(1)will skip the first item before return the rest
    }
    const page = Number(req.query.page) || 1
    const limit =Number(req.query.limit)|| 10
    const skip = (page -1)*limit
    const products = await result;
    res.status(200).json({products,nbHits:products.length})
    // res.status(200).json({msg:`products  route`})
}
module.exports ={
    getAllProductsStatic,
    getAllProducts,
}