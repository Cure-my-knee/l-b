const express = require("express");
const router = express.Router();
const userData = require("../controller/alluserdata");
const userLogin = require("../controller/login")
const upload = require("../midelware/upload");
const isAuth = require("../midelware/auth");
router.get("/user-lead", isAuth, userData.readdata)
router.post("/add-lead" , isAuth, userData.create)
router.get("/crmusers", isAuth, userData.allUsers)
router.get("/read-by-id/:id", isAuth, userData.readbyId)
router.put("/update/:id", isAuth, userData.updatebyId)
router.put("/reschedule/:id", isAuth, userData.reschedule)
router.get("/today-appointment",isAuth, userData.todayApp)
router.get("/card-data", isAuth,userData.carddata)
router.put("/giveaccess/:id", isAuth, userLogin.GiveAcces)
router.put("/giveaccesstoadmin/:id",  userLogin.GiveAccesForAdmin)
router.put("/update-user", isAuth, userData.updateUser)
router.put("/change-password/:id", isAuth, userLogin.changepassword)
router.get("/monthly-data",isAuth,userData.getMonthlyLeadsData)
router.get("/monthly-data-for-bar-chart",isAuth,userData.getMonthlyLeadsDataforBarChart)
router.put("/handover-another-user", isAuth,userData.handoverUser)
router.post(
  "/userData/upload",
  [upload.single("file")],
  userData.uploadData
);
router.get("/dailyreport", isAuth,userData.dailyeport)

router.get("/export-excel", userData.exportAllUsersData)

module.exports = router;

