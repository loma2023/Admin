const express = require("express");
const router = express.Router();
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

const Admin = require("../models/AdminSchema");
const Msg = require("../messages/Msg");

router.get("/Register", (req, res) => {
  res.render("Auth/Register", { Title: "Register" });
});

let CodeTxt = ''
let RegisterObj = {}
router.post("/isCurrentEmail", async (req, res) => {
  try {
    await Admin.find()
      .then((Data) => {
        if (Data.length > 0) { return res.redirect("/Login") }
        else { return res.json(Msg.Success); }
      })
      .catch((error) => { console.log(error); });
  }
  catch (err) { return res.json(Msg.Error) }
})

router.post("/Register", async (req, res) => {
  try {
    // Create Random Code and Sent Email
    CodeTxt = ''
    const hexString = "0123456789"
    for (let i = 0; i < 6; i++) { CodeTxt += hexString[Math.floor(Math.random() * hexString.length)] }

    const EmailObj = {
      from: req.body.Email,
      to: req.body.Email,
      subject: 'Verification Email',
      html: `${Msg.DesignGamilMsg}
      <div class="DetailsMsg">
          <p>عزيزي ${req.body.Username}</p>
          <p> شكرًا لك على الاشتراك </p>
          <p> تم تأكيد اشتراكك، ويمكنك الآن الوصول الكامل إلى جميع المزايا والميزات التي نقدمها</p>
          <p> نحن هنا لتقديم الدعم لك، لذا لا تتردد في التواصل معنا إذا كانت لديك أية أسئلة </p>
          <p>يرجي استخدام الكود التالي لتأكيد حسابك </p>
          <h3>${CodeTxt}</h3>
      </div></div></body></html>`
    };

    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) {
      RegisterObj = {
        Username: req.body.Username,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Password: req.body.Password,
        NameCompany: req.body.NameCompany,
        TypeCompany: req.body.TypeCompany,
        LogoCompany: req.body.LogoCompany,
        CityCompany: req.body.CityCompany,
        AddressCompany: req.body.AddressCompany,
        PhoneCompany1: req.body.PhoneCompany1,
        PhoneCompany2: req.body.PhoneCompany2,
        Plan: "Month",
        ActivedAt: new Date(),
        CreatedAt: new Date(),
      }
      console.log(CodeTxt)
      res.json(Msg.SendMail);
    } else {
      res.json(Msg.NotSendMail);
    }
  }

  catch (err) { return res.json(Msg.Error) }
}
);

router.post("/ConfirmEmail", async (req, res) => {
  try {
    if (req.body.CodeTxt === CodeTxt) {
      const NewUser = await Admin.create(RegisterObj);
      let Code = {
        ID: NewUser._id,
        UserID: NewUser._id,
        Username: NewUser.Username,
        Address: NewUser.Address,
        Phone: NewUser.Phone,
        Email: NewUser.Email,
        TypeUser: "Owner",
        Permissions: [],
      }
      const token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json(Msg.Success);
    } else {
      res.json(Msg.WrongCode)
    }
  }
  catch (err) { return res.json(Msg.Error) }
});

module.exports = router;