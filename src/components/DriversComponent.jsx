import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DriverDialog from './DriverDialog';
import EditDriverDialog from './EditDriverDialog'; 


const API_BASE_URL = 'https://us-central1-maristhungerexpress.cloudfunctions.net/api';

const DriversComponent = ({ onEditDrivers }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDriverDialogOpen, setIsEditDriverDialogOpen] = useState(false);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/drivers`);
            setDrivers(response.data);
        } catch (error) {
            console.error('Failed to fetch drivers', error);
        }
    };

    const handleOpenDialog = (driver) => {
        setSelectedDriver(driver);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedDriver(null);
    };

    const openEditDriverDialog = (driver) => {
      console.log('Opening edit dialog for driver:', driver);
      setSelectedDriver(driver);
      setIsEditDriverDialogOpen(true);
      };

      const closeEditDriverDialog = () => {
        setIsEditDriverDialogOpen(false);
        setSelectedDriver(null);
      };

      const handleEditDrivers = async (driverData) => {
        try {
          const response = await fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/update/${driverData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // Include any other headers like authorization if required
            },
            body: JSON.stringify(driverData)
          });
    
          if (response.ok) {
            const updatedDriver = await response.json(); // Assuming the server responds with the updated driver data
            alert('Driver details updated successfully!');
            setIsEditDriverDialogOpen(false);
            // You might want to update the state or context with the updated driver info here
          } else {
            const errorData = await response.json(); // Assuming the server responds with error details
            alert(`Error updating driver details: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Unable to update driver data:', error);
          alert('An error occurred while updating driver details. Please try again.');
        } finally {
          setIsEditDriverDialogOpen(false); // Ensure the dialog is closed regardless of the outcome
        }
      };
    const handleSaveDriver = (driverData) => {
        // Implement the logic to save the driver data
    };

    return (
        <>
          {drivers.map((driver) => (
            <div key={driver._id}>
              <span>{driver.name}</span>
              <button onClick={() => openEditDriverDialog(driver)}>Edit</button>
            </div>
          ))}
          {isEditDriverDialogOpen && (
            <EditDriverDialog
              driver={selectedDriver}
              onSave={handleEditDrivers}
              onClose={closeEditDriverDialog}
              />
          )}
        </>
      );
    };

export default DriversComponent;
