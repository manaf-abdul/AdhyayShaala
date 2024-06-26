import { useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from "next/router"
import { SyncOutlined } from '@ant-design/icons'
import InstructorNav from "../nav/InstructorNav"

const Instructorroute = ({ children }) => {
    const router = useRouter()

    const [ok, setOk] = useState(false)

    const fetchInstructor = async () => {
        try {
            const { data } = await axios.get("/api/current-instructor")
            console.log("data", data)
            if (data.ok) setOk(true)
        } catch (error) {
            console.log(error)
            setOk(false)
            router.push('/')
        }
    }

    useEffect(() => {
        fetchInstructor()
    }, [])

    return (
        <>
            {!ok ?
                <SyncOutlined
                    spin
                    className="d-flex justify-content-center display-1 text-primary p-5"
                />
                :
                <>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <InstructorNav/>
                            </div>
                            <div className="col-md-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </>

            }
        </>
    )
}

export default Instructorroute