import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary,
    AccordionDetails, Typography, Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { updateOrder } from '../actions/order.js';
import html2pdf from 'html2pdf.js';
import { isMobileDevice } from '../utils.js';


export const generatePDF = (order) => {
    const element = document.createElement('div');

    let orderItemsTable = `
        <table border="1" cellspacing="0" cellpadding="5">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    let subtotal = 0;
    order.order_items.forEach(item => {
        subtotal += item.subtotal;
        orderItemsTable += `
            <tr>
                <td><img src="${item.image_url}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const discount = order.discount || 0;
    const tax = calculateTaxForOrder(order);
    const totalPrice = subtotal - discount + tax;

    orderItemsTable += `
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" align="right">Subtotal:</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" align="right">Discount:</td>
                <td>-$${discount.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" align="right">Tax:</td>
                <td>$${tax.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3" align="right"><strong>Total Price:</strong></td>
                <td><strong>$${totalPrice.toFixed(2)}</strong></td>
            </tr>
        </tfoot>
    </table>
    `;

    element.innerHTML = `
        <h2 style="color: #FF5733; text-shadow: 2px 2px #33FF57;">Hunger Express</h2>
        <h3>Invoice for Order: ${order._id}</h3>
        <p>Date: ${new Date(order.order_date).toLocaleString()}</p>
        <p>Status: ${order.order_status}</p>
        <p>Delivery Address: ${order.delivery_address}</p>
        ${orderItemsTable}
    `;
    const opt = {
        margin: 10,
        filename: `Invoice_${order._id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
const calculateTaxForOrder = (order) => {
    const subtotal = order.order_items.reduce((acc, item) => acc + item.subtotal, 0);
    const discountedSubtotal = Math.max(subtotal - (order.discount || 0), 0); // Ensure subtotal doesn't go below zero
    const taxRate = 0.1; // Assuming 10% tax rate, adjust as needed
    return discountedSubtotal * taxRate;
};
export const handleCancelClick = async (event, order, dispatch, updateOrder, orders, setOrders) => {
    event.stopPropagation();

    const { _id: orderId, order_date } = order;

    if (!orderId) {
        console.error('Order ID is undefined. Cannot proceed with the update.');
        alert('Error: Unable to cancel the order due to missing order ID.');
        return;
    }

    // Calculate the time difference in minutes
    const timeDiff = (new Date().getTime() - new Date(order_date).getTime()) / 60000; // Convert milliseconds to minutes

    let refundPercentage;
    if (timeDiff < 1) {
        refundPercentage = 90;
    } else if (timeDiff < 2) {
        refundPercentage = 80;
    } else if (timeDiff < 3) {
        refundPercentage = 70;
    } else if (timeDiff < 4) {
        refundPercentage = 60;
    } else if (timeDiff < 5) {
        refundPercentage = 50;
    } else if (timeDiff < 6) {
        refundPercentage = 40;
    } else if (timeDiff < 7) {
        refundPercentage = 30;
    } else if (timeDiff < 8) {
        refundPercentage = 20;
    } else if (timeDiff < 9) {
        refundPercentage = 10;
    } else {
        refundPercentage = 0; // No refund if more than 10 minutes
    }

    const refundAmount = (order.total_price * refundPercentage) / 100;

    // Confirm cancellation and refund with the user
    const confirmCancel = window.confirm(`Are you sure you want to cancel this order? You will receive a ${refundPercentage}% refund, amounting to $${refundAmount.toFixed(2)}.`);
    if (!confirmCancel) {
        return; // Stop if user does not confirm
    }

    try {
        const updatedOrderData = {
            orderId,
            orderData: { order_status: 'Canceled' }
        };
        await dispatch(updateOrder(updatedOrderData));

        // Update local state to reflect the change
        const updatedOrders = orders.map(o =>
            o._id === orderId ? { ...o, order_status: 'Canceled' } : o
        );
        setOrders(updatedOrders);

        // Update the alert message to include refund details
        alert(`Order has been successfully canceled. You will receive a ${refundPercentage}% refund, amounting to $${refundAmount.toFixed(2)}.`);

    } catch (error) {
        console.error('Failed to cancel the order:', error);
        alert('Error: Failed to cancel the order. Please try again.');
    }
};

const OrderHistory = () => {
    const [filterStatus, setFilterStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const user = useSelector(state => state.auth.user);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    // const [isCancelled, setIsCancelled] = useState(order.status === "Canceled");
    const dispatch = useDispatch(); // Call useDispatch at the top level


    const onHandleCancelClick = (event, order) => {
        handleCancelClick(event, order, dispatch, updateOrder, orders, setOrders);
    };

    useEffect(() => {
        if (user && user._id) {
            fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/history/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                });
        }
    }, [user]);

    // // Function to fetch orders
    const fetchOrders = () => {
        if (user && user._id) {
            fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/history/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                })
                .catch(error => {
                    console.error('Failed to fetch orders:', error);
                });
        }
    };

    useEffect(() => {
        setFilteredOrders(orders.filter(order =>
            filterStatus === '' || order.order_status === filterStatus
        ).sort((a, b) => new Date(b.order_date) - new Date(a.order_date)));
    }, [filterStatus, orders]);

    // UseEffect for initial fetch and setting up polling
    useEffect(() => {
        fetchOrders(); // Initial fetch
        const intervalId = setInterval(fetchOrders, 5000); // Set up polling every 5 seconds
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [user]);




    const calculateTotalPriceForOrder = (order) => {
        const subtotal = order.order_items.reduce((acc, item) => acc + item.subtotal, 0);
        const discountedSubtotal = Math.max(subtotal - (order.discount || 0), 0); // Ensure subtotal doesn't go below zero
        const tax = calculateTaxForOrder(order);
        return discountedSubtotal + tax;
    };

    // Helper function to check if the order is older than 30 minutes
    const isOrderOlderThan30Mins = (orderDate) => {
        const orderTime = new Date(orderDate).getTime();
        const currentTime = new Date().getTime();
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

        return (currentTime - orderTime) > THIRTY_MINUTES;
    };


    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
                <InputLabel id="order-status-label">Order Status</InputLabel>
                <Select
                    labelId="order-status-label"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Order Status"
                    style={{ width: '200px' }}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {['Placed', 'In Progress', 'Completed', 'Canceled'].map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {filteredOrders.map((order) => (
                <Accordion key={order._id} expanded={expandedOrderId === order._id} onChange={() => setExpandedOrderId(expandedOrderId !== order._id ? order._id : null)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableBody>
                                <TableRow className={isMobileDevice() ? 'mobile' : ''}>
                                   
                                    <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                                    <TableCell>{order.order_status}</TableCell>
                                    <TableCell>{order.delivery_address}</TableCell>
                                    <TableCell>{order.driver ? order.driver : "No Driver Assigned"}</TableCell>
                                    <TableCell>${order.total_price.toFixed(2)}</TableCell>
                                    <TableCell align="right">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => generatePDF(order)}
                                            >
                                                Download Invoice
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                disabled={isOrderOlderThan30Mins(order.order_date) || order.order_status === 'Canceled'}
                                                onClick={(event) => onHandleCancelClick(event, order)} // Ensure this calls onHandleCancelClick
                                            >
                                                {order.order_status === 'Canceled' ? 'Cancelled' : 'Cancel'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    
                                </TableRow>
                            </TableBody>
                        </Table>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography component="div">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.order_items.map(item => (
                                        <TableRow key={item._id}>
                                            <TableCell><Avatar src={item.image_url} alt={item.name} /></TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">Subtotal:</TableCell>
                                        <TableCell>${order.order_items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">Discount:</TableCell>
                                        <TableCell>-${(order.discount ? order.discount.toFixed(2) : '0.00')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">Tax:</TableCell>
                                        <TableCell>${(order.tax ? order.tax.toFixed(2) : '0.00')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} align="right"><strong>Total Price:</strong></TableCell>
                                        <TableCell><strong>${(order.total_price ? order.total_price.toFixed(2) : '0.00')}</strong></TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Snackbar
                open={showToast}
                autoHideDuration={6000}
                onClose={() => setShowToast(false)}
                message="Cannot cancel order at this point of time"
            />
        </div>
    );
}

export default OrderHistory;