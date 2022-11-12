import express from 'express'
import formidable from "express-formidable";
import { imageUpload ,removeImage,create, read, uploadVideo, removeVideo, addLesson, update, removeLesson} from '../controllers/course'
import { requireSignIn,isInstructor } from '../middlewares'
const router = express.Router()

router.post('/course/upload-image',imageUpload)
router.post('/course/remove-image',removeImage)

router.post('/course',requireSignIn,isInstructor,create)
router.get('/course/:slug',read)

router.put("/course/:slug", requireSignIn, update);

router.post("/course/video-upload/:instructorId", requireSignIn, formidable(), uploadVideo);
router.post("/course/video-remove/:instructorId", requireSignIn, removeVideo);

router.post("/course/lesson/:slug/:instructorId", requireSignIn, addLesson);
router.put("/course/:slug/:lessonId", requireSignIn, removeLesson);
module.exports=router