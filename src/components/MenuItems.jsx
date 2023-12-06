    import React, { useState, useEffect } from 'react';
    import { fetchRestaurants } from '../actions/restaurantActions';
    import RestaurantPane from './RestaurantPane';
    import ImagePanel from './ImagePanel';
    import MenuItems from './MenuItems';

    const Home = () => {
        const [restaurants, setRestaurants] = useState([]);
        const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Define selectedRestaurant state

        useEffect(() => {
            const loadRestaurants = async () => {
                const data = await fetchRestaurants();
                setRestaurants(data);
            };

            loadRestaurants();
        }, []);

        return (
            <div>
                {/* Image Panel Component */}
                <ImagePanel />

                <div className="restaurant-grid">
                    {restaurants.map(restaurant => (
                        <RestaurantPane
                            key={restaurant.id}
                            restaurant={restaurant}
                            setSelectedRestaurant={setSelectedRestaurant}
                        />
                    ))}
                </div>

                {/* Include the MenuItems component */}
                {selectedRestaurant && <MenuItems restaurant={selectedRestaurant} />}
            </div>
        );
    }

    export default Home;
