import toast from 'react-hot-toast';

export const getListings = async (authToken, page) => {
    try {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/listings?page=" + page, {
            method: "GET",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
            }
        });
        return await data.json();
    } catch (e) {
        console.error("Error fetching listings:", e);
        toast.error("Failed to fetch listings");
        return null;
    }
}

export const getUserListings = async (authToken, page = 1) => {
    try {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user-listings?page=" + page, {
            method: "GET",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
            }
        });
        return await data.json();
    } catch (error) {
        console.error("Error fetching user listings:", error);
        toast.error("Failed to fetch your listings");
    }
}

export const addListing = async (authToken, listingData) => {
    try {
        const loadingToast = toast.loading("Adding listing...");
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/listings", {
            method: "POST",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: listingData,
        })

        const responseData = await res.json();
        
        if(res.ok) {
            console.log("Listing added successfully:", responseData);
            toast.dismiss(loadingToast);
            toast.success("Listing added successfully!");
            return responseData;
        } else {
            toast.dismiss(loadingToast);
            toast.error(responseData.message || "Failed to add listing");
            console.error("Failed to add listing:", responseData);
            return null;
        }
    } catch (error) {
        toast.error("Error adding listing");
        console.error("Error adding listing:", error);
        return null;
    }
}

export const getListingById = async (authToken, id) => {
    try {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/listings/' + id, {
            method: "GET",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json"
            }
        })
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Failed to fetch listing");
        }
        return data;
    } catch (error) {
        console.error("Error fetching listing by ID:", error);
        toast.error("Failed to fetch listing details");
        return null;
    }
}

export const updateListing = async (authToken, id, listingData) => {
    try {
        const loadingToast = toast.loading("Updating listing...");
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/listings/${id}`, {
            method: 'POST', // use POST with _method=PUT for file uploads
            credentials: 'include',
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: listingData,
        });

        console.log(res);
        
        const responseData = await res.json();
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Listing updated successfully!");
            return responseData;
        }
        toast.dismiss(loadingToast);
        toast.error(responseData.message || "Failed to update listing");
        console.error('Failed to update listing:', responseData);
        return null;
    } catch (error) {
        toast.error("Error updating listing");
        console.error('Error updating listing:', error);
        return null;
    }
}


export const deleteListing = async (authToken, id) => {
    try {
        const loadingToast = toast.loading("Deleting listing...");
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/listings/' + id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json"
            }
        })
        const responseData = await res.json();
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Listing deleted successfully!");
        } else {
            toast.dismiss(loadingToast);
            toast.error(responseData.message || "Failed to delete listing");
        }
        return responseData;
    } catch (error) {
        toast.error("Error deleting listing");
        console.error("Error deleting listing:", error);
        return null;
    }
}


//upload listing using csv file
export const uploadListingsCsv = async (authToken, file) => {
    try {
        const loadingToast = toast.loading("Uploading CSV...");
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/upload-listings-csv", {
            method: "POST",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
        })
        const responseData = await res.json();
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Listings uploaded successfully!");
        } else {
            toast.dismiss(loadingToast);
            toast.error(responseData.message || "Failed to upload listings");
        }
        return responseData;
    } catch (error) {
        toast.error("Error uploading listings CSV");
        console.error("Error uploading listings CSV:", error);
        return null;
    }
}