import React, { useState, useEffect } from 'react';

const ImagePanel = () => {
    // Sample image paths. Replace these with your own paths.
    const images = [
        '/bannerImage1.png',
        '/bannerImage2.png',
        '/bannerImage3.png',
        '/bannerImage4.png',
        '/bannerImage5.png',
        '/bannerImage6.png',
        '/bannerImage7.png',
        '/bannerImage8.png',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 10 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="image-panel" style={{ width: '100%', height: '70vh' }}>
            <img
                src={images[currentImageIndex]}
                alt="Rotating content"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // This ensures the image covers the div without stretching
                }}
            />
        </div>
    );
};

export default ImagePanel;
