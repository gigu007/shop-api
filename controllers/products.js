const { query } = require('express')
const Product = require('../models/product')
const { search } = require('../routes/products')


const getAllProductsStatic = async (req,res)=>{
   
    // throw new Error('testing async errors')
    
        // const search ='g'//any name that contains letter a
        const products = await Product.find({
        // name:{$regex:search, $options:'i'}, //i means case insensitive
        price:{$lt:130}
        //price:{$gt:}

        
    }).select('name price').limit(14)// selecting a some fields only
    // .sort('-name -price')//this will sort from z-a while price will be from max - min
    res.status(200).json({products,nbHits:products.length})
}
const getAllProducts = async(req,res)=>{
    const {featured,company,name,sort,fields,numericFilters} = req.query//the query string
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
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<=':'$lte',
            '<':'lt',


        }
        const regEx=/\b(<|>|<=|>=|=|)\b/g//regular expression
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`)
        const options =['price','rating']
        filters =filters.split(',').forEach((item)=>{
            //array destructuring
       const [field,operator,value]=item.split('-')
       if(options.includes[field]){
           queryObject[field]={[operator]:Number[value]}
       }
        })
    }
    const page = Number(req.query.page) || 1
    const limit =Number(req.query.limit)|| 10
    const skip = (page -1)*limit
    result =result.skip(skip).limit(limit)
    const products = await result;
    res.status(200).json({products,nbHits:products.length})
    // res.status(200).json({msg:`products  route`})
}
module.exports ={
    getAllProductsStatic,
    getAllProducts,
}