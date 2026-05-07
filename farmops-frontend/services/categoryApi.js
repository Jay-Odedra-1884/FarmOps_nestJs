import toast from 'react-hot-toast';

export const getCategory = async (authToken) => {
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
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

export const addCategory = async (authToken, formData) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
             },
             body: JSON.stringify({
                name: formData.get('name')
             })
        });
        
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || "Failed to add category");
        }
        return data;

    } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category");
        return [];
    }
}
