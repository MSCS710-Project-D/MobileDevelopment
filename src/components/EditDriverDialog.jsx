import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateDriver } from '../actions/deliveryDriver';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

const EditDriverDialog = ({ driver, onClose, onSave, isOpen }) => {
    const dispatch = useDispatch();
    const [editedDriver, setEditedDriver] = useState(driver || {});

    useEffect(() => {
        if (driver) {
            debugger;
            setEditedDriver(driver);
        }
    }, [driver]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDrivers = [...editedDriver];
        updatedDrivers[index] = { ...updatedDrivers[index], [name]: value };
        setEditedDriver(updatedDrivers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editedDriver.forEach(driver => {
            if (driver._id) {
                dispatch(updateDriver(driver._id, driver));
            }
        });
        onSave(editedDriver);
        onClose();
    };

    if (!driver) {
        return null;
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Edit Driver</DialogTitle>
            <form>
                <DialogContent>
                    {
                        editedDriver.map((driverItem, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <TextField
                                    label="License Plate"
                                    type="text"
                                    name="license_plate"
                                    fullWidth
                                    margin="dense"
                                    value={driverItem.license_plate || ''}
                                    onChange={(e) => handleChange(index, e)}
                                />
                                <TextField
                                    label="Vehicle Type"
                                    type="text"
                                    name="vehicle_type"
                                    fullWidth
                                    margin="dense"
                                    value={driverItem.vehicle_type || ''}
                                    onChange={(e) => handleChange(index, e)}
                                />

                                <select name="availability" value={driverItem.availability} onChange={(e) => handleChange(index, e)}>
                                    <option value="Available">Available</option>
                                    <option value="On Delivery">On Delivery</option>
                                    <option value="Offline">Offline</option>
                                </select>
                                <div>
                                    <Button onClick={() => {

                                        fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/update/${driverItem._id}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(driverItem)
                                        })

                                        onSave();
                                    }} color="primary">Edit</Button>


                                    <Button onClick={() => {

                                        fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/delete/${driverItem._id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })

                                        onSave();
                                    }} color="primary">Delete</Button>
                                </div>
                            </div>
                        ))
                    }
                    {/* Add more fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditDriverDialog;
