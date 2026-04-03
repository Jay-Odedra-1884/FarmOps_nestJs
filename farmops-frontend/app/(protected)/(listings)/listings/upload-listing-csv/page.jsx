"use client"

import { MyHook } from '@/context/AppProvider';
import { uploadListingsCsv } from '@/services/listingApi';
import React from 'react'

function page() {
    const { authToken } = MyHook();

    function handleSubmit(e) {
        e.preventDefault();
        let file = e.target.file.files[0];
        uploadListingsCsv(authToken, file);

    }

  return (
    <div className='bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl bg-gray-50 rounded-lg shadow-md p-8'>
        <form onSubmit={handleSubmit} encType='multipart/form-data' className='flex flex-col gap-10'>
        <label className="block text-sm font-semibold text-gray-700">Upload CSV File</label>
        <input type="file" name='file' className='border px-4 py-4 rounded-sm shadow cursor-pointer bg-white hover:scale-105 transition-all duration-100 file:text-white file:bg-gray-400 file:px-2 file:py-1 file:rounded-sm' />
        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Upload CSV</button>
      </form>
      </div>
    </div>
  )
}

export default page
