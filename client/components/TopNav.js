import { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import axios from "axios"
import { toast } from 'react-toastify'
import { AppstoreAddOutlined, CarryOutOutlined, TeamOutlined, CoffeeOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'
import { Context } from '../context'
import { useRouter } from 'next/router'

const { Item, SubMenu, ItemGroup } = Menu //Menu.Item

const TopNav = () => {
    const router = useRouter()
    const [current, setCurrent] = useState('')

    const { state, dispatch } = useContext(Context)
    const { user } = state

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname)
        // console.log(window.location.pathname)
    }, [process.browser && window.location.pathname])

    const logOut = async () => {
        dispatch({ type: "LOGOUT" })
        window.localStorage.removeItem('user')
        const { data } = await axios.get('/api/logout')
        toast.success(data.message)
        router.push("/login")
    }

    return (
        <Menu mode='horizontal' selectedKeys={[current]} >
            {/* <div className='flex-box d-flex justify-content-end'> */}
            <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreAddOutlined />}
            >
                <Link legacyBehavior href='/'>
                    <a>App</a>
                </Link>
            </Item>

            {user === null && (
                <>
                    <Item
                        key="/login"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<LoginOutlined />}
                    >
                        <Link legacyBehavior
                            href='/login'>
                            <a>Login</a>
                        </Link>
                    </Item>
                    <Item
                        key="/register"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<UserAddOutlined />}
                    >
                        <Link legacyBehavior
                            href='/register'>
                            <a>Register</a>
                        </Link>
                    </Item>
                </>
            )}

            {user && user.role && user.role.includes("Instructor") ?
                <Item
                    key="/instructor/course/create"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<CarryOutOutlined />}
                >
                    <Link legacyBehavior
                        href='/instructor/course/create'>
                        <a>Create Course</a>
                    </Link>
                </Item>
                :
                <Item
                    key="/user/become-instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                >
                    <Link legacyBehavior
                        href='/user/become-instructor'>
                        <a>Become Instructor</a>
                    </Link>
                </Item>
            }
            {user && user.role && user.role.includes("Instructor") && (
                <Item
                    key="/instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                >
                    <Link legacyBehavior
                        href='/instructor'>
                        <a>Instructor</a>
                    </Link>
                </Item>
            )}
            {user !== null && (
                <SubMenu
                    icon={<CoffeeOutlined />}
                    title={user && user.name}
                    className="float-right"
                    style={{ position: "absolute", right: "2rem" }}
                >
                    <ItemGroup className='float-right'>
                        <Item
                            key="/user"
                            onClick={(e) => setCurrent(e.key)}
                            icon={<UserAddOutlined />}
                        >
                            <Link legacyBehavior
                                href='/user'>
                                <a>DashBoard</a>
                            </Link>
                        </Item>
                        <Item
                            onClick={logOut}
                            icon={<LogoutOutlined />}
                            style={{ "float": "end" }}
                        >
                            Logout
                        </Item>
                    </ItemGroup>
                </SubMenu>
            )}
            {/* </div> */}
        </Menu>
    )
}

export default TopNav