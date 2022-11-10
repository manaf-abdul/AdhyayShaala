import { createContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
//initial state

const initialState = {
    user: null
}

//create context

const Context = createContext()

//rootReducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null }
        default:
            return state;
    }
}

//context provider

const Provider = ({ children }) => {

    const router = useRouter()

    const [state, dispatch] = useReducer(rootReducer, initialState)

    useEffect(() => {
        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem('user'))
        })
    }, [])

    axios.interceptors.response.use(
        function (response) {
            //any status code that lie within range of 200 cause this functio
            //trigger
            return response
        }, function (error) {
            //anu=y status code that falls outside the range of 
            // 200 cause this function to trigger
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryrequest) {
                return new Promise((resolve, reject) => {
                    axios.get('/api/logout')
                        .then((data) => {
                            console.log('401 error>logout');
                            dispatch({ type: "LOGOUT" })
                            window.localStorage.removeItem('user')
                            router.push('/login')
                        })
                        .catch((err) => {
                            console.log("axios interceptors error", err)
                            reject(error)
                        })
                })
            }
            return Promise.reject(error)
        }
    )
    
    const getCsrfToken = async () => {
        const { data } = await axios.get('/api/csrf-token')
        axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken
    }
    
    useEffect(() => {
        // getCsrfToken()
    }, [])

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )

}

export { Context, Provider }