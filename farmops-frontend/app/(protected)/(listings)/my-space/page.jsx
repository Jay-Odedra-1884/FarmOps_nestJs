"use client"
import { MyHook } from '@/context/AppProvider';
import { deleteListing, getUserListings } from '@/services/listingApi';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { Spinner } from '@/components/ui/spinner';

function page() {

  const router = useRouter();
  const { authToken } = MyHook();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getListings = async (page = 1) => {
    // fetch user listings and display
    return await getUserListings(authToken, page)
  }

  //handle the delete listing
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure? you want to delete",
      text: "This Listing will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((res) => {
      if (res.isConfirmed) {
        deleteListing(authToken, id)
          .then((res) => console.log(res))
        //update the listing state by filtering out the deleted listing
        setListings((prev) => prev.filter(listing => listing.id !== id));

        Swal.fire(
          'Deleted!',
          'Your listing has been deleted.',
          'success'
        );
      }
    })
  }

  useEffect(() => {
    setLoading(true);
    if (authToken) {
      getListings(currentPage)
        .then((res) => {
          if (res.success) {
            setListings(res.data.data);
            setLastPage(res.data.last_page);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        })
    } else {
      router.push('/auth');
    }
  }, [authToken, currentPage])


  return (
    <div className='mt-5 px-20'>
      {/* <h1 className='text-3xl font-bold'>Dashboard</h1> */}
      <div className='flex justify-between mt-5 mb-5'>
        <p className='font-semibold text-2xl'>Your Blogs</p>
        <div className='bg-black text-white rounded-sm px-2 py-1 cursor-pointer hover:scale-110' onClick={() => router.push('/listings/add-listing')}>+ Add New Blog</div>
      </div>
      <hr />
      {loading ? (
        <div className='mt-20 w-full flex flex-col justify-center items-center'>
          <Spinner className="size-20 text-black" />
          <p>Please wait...</p>
        </div>
      ) : (
        <>
          {listings.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {
                  listings && listings.map((listing) => (
                    <Card key={listing.id} className="relative mx-auto my-3 w-full max-w-sm pt-0 overflow-hidden">
                      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                      <img
                        src={listing.image ? 'http://127.0.0.1:8000/storage/' + listing.image : 'http://127.0.0.1:8000/storage/placeholder.png'}
                        alt="Event cover"
                        className="relative z-20 aspect-video w-full object-cover dark:brightness-40"
                      />
                      <CardHeader>
                        <CardAction>
                          <Badge variant="secondary">{listing.category?.name || "Uncategorized"}</Badge>
                        </CardAction>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>
                          <div
                            dangerouslySetInnerHTML={{ __html: listing.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' }}
                          ></div>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className={'gap-2'}>
                        <Button onClick={() => router.push(`/listings/edit-listing/${listing.id}`)} className="w-1/2 bg-green-400">Edit</Button>
                        <Button onClick={() => handleDelete(listing.id)} className="w-1/2 bg-red-500">Delete</Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
              <div className='flex gap-4 w-full justify-center items-center mt-5 mb-10'>
                <div onClick={() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev)} className={`bg-black px-2 py-1 rounded-sm text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Prev</div>
                <div>{currentPage} of {lastPage}</div>
                <div onClick={() => setCurrentPage(prev => prev < lastPage ? prev + 1 : prev)} className={`bg-black px-2 py-1 rounded-sm text-white ${currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Next</div>
              </div>
            </>
          ) : (
            <div className='text-center mt-10'>No listings available.</div>
          )}
        </>
      )}
    </div>
  )
}

export default page
