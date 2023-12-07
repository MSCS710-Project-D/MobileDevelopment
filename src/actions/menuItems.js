
import axios from 'axios';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api";

const fetchMenuItems = async (restaurantId) => {
    try {
        const response = await axios.get(`${base_url}/menuItems/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return [];
    }
};

export { fetchMenuItems };
