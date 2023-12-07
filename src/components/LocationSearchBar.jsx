import React, { useState } from 'react';

const LocationSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        fetch(`https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json`)
            .then(response => response.json())
            .then(data => {
                setResults(data);
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
            });
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for a location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map(result => (
                    <li key={result.place_id}>{result.display_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default LocationSearchBar;
