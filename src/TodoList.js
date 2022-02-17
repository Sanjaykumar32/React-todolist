import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import { nanoid } from "nanoid";
import axios from "axios"

export default function TodoList() {
  const [name, setname] = useState("");
  const [amount, setamount] = useState("");
  const [details, setdetails] = useState([])
  const [id, setid] = useState(nanoid())
  const [updateid, setupdateid] = useState("")


  useEffect(async () => {
    try {
      const viewdata = await axios.get("http://localhost:8000/getdata")
      setdetails(viewdata.data)
    } catch (error) {
      console.log(error);  
    }

  }, [])

 
  
  const HandalClick = async (e) => {
    setid(nanoid())

    if (name != "" && amount != "") {
    try {
      await axios.post("http://localhost:8000/postData", {
        name,
        amount,
        id,
      })
    } catch (error) {
      console.log(error)
    }
    const Alldata = { name: name, amount: amount, id: id }
    setname("");
    setamount('');
   
      setdetails((el) => {
        return [...el, Alldata]
      })
  } 
}

  

  const DeleteHandle =  async (elid) => {
    try {
      await axios.delete("http://localhost:8000/deleteData" , {data : {elid:elid}} )
    } catch (error) {
       console.log(error)
    }    
    
    const alldata = details.filter((el) => elid != el.id)
      setdetails(alldata)
  }
  
  


  const EditHandle =   (id) => {
      setupdateid(id)
  }
  
  const  EditClick = async (id)=>{
    await axios.post("http://localhost:8000/updatenew" , {
      name,
      amount,
      id,
  }).then((res)=>{
    setdetails(res.data)
    setname("");
    setamount("");
  }).catch((err)=>{
  console.log(err);
  })
}

     
 
  return (
    <>
      <div className='d-flex justify-content-center mt-5' width=""  >
        <div >
          <input type="text"
            placeholder='Name'
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="form-control"
            id="Editname"
          />
        </div>
        &nbsp; &nbsp;
        <div>
          <input type="text"
            placeholder='Amount'
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            className="form-control"
            id="Editamount"
          />

        </div>
        &nbsp;  &nbsp; &nbsp;
        <Button id="Editbtn" onClick={() => HandalClick()} variant="success">Save Data</Button>{' '}
        &nbsp; &nbsp;
        <Button id="Editupdate" onClick={() => EditClick(updateid)} variant="success">Upadate Data</Button>{' '}
      </div>
     <div><h4 style={{color: "red"}} className="text-center">{}</h4></div>

      <div className='mt-5 d-flex justify-content-center'>
        <table width="75%" border="1px solid">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {details.map((el) => {
              return <tr key={el.id}>
                <td>{el.name}</td>
                <td>{el.amount}</td>
                <td className='d-flex justify-content-center'>
                  <Button className="m-0" onClick={() => DeleteHandle(el.id)} variant="danger">Delete Data</Button>{' '}
                  &nbsp; &nbsp;
                  <Button id="Updatebtn" className="m-0" onClick={() => EditHandle(el.id)} variant="success">Edit Data</Button>{' '}
                </td>
              </tr>
            })} 
          </tbody>
        </table>
      </div>
    </>
  )
}
