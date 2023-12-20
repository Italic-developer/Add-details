"use client"

import { Router, useRouter } from "next/router";
import { useEffect , useState } from "react";
import { SubmitHandler, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  
  interface data {
    name: string,
    age: number
  }

    const [users , setUsers] = useState([])

  const {register, handleSubmit, watch, formState: { errors }} = useForm()
  async function onSubmit<SubmitHandler>( data:data){ 
    console.log(data.name)
  
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "name": "patrick", //data.name,
  "age":  12 //data.age
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};

 await fetch(" http://localhost:4000/api/post", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => {
    console.log('error', error)
   toast.error("An error occurred while processing the response")
  });
  }

    useEffect( 
      ()=>{
        async function fetchdata() {
          fetch("http://localhost:4000/api/getall")
          .then(response => response.json())
          .then(result => {console.log(result)
           setUsers(result) 
          })
          .catch(error => console.log('error', error));
      }
       fetchdata();
    } , [])

  return (
    <div className='bg-white relative'>  
      <div><Toaster/></div> 
     <h1 className='text-center text-slate-950 mt-10'> Put Your Random Details</h1>
     <form onSubmit={handleSubmit(onSubmit)}>
       <input type="text" placeholder='Your Name' {...register("name")} />
       {errors.name && <span>This field is required</span>}
       <input type="text" placeholder='Your Age' {...register("age" , {required:true})} />
       {errors.age && <span>This field is required</span>}
      
       <button>Submit</button>
     </form>
     <button className="text-blue-600 bg-slate-100 absolute  p-10 rounded-full shadow-xltop-7 right-7 " onClick={()=>{  }}>↺</button>
     
  <DisplayData/>
  
         </div>
  )
  function DisplayData() {
    return (
      <div>
        {users != null && users.length > 0 && (
          <div>
            {users.map((user) => (
              <div key={user._id} className="flex flex-row gap-x-6">
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
                <hr /> {/* Optional: Separator between items */}
              </div>
            ))}
          </div>
        )}
        {users === null || users.length === 0 && <span>no users</span>}
        </div>
    );
  }}



