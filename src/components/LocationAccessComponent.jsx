import React, { useState } from 'react';

const LocationAccessComponent = () => {
    const [location, setLocation] = useState(null);

    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.error("Error accessing location:", error);
            }
        );
    };

    return (
        <div>
            <button onClick={handleGetLocation}>Get My Location</button>
            {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
        </div>
    );
};

export default LocationAccessComponent;
