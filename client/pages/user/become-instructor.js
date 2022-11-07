import axios from 'axios'
import { useContext,useState } from 'react'
import { Context } from '../../context'
import { Button } from 'antd'
import { SettingOutlined,UserSwitchOutlined,LoadingOutlined } from '@ant-design/icons'
import {toast} from 'react-toastify'
import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructor = () => {
  return (
    <h1 className='jumbotron text-center square p-5'>BecomeInstructor</h1>
  
    )
}

export default BecomeInstructor