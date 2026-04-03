"use client"

import RichTextEditor from '@/components/RichTextEditor';
import { Spinner } from '@/components/ui/spinner';
import { MyHook } from '@/context/AppProvider';
import { getCategory } from '@/services/categoryApi';
import { getListingById, updateListing } from '@/services/listingApi';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

function page() {
  const { id } = useParams();
  const { authToken } = MyHook();
  const editorRef = useRef(null);
  // State variables for form fields which will update on change of fields
  const [categories, setCategories] = useState([]);
  const [listing, setListing] = useState(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();


  const [previewUrl, setPreviewUrl] = useState(null);

  //gte the category from db to show the all option to user
  const getCategories = async () => {
    const res = await getCategory(authToken);
    setCategories(res.data);

  }


  //get the listing by id to show the old data in form which user need to update
  useEffect(() => {
    if (listing) {
      setTitle(listing.title || '');
      setCategoryId(listing.category_id || '');
      if (editorRef.current) {
        editorRef.current.commands.setContent(listing.description || "");
      }
    }
  }, [listing])

  // build preview URL: selected file preview or existing listing image
  useEffect(() => {
    // If a new file is selected, show its preview
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // Otherwise, show existing image from listing if available
    if (listing && listing.image) {
      const imagePath = listing.image;
      setPreviewUrl(`http://127.0.0.1:8000/storage/${imagePath}`);
      return;
    }

    setPreviewUrl(null);
  }, [imageFile, listing]);

  //fetch the listing data by id and categories for dropdown
  useEffect(() => {
    setLoading(true);
    getListingById(authToken, id)
      .then((data) => {
        setListing(data.data);
      })
      .finally(() => {
        setLoading(false);
      })
    getCategories();
  }, [authToken]);


  //handle form submit to update the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorRef.current) return;

    const description = editorRef.current.getHTML();
    // Build FormData for update (use _method=PUT for Laravel file upload)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    // include _method override for PUT
    formData.append('_method', 'PUT');
    if (imageFile) formData.append('image', imageFile);

    console.log('Submitting update for listing', id, Object.fromEntries(formData.entries()));

    const result = await updateListing(authToken, id, formData);
    if (result) {
      router.push('/listings');
    } else {
      toast.error("Failed to update listing. Please check the form data.");
    }
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Spinner className="size-20 text-black" />
        </div>
      ) : (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Listing</h1>

            <form encType='multipart/form-data' onSubmit={handleSubmit} className="space-y-6">

              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name='title'
                  placeholder='Enter listing title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <RichTextEditor editorRef={editorRef} />
                {/* Hidden input to store TipTap content */}
                <input type="hidden" name="description" />
              </div>


              {/* category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name='category_id'
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {categories && categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {/* previe image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Image</label>
                {previewUrl ? (
                  <img src={previewUrl} alt="Listing Image" className="w-full h-48 object-cover rounded-md mb-2" />
                ) :
                  <p>No current image available</p>}
              </div>
              {/* Image Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>
                <input
                  type="file"
                  name='image'
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type='submit'
                  className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Submit
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default page
