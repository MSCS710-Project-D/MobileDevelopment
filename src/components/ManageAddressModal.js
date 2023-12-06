import { useAddress } from './components/AddressContext';

// Inside the component
const { setSavedAddress } = useAddress();

// When saving the address
setSavedAddress(addressData);
