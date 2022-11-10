import axios from 'axios'
import InstructorRoute from '../../../components/routes/InstructorRoutes'
import { useState, useEffect } from 'react'
import CourseCreateForm from '../../../components/forms/courseCreateFrom'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'


const CourseCreate = () => {
  const router=useRouter()
  const [preview, setPreview] = useState("")
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image")

  const [image, setImage] = useState({})
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: '9.99',
    uploading: false,
    paid: true,
    loading: false,
    category: "",
  })

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    setValues({ ...values, loading: true })
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri
        })
        console.log("response",data)
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (error) {
        console.log(error);
        setValues({ ...values, loading: false })
        toast("Failed")
      }
    })

  }

  const handleImageRemove = async() => {
    try {
      setValues({ ...values, loading: true })
      const res = await axios.post('/api/course/remove-image',{image})
      setImage()
      setPreview()
      setUploadButtonText("Upload Image")
      setValues({ ...values, loading: false })
     } catch (error) {
      console.log(error);
      setValues({ ...values, loading: false })
      toast("Failed")
     }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
   try {
    const {data}=await axios.post('/api/course',{
      ...values,
      image
    })
    toast("Great Now You Can Start Adding Lessons")
    router.push('/instructor')
   } catch (error) {
    toast.error(err.response.data)
   }
  }

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center square p-5'>CourseCreate</h1>
      <div className='pb-3 pt-3'>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
    </InstructorRoute>
  )
}

export default CourseCreate