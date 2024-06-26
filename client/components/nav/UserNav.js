import Link from 'next/link'
import { useEffect, useState } from 'react'

const UserNav = () => {
    const [current, setCurrent] = useState('')

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname)
        // console.log(window.location.pathname)
    }, [process.browser && window.location.pathname])
    return (
        <div className='nav flex-column nav-pills'>
            <Link legacyBehavior href='/user'>
                <a className={`nav-link ${current ==='/user' && "active"}`}>DashBoard</a>
            </Link>
        </div>
    )
}

export default UserNav