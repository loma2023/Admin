// ******************* Static Code  **************************************************
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2024;
const mongoose = require("mongoose");
const methodOverride = require("method-override"); app.use(methodOverride("_method"));
const cookieParser = require("cookie-parser"); app.use(cookieParser());
const bodyParser = require("body-parser"); //app.use(bodyParser());
const path = require("path");
// const cors = require('cors'); app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.set('views', path.join(__dirname, 'views'));
require("dotenv").config();
// ******************* Connect With DB  **********************************************
mongoose.connect(process.env.MONGOOSE_URL)
  .then(() => { app.listen(PORT, () => { console.log(`http://localhost:${PORT}/`) }) })
  .catch((err) => { console.log(err) });
// *******************  Import Routes  ***********************************************
const MainRoute      = require("./routes/0-MainRoute");      app.use(MainRoute);
const LoginRoute     = require("./routes/1-LoginRoute");     app.use(LoginRoute);
const RegisterRoute  = require("./routes/2-RegisterRoute");  app.use(RegisterRoute);
const SettingsRoute  = require("./routes/10-SettingsRoute"); app.use(SettingsRoute);
const ModernRoute    = require("./routes/3-ModernRoute");    app.use(ModernRoute);
const HemayaRoute    = require("./routes/4-HemayaRoute");    app.use(HemayaRoute);

app.use((req, res, next) => { res.status(404).redirect("/Error"); })