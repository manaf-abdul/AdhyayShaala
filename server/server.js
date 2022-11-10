import express from 'express'
import cors from 'cors'
import csrf from 'csurf'
import { readdirSync } from 'fs'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
const morgan = require("morgan")
require("dotenv").config()


//create express app
const app = express()

const csrfProtection = csrf({ cookie: true })

//DB CONNECTION
mongoose.connect(process.env.DATABASE)
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log("DB ERROR:", err))


//apply middleware
app.use(cors())
app.use(express.json({limit:'1gb'}))
app.use(cookieParser())
app.use(morgan("dev"))

//route
readdirSync("./routes").map((r) =>
    app.use("/api", require(`./routes/${r}`))
)
// app.use('/api/course',CourseRoutes )

//csrf
// app.use(csrfProtection)

// app.get('/api/csrf-token', (req, res) => {
//     res.json({ csrfToken: req.csrfToken() })
// })

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server started in ${PORT}`))