import React, { useState } from 'react'
import axios from 'axios'
import jsdom from 'jsdom'
import Link from 'next/link'
import { Card } from 'antd'

const Index = ({ results }) => {
    // let data = results.map(res => {
    //     let NewUrl = res.url.split('.com')
    //     return {
    //         title: res.title,
    //         url: NewUrl[1]

    //     }
    // }
    // )
    const [state, setState] = useState(results)
    return (
        <>
            <h1 className='jumbotron bg-primary square text-center'>Hello world</h1>
            <div className='container'>
                <div className='row'>

                    <div className='col-md-4'>
                        <Card>
                            <h3 className='text-center'>Result</h3>
                            {state ? state.map(res => (
                                <h1>
                                    <Link legacyBehavior href={res.url}>
                                        <a>{res.title}</a>
                                    </Link>
                                </h1>
                            )) : ""}
                        </Card>
                    </div>
                    <div className='col-md-4'>
                        {state ? state.map(res => (
                            <h1>
                                <Link legacyBehavior href={{pathname:'/data',query: { keyword: res.url },}}>
                                    <a>{res.title}</a>
                                </Link>
                            </h1>
                        )) : ""}

                    </div>
                    <div className='col-md-4'>
                        {state ? state.map(res => (
                            <h1>
                                <Link legacyBehavior href={res.url}>
                                    <a>{res.title}</a>
                                </Link>
                            </h1>
                        )) : ""}

                    </div>

                </div>
            </div>
        </>
    )
}

export default Index

export async function getServerSideProps(context) {

    let Results = []
    const response = await axios.get(`https://www.sarkariresult.com/`)
    const { JSDOM } = jsdom

    const { document } = (new JSDOM(response.data)).window;

    let data = document.getElementById("box1")
    data = data.querySelectorAll("a")
    for (var p of data) {
        let newUrl=p.href.split('.com/')
        Results.push({
            title: p.text,
            url: newUrl[1]
        })
    }

    return {
        props: { results: Results }, // will be passed to the page component as props
    }
}