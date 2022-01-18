import  express from 'express';
import productModel from '../db/ProductSchema.js'
import colorModel from '../db/ColorSchema.js'
import checkModel from '../db/CheckoutSchema.js'
import categoryModel from '../db/CategorySchema.js'
import orderModel from '../db/CheckoutSchema.js'
const proRouter = express.Router();  

proRouter.get("/fetchProductService", async (req, res) => {
    let allproduct = []
    await productModel.find().populate(["color_id", "category_id"])
        .then(pro => allproduct = pro)
    let category = []
    await categoryModel.find({}).then(pro => category = pro)
    let color = []
    await colorModel.find({}).then(pro => color = pro)
    res.json({ "color": color, "category": category, "allproduct": allproduct })
})

proRouter.post("/checkOutService",async(req,res)=>{
    console.log(req.body,"checkout service")
    await checkModel.create(req.body).then(data=>{ 
        res.json({msg:"order Placed"})

    }) 


})
proRouter.post("/orderService", (req, res) => { 
    orderModel.find({user_email: req.body.email}, (err, data)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(data)
        } 
    })
})
proRouter.post("/applyFilterService", async (req, res) => {
    let data = req.body;
    if (data.category != '' && data.colors.length != 0) {
        productModel.find({
            category_id: data.category,
            color_id: data.colors,
        })
            .populate(["color_id", "category_id"])
            .then((product) => {
                res.json({ product });
            });
    } else if (data.category != '') {

        productModel.find({ category_id: data.category })
            .populate(["color_id", "category_id"])
            .then((product) => res.json({ product }));
    } else if (data.colors.length != 0) {

        productModel.find({ color_id: data.colors })
            .populate(["color_id", "category_id"])
            .then((product) =>{
                res.json({ product })});
    } else {

        productModel.find()
            .populate(["color_id", "category_id"])
            .then((product) => res.json({ product }));
    }
}) 
proRouter.post("/fetchRateProduct", async (req, res) => {
    console.log(req.body,"fetch rate product")
    await productModel.findOne({_id:req.body.id}).populate(["color_id", "category_id"])
    .then(pro => res.send(pro))
  })
  proRouter.post("/rateProductService", async (req, res) => {
    console.log(req.body)
    await productModel.findOneAndUpdate({_id:req.body.id}, {$set:{product_rating:req.body.value,rated_by:req.body.rated}},{new:true}).populate(["color_id", "category_id"])
    .then(pro => res.send(pro))
  })

export default proRouter