import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { toast } from 'react-toastify'
import { getAuth ,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router';

const OAuth = () => {
const navigate = useNavigate()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth , provider)
      const user = result.user
      // check exist user
      const docRef = doc(db, "users" , user.uid)
      const docSnap = await getDoc(docRef)
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name : user.displayName,
          email : user.email,
          timestamp : serverTimestamp()
        })
      }
      navigate('/')
    } catch (error) {
      toast.error("Could not authorize with google")
      console.log(error)
    }
  }


  return (
    <div>
      <button type="button" onClick={onGoogleClick}
      className='flex items-center justify-center w-full bg-red-700 
      text-white px-7 py-3 uppercase text-sm font-mediumshadow-md rounded
      hover:bg-red-800
      hover:shadow-lg
      active:bg-red-900
      active:shadow-lg
      transition duration-150 ease-in-out
      '>
        <FcGoogle className='text-2xl  bg-white rounded-full mr-2' />
        Continue with google
      </button>
    </div>
  )
}

export default OAuth
