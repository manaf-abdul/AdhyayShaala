import Link from 'next/link'
import jsdom from 'jsdom'
import axios from 'axios'


const Index = () => {


  return (
    <div>Index</div>
  )
}

export default Index

export const getServerSideProps = async (context) => {
    const id = context.query;
    console.log(id)
    let Results = []
    const response = await axios.get(`https://www.sarkariresult.com/${id.keyword}`)
    const { JSDOM } = jsdom

    const { document } = (new JSDOM(response.data)).window;

    let data=document.querySelectorAll("table td h2 table tbody tr td h2")
    

   
    // let data = document.getElementById("tbody")
    // data=data.querySelectorAll("td")
    // data = data.forEach(
    //   querySelector('tr').textContent
    // )
    // data=data.querySelector('tr').textContent
    for (var p of data) {
        let newUrl=p.textContent
        Results.push({
            title: newUrl,
        })
    }
    console.log(data)

    console.log(Results)

 return {
  props: { }, // will be passed to the page component as props
}
  
};