import axios from 'axios'
import InstructorRoute from '../../../../components/routes/InstructorRoutes'
import { useState, useEffect } from 'react'
import CourseCreateForm from '../../../../components/forms/courseCreateFrom'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Item from 'antd/lib/list/Item'
import { Avatar, List, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm'


const CourseEdit = () => {

    const router = useRouter();
    const { slug } = router.query
    const [preview, setPreview] = useState("")
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image")

    const [visible, setVisible] = useState(false)
    const [current, setCurrent] = useState({})
    const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)

    const [image, setImage] = useState({})
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: '9.99',
        uploading: false,
        paid: true,
        loading: false,
        category: "",
        lessons: []
    })

    useEffect(() => {
        loadCourse();
    }, [slug]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        if (data) setValues(data);
        if (data && data.image) setImage(data.image);
    };



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
                console.log("response", data)
                setImage(data)
                setValues({ ...values, loading: false })
            } catch (error) {
                console.log(error);
                setValues({ ...values, loading: false })
                toast("Failed")
            }
        })

    }

    const handleImageRemove = async () => {
        try {
            setValues({ ...values, loading: true })
            const res = await axios.post('/api/course/remove-image', { image })
            setImage({})
            setPreview()
            setUploadButtonText("Upload Image")
            setValues({ ...values, loading: false })
        } catch (error) {
            console.log(error);
            setValues({ ...values, loading: false })
            toast("Failed")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`/api/course/${slug}`, {
                ...values,
                image
            })
            toast("Course Updated")
            // router.push('/instructor')
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    const handleDrag = (e, index) => {
        e.dataTransfer.setData("itemIndex", index)
    }

    const handleDrop = async (e, index) => {
        const movingItemIndex = e.dataTransfer.getData("itemIndex")
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex]
        allLessons.splice(movingItemIndex, 1)
        allLessons.splice(targetItemIndex, 0, movingItem)

        setValues({ ...values, lessons: [...allLessons] })

        //save the new orders
        const { data } = await axios.put(`/api/course/${slug}`, {
            ...values,
            image
        })
        console.log("Lessons,rearranged response", data)
        toast("Lessons Re-Arranged Successfully")
    }

    const handleDelete = async (index) => {
        const answer = window.confirm("Are you sure want to delete")
        if (!answer) return;
        let allLessons = values.lessons
        let removed = allLessons.splice(index, 1)
        setValues({ ...values, lessons: allLessons })

        const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
    }

    const handleVideo = async (e) => {
        //remove previous
        if (current.video && current.video.Location) {
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, current.video)
            console.log("res", res);
        }
        const file = e.target.files[0]
        setUploadVideoButtonText(file.name)
        setUploading(true)
        //send video as formdat
        const videoData = new FormData()
        videoData.append('video', file)
        videoData.append('courseId', values._id)
        const { data } = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
            onDownloadProgress: (e) => setProgress(Math.round((100 * e.loaded / e.total)))
        })
        console.log("data",data);
        setCurrent({...current,video:data})
        setUploading(false)
    }

    const handleUpdateLesson = () => {
        console.log("handleUpdateLesson");
    }


    return (
        <InstructorRoute>
            <h1 className='jumbotron text-center square p-5'>Edit Course</h1>
            <div className='pb-3 pt-3'>
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    handleImageRemove={handleImageRemove}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    editPage={true}
                />
            </div>
            <div className="row pb-5">
                <div className="col lesson-list">
                    <h4>
                        {values && values.lessons && values.lessons.length} Lessons
                    </h4>
                    <List
                        onDragOver={(e) => e.preventDefault()}
                        itemLayout="horizontal"
                        dataSource={values && values.lessons}
                        renderItem={(item, index) => (
                            <Item
                                draggable
                                onDragStart={(e) => handleDrag(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <Item.Meta
                                    onClick={() => {
                                        setVisible(true)
                                        setCurrent(item)
                                    }}
                                    avatar={<Avatar>{index + 1}</Avatar>}
                                    title={item.title}
                                ></Item.Meta>
                                <DeleteOutlined onClick={() => handleDelete(index, item)} className="text-danger float-right" />
                            </Item>
                        )}
                    ></List>
                </div>
            </div>

            <Modal
                title="Update Lesson"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <UpdateLessonForm
                    current={current}
                    setCurrent={setCurrent}
                    handleVideo={handleVideo}
                    handleUpdateLesson={handleUpdateLesson}
                    uploadVideoButtonText={uploadVideoButtonText}
                    progress={progress}
                    uploading={uploading}
                />
            </Modal>
        </InstructorRoute>
    )
}

export default CourseEdit