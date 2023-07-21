const express = require("express")
require('dotenv').config();


const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.listen(PORT, () => {
    console.log(`server started on port no. ${PORT}`);
})