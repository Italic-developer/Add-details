"use client"

import { useEffect , useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {

  type FormData= {
    nameOfDetail: string,
    detail: string
  }
  

  interface User{
    _id: string;
    nameOfDetail: string;
    detail: string;
    // Add other properties as needed
  }
  
  // Update the state type
  const [users, setUsers] = useState<User[]>([]);
  const {register, handleSubmit, watch, formState: { errors }} = useForm<FormData>()
   const onSubmit = async(data:FormData) => {
    try {
      const response = await fetch("http://localhost:4000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nameOfDetail: data.nameOfDetail,
          detail: data.detail
        })
      });
  
      if (response.ok) {
        toast.success("Data submitted successfully");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the data");
    }
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
       <input type="text" placeholder='Your Name' {...register("nameOfDetail", {required:true})} />
       {errors.nameOfDetail && <span>This field is required</span>}
       <input type="text" placeholder='Your Age' {...register("detail" , {required:true})} />
       {errors.detail && <span>This field is required</span>}
      
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
                <p>Name: {user.nameOfDetail}</p>
                <p>Age: {user.detail}</p>
                <hr /> 
              </div>
            ))}
          </div>
        )}
        {users === null || users.length === 0 && <span>no users</span>}
        </div>
    );
  }}



