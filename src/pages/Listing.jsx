import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import Spinner from '../components/Spinner'
import { db } from '../firebase'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper'
import { FaShare, FaBed, FaBath, FaMapMarkerAlt, FaParking, FaChair } from 'react-icons/fa'
import { getAuth } from 'firebase/auth'
import 'swiper/css/bundle';
import Contact from './Contact'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const Listing = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [contactLandLord, setContactLandLord] = useState(false)
  const params = useParams()
  const auth = getAuth()
  SwiperCore.use(Autoplay, Navigation, Pagination)
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)

      }
    }
    fetchListing()

  }, [params.id])
  if (loading) {
    return <Spinner />
  }
  return (
    <main>

      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div className='w-full  h-[350px]'
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover"
                }}>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className="fixed top-[13%] right-[3%] z-10 bg-white 
      cursor-pointer border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)
        }}
      >
        <FaShare className='text-lg text-slate-500' />
      </div>
      {shareLinkCopied && (
        <p
          className='fixed top-[23%] right-[5%] z-10 font-semibold border-2 border-gray-400 rounded-md bg-white'>
          Link Copied
        </p>
      )}
      <div className="md:flex  m-4 p-4 overflow-x-hidden bg-white ">
        <div className="w-full p-3 max-w-5xl border-3 shadow-lg ">
          <p className='text-2xl font-bold mb-3 text-blue-900 '>
            {listing.name} - $ {listing.offer ? listing.discountedPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className='flex items-center mt-6 mb-3 font-semibold '>
            <FaMapMarkerAlt className='text-green-700 overflow-x-hidden ' />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%] ">
            <p className='bg-red-800 w-full p-1 max-w-[200px] rounded-md text-white text-center font-semibold shadow-md '>
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className='w-full max-w-[200px] p-1 bg-green-800 rounded-md text-white text-center font-semibold shadow-md '>
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className='mt-3 mb-3 '>
            <span className='font-semibold '> Desceription -</span>
            {listing.description}
          </p>
          <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6'>
            <li className='flex justify-start items-center whitespace-nowrap  '>
              <FaBed className='text-lg mr-1' />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className='flex justify-start items-center whitespace-nowrap  '>
              <FaBath className='text-lg mr-1' />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className='flex justify-start items-center whitespace-nowrap  '>
              <FaParking className='text-lg mr-1' />
              {+listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className='flex justify-start items-center whitespace-nowrap  '>
              <FaChair className='text-lg mr-1' />
              {+listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setContactLandLord(true)}
                className='px-7 py-3 bg-blue-600 text-white font-medium text-sm 
           uppercase rounded shadow-md w-full sm:max-w-[50%] text-center transition duration-150 ease-in-out
           hover:bg-blue-700 hover:shadow-lg 
           focus:bg-blue-700 focus:shadow-lg
           ' >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandLord && (
            <Contact
              userRef={listing.userRef}
              listing={listing}
            />
          )}

        </div>
        {listing.latitude && listing.longitude && (
          <div className='w-full max-w-5xl h-[300px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2'>
            <MapContainer center={[listing.latitude , listing.longitude]} 
            zoom={13} scrollWheelZoom={false}
            style={{width: "100%" , height: "100%"}}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[listing.latitude , listing.longitude]}>
                <Popup>
                  {listing.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </main>
  )
}

export default Listing
