import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"

export const createOrder = createAsyncThunk('order/createOrder', async (orderData) => {
  debugger;
  const response = await axios.post(`${base_url}/orders/create`, orderData);
  return response.data;
});

export const fetchAllOrders = () => async (dispatch) => {
  try {
    const response = await axios.get('https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders');
    dispatch({ type: 'FETCH_ALL_ORDERS_SUCCESS', payload: response.data });
  } catch (error) {
    console.error(error.response);
  }
}

export const getAllOrders = createAsyncThunk('order/getAllOrders', async () => {
  const response = await axios.get("/orders/");
  return response.data;
});

export const getOrderById = createAsyncThunk('order/getOrderById', async (orderId) => {
  const response = await axios.get(`/orders/${orderId}`);
  return response.data;
});

export const getOrdersByUserId = createAsyncThunk('order/getOrdersByUserId', async (userId) => {
  const response = await axios.get(`/orders/user/${userId}`);
  return response.data;
});

export const updateOrder = createAsyncThunk('order/updateOrder', async ({ orderId, orderData }) => {
  const response = await axios.put(`${base_url}/orders/update/${orderId}`, orderData);
  return response.data;
});

export const deleteOrderById = createAsyncThunk('order/deleteOrderById', async (orderId) => {
  const response = await axios.delete(`/orders/delete/${orderId}`);
  return response.data;
});

// Additional actions for orderHistory can be added similarly
