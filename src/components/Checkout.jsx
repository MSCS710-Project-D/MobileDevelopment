import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/order';
import { Paper, Grid, TextField, FormControlLabel, Checkbox, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../styles/Checkout.scss';
import Confetti from 'react-confetti';
import { useAddress } from './AddressContext';
import { Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';


function Checkout() {


    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const [showSuccess, setShowSuccess] = useState(false);
    const { savedAddresses } = useAddress();
    const [selectedAddress, setSelectedAddress] = useState("None");

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const [deliveryAddress, setDeliveryAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const [billingAddress, setBillingAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const US_STATES = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    const [useDeliveryForBilling, setUseDeliveryForBilling] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'creditCard'
    const [paypalDetails, setPaypalDetails] = useState({})

    const paypalRef = React.useRef();
    // Calculate subtotal for each item
    const calculateItemSubtotal = (quantity, price) => {
        return quantity * price;
    };

    // Calculate total price of the order
    const calculateTotalPrice = () => {
        return order.orderItems.reduce((total, item) => {
            return total + calculateItemSubtotal(item.quantity, item.price);
        }, 0);
    };

    useEffect(() => {
        if (savedAddresses.length > 0) {
            setDeliveryAddress(savedAddresses[0]);
        }
    }, [savedAddresses]);


    useEffect(() => {
        if (!window.paypal) {
            return;
        }

        // Check if PayPal buttons are already rendered
        if (paypalRef?.current?.children?.length === 0) {
            window.paypal.Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: order.order.total_price
                            }
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        setPaypalDetails(details);
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                }
            }).render(paypalRef.current);
        }
    }, [paymentMethod]);


    useEffect(() => {
        if (useDeliveryForBilling) {
            setBillingAddress(deliveryAddress);
        }
    }, [useDeliveryForBilling, deliveryAddress]);

    const handleDeliveryChange = (e) => {
        setDeliveryAddress({
            ...deliveryAddress,
            [e.target.name]: e.target.value
        });
    };

    const couponDiscounts = {
        '10OFF': 0.10, // 10% discount
        '20OFF': 0.20, // 20% discount
        '30OFF': 0.30, // 30% discount
        '40OFF': 0.40, // 40% discount
        '50OFF': 0.50, // 50% discount
    };


    const handleApplyCoupon = () => {
        const discountPercentage = couponDiscounts[couponCode];
        if (discountPercentage) {
            const subtotal = calculateTotalPrice();
            const discountAmount = subtotal * discountPercentage;
            setDiscount(discountAmount);
        } else {
            setDiscount(0);
            alert('Invalid coupon code');
        }
    };



    const handleAddressSelection = (e) => {
        if (e.target.value === "None") {
            setDeliveryAddress({
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                zipCode: '',
                state: ''
            });
        } else {
            const selectedAddress = savedAddresses[e.target.value];
            setDeliveryAddress(selectedAddress);
        }
    };

    const handleRemoveCoupon = () => {
        setDiscount(0); // Reset discount to zero
        setCouponCode(''); // Clear the coupon code
    };


    const handleBillingChange = (e) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        const selectedIndex = e.target.value;
        if (selectedIndex !== "") {
            const selectedAddress = savedAddresses[selectedIndex];
            setDeliveryAddress(selectedAddress);
        }
    };

    const calculateTax = (state, total) => {
        const taxRates = {
            'Alabama': 0.04,
            'Alaska': 0.00, // No state sales tax, but local taxes may apply
            'Arizona': 0.056,
            'Arkansas': 0.065,
            'California': 0.0725,
            'Colorado': 0.029,
            'Connecticut': 0.0635,
            'Delaware': 0.00, // No sales tax
            'Florida': 0.06,
            'Georgia': 0.04,
            'Hawaii': 0.04,
            'Idaho': 0.06,
            'Illinois': 0.0625,
            'Indiana': 0.07,
            'Iowa': 0.06,
            'Kansas': 0.065,
            'Kentucky': 0.06,
            'Louisiana': 0.0445,
            'Maine': 0.055,
            'Maryland': 0.06,
            'Massachusetts': 0.0625,
            'Michigan': 0.06,
            'Minnesota': 0.06875,
            'Mississippi': 0.07,
            'Missouri': 0.04225,
            'Montana': 0.00, // No sales tax
            'Nebraska': 0.055,
            'Nevada': 0.0685,
            'New Hampshire': 0.00, // No sales tax
            'New Jersey': 0.06625,
            'New Mexico': 0.05125,
            'New York': 0.04,
            'North Carolina': 0.0475,
            'North Dakota': 0.05,
            'Ohio': 0.0575,
            'Oklahoma': 0.045,
            'Oregon': 0.00, // No sales tax
            'Pennsylvania': 0.06,
            'Rhode Island': 0.07,
            'South Carolina': 0.06,
            'South Dakota': 0.045,
            'Tennessee': 0.07,
            'Texas': 0.0625,
            'Utah': 0.0485,
            'Vermont': 0.06,
            'Virginia': 0.053,
            'Washington': 0.065,
            'West Virginia': 0.06,
            'Wisconsin': 0.05,
            'Wyoming': 0.04,
            'District of Columbia': 0.06
        };

        const taxRate = taxRates[state] || 0; // Default to 0 if state not found
        return total * taxRate;
    };

    const calculateTotalPriceWithTax = () => {
        const subtotal = calculateTotalPrice();
        const taxAmount = calculateTax(deliveryAddress.state, subtotal);
        return subtotal + taxAmount;
    };

    const calculateTotalWithDiscount = () => {
        const subtotal = calculateTotalPrice();
        const taxAmount = calculateTax(deliveryAddress.state, subtotal);
        const totalWithTax = subtotal + taxAmount;
        const totalAfterDiscount = totalWithTax - discount;

        return totalAfterDiscount >= 0 ? totalAfterDiscount : 0;
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        const subtotal = calculateTotalPrice();
        const taxAmount = calculateTax(deliveryAddress.state, subtotal);
        const totalWithTax = subtotal + taxAmount;
        const totalWithDiscount = totalWithTax - discount;

        const finalTotal = totalWithDiscount >= 0 ? totalWithDiscount : 0;

        const deliveryString = Object.values(deliveryAddress).join(', ');
        const billingString = useDeliveryForBilling ? deliveryString : Object.values(billingAddress).join(', ');

        // Construct the order object
        const newOrder = {
            ...order,
            order: {
                ...order.order,
                delivery_address: deliveryString,
                billing_address: billingString,
                total_price: finalTotal,
                tax: taxAmount,
                discount: discount
            }
        };
        // // Conditionally add payment_info only if needed
        if (paymentMethod === 'cash') {
            newOrder.order.payment_info = { type: "COD", amount: finalTotal };
        } else if (paypalDetails) {
            newOrder.order.payment_info = paypalDetails;
        }

        dispatch(createOrder(newOrder))
            .then((resp) => {

                console.log(resp);
                localStorage.setItem('order', JSON.stringify(resp));
                var test = resp;


                // Show confetti and success message upon successful dispatch
                setShowSuccess(true);

                // Redirect to home after 5 seconds
                setTimeout(() => {
                    console.log(test)
                    setShowSuccess(false); // Hide confetti and success message
                    window.location.href = "/home"; // Redirect to home page
                }, 5000);
            })
            .catch(error => {
                // Handle any errors from the dispatch here
                console.error("Error creating order:", error);
            });
    };



    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            {/* Display Cart Items */}
            {order?.orderItems?.length ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Subtotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems.map((item, index) => {
                            const subtotal = calculateItemSubtotal(item.quantity, item.price);
                            const itemId = item?._id;
                            if (!itemId) {
                                console.warn("Unexpected item structure:", item);
                                return null;
                            }

                            return (
                                <TableRow key={itemId}>
                                    <TableCell>
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px' }} />
                                        ) : (
                                            <Avatar variant="square">N/A</Avatar>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>${item.subtotal}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell colSpan={4} align="right">Total:</TableCell>
                            <TableCell>${calculateTotalPrice().toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="right">Tax:</TableCell>
                            <TableCell>${calculateTax(deliveryAddress.state, calculateTotalPrice()).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="right">Discount:</TableCell>
                            <TableCell>${discount.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} align="right">Total after Discount:</TableCell>
                            <TableCell>${calculateTotalWithDiscount().toFixed(2)}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            ) : (
                <Typography variant="body1">Your cart is empty.</Typography>
            )}

            <FormControl variant="outlined" sx={{ width: '250px', marginBottom: '20px' }}>
                <InputLabel id="saved-address-label">Select a Saved Address</InputLabel>
                <Select
                    labelId="saved-address-label"
                    label="Select a Saved Address"
                    onChange={handleAddressSelection}
                    value={selectedAddress}
                >
                    <MenuItem value="None">
                        <em>None</em>
                    </MenuItem>
                    {savedAddresses.map((address, index) => (
                        <MenuItem key={index} value={index}>
                            {address.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Paper elevation={3} className="checkout-paper">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <h3>Delivery Address</h3>
                            <TextField
                                className="mui-text-field"
                                label="First Name"
                                name="firstName"
                                value={deliveryAddress.firstName}
                                onChange={handleDeliveryChange}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Last Name"
                                name="lastName"
                                value={deliveryAddress.lastName}
                                onChange={handleDeliveryChange}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Address Line 1"
                                name="address1"
                                value={deliveryAddress.address1}
                                onChange={handleDeliveryChange}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Address Line 2"
                                name="address2"
                                value={deliveryAddress.address2}
                                onChange={handleDeliveryChange}
                            />
                            <TextField
                                className="mui-text-field"
                                label="City"
                                name="city"
                                value={deliveryAddress.city}
                                onChange={handleDeliveryChange}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Zip Code"
                                name="zipCode"
                                value={deliveryAddress.zipCode}
                                onChange={handleDeliveryChange}
                                required
                            />
                            <Select
                                label="State"
                                name="state"
                                value={deliveryAddress.state}
                                onChange={handleDeliveryChange}
                                required
                                sx={{ width: '300px' }} // Set the width here
                            >
                                {US_STATES.map((state, index) => (
                                    <MenuItem key={index} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={useDeliveryForBilling}
                                        onChange={(e) => setUseDeliveryForBilling(e.target.checked)}
                                    />
                                }
                                label="Use Delivery Address as Billing Address"
                            />
                            <h3>Billing Address</h3>
                            <TextField
                                className="mui-text-field"
                                label="First Name"
                                name="firstName"
                                value={billingAddress.firstName}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Last Name"
                                name="lastName"
                                value={billingAddress.lastName}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Address Line 1"
                                name="address1"
                                value={billingAddress.address1}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Address Line 2"
                                name="address2"
                                value={billingAddress.address2}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                            />
                            <TextField
                                className="mui-text-field"
                                label="City"
                                name="city"
                                value={billingAddress.city}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                            />
                            <TextField
                                className="mui-text-field"
                                label="Zip Code"
                                name="zipCode"
                                value={billingAddress.zipCode}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                            />
                            <Select
                                label="State"
                                name="state"
                                value={billingAddress.state}
                                onChange={handleBillingChange}
                                disabled={useDeliveryForBilling}
                                required
                                sx={{ width: '300px' }} // Set the width here

                            >
                                {US_STATES.map((state, index) => (
                                    <MenuItem key={index} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>

                    <h3>Payment Method</h3>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="cash">Cash on Delivery</option>
                        <option value="paypal">PayPal</option>
                    </select>

                    {paymentMethod === 'paypal' && (
                        <div ref={paypalRef}></div>
                    )}

                    {/* Coupon Code Section */}
                    <div className="coupon-section">
                        <TextField
                            label="Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                        />
                        <Button onClick={handleApplyCoupon}>Apply Coupon</Button>
                        <Button onClick={handleRemoveCoupon}>Remove Coupon</Button>
                    </div>

                    {/* Display Total Amount */}
                    <div className="total-amount">
                        <p>Total before discount: ${calculateTotalPriceWithTax().toFixed(2)}</p>
                        <p>Discount: ${discount.toFixed(2)}</p>
                        <p>Total after discount: ${calculateTotalWithDiscount().toFixed(2)}</p>
                    </div>
                    <Button type="submit" variant="contained" color="primary" className="place-order-button">Place Order</Button>
                </form>
            </Paper>

            {showSuccess && (
                <>
                    <Confetti />
                    <div className="success-message">Order created successfully!</div>
                </>
            )}
        </div>
    );
}

export default Checkout;
