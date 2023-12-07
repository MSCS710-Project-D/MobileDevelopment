import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary,
  AccordionDetails, Typography, Avatar, Button, Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { updateOrder } from '../actions/order.js';
import html2pdf from 'html2pdf.js';
import { isMobileDevice } from '../utils.js';

const AdminOrders = () => {
  const [filterStatus, setFilterStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});

  const dispatch = useDispatch();

  // Function to fetch all orders
  const fetchAllOrders = () => {
    // Replace with your API endpoint to fetch all orders
    fetch('https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
      });
  };

  useEffect(() => {
    fetchAllOrders(); // Fetch all orders on component mount
  }, []);

  const calculateTaxForOrder = (order) => {
    const subtotal = order.order_items.reduce((acc, item) => acc + item.subtotal, 0);
    const discountedSubtotal = Math.max(subtotal - (order.discount || 0), 0); // Ensure subtotal doesn't go below zero
    const taxRate = 0.1; // Assuming 10% tax rate, adjust as needed
    return discountedSubtotal * taxRate;
};

  // Fetch drivers
  const fetchDrivers = () => {
    fetch('https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers')
      .then(res => res.json())
      .then(data => {
        setDrivers(data);
      })
      .catch(error => {
        console.error('Failed to fetch drivers:', error);
      });
  };

  useEffect(() => {
    fetchAllOrders();
    fetchDrivers(); // Fetch drivers on component mount
  }, []);

  // Handle driver selection
  const handleDriverSelect = async (orderId, driverId) => {
    const selectedDriver = drivers.find(driver => driver._id === driverId);
    if (!selectedDriver) {
      console.error('Selected driver not found');
      return;
    }

    const updatedOrderData = {
      driver: selectedDriver.license_plate // Assuming you want to store the license plate
    };

    try {
      const response = await fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrderData)
      });

      if (!response.ok) {
        throw new Error('Failed to update order with driver');
      }

      // Update local state to reflect the change
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, driver: selectedDriver.license_plate } : order
      );
      setOrders(updatedOrders);

      setSelectedDrivers(prev => ({ ...prev, [orderId]: driverId }));
    } catch (error) {
      console.error('Error updating order with driver:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };


  useEffect(() => {
    setFilteredOrders(orders.filter(order =>
      filterStatus === '' || order.order_status === filterStatus
    ).sort((a, b) => new Date(b.order_date) - new Date(a.order_date)));
  }, [filterStatus, orders]);

  const generatePDF = (order) => {
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


  const isOrderOlderThan30Mins = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

    return (currentTime - orderTime) > THIRTY_MINUTES;
  };

  const handleCancelClick = async (event, order) => {
    event.stopPropagation();

    const { _id: orderId } = order;

    if (!orderId) {
      console.error('Order ID is undefined. Cannot proceed with the update.');
      alert('Error: Unable to cancel the order due to missing order ID.');
      return;
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

      alert('Order has been successfully canceled.');
    } catch (error) {
      console.error('Failed to cancel the order:', error);
      alert('Error: Failed to cancel the order. Please try again.');
    }
  };


  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;

    // Find the order to be updated
    const orderToUpdate = orders.find(order => order._id === orderId);
    if (!orderToUpdate) {
      console.error('Order not found');
      return;
    }

    // Prepare the updated order payload
    const updatedOrderData = {
      ...orderToUpdate,
      order_status: newStatus
    };

    try {
      // Make an API call to update the order
      const response = await fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrderData)
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state with the new order status
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, order_status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      // Handle error (e.g., show a notification to the user)
    }
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
                  <TableCell>
                    <FormControl variant="outlined" size="small">
                      <Select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(e, order._id)}
                        style={{ minWidth: 120 }}
                      >
                        {['Placed', 'In Progress', 'Completed', 'Canceled'].map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small" disabled={!!selectedDrivers[order._id]}>
                      <Select
                        value={selectedDrivers[order._id] || ''}
                        onChange={(e) => handleDriverSelect(order._id, e.target.value)}
                        style={{ minWidth: 120 }}
                      >
                        {drivers.map(driver => (
                          <MenuItem key={driver._id} value={driver._id}>
                            {driver.vehicle_type} - {driver.license_plate}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{order.delivery_address}</TableCell>
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
                        onClick={(event) => handleCancelClick(event, order)}
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

export default AdminOrders;