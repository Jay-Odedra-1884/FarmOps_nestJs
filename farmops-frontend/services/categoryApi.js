import toast from 'react-hot-toast';

export const getCategory = async (authToken) => {
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
             }
        });
        
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Failed to fetch categories");
        }
        return data;

    } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
        return [];
    }
}