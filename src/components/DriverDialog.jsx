// DriverDialog.jsx
import React, { useState } from 'react';

const DriverDialog = ({ driver, onClose, onSave }) => {
  const [driverData, setDriverData] = useState(driver);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  const handleSubmit = () => {
    // Here you would handle the API call to save the driver data
    onSave(driverData);
  };

  if (!driver) return null;

  return (
    <div className="driver-dialog-overlay">
      <div className="driver-dialog">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>Edit Driver</h3>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={driverData.name}
            onChange={handleChange}
          />
        </label>
        {/* Add more fields as needed */}
        <button className="submit" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default DriverDialog;
