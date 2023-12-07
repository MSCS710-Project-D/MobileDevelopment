import axios from 'axios';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"

export const fetchRestaurants = async () => {
    try {
        const response = await axios.get(`${base_url}/restaurant`);
        return response.data;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
};

export const addRestaurant = async (restaurant) => {
    try {
        const response = await axios.post(`${base_url}/restaurant/create`, restaurant);
        return response.data;
    } catch (error) {
        console.error("Error adding restaurant:", error);
        return [];
    }
}

export const updateRestaurant = async (restaurant) => {
    try {
        const response = await axios.put(`${base_url}/restaurant/update/${restaurant._id}`, restaurant);
        return response.data;
    } catch (error) {
        console.error("Error updating restaurant:", error);
        return [];
    }
}

export const deleteRestaurant = async (restaurantId) => {
    try {
        const response = await axios.delete(`${base_url}/restaurant/delete/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return [];
    }
}
