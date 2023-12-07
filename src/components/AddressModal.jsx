import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import AddressInputRow from './AddressInputRow'; // Adjust the path as per your directory structure
import SavedAddresses from './SavedAddresses';
import { useAddress } from './AddressContext'; // Adjust the path as per your directory structure

function AddressModal({ isOpen, onClose }) {
    const { savedAddresses, addAddress } = useAddress();
    const [address, setAddress] = useState({
        name: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const [errors, setErrors] = useState({
        zipCode: '' // Initialize with empty string or appropriate default value
    });

    const isValidZipCode = (zipCode) => {
        // Example: US zip code validation (5 digits or 9 digits with a hyphen)
        const pattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
        return pattern.test(zipCode);
    };

    const US_STATES = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    
    const handleSaveAddress = () => {
        // Implement validation logic here
        let newErrors = {...errors};

        // Example: Validate Zip Code
        if (!isValidZipCode(address.zipCode)) {
            newErrors.zipCode = 'Invalid Zip Code';
        } else {
            newErrors.zipCode = '';
        }

        setErrors(newErrors);

        // Check if there are any errors before proceeding
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (!hasErrors) {
            addAddress(address);

            setAddress({
                name: '',
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                zipCode: '',
                state: ''
            }); // Reset the form
        }
        
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Manage Addresses</DialogTitle>  
            <DialogContent>
            <AddressInputRow address={address} onChange={handleAddressChange} errors={errors} />
                <SavedAddresses addresses={savedAddresses} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveAddress} color="primary">Save Address</Button>
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddressModal;
