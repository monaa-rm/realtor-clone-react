import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { db } from '../firebase'
import LisitingItem from './LisitingItem'

const Offers = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchListing, setLastFetchListing] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        const ListingRef = collection(db, "listings")
        const q = query(ListingRef, where("offer", "==", true),
          orderBy("timestamp", "desc"), limit(8))

        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchListing(lastVisible)
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listing")
      }
    }

    fetchListings()

  }, [])

  async function onFetchMoreListings() {
    try {
      const ListingRef = collection(db, "listings")
      const q = query(ListingRef, where("offer", "==", true),
        orderBy("timestamp", "desc"),startAfter(lastFetchListing), limit(4))

      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchListing(lastVisible)
      const listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error("Could not fetch listing")
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 ">
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' >
              {
                listings.map((listing) => (
                  <LisitingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))
              }
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex justify-center items-center ">
              <button type='button' onClick={onFetchMoreListings}
                className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6
            hover:border-slate-600 rounded transition duration-150 ease-in-out
            '
              >Load more</button>
            </div>
          )}
        </>
      ) : (
        <p>There is no current offers</p>
      )
      }
    </div>
  )
}

export default Offers
