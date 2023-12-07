import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Grid, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { isMobileDevice } from '../utils';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const gridItemStyle = {
    padding: '20px',
    textAlign: 'center',
    color: 'theme.palette.text.secondary',
    borderRadius: '8px',
    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
    height: '300px', // Fixed height for each grid item
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const descriptionStyle = {
    overflowY: 'auto', // Scroll for overflow
    maxHeight: '100px', // Maximum height before scrolling
    marginBottom: '10px'
};

const calorieRanges = [
    { label: '0 - 500', min: 0, max: 500 },
    { label: '501 - 1000', min: 501, max: 1000 },
    { label: '1001+', min: 1001, max: Infinity }
];

const FoodSuggestionModal = ({ open, handleClose }) => {
    const [step, setStep] = useState(1);
    const [menuItems, setMenuItems] = useState([]);
    const [allergyOptions, setAllergyOptions] = useState([]);
    const [selectedAllergy, setSelectedAllergy] = useState('none'); // Default to 'none'
    const [selectedCalorieRange, setSelectedCalorieRange] = useState('0 - 500'); // Default to first range
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [expandedItemId, setExpandedItemId] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('https://us-central1-maristhungerexpress.cloudfunctions.net/api/menuItems');
                console.log('Fetched Menu Items:', response.data); // Check fetched data
                setMenuItems(response.data);
                extractAllergyOptions(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        fetchMenuItems();
    }, []);


    const extractAllergyOptions = (items) => {
        const allergies = new Set();
        items.forEach(item => {
            if (item.allergy_info && item.allergy_info.length > 0) {
                item.allergy_info.forEach(allergy => {
                    // Splitting in case multiple allergies are in a single string
                    allergy.split(', ').forEach(individualAllergy => allergies.add(individualAllergy.trim()));
                });
            }
        });
        setAllergyOptions(['none', ...Array.from(allergies)]);
    };

    const handleNextStep = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            suggestMenuItems();
        }
    };

    const suggestMenuItems = () => {
        const range = calorieRanges.find(range => range.label === selectedCalorieRange);
        console.log("Selected Range:", range); // Check selected range
    
        const filteredItems = menuItems.filter(item => {
            const hasAllergen = item.allergy_info && item.allergy_info.some(allergen => allergen.toLowerCase().includes(selectedAllergy.toLowerCase()));
            const allergyMatch = selectedAllergy === 'none' || !hasAllergen;
            const calories = parseInt(item.calories);
            const calorieMatch = calories >= range.min && calories <= range.max;
        
            console.log("Item:", item.name, "Allergy Match:", allergyMatch, "Calorie Match:", calorieMatch); // Check each item
        
            return allergyMatch && calorieMatch;
        });
    
        console.log("Filtered Items:", filteredItems); // Check filtered items
        setSuggestedItems(filteredItems);
        setStep(3); // Move to the final step to show suggestions
    };
    

    const renderAllergyOptions = () => (
        <div>
            <Typography variant="subtitle1" gutterBottom>
                Are you allergic to any of the ingredients?
            </Typography>
            <RadioGroup value={selectedAllergy} onChange={(e) => setSelectedAllergy(e.target.value)}>
                {allergyOptions.map(allergy => (
                    <FormControlLabel key={allergy} value={allergy} control={<Radio />} label={allergy} />
                ))}
            </RadioGroup>
        </div>
    );
    

    const renderCalorieRangeOptions = () => (
        <div>
            <Typography variant="subtitle1" gutterBottom>
                What calorie range would you like to have?
            </Typography>
            <RadioGroup value={selectedCalorieRange} onChange={(e) => setSelectedCalorieRange(e.target.value)}>
                {calorieRanges.map(range => (
                    <FormControlLabel key={range.label} value={range.label} control={<Radio />} label={range.label} />
                ))}
            </RadioGroup>
        </div>
    );
    const toggleItemExpansion = (itemId) => {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
    };

    const renderSuggestedItems = () => {
        if (suggestedItems.length === 0) {
            return (
                <Typography variant="subtitle1" style={{ marginTop: '20px', textAlign: 'center' }}>
                    No items match your criteria.
                </Typography>
            );
        }
    
        return (
            <Grid container spacing={3}>
                {suggestedItems.map(item => (
                    <Grid item xs={12} sm={isMobileDevice() ? 12 : 6} md={isMobileDevice() ? 12 : 4} key={item._id}>
                        <Paper style={gridItemStyle}>
                            <Typography variant="h6" gutterBottom>{item.name}</Typography>
                            <div style={descriptionStyle}>
                                {item.description}
                            </div>
                            <div>
                                <Typography variant="body2" color="textSecondary">${item.price}</Typography>
                                <Typography variant="body2" color="textSecondary">Calories: {item.calories}</Typography>
                                {item.allergy_info && item.allergy_info.length > 0 && (
                                    <Typography variant="body2" color="error">Allergens: {item.allergy_info.join(', ')}</Typography>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        );
    };
    

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return renderAllergyOptions();
            case 2:
                return renderCalorieRangeOptions();
            case 3:
                return renderSuggestedItems();
            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...style, width: isMobileDevice() ? '60%' : style.width }}>
                <Typography variant="h6" component="h2">
                    {step === 3 ? 'Suggested Dishes' : 'Help us suggest a dish for you'}
                </Typography>
                {renderStepContent()}
                {step < 3 && (
                    <Button variant="contained" onClick={handleNextStep} style={{ marginTop: '20px' }}>
                        Next
                    </Button>
                )}
                <Button variant="text" onClick={handleClose} style={{ marginLeft: '10px', marginTop: '20px' }}>Close</Button>
                <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={handleClose}>
                    <CloseIcon />
                </Button>
            </Box>
        </Modal>
    );
};

export default FoodSuggestionModal;
