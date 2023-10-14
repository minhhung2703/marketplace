require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// package
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload")
// const bodyParser = require("body-parser");
// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// })

// routes
const authRoute = require("./routes/AuthRoutes");
const gigsRoute = require("./routes/GigsRoute")

const NotFound = require("./middlewares/not-found");
const errorHandleMiddlerware = require("./middlewares/error-handler");


app.use(cors({
    origin: [process.env.PUBLIC_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use("/uploads", express.static("uploads"))
app.use("/uploads/profiles", express.static("/uploads/profiles"));
// app.use(fileUpload({ useTempFiles: true }))
// app.use(bodyParser.json())

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.get("/", () => console.log("hello"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/gigs", gigsRoute)

app.use(NotFound);
app.use(errorHandleMiddlerware);

const port = process.env.PORT || 5000;
const start = async () => {
    app.listen(port, console.log(`Server started on port ${port}`));
}

start();