import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [savedAddresses, setSavedAddresses] = useState([]);

    const addAddress = (address) => {
        setSavedAddresses(prevAddresses => [...prevAddresses, address]);
    };

    return (
        <AddressContext.Provider value={{ savedAddresses, addAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    return useContext(AddressContext);
};
