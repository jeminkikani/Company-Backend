require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT;
const mongoUrl = process.env.MONGODB_URL;
const morgan = require("morgan");

//Application Based middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// mongodb Connection
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log(`DB connected..`);
  })
  .catch((err) => {
    console.log(err);
  });

//userRoutes
const userRoutes = require("./Routes/user.Routes");
app.use("/api/user", userRoutes);

// companyRoutes
const is_permissionRoutes = require("./Routes/is_permission.Routes");
app.use("/api", is_permissionRoutes);

// groupRoutes 
const groupRoutes = require("./Routes/Group.Routes");
app.use('/api', groupRoutes)

// companyRoutes
const companyRoutes = require("./Routes/company.Routes");
app.use('/api', companyRoutes)

// groupUserRoutes
const groupUserRoutes = require("./Routes/groupUser.Routes");
app.use('/api', groupUserRoutes)

//server started...
app.listen(port, () => console.log(`http://loacalhost:${port}`));
