import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "1mb"}))
app.use(express.urlencoded({extended: true, limit: "1mb"}))
app.use(express.static("public"))
app.use(cookieParser())

//importing routes from routes
import userRouter from './routes/user.routes.js'
import recruiterRouter from './routes/recruiter.routes.js'
import jobPostRouter from './routes/jobPost.routes.js'
import adminRouter from './routes/admin.routes.js'
import miscRouter from './routes/misc.routes.js'

app.use("/api/v1/user",userRouter)//http://localhost:7000/api/v1/user/testing
app.use("/api/v1/recruiter",recruiterRouter)//http://localhost:7000/api/v1/recruiter/test
app.use("/api/v1/jobs",jobPostRouter)
app.use("/api/v1/misc",miscRouter)
app.use('/api/v1/admin',adminRouter)

export { app }