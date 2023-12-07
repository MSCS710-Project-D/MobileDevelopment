import React, { useState } from 'react';

const AddMenuItemDialog = ({ restaurantId, onClose, onSave }) => {
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        availability: '',
        image_url: '',
        allergy_info: [],
        calories: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenuItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave({ ...menuItem, restaurant_id: restaurantId });
        onClose();
    };

    return (
        <div className="menu-item-dialog-overlay">
            <div className="menu-item-dialog">
                <input name="name" placeholder="Dish Name" onChange={handleChange} />
                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
                <input type="number" name="price" placeholder="Price" onChange={handleChange} />
                <input name="availability" placeholder="Availability" onChange={handleChange} />
                <input name="image_url" placeholder="Image URL" onChange={handleChange} />
                <input type="number" name="calories" placeholder="Calories" onChange={handleChange} />
                {/* ... Add more inputs as needed ... */}
                <button onClick={handleSubmit}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddMenuItemDialog;
