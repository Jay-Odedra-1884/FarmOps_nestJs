export const getUserStats = async (authToken) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-stats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
    return response.json();
};

export const getFarmStats = async (authToken, farmId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm-stats/${farmId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });
    return response.json();
};