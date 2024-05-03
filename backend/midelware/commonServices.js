const path = require("path");
const fs = require("fs");
const csvtojson = require("csvtojson");
const readExcelFile = require("read-excel-file/node");
const { Op } = require("sequelize");
const moment = require("moment");
const xlsx = require("xlsx");

exports.uploadFile = ({ file, uploadPath }) => {
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      fs.copyFileSync(
        `upload/${file.filename}`,
        `${uploadPath}/${file.filename}`
      );
      fs.unlinkSync(`upload/${file.filename}`);
  
      return true;
    } catch (error) {
      return false;
    }
  };



  exports.readFile = async (data, req) => {
    try {
      let { filename } = data.file;
      let fileExtension = filename.split(".").slice(-1).pop();
      let filePath = path.join(data.uploadPath, filename);
      let fileData;
      if (fileExtension == "csv") {
        fileData = await csvtojson({ noheader: true }).fromFile(filePath);
        fileData.shift();
        data.fileData = fileData;
        // console.log(data)
      } else if (fileExtension == "xlsx") {
        let fileDataArr = await readExcelFile(filePath);
        data.fileData = convertToJSON(fileDataArr);
      }
      return data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };


  function convertToJSON(array) {
    let jsonData = [];
    for (var i = 1, length = array.length; i < length; i++) {
      const row = array[i];
  
      if (row.filter((d) => d === null).length !== row.length) {
        var data = {};
        let emptyCol = 0;
        for (var x = 0; x < row.length; x++) {
          if (row[x] == null) emptyCol++;
          else break;
        }
        row.splice(0, emptyCol);
        for (var x = 0; x < row.length; x++) {
          data["field" + (x + 1)] = row[x];
        }
        jsonData.push(data);
      }
    }
  
    return jsonData;
  }


  exports.validateFileType = async ({ file, extensions = [] }) => {
    let { filename } = file;
  
    try {
      let fileExtension = filename.split(".").slice(-1).pop();
      console.log("fileExtension");
  
      if (extensions.includes(fileExtension.toLowerCase())) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };