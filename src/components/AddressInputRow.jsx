import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';



const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const isValidZipCode = (zipCode) => {
    // Example: US zip code validation (5 digits or 9 digits with a hyphen)
    const pattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return pattern.test(zipCode);
};

function AddressInputRow({ address, onChange, errors }) {
    return (
        <div className="address-input-row">
            <TextField
                label="Address Type"
                name="name"
                value={address.name}
                onChange={onChange}
                required
            />
            <TextField
                label="First Name"
                name="firstName"
                value={address.firstName}
                onChange={onChange}
                required
            />
            <TextField
                label="Last Name"
                name="lastName"
                value={address.lastName}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Address Line 1"
                name="address1"
                value={address.address1}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Address Line 2"
                name="address2"
                value={address.address2}
                onChange={onChange}
            />
            <TextField
                className="mui-text-field"
                label="City"
                name="city"
                value={address.city}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Zip Code"
                name="zipCode"
                value={address.zipCode}
                onChange={onChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode || ''}
                required
            />
            <FormControl fullWidth>
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                    labelId="state-select-label"
                    name="state"
                    value={address.state}
                    onChange={onChange}
                    label="State"
                >
                    {US_STATES.map((state, index) => (
                        <MenuItem key={index} value={state}>{state}</MenuItem>
                    ))}
                </Select>
                {/* Include FormHelperText if you have validation messages */}
            </FormControl>
        </div>
    );
}

export default AddressInputRow;
