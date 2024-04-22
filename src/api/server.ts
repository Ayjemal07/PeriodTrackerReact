export const server_calls = {

    getallPeriod: async (token: string) => { 
        const response = await fetch(`http://127.0.0.1:5000/api/cycles`,
        {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'x-access-token': token
            }

        });

        if (!response.ok){
            throw new Error('Failed to fetch data from the server')
        }

        return await response.json()
    },

    createPeriod: async (data: any = {},token: string) => {
        console.log(data)
        const response = await fetch(`http://127.0.0.1:5000/api/cycle`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'x-access-token': token
            },
            body: JSON.stringify(data)

        })

        if (!response.ok) {
            throw new Error('Failed to create new data on the server')
        }

        return await response.json()
    },

    updatePeriod: async (id: string, data:any = {},token: string) => {
        const response = await fetch(`http://127.0.0.1:5000/api/cycles/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'x-access-token': token
            },
            body: JSON.stringify(data)

        })

        if (!response.ok) {
            throw new Error('Failed to update data on the server')
        }

        return await response.json()
    },

    deletePeriod: async (id: string,token: string) => {
        const response = await fetch(`http://127.0.0.1:5000/api/cycles/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'x-access-token': token
            },

        })

        if (!response.ok) {
            throw new Error('Failed to delete data from the server')
        }

        return;
    },
}