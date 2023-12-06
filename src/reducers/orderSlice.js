import { createSlice } from '@reduxjs/toolkit';
import { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrderById } from '../actions/order';

// Initial state for the order slice
const initialState = {
  order: {
    user_id: null,
    restaurant_id: null,
    delivery_address: '',
    total_price: 0,
    payment_info: '' 
  },
  orderItems: [],
  error: null
};



const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderItem: (state, action) => {
        const item = action.payload;
      
        console.log("Adding item to cart:", action.payload);
        state.order.user_id = item.user_id;

        // Safely access the $oid property
        const itemId = item?._id;
        if (!itemId) {
          console.warn("Unexpected item structure:", item);
          return;
        }
        const existingItem = state.orderItems.find(i => i._id === itemId);
      
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.subtotal = existingItem.price * existingItem.quantity;
        } else {
          state.orderItems.push({ ...item, subtotal: item.price * item.quantity });
        }

        state.order.restaurant_id = item.restaurant_id;
      
      
        // Update the total price of the order
        state.order.total_price = state.orderItems.reduce((acc, item) => acc + item.subtotal, 0);
      },
    removeOrderItem: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.orderItems.findIndex(item => item._id === itemId);
      if (itemIndex !== -1) {
        state.orderItems.splice(itemIndex, 1);
      }

      // Update the total price of the order after removing an item
      state.order.total_price = state.orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    },
    updateOrderItem: (state, action) => {
      const updatedItem = action.payload;
      const itemIndex = state.orderItems.findIndex(item => item._id === updatedItem._id);
      if (itemIndex !== -1) {
        state.order.total_price -= state.orderItems[itemIndex].subtotal;
        state.orderItems[itemIndex] = updatedItem;
        state.order.total_price += updatedItem.subtotal;
      }
    },
    clearOrder: (state) => {
      state.order = initialState.order;
      state.orderItems = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload._id);
      });
  }
});

export const { addOrderItem, removeOrderItem, updateOrderItem, clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
