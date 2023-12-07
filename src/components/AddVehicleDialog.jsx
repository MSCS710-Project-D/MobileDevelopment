import React, { useState , useEffect} from 'react';
import { saveDriver } from '../actions/deliveryDriver';
import { useSelector } from 'react-redux';
import '../styles/drivers.scss';

const AddVehicleDialog = ({ onClose, onSave }) => {
    const user = useSelector(state => state.auth.user);
    const [vehicle, setVehicle] = useState({
        user_id: user._id,
        vehicle_type: '',
        license_plate: '',
        availability: 'Available' // Default value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(vehicle);
        onClose();
    };

    return (
        <div className="vehicle-dialog-overlay">
            <div className="vehicle-dialog">
                <button className="close-button" onClick={onClose}>X</button>
                <h3>Add Driver</h3>
                <label>
                    Vehicle Type:
                    <input type="text" name="vehicle_type" value={vehicle.vehicle_type} onChange={handleChange} />
                </label>
                <label>
                    License Plate:
                    <input type="text" name="license_plate" value={vehicle.license_plate} onChange={handleChange} />
                </label>
                <label>
                    Availability:
                    <select name="availability" value={vehicle.availability} onChange={handleChange}>
                        <option value="Available">Available</option>
                        <option value="On Delivery">On Delivery</option>
                        <option value="Offline">Offline</option>
                    </select>
                </label>
                <button className="submit" onClick={() => saveDriver(vehicle)}>Save</button>
            </div>
        </div>
    );
};

export default AddVehicleDialog;