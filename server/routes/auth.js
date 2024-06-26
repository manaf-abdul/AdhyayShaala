import express from 'express'
import { login, logout, register ,currentUser,currentInstructor} from '../controllers/auth'
import { requireSignIn } from '../middlewares'
const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/current-user',requireSignIn,currentUser)
router.get('/current-instructor',requireSignIn,currentInstructor)


module.exports=router