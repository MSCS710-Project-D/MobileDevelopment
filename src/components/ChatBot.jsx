
import React, { useState, useEffect } from 'react';
import { TextField, Paper, IconButton, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchRestaurants } from '../actions/restaurantActions';
import { getOrdersByUserId } from '../actions/order';
import { useSelector, useDispatch } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const API_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api";

const ChatBot = ({ open, onClose }) => {
    const user = useSelector(state => state.auth.user);
    const [message, setMessage] = useState('');
    const [activeUser, setActiveUser] = useState(null);
    const uniqueMessages = new Set(); // Set to keep track of unique messages


    useEffect(() => {
        if (window?.channel) {
            if (user?.user_type === 'admin') {
                window?.channel.bind('admin', (data) => {
                    setActiveUser(data.message.sender);
                    setConversation(conversation => [...conversation, { text: data.message.content, sender: 'bot' }]);
                })
            } else {
                window?.channel.bind(user._id, (data) => {
                    setConversation(conversation => [...conversation, { text: data.message.content, sender: 'bot' }]);
                })
            }
        }
    }, [window?.channel])
    
    const [hasUserReplied, setHasUserReplied] = useState(false);
    const [conversation, setConversation] = useState(() => {
        // Load conversation from local storage or start with an initial message
        const savedConversation = localStorage.getItem('chatbotConversation');
        return savedConversation ? JSON.parse(savedConversation) : [{ text: 'Hello, How can I help you today?', sender: 'bot' }];
    });
    const [intentsAdded, setIntentsAdded] = useState(false); // New state to track if intents have been added

     // Save conversation to local storage whenever it changes
     useEffect(() => {
        localStorage.setItem('chatbotConversation', JSON.stringify(conversation));
    }, [conversation]);

    const isNegativeResponse = (message) => {
        const negativeWords = ['no', 'not', 'none', 'nothing', 'nope', 'don’t', 'dont', 'do not', 'never'];
        return negativeWords.some(word => message.toLowerCase().includes(word));
    };
    

    const renderMessage = (msg, index) => {
        if (uniqueMessages.has(msg.text)) {
            return null; // Skip rendering if it's a duplicate
        }

        uniqueMessages.add(msg.text);
        
        if (msg.type === 'intents') {
            return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', margin: '5px 0' }}>
                    {msg.intents.map((intent, idx) => (
                        <Button key={idx} onClick={intent.action} variant="contained" color="primary" style={{ margin: '5px' }}>
                            {intent.text}
                        </Button>
                    ))}
                </div>
            );
        } else {
            const isUserMessage = msg.sender === 'user';
            const messageStyle = {
                alignSelf: isUserMessage ? 'flex-start' : 'flex-end',
                backgroundColor: isUserMessage ? '#e0e0e0' : '#90caf9',
                borderRadius: '10px',
                padding: '5px 10px',
                maxWidth: '70%',
                margin: '5px 0'
            };

            return (
                <div key={index} style={messageStyle}>
                    {typeof msg.text === 'string' ? msg.text : msg.text}
                </div>
            );
        }
    };
    const renderIntents = () => {
        if (!hasUserReplied) return null;

        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <Button onClick={() => handleIntentClick('Check Order Status')} variant="contained" color="primary">
                    Check Order Status
                </Button>
                <Button onClick={() => handleIntentClick('Restaurants')} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                    Restaurants
                </Button>
                {/* Add more buttons for other intents */}
            </div>
        );
    };

    // Function to check for affirmative responses
    const isAffirmativeResponse = (message) => {
        const affirmativeWords = ['yes', 'yeah', 'okay', 'sure', 'absolutely', 'definitely'];
        return affirmativeWords.some(word => message.toLowerCase().includes(word));
    };
    // Function to add intents to the conversation
    const addIntentsToConversation = () => {
        const intents = [
            { text: 'Check Order Status', action: () => handleIntentClick('Check Order Status') },
            { text: 'Restaurants', action: () => handleIntentClick('Restaurants') },
            { text: 'Change Password', action: () => handleIntentClick('Change Password') },
            { text: 'Home Screen Navigation', action: () => handleIntentClick('Home Screen Navigation') },
            { text: 'Profile', action: () => handleIntentClick('Profile') }];
        setConversation(conversation => [...conversation, { type: 'intents', intents }]);
    };

    const dispatch = useDispatch();
    const [localOrders, setLocalOrders] = useState([]);
    const orders = useSelector(state => state.orders); // Corrected this line

    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);


    useEffect(() => {
        fetchUserOrders();
    }, [user]);



    const fetchUserOrders = async () => {
        if (user && user._id) {
            try {
                const response = await fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/history/${user._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching orders:', error);
                return [];
            }
        }
        return [];
    };

    const handleIntentClick = (intent) => {
        if (intent === 'Profile') {
            setConversation(conversation => [
                ...conversation, 
                { text: "What would you like to do in your profile?", sender: 'bot' },
                { type: 'intents', intents: [
                    { text: 'Settings', action: () => handleIntentClick('Settings') },
                    { text: 'Update Profile', action: () => handleIntentClick('Update Profile') },
                    { text: 'Manage Address', action: () => handleIntentClick('Manage Address') },
                    { text: 'Logout', action: () => handleIntentClick('Logout') },
                ]}
            ]);
        }
        else {
            handleIntent(intent).then(response => {
                setConversation(conversation => [...conversation, { text: response, sender: 'bot' }]);
            });
        }
        // You can directly call handleIntent here or set the message and then call handleSend
        // handleIntent(intent).then(response => {
        //     setConversation(conversation => [...conversation, { text: response, sender: 'bot' }]);
        //     if (!intentsAdded) {
        //         addIntentsToConversation(); // Add intents only if they haven't been added before
        //         setIntentsAdded(true); // Update state to indicate intents have been added
        //     }
        // });
    };



    const handleIntent = async (intent) => {
        let apiResponse;
        switch (intent) {
            case 'Check Order Status':
                console.log("Fetching orders...");
                apiResponse = await fetchUserOrders();
                console.log("Orders response:", apiResponse);
                return formatOrdersResponse(apiResponse);
            case 'Restaurants':
                console.log("Fetching restaurants...");
                apiResponse = await fetchRestaurants();
                console.log("Restaurants:", apiResponse);
                return formatRestaurantData(apiResponse);
            case 'Change Password':
                apiResponse = "To change your password, please go to your profile settings.";
                break;
            case 'Home Screen Navigation':
                apiResponse = "You can find various options on the home screen, including the menu items on clicking Restaurant you want to order from .";
                break;
            case 'Profile':
                apiResponse = "In your profile, you can do the following:\n1. Settings\n2. Update Profile\n3. Manage Address\n4. Logout";
                break;
            case 'Settings':
                apiResponse = "In Settings, you can enable location access and notifications.";
                break;
            case 'Update Profile':
                apiResponse = "You can edit your first name, last name, address, and email in the Update Profile section.";
                break;
            case 'Manage Address':
                apiResponse = "Manage your addresses to use them during checkout.";
                break;
            case 'Logout':
                apiResponse = "You can log out from the application through the Logout option.";
                break;
            default:
                apiResponse = "I'm not sure how to help with that. Would you like to speak with a live agent?";
                setHasUserReplied(true); // Show intents after this response
                break;
        }
        return apiResponse;
    };

    const formatOrdersResponse = (orders) => {
        if (!Array.isArray(orders) || orders.length === 0) {
            return "No orders found or invalid order format.";
        }

        return orders.map((order, index) => (
            <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div>
                        <p>Status: {order.order_status}</p>
                        <p>Address: {order.delivery_address}</p>
                        <p>Total Price: ${order.total_price.toFixed(2)}</p>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        {order.order_items.map((item, idx) => (
                            <p key={idx}>{item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}</p>
                        ))}
                        <a href="/order-history" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary">
                                Download Invoice
                            </Button>
                        </a>
                        <a href="/order-history" style={{ textDecoration: 'none', marginLeft: '10px' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={isOrderOlderThan30Mins(order.order_date) || order.order_status === 'Canceled'}
                            >
                                {order.order_status === 'Canceled' ? 'Cancelled' : 'Cancel'}
                            </Button>
                        </a>
                    </div>
                </AccordionDetails>
            </Accordion>
        ));
    };


    // Helper function to check if the order is older than 30 minutes
    const isOrderOlderThan30Mins = (orderDate) => {
        const orderTime = new Date(orderDate).getTime();
        const currentTime = new Date().getTime();
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

        return (currentTime - orderTime) > THIRTY_MINUTES;
    };


    const formatRestaurantData = (restaurants) => {
        return restaurants.map(restaurant => (
            <div key={restaurant._id}>
                <h4>{restaurant.name}</h4>
                <p>Address: {restaurant.address}</p>
                <p>Phone: {restaurant.phone_number}</p>
                <a href={`/restaurants/${restaurant._id}`} target="_blank" rel="noopener noreferrer">View Menu</a>
            </div>
        ));
    };

    const [liveagent, setLiveagent] = useState(user?.user_type === 'admin' ? true : false);


   

    const handleSend = async () => {
        if (message.trim() === '') {
            return; 
        }
        
        if (!liveagent && user?.user_type !== 'admin') {
            if (message.trim()) {
                const newMessage = { text: message, sender: 'user', timestamp: new Date().toISOString() };
                setConversation([...conversation, newMessage]);
                setMessage('');
    
                // Check if the last bot message was about speaking with a live agent
                const lastBotMessage = conversation.length > 0 && conversation[conversation.length - 1];
                // Check if it's the first user message and if it's negative
            if (conversation.length === 1 && isNegativeResponse(message)) {
                setConversation(conversation => [...conversation, { text: "Thank you for contacting us. If you need any assistance in the future, feel free to reach out. Have a great day!", sender: 'bot' }]);
            } else 
                if (lastBotMessage && lastBotMessage.sender === 'bot' && lastBotMessage.text.includes('Would you like to speak with a live agent?')) {
                    if (isAffirmativeResponse(message)) {
                        setConversation(conversation => [...conversation, { text: "Connecting to a live agent, please wait...", sender: 'bot' }]);
                        
                        const resp  =await axios.post(`${API_URL}/messages/create`, {
                            sender: user?._id,
                            content: 'Would you like to speak with a live agent?',
                            timestamp: new Date().toISOString(),
                            role: user?.user_type
                        })

                        setLiveagent(true);
    
                        console.log('resp', resp.data);
                    } else {
                        // Handle non-affirmative response
                        setConversation(conversation => [...conversation, { text: "Okay, let me know if there's anything else I can help with.", sender: 'bot' }]);
                    }
                } else {
                    try {
                        const response = await handleIntent(message);
                        setConversation(conversation => [...conversation, { text: response, sender: 'bot' }]);
                        if (!hasUserReplied) {
                            addIntentsToConversation(); // Add intents only after the first user message
                            setHasUserReplied(true); // Update state to indicate the user has replied
                        }
                    } catch (error) {
                        console.error('Error processing message:', error);
                        setConversation(conversation => [...conversation, { text: "Sorry, I couldn't process your request.", sender: 'bot' }]);
                    }
                }
            }
        } else {
            setConversation(conversation => [...conversation, { text: message.trim(), sender: 'user' }]);
            
            const config = {
                sender: user?._id,
                content: message.trim(),
                timestamp: new Date().toISOString(),
                role: user?.user_type
            }

            if (user?.user_type === 'admin') {
                config.receiver = activeUser
            }

            const resp  =await axios.post(`${API_URL}/messages/create`, config)

            console.log('resp', resp.data);
        }
        setMessage(''); // Clear the message input field after sending
    };

    if (!open) return null;

    return (
        <Paper elevation={3} style={{ position: 'fixed', bottom: 20, right: 20, padding: '10px', width: '300px', height: '400px', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Chat with Us</h3>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {conversation.map(renderMessage)}
            </div>
            <Divider />
            <TextField
                autoFocus
                margin="dense"
                id="message"
                label="Type your message"
                type="text"
                fullWidth
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                Send
            </Button>
        </Paper>
    );
};

export default ChatBot;
