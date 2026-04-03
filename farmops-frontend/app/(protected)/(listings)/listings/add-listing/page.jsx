"use client"

import RichTextEditor from '@/components/RichTextEditor'
import { MyHook } from '@/context/AppProvider';
import { getCategory } from '@/services/categoryApi';
import { addListing } from '@/services/listingApi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'

function page() {
  const { authToken } = MyHook();
  const editorRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState({});

  const router = useRouter();


  const getCategories = async () => {
    const res = await getCategory(authToken);
    setCategories(res.data);

  }

  useEffect(() => {
    getCategories();
  }, [authToken]);

  // build preview URL: selected file preview or existing listing image
  useEffect(() => {
    // If a new file is selected, show its preview
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // No selected file -> clear preview
    setPreviewUrl(null);
  }, [imageFile]);

  const validateForm = (data) => {
    let newErrors = {};
    
    if (!data.get('title')) {
      newErrors.title = 'Title is required';
    }
    if(data.get('title') && data.get('title')?.length < 3 || data.get('title')?.length > 100){
      newErrors.title = 'Title must be at least 3 to 100 characters long';
    }
    if(data.get('title') && /^[0-9]+$/.test(data.get('title'))) {
      newErrors.title = 'Title must not be a number';
    }
    if (!data.get('description')) {
      newErrors.description = 'Description is required';
    }
    if (!data.get('category_id')) {
      newErrors.category_id = 'Category is required';
    }
    if(data.get('image') && !(["image/jpeg", "image/png", "image/webp"].includes(data.get('image')?.type))) {
      newErrors.image = 'Image must be a valid image file';
    }
    
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editorRef.current) {
      // Get the HTML content from TipTap editor
      const description = editorRef.current.getHTML();
      // Set the value of the hidden input to the editor content
      document.querySelector('input[name="description"]').value = description;

      // Log form data for debugging
      const formData = new FormData(e.target);
      if(!validateForm(formData)) return;

      const result = await addListing(authToken, formData);
      if (result) {
        e.target.reset();
        router.push('/listings');
      }
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
        <div className='flex justify-between items-center'>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Listing</h1>
          <div onClick={() => router.push('upload-listing-csv')} className='bg-black text-white px-2 py-1 rounded-sm cursor-pointer'>Import From CSV</div>
        </div>

        <form encType='multipart/form-data' onSubmit={handleSubmit} className="space-y-6">

          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name='title'
              placeholder='Enter listing title'
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
            {error.title && <p className="text-red-500 text-sm mt-2">{error.title}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <RichTextEditor editorRef={editorRef} />
            {/* Hidden input to store TipTap content */}
            <input type="hidden" name="description" />
            {error.description && <p className="text-red-500 text-sm mt-2">{error.description}</p>}
          </div>


          {/* category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              name='category_id'
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {categories && categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {error.category_id && <p className="text-red-500 text-sm mt-2">{error.category_id}</p>}
          </div>
          {/* previe image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Image</label>
            {previewUrl ? (
              <img src={previewUrl} alt="Listing Image" className="w-full h-48 object-cover rounded-md mb-2" />
            ) :
              <p>Choose Image (preview will appear here)</p>}
          </div>

          {/* Image Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>
            <input
              type="file"
              name='image'
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300"
            />
            {error.image && <p className="text-red-500 text-sm mt-2">{error.image}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type='submit'
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Submit
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default page
