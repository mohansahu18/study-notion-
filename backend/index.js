const express = require("express")

const dbconnection = require("./config/database")
const cloudinaryConnect = require("./config/cloudinary")

const courseRoutes = require('./routes/course')
const paymentRoutes = require('./routes/payment')
const profileRoutes = require('./routes/profile')
const userRoutes = require('./routes/user')

const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
require('dotenv').config();


const PORT = process.env.PORT || 4001

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
)
// cloudinary connect
cloudinaryConnect()

// routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)


app.listen(PORT, () => {
    console.log(`server started on port no. ${PORT}`);
})

dbconnection()