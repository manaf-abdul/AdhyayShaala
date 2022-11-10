import express from 'express'
import { imageUpload ,removeImage,create} from '../controllers/course'
import { requireSignIn,isInstructor } from '../middlewares'
const router = express.Router()

router.post('/course/upload-image',imageUpload)
router.post('/course/remove-image',removeImage)

router.post('/course',requireSignIn,isInstructor,create)
router.post('/course/:slug',read)

module.exports=router