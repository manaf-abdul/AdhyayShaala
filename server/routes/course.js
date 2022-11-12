import express from 'express'
import formidable from "express-formidable";
import { imageUpload ,removeImage,create, read, uploadVideo, removeVideo} from '../controllers/course'
import { requireSignIn,isInstructor } from '../middlewares'
const router = express.Router()

router.post('/course/upload-image',imageUpload)
router.post('/course/remove-image',removeImage)

router.post('/course',requireSignIn,isInstructor,create)
router.get('/course/:slug',read)
router.post("/course/video-upload", requireSignIn, formidable(), uploadVideo);
router.post("/course/remove-video/:instructorId", requireSignIn, removeVideo);

module.exports=router