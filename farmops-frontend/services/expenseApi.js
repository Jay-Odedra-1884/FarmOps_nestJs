import toast from "react-hot-toast";

export const getExpenseCategories = async (authToken) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses-categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        
        return await res.json();
    } catch (error) {
        console.error(error);
    } 
};

export const addExpense = async (authToken, expenseData) => {
    try {
        console.log(expenseData);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(expenseData),
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Transaction added successfully!");
        } else {
            const firstError = data.errors
                ? Object.values(data.errors)[0][0]
                : data.message;
            toast.error(firstError || "Failed to add transaction");
        }
        return data;
    } catch (error) {
        toast.error("Failed to add transaction");
        console.error(error);
    }
};

export const getAllExpenses = async (authToken, page = 1, filter = {}) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-expenses?page=${page}&${new URLSearchParams(filter)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const getExpensesByFarm = async (authToken, farmId, page = 1, filter = {}) => {
    try {
        const params = new URLSearchParams({ farm_id: farmId, page, ...filter });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const updateExpense = async (authToken, id, data) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
            toast.success("Transaction updated!");
        } else {
            const firstError = json.errors
                ? Object.values(json.errors)[0][0]
                : json.message;
            toast.error(firstError || "Failed to update transaction");
        }
        return json;
    } catch (error) {
        toast.error("Failed to update transaction");
        console.error(error);
    }
};

export const deleteExpense = async (authToken, id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        const json = await res.json();
        if (json.success) {
            toast.success("Transaction deleted!");
        } else {
            toast.error(json.message || "Failed to delete transaction");
        }
        return json;
    } catch (error) {
        toast.error("Failed to delete transaction");
        console.error(error);
    }
};

export const addExpenseCategory = async (authToken, name) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses-categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Category added!");
        } else {
            const firstError = data.errors
                ? Object.values(data.errors)[0][0]
                : data.message;
            toast.error(firstError || "Failed to add category");
        }
        return data;
    } catch (error) {
        toast.error("Failed to add category");
        console.error(error);
    }
};
