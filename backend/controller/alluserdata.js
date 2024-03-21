const moment = require("moment");
const db = require("../models");
const allUserData = db.all_user_data;
const allUserDataHistory = db.all_user_data_history;
const { Op, literal } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const {
      name,
      age,
      queries,
      email,
      phone,
      source,
      country,
      state,
      city,
      followup_date,
      leadstatus,
      comment
    } = req.body;
    let user= req.email
    const isAdmin=req.isAdmin
    if(isAdmin){
      user=req.body.user
      if(!user){
        return res
        .status(200)
        .json({ status: 0, message: "please select user" });
      }
    }
    let obj = {
      name: name,
      age: age,
      queries: queries,
      email: email,
      phone: phone,
      source: source,
      country: country,
      state: state,
      city: city,
      followup_date: followup_date,
      status: leadstatus,
      comment: comment,
      user: user,
    };
    let result = await allUserData.findOne({ where: { phone: phone } });
    if (result) {
      return res
        .status(200)
        .json({ status: 0, message: "This data is already exists" });
    }
    const data = await allUserData.create(obj);
    return res.status(200).json({
      status: 1,
      message: "created",
      data: {
        data: data,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.readdata = async (req, res) => {
  try {
    const status = req.query.status;
    const user = req.email;
    const isAdmin = req.isAdmin;
    let result = "";
    console.log(isAdmin);
    if (!status) {
if(isAdmin){
  result = await allUserData.findAll();
}else{
  result = await allUserData.findAll({where:{user:user}});}
    }else if(status==="followup"){
      if(isAdmin){
        result = await allUserData.findAll({
          where: {
            status: {
            [Op.or]: ["F", "R"],
          }
        },
        });
      }else{
        result = await allUserData.findAll({
          where: { user: user ,
            status: {
            [Op.or]: ["F", "R"],
          }
        },
        });}
    } 
    else {
      if(isAdmin){
        result = await allUserData.findAll({
          where: { status: status },
        });
      }else{
        result = await allUserData.findAll({
          where: { status: status, user: user },
        });}
      
    }
    if (result && result.length > 0) {
      return res
        .status(200)
        .json({ status: 1, message: "success", data: result });
    } else {
      return res.status(200).json({
        status: 0,
        message: "No Record Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.phoneorname = async (req, res) => {
  try {
    const phone = req.query.phone;
    const name = req.query.name;
    const user = req.email;
    let result = "";
    if (phone) {
      result = await allUserData.findAll({
        where: { phone:phone, user: user },
      });
    }
    if (name) {
      result = await allUserData.findAll({
        where: {  name: name, user: user },
      });
    }
    if (result && result.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "No Record Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.readbyId = async (req, res) => {
  try {
    const id = req.params.id;
    let option={ where: { id: id },include: [
      {
        association: "all_user_data_history",
      },
    ], }
    const result = await allUserData.findOne(option);
    if (result) {
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.send(200).json({
        status: 0,
        message: "No Data Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.updatebyId = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      age,
      queries,
      email,
      phone,
      source,
      country,
      state,
      city,
      followup_date,
      status,
      comment,
      user
    } = req.body;
    const result = await allUserData.findOne({ where: { id: id } });
    if (result) {
     await result.update({
        name: name,
        age: age,
        queries: queries,
        email: email,
        phone: phone,
        source: source,
        country: country,
        state: state,
        city: city,
        followup_date: followup_date,
        status: status,
        comment: comment,
        user: user,
      });
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "No Data Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.reschedule = async (req, res) => {
  try {
    const id = req.params.id;
    const { leadstatus, comment, rdate } = req.body;
    const result = await allUserData.findOne({ where: { id: id } });
    if (result) {
    let obj = {
      leadId:result.id,
      name: result.name,
      age: result.age,
      queries: result.queries,
      email: result.email,
      phone: result.phone,
      source: result.source,
      country: result.country,
      state: result.state,
      city: result.city,
      followup_date: result.followup_date,
      status: result.status,
      comment: result.comment,
      user: result.user,
    };
    const data = await allUserDataHistory.create(obj);
     await result.update({
        status: leadstatus,
        comment: comment,
        followup_date: rdate,
      });
      return res.status(200).json({
        status: 1,
        message: "seccess",
        data: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.bydate = async (req, res) => {
  try {
    const user = req.email;
    const edate = req.query.edate;
    const sdate = req.query.sdate;
    let result = "";
    if (user === "*") {
      result = await allUserData.findAll({
        where: {
          createdAt: {
            [Op.between]: [sdate, edate], // Between two dates
          },
        },
      });
    } else {
      result = await allUserData.findAll({
        where: {
          user: user,
          createdAt: {
            [Op.between]: [sdate, edate], // Between two dates
          },
        },
      });
    }
    if (result && result.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "No Record Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.carddata = async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); //  
  const day = String(currentDate.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;
  let today=moment().format("YYYY-MM-DD")
  try {
    const user = req.email;
    const isAdmin = req.isAdmin;
    let totalLead,totalRelevent,todayFollowup,todayLeads
    if(isAdmin){
      totalLead = await allUserData.count();
      totalRelevent = await allUserData.count({
       where: { status: "R" },
     });
      todayFollowup = await allUserData.count({
       where: {
         followup_date: todayDate,
         status: {
           [Op.or]: ["F", "R"],
         },
       },
     });
     
      todayLeads = await allUserData.count({
       where: {
         createdAt: literal(`DATE_FORMAT(createdAt, '%Y-%m-%d') = '${today}'`),
       },
     });
    }else{
     totalLead = await allUserData.count({ where: { user: user } });
     totalRelevent = await allUserData.count({
      where: { user: user, status: "R" },
    });
     todayFollowup = await allUserData.count({
      where: {
        user: user,
        followup_date: todayDate,
        status: {
          [Op.or]: ["F", "R"],
        },
      },
    });
    
     todayLeads = await allUserData.count({
      where: {
        user: user,
        createdAt: literal(`DATE_FORMAT(createdAt, '%Y-%m-%d') = '${today}'`),
      },
    });}
  return res.status(200).json({
    status:1,
    message:"success",
    data:{
      totalLead:totalLead,
      totalRelevent:totalRelevent,
      todayFollowup:todayFollowup,
      todayLeads:todayLeads
    }
  })
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.todayApp = async (req, res) => {
  try {
    const user=req.email
    const isAdmin = req.isAdmin;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
    const day = String(currentDate.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;
    console.log(todayDate);
    let result = "";
    if(isAdmin){
      result = await allUserData.findAll({     
        where: {status: "Apt", followup_date: todayDate },
      });
    }else{
      result = await allUserData.findAll({     
        where: {user:user,status: "Apt", followup_date: todayDate },
      });}
    if (result) {
      return res.status(200).json({
        status:1,
        message:"success",
        data:result
      })
    }else{
      return res.status(200).json({
        status:0,
        message:"no record found",
      })
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};


