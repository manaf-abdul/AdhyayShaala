import express from 'express'
import formidable from "express-formidable";
import { imageUpload ,removeImage,create, read, uploadVideo} from '../controllers/course'
import { requireSignIn,isInstructor } from '../middlewares'
const router = express.Router()

router.post('/course/upload-image',imageUpload)
router.post('/course/remove-image',removeImage)

router.post('/course',requireSignIn,isInstructor,create)
router.get('/course/:slug',read)
router.post("/course/video-upload", requireSignIn, formidable(), uploadVideo);

module.exports=router