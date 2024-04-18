const jwt = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const db = require("../models");
const User = db.crmusers;

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const hashpassword = await bcryptjs.hash(password, 12);
  let obj = { name: name, email: email, phone: phone, password: hashpassword };
  try {
    const result = await User.findOne({ where: { email: email } });
    if (result) {
      return res
        .status(200)
        .json({ status: 1, message: "User email already exists" });
    }
    const data = await User.create(obj);
    return res.status(200).json({
      status: 1,
      message: "created",
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {                                                                                          
    const result = await User.findOne({ where: { email: email } });
    if (!result) {
      return res.status(200).json({ status: 0, message: "User is not Exist" });
    }
    const validPassword = await bcryptjs.compare(password, result.password);
    if (!validPassword) {
      return res
        .status(200)
        .json({ status: 0, message: "Password is not correct" });
    }
    if (!result.allowLogin) {
      return res.status(200).json({ status: 0, message: "You are in waitting list" });
    }
    const token = jwt.sign(
      { email: result.email, name: result.name.toString() },
      "bsfnvhjfcswdkbesdktjcva",
      { expiresIn: "24h" }
    );
    return res
      .status(200)
      .json({
        status: 1,
        message: "login_success",
        data: { token: token, user: result },
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};


exports.GiveAcces = async (req, res)=>{
  try {
    const id = req.params.id;
    const allowLogin=1;
    const result=await User.findOne({ where: { id:id } });
    if(result){
await result.update({
  allowLogin:allowLogin
})
return res.status(200).json({
  status:1,
  message:"success",
  data:result
})
    }else{
return res.status(200).json({
  status:0,
  message:"No data found"
})
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
}

exports.getUserByEmail = async (req, res, email) => {
  try {
    const result = await User.findOne({ where: { email: email } });
    if (!result) {
      return res.status(200).json({ status: 0, message: "User not exits" });
    }
    let data = {
      ...result.dataValues,
      password: "",
    };
    return {
      status: 1,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};


exports.getAllUser = async (req, res) => {
  try {
    const result = await User.findAll();
    if (!result) {
      return res.status(200).json({ status: 0, message: "No record found" });
    }
    return res.send( {
      status: 1,
      data: result,
    })
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.getselfUser = async (req, res) => {
  let email=req.email
  try {
    const result = await User.findOne({where:{ email: email }});
    if (!result) {
      return res.status(200).json({ status: 0, message: "No record found" });
    }
    return res.send( {
      status: 1,
      data: result,
    })
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};