import express from 'express'
import { instructorCourses } from '../controllers/instructor';
import { requireSignIn } from '../middlewares';
const router = express.Router()

router.get("/instructor-courses", requireSignIn, instructorCourses);

module.exports=router