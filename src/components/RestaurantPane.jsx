import React, { useState } from 'react';
import '../styles/restaurants.scss';
import { updateRestaurant, deleteRestaurant } from '../actions/restaurantActions';
import { useSelector } from 'react-redux';
import { isMobileDevice } from '../utils';

const BASE_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api/";

const RestaurantPane = ({ restaurant, onRestaurantClick }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editableRestaurant, setEditableRestaurant] = useState(null);
    const initialValue = "0"; // replace "some value" with the actual initial value
    const [isSelected, setIsSelected] = useState(initialValue);
    const user = useSelector((state) => state.auth.user);

    const handlePaneClick = () => {
        onRestaurantClick(restaurant._id);
        setIsSelected(true); // Set the restaurant pane as selected
    };

    const handleEditClick = (restaurant) => {
        setEditableRestaurant(restaurant);
        setModalOpen(true);
    };

    const handleSaveClick = async () => {
        try {
            await updateRestaurant(editableRestaurant);
            alert('Restaurant updated successfully!');
            setModalOpen(false);
        } catch (error) {
            alert('Error updating restaurant. Please try again.');
        }
    };

    const handleDeleteClick = async (restaurantId) => {
        try {
            await deleteRestaurant(restaurantId);
            alert('Restaurant deleted successfully!');
        } catch (error) {
            alert('Error deleting restaurant. Please try again.');
        }
    };

    return (
        <div className="restaurant-pane" style={{ width: isMobileDevice() ? '100%': '350px' }}>
             <div onClick={handlePaneClick}>
                <img width={350} height={350} src={restaurant.restaurantImg} alt={restaurant.name} className="restaurant-images" />
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-description">{restaurant.description}</div>
                <div className="restaurant-details">
                    <div className="restaurant-address">
                        <span className="icon">📍</span>
                        {restaurant.address}
                    </div>
                    <div className="restaurant-phone">
                        <span className="icon">📞</span>
                        {restaurant.phone_number}
                    </div>
                </div>
            </div>
            {
                user.user_type === 'admin' && (
                    <div className="restaurant-actions">
                        <button 
                            className="edit-button" 
                            onClick={() => handleEditClick(restaurant)}
                            disabled={!isSelected} // Disable if the restaurant is not selected
                        >
                            Edit
                        </button>
                        <button 
                            className="delete-button" 
                            onClick={() => handleDeleteClick(restaurant._id)}
                            disabled={!isSelected} // Disable if the restaurant is not selected
                        >
                            Delete
                        </button>
                    </div>
                )
            }
            {isModalOpen && (
                <div className="menu-modal-overlay">
                    <div className="menu-modal">
                        <button className="close-button" onClick={() => setModalOpen(false)}>X</button>
                        <h3>Edit Restaurant</h3>
                        <label>
                            Name:
                            <input type="text" value={editableRestaurant.name} onChange={(e) => setEditableRestaurant({ ...editableRestaurant, name: e.target.value })} />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={editableRestaurant.description} onChange={(e) => setEditableRestaurant({ ...editableRestaurant, description: e.target.value })} />
                        </label>
                        <label>
                            Address:
                            <input type="text" value={editableRestaurant.address} onChange={(e) => setEditableRestaurant({ ...editableRestaurant, address: e.target.value })} />
                        </label>
                        <label>
                            Phone Number:
                            <input type="text" value={editableRestaurant.phone_number} onChange={(e) => setEditableRestaurant({ ...editableRestaurant, phone_number: e.target.value })} />
                        </label>
                        <button className="submit" onClick={handleSaveClick}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantPane;
