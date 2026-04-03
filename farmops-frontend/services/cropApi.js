import toast from "react-hot-toast";

export const getCrop = async (authToken, farmId) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/crops?farm_id=${farmId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

export const addCrop = async (authToken, cropData) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/crops`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(cropData)
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Crop added successfully");
        } else {
            toast.error(data.message || "Failed to add crop");
        }
        return data;
    } catch (error) {
        toast.error("Failed to add crop");
    }
}

export const updateCrop = async (authToken, cropData, cropId) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/crops/${cropId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(cropData)
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Crop updated successfully");
        } else {
            toast.error(data.message || "Failed to update crop");
        }
        return data;
    } catch (error) {
        toast.error("Failed to update crop");
    }
}

export const deleteCrop = async (authToken, cropId) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/crops/${cropId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Crop deleted successfully");
        } else {
            toast.error(data.message || "Failed to delete crop");
        }
        return data;
    } catch (error) {
        toast.error("Failed to delete crop");
    }
}