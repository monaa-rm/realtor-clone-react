import { getAuth, updateProfile } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import { FcHome } from "react-icons/fc"
import { Link } from 'react-router-dom'
import LisitingItem from './LisitingItem'



const Profile = () => {

  const navigate = useNavigate()
  const auth = getAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const { name, email } = formData
  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }
  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (auth.currentUser.displayName !== name) {
        //update displayname in firebase authentication
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        //update name in firestore authentication
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
      }
      toast.success("Profile details updates")
    } catch (error) {
      toast.error("Could not update the profile details")
    }
  }


  useEffect(() => {
    async function fetchUserListings() {

      const listingRef = collection(db, "listings")
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      let querySnap = await getDocs(q);
      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onDelete= async (id) => {
    if(window.confirm('Are you sure you want to delete?')){
      await deleteDoc(doc(db,"listings",id))
      const updatedlistings = listings.filter((listing)=> listing.id !== id)
      setListings(updatedlistings)
      toast.success("Successfully deleted the listing")
    }
  }
  const onEdit= (id) => {
    navigate(`/edit-listing/${id}`)
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>

        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input type="text" id='name'
              value={name}
              disabled={!changeDetails}
              onChange={onChange}
              className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 
        rounded bg-white border border-gray-300 transition ease-in-out ${changeDetails && "bg-red-200 focus:bg-red-200"}`}
            />

            <input type="text" id='email'
              value={email}
              disabled
              onChange={onChange}
              className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 
        rounded bg-white border border-gray-300 transition ease-in-out `}
            />

            <div className='flex justify-between whitespace-nowrap text-xs sm:text-lg mb-6'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span onClick={(e) => {
                  changeDetails && onSubmit(e)
                  setChangeDetails(prev => !prev)
                }}
                  className='text-red-300 hover:text-red-700 
                  transition ease-in-out duration-200 ml-1 cursor-pointer'>
                  {changeDetails ? "Apply change" : " Edit"}
                </span>
              </p>
              <p onClick={onLogOut} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>Sign out</p>
            </div>

          </form>
          <button type='submit' className='w-full bg-blue-600 text-white uppercase 
          px-3 py-3 text-sm font-medium rounded shadow-md transition duration-150 ease-in-out
          hover:bg-blue-700 hover:shadow-lg active:bg-blue-800
          '>
            <Link to="/create-listing" className='flex justify-center items-center' >
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2' />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl mt-3 mb-6 text-center font-semibold'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listings.map((listing) => {

                return (
                  <LisitingItem
                  key={listing.id}
                   id={listing.id} 
                   listing={listing.data}
                   onDelete={()=> onDelete(listing.id)}
                   onEdit={()=> onEdit(listing.id)}
                   />
                )
              })}
            </ul>
          </>
        )}
      </div>
    </>
  )
}

export default Profile
