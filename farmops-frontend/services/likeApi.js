import toast from "react-hot-toast";

export const toggleLikes = async (authToken, listingId) => {
    try {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/likes", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                listing_id: listingId,
            }),
        })
        const responseData = await res.json();
        if (responseData.status) {
            toast.success(responseData.message);
            return responseData;
        } else {
            toast.error(responseData.message || "Failed to like");
            return null;
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        toast.error("Failed to toggle like");
        return null;
    }
}