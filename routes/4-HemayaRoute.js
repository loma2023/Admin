const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const HemayaUser = require("../models/HemayaSchema");
const Admin = require("../models/AdminSchema");

// GET REQUEST
router.get("/HemayaCustomersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("1-Customers", { User: Decode, Title: "بيانات عملاء حماية", Buttons: "TRUE", })
});

router.get("/HemayaSchema.JSON", RequireAuth, async (req, res) => {
  await HemayaUser.find()
    .then((MainData) => { res.json(MainData) })
    .catch((err) => { return location.href = "/Error" })
});

// EDIT AND GET REQUEST
router.put("/CollectHemayaCustomer:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let MyPlan = "الباقة الشهرية"
  if (req.body.Plan === "Year") { MyPlan = "الباقة السنوية" }
  if (req.body.Plan === "Lifetime") { MyPlan = "باقة مدي الحياة" }

  await HemayaUser.updateOne({ _id: req.params.id },
    {
      Plan: req.body.Plan,
      ActivedAt: new Date(),
      PaymentWay: req.body.PaymentWay,
      $push: {
        NotificationsData: {
          Username: "HEMAYA", ReadBy: [], Text: `تم تفعيل حسابك ,وانت الآن مشترك في ${MyPlan}`, Icon: "bx bx-check", CreatedAt: new Date(),
        },
      },
    },
  )

  await Admin.updateOne({ _id: Decode.ID }, {
    $push:
    {
      GeneralData: {
        DocDate: req.body.DocDate,
        Name: req.body.Name,
        Plan: req.body.Plan,
        PaymentWay: req.body.PaymentWay,
        Total: req.body.Total,
        System: "Hemaya",
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }], Text: "بتفعيل حساب احد عملاء حماية", Icon: "bx bx-check", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch(err => { return res.json(Msg.Error) })
});

module.exports = router;