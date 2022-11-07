import Link from 'next/link'

const UserNav = () => {
    return (
        <div className='nav flex-column nav-pills mt-2'>
            <Link legacyBehavior href='/user'>
                <a className='nav-link active'>DashBoard</a>
            </Link>
        </div>
    )
}

export default UserNav