import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase'

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null)
  const [message , setMessage] = useState("")
  useEffect(() => {
    async function getLordLand() {
      const docRef = doc(db, "users", userRef)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error('Could not get landlord data')
      }
    }
    getLordLand()
  }, [userRef])
  function onChange(e){
    setMessage(e.target.value)
  }
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full mt-6 ">
          <p className=''>
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea name='message' id='message' rows="2" value={message}
            className="w-full px-4 py-2 text-xl text-gray-700 border-gray-300 rounded
            transition duration-150 ease-in-out 
            focus:text-gray-700 focus:bg-white focus:border-slate-600 
            " 
            onChange={onChange}
            ></textarea>
          </div>
          <a href={`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}>
          {/* <a href="mailto:info@w3docs.com?cc=secondemail@example.com, anotheremail@example.com, &bcc=lastemail@example.com&subject=Mail from our Website&body=Dear W3docs Team"> */}
          <button type='button'
          className='py-3 px-7 mb-6 bg-blue-600 text-white rounded text-sm uppercase shadow-md transition duration-150 ease-in-out  
          hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-700 active:shadow-lg 
          '
          >
            Send Message
          </button>            
          </a>

        </div>

      )}
    </>
  )
}

export default Contact
