const moment = require("moment");
const db = require("../models");
const allUserData = db.all_user_data;
const allUserDataHistory = db.all_user_data_histories;
const Users = db.crmusers;
const {
  validateFileType,
  uploadFile,
  readFile,
} = require("../midelware/commonServices");
const { Op, literal } = require("sequelize");
const sequelize = require("sequelize");
const Sequelize = require("sequelize");

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
      comment,
    } = req.body;
    let user = req.email;
    const isAdmin = req.isAdmin;
    if (isAdmin) {
      user = req.body.user;
      if (!user) {
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
    if(!result && phone.includes("+91")){
      result =await allUserData.findOne({where:{phone:phone.slice(3)}});
    }
    else if(!result){
      result =await allUserData.findOne({where:{phone:`+91${phone}`}});
    }
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

exports.dailyeport= async(req,res)=>{
  const user = req.email;
  const reportdate=req.query.reportdate
  let option = { order: [["createdAt", "DESC"]] };
  try {
    const result = await allUserDataHistory.findAll({where:{user:user, createdAt:reportdate, ...option}})
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
}

exports.readdata = async (req, res) => {
  let { startDate, endDate, q, page, limit ,createuser} = req.query;
  try {
    const status = req.query.status;
    const user = req.email;
    const isAdmin = req.isAdmin;
    let option = { order: [["createdAt", "DESC"]] };
    if (page !== undefined && Number.isInteger(parseInt(page))) {
      limit = limit && Number.isInteger(parseInt(limit)) ? +limit : 5;
      page = parseInt(page);
      page = page - 1 >= 0 ? page - 1 : 0;
      option["limit"] = limit;
      option["offset"] = page ? page * limit : 0;
    }
    console.log(isAdmin);
    if (!status) {
      if (!isAdmin) {
        option.where = { user: user };
      }
    } else if (status === "followup") {
      if (isAdmin) {
        option.where = {
          status: {
            [Op.or]: ["F", "R"],
          },
        };
      } else {
        option.where = {
          user: user,
          status: {
            [Op.or]: ["F", "R"],
          },
        };
      }
    } else {
      if (isAdmin) {
        option.where = { status: status };
      } else {
        option.where = { status: status, user: user };
      }
    }
    if (q) {
      let obj = {
        [Op.or]: {
          name: { [Op.substring]: sequelize.literal(q) },
          phone: { [Op.substring]: sequelize.literal(q) },
        },
      };
      option.where = { ...option.where, ...obj };
    }
    if (startDate && endDate) {
      option.where = {
        ...option.where,
        createdAt: { [Op.between]: [startDate, moment(endDate).add(1,"day").format("YYYY-MM-DD")] },
      };
    }
    if (createuser) {
      option.where = {
        ...option.where,
        user: { [Op.eq]: createuser },
      };
    }

    const { count, rows } = await allUserData.findAndCountAll(option);
    if (rows && rows.length > 0) {
      return res.send({
        status: 1,
        message: "success",
        totalCount: count,
        recordCount: rows.length,
        currentPage: page ? page : undefined,
        nextPage: page ? parseInt(page) + 1 : undefined,
        data: rows,
      });
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

exports.allUsers = async (req, res) => {
  try {
    const result = await Users.findAll();
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
    let option = {
      where: { id: id },
      include: [
        {
          association: "all_user_data_histories",
          required: false,
        },
      ],
    };
    const result = await allUserData.findOne(option);

    if (result) {
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.send({
        status: 0,
        message: "No Data Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};



exports.updateUser = async (req, res) => {
  try {
    const {
      arrayofId,
      user,
    } = req.body;
    const result = await allUserData.findAll({ where: { id: arrayofId} });
    if (result) {
      await allUserData.update({user: user}, {where:{id:arrayofId}});
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
      user,
    } = req.body;
    const result = await allUserData.findOne({ where: { id: [id] } });
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
      console.log("status", status);
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
    const { leadstatus, comment, rdate , queries, age } = req.body;
    const result = await allUserData.findOne({ where: { id: id } });
    if (result) {
      let obj = {
        leadId: result.id,
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
        queries:queries,
        age:age
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
  let today = moment().format("YYYY-MM-DD");
  try {
    const user = req.email;
    const isAdmin = req.isAdmin;
    let totalLead, totalRelevent, todayFollowup, todayLeads;
    if (isAdmin) {
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
    } else {
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
      });
    }
    return res.status(200).json({
      status: 1,
      message: "success",
      data: {
        totalLead: totalLead,
        totalRelevent: totalRelevent,
        todayFollowup: todayFollowup,
        todayLeads: todayLeads,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.todayApp = async (req, res) => {
  try {
    const user = req.email;
    const isAdmin = req.isAdmin;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month
    const day = String(currentDate.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;
    console.log(todayDate);
    let result = "";
    if (isAdmin) {
      result = await allUserData.findAll({
        where: { status: "AptF", followup_date: todayDate },
      });
    } else {
      result = await allUserData.findAll({
        where: { user: user, status: "AptF", followup_date: todayDate },
      });
    }
    if (result) {
      return res.status(200).json({
        status: 1,
        message: "success",
        data: result,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "no record found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

exports.uploadData = async (req, res) => {
  const file = req.file;
  const extensions = ["xlsx", "csv"];

  const options = { userId: req.userId };
  const uploadPath = `${__dirname}/upload`;

  let user = req.email;

  //  validate file type
  if (!(await validateFileType({ file, extensions }))) {
    return res.send({
      status: 0,
      message: "Please upload CSV or Excel file only",
    });
  }
  // transfer upload fie in upload path
  if (!(await uploadFile({ file, uploadPath }))) {
    return res.send({ status: 0, message: "Something went wrong" });
  }

  try {
    let fileObj = { file: file, uploadPath: uploadPath };
    // read file
    fileObj = await readFile(fileObj);
    if (!fileObj || fileObj.fileData.length <= 0)
      return res.send({
        status: 0,
        message: "file is empty pls provide record",
      });

    let dataInserted = [];
    if (fileObj) {
      let recordCount = fileObj.fileData.length;

      for (const iterator of fileObj.fileData) {
        let date = iterator.field1;
        let agentName = iterator.field2;
        let agentMailId = iterator.field3;
        let queryAwsFromNumber = iterator.field4;
        let source = iterator.field5;
        let paitentName = iterator.field6;
        let contactNumber = iterator.field7;
        let location = iterator.field8;
        let treatmentEnquired = iterator.field9;
        let firstFollowupStatus = iterator.field10;
        let dateOfAppointment = iterator.field11;
        let secoundFollowupStatus = iterator.field12;
        let thirdFollowupStatus = iterator.field13;
        let status = iterator.field14;

        if (typeof date === "string") {
          let parts = date.split("-"); // Split the string by '-'

          // Extract day, month, and year from the parts array
          let day = parseInt(parts[0]);
          let month = parseInt(parts[1]) - 1; // Month is zero-based in JavaScript Date object
          let year = parseInt(parts[2]);

          // Create a new Date object
          date = new Date(year, month, day);
        }

        let obj = {
          name: paitentName,
          age: 0,
          queries: treatmentEnquired,
          email: "",
          phone: contactNumber,
          source: source,
          country: location,
          state: "",
          city: "",
          followup_date: dateOfAppointment,
          status: status,
          comment: thirdFollowupStatus,
          user: agentMailId,
          createdAt: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        };
        console.log(obj);
        try {
          let result = await allUserData.findOne({
            where: { phone: contactNumber },
          });
          if (result) {
            continue;
          }
          result = await allUserData.create(obj);
          dataInserted.push(result);
          if (firstFollowupStatus) {
            let obj = {
              leadId: result.id,
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
              comment: firstFollowupStatus,
              user: result.user,
              createdAt: result.createdAt,
            };
            const data = await allUserDataHistory.create(obj);
          }
          if (secoundFollowupStatus) {
            let obj = {
              leadId: result.id,
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
              comment: secoundFollowupStatus,
              user: result.user,
              createdAt: result.createdAt,
            };
            const data = await allUserDataHistory.create(obj);
          }
        } catch (error) {
          console.log("error", error);
          dataInserted.push(JSON.parse(error));
        }
      }
      return res.send({
        status: 1,
        message: "Success",
        data: dataInserted,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({ status: 0, error: error });
  }
};
