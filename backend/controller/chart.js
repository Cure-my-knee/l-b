const db= require("../models")
const detailedviewdata=db.all_user_data
const users=db.crmusers
const userdetails=db.detailed_view
const {Op}= require("sequelize")


exports.piechart=async (req, res) =>{
    try{
        const user= req.query.user
        const status= req.query.status
        const monthlyLead = await Sale.findAll({
            where:{user:user, status:"Apt"},
            attributes: [
              [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
              [sequelize.fn('YEAR', sequelize.col('date')), 'year'], 
              [sequelize.fn('COUNT', sequelize.col('status')), 'totallead']
            ],
            group: ['year', 'month']
           
          });
      
        if(result&&result.length>0){

        }else{

        }

    }catch(error){
        console.log(error)
        return res.send(error)
    }
}


exports.barchart= async(req,res)=>{
try{
const user=req.query.user
const result= " "
if(result&&result.length>0){

}else{

}
}catch(error){
    console.log(error)
    return res.send(error)
}
}


exports.adminbarchart=async (req,res)=>{
    try{
const user =req.query.user
const result= " "
if(result&&result.length>0){

}else{

}
    }catch(error){
        console.log(error)
        return res.send(error)
    }
}