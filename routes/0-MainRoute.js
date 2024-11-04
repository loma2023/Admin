const express = require("express");
const router = express.Router();
const moment = require("moment");
const Mailer = require('nodemailer');
const jwt = require("jsonwebtoken");

const transporter = Mailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: "j t z s y v s j w a i v k y c s",
  }
});

require('dotenv').config()

const { RequireAuth, UnRequireAuth, CheckIfUser } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const Admin = require("../models/AdminSchema");

router.get("*", CheckIfUser);
router.post("*", CheckIfUser);
router.put("*", CheckIfUser);
router.delete("*", CheckIfUser);

router.get("/AdminSchema.JSON", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await Admin.findOne({ _id: Decode.ID })
    .then((MainData) => { res.json([MainData, Decode]) })
    .catch((err) => { return location.href = "/Error" })
});

router.put("/ReadNotification:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await Admin.updateOne({ "NotificationsData._id": req.params.id },
    { $push: { "NotificationsData.$.ReadBy": { User: Decode.UserID, }, } })
    .then((Data) => { return res.json(Msg.Success) })
    .catch(err => { return res.json(Msg.Error) })
});

router.get("/Home", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  await Admin.findOne({ _id: Decode.ID })
    .then((Data) => { res.render("0-Home", { MainData: Data, User: Decode, moment: moment, Title: "Home" }); })
    .catch((err) => { return location.href = "/Error" })
});

router.get("/CashBook", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("17-CashBook", { User: Decode, Title: "سجل التحصيلات", Buttons: "FALSE" });
});

router.get("/Messages", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("18-Messages", { User: Decode, Title: "رسائل العملاء", Buttons: "FALSE" });
});

// DELETE AND GET Request
router.delete("/Messages:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await Admin.updateOne(
    { "MessagesData._id": req.params.id },
    { $pull: { MessagesData: { _id: req.params.id } } }
  )
  await Admin.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بحذف رسالة احد العملاء`, Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

// Sent Message 
router.post("/MessageToCustomer", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  try {
    const EmailObj = {
      from: process.env.MY_EMAIL,
      to: req.body.ToEmail,
      subject: 'MODERN',
      html: `${Msg.DesignGamilMsg}
      <div class="DetailsMsg">
          <p>${req.body.Message} </p>
      </div></div></body></html>`
    };

    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) { res.json(Msg.SendMsg); }
    else { res.json(Msg.NotSendMsg); }

  }
  catch (err) { return res.json(Msg.Error) }
});


router.get("/Error", (req, res) => {
  res.render("Auth/Error", { Title: "Error" });
});

router.get("/Error404", (req, res) => {
  res.render("Auth/Error", { Title: "Error 404" });
});

router.get("/Permission", (req, res) => {
  res.render("Auth/Error", { Title: "Permission" });
});

router.get("/SignOut", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/Login");
});






module.exports = router;