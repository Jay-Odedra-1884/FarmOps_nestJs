export const getFarms = async (authToken) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    
    return await res.json()
}

export const getFarmById = async (authToken, farmId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    
    return await res.json()
}


export const addFarm = async (authToken, farmData) => {
    console.log(farmData.get('farmName'));
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            name: farmData.get('farmName'),
            location: farmData.get('farmLocation')||null,
            size: farmData.get('farmSize')||null
        })
    })
    return await res.json()
} 

export const updateFarm = async (authToken, farmId, farmData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(farmData)
    })
    return await res.json()
} 

export const deleteFarm = async (authToken, farmId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    })
    return await res.json()
} 

