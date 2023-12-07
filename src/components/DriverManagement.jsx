import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Function to fetch drivers
  const fetchDrivers = async () => {
    try {
      const response = await axios.get('https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers');
      setDrivers(response.data); // Assuming the data is an array of drivers
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Effect to fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Function to handle driver selection
  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true); // Open the edit dialog
  };

  // Function to handle driver update
  const handleUpdateDriver = () => {
    // Logic to update the driver details
  };

  // Function to close the edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDriver(null); // Reset the selected driver
  };

  return (
    <div>
      {/* Trigger button to open edit dialog */}
      <button onClick={fetchDrivers}>Edit Driver</button>

      {/* Edit Driver Dialog */}
      {isEditDialogOpen && (
        <div className="edit-driver-dialog">
          <h3>Edit Driver</h3>
          {/* List of drivers */}
          <ul>
            {drivers.map((driver) => (
              <li key={driver._id} onClick={() => handleDriverClick(driver)}>
                {driver.name}
              </li>
            ))}
          </ul>
          {/* Form to edit the selected driver's details */}
          {selectedDriver && (
            <>
              <input
                type="text"
                value={selectedDriver.name}
                onChange={(e) => setSelectedDriver((prev) => ({ ...prev, name: e.target.value }))}
              />
              {/* Add other input fields for other driver details */}
              <button onClick={handleUpdateDriver}>Update Driver</button>
              <button onClick={handleCloseEditDialog}>Close</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
