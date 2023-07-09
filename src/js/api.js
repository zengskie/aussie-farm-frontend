const API_BASE_URL = 'https://aussiefarm.local/api/v1'; // Replace with your API base URL

const getItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/kangaroos`);

        if (response.ok) {
            const items = await response.json();
            return items.data;
        } else {
            throw new Error('Error fetching todos');
        }
    } catch (error) {
        throw error;
    }
};

export { getItems };