import React from 'react';
import Box from '@mui/material/Box';

const Loader = ({ src }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <img src={'./loader.gif'} alt="Loading..." />
        </Box>
    );
};

export default Loader;
