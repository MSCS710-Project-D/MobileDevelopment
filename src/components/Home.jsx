// Home.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';
import MenuModal from './MenuModal';
import { fetchMenuItems } from '../actions/menuItems.js';
import ChatBot from '../components/ChatBot'; // Import the ChatBot component
import FoodSuggestionModal from '../components/FoodSuggestionModal'; // Use .js if the file is a JavaScript file
import { isMobileDevice } from '../utils.js';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [isChatBotVisible, setIsChatBotVisible] = useState(false); // State to control chatbot visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use useSelector to access the user from the Redux store
    const user = useSelector((state) => state.auth.user);

    // Function to toggle chatbot visibility
    const toggleChatBot = () => {
        setIsChatBotVisible((prev) => !prev);
    };

    useEffect(() => {
        // Assuming you have a way to check if the user has just logged in
        const userJustLoggedIn = true; // Replace with actual logic
        if (userJustLoggedIn) {
            setIsModalOpen(true);
        }
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const orderString = localStorage.getItem('order');
        if (orderString) {
            const parsedOrder = JSON.parse(orderString);
            if (parsedOrder && parsedOrder.payload && parsedOrder.payload._id) {
                const _id = parsedOrder.payload._id;
                console.log('TESTTTTTT', _id);

                fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/process/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(() => {
                    localStorage.removeItem('order');
                });
            }
        }
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };

        loadRestaurants();
    }, []);

    const handleRestaurantClick = async (restaurant) => {
        setSelectedRestaurant(restaurant);
        const items = await fetchMenuItems(restaurant._id); // Fetch menu items
        setMenuItems(items); // Set menu items
        setIsMenuModalVisible(true);
    };

    // Check if the user is an admin before rendering the Food Suggestion Modal
    const isAdmin = user?.user_type === 'admin';

    return (
        <div>
            <ImagePanel />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobileDevice() ? '15px' : '55px' }} className="restaurant-grid">
                {restaurants.map((restaurant) => (
                    <RestaurantPane
                        key={restaurant._id}
                        restaurant={restaurant}
                        onRestaurantClick={() => handleRestaurantClick(restaurant)}
                    />
                ))}
            </div>
            {isMenuModalVisible && selectedRestaurant && (
                <MenuModal
                    restaurant={selectedRestaurant}
                    menuItems={menuItems} // Pass menu items to MenuModal
                    onClose={() => setIsMenuModalVisible(false)}
                />
            )}
            {/* Chatbot Trigger Button */}
            <button
                onClick={toggleChatBot}
                style={{
                    position: 'fixed',
                    bottom: isMobileDevice() ? '70px' : '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Chat with Us
            </button>

            {/* Chatbot Component */}
            {isChatBotVisible && <ChatBot open={isChatBotVisible} onClose={toggleChatBot} />}

            {/* Food Suggestion Modal - Render only if the user is not an admin */}
            {!isAdmin && <FoodSuggestionModal open={isModalOpen} handleClose={handleCloseModal} />}
        </div>
    );
};

export default Home;
