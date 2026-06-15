import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../services/api';

/**
 * transformProduct: Bitta mahsulotni frontend formatiga o'tkazadi.
 */
const transformProduct = (product) => {
  if (!product) return null;
  const image = product.image || product.img;
  let imgPath = '/assets/no-img.png';
  
  if (image) {
    imgPath = (image.startsWith('http') || image.startsWith('data:')) 
      ? image 
      : `/assets/${image}`;
  }

  return {
    ...product,
    id: String(product.id).startsWith('static') ? product.id : Number(product.id),
    name: product.name || '',
    price: Number(product.price || 0),
    img: imgPath
  };
};

/**
 * transformCart: Backend ma'lumotlarini frontendga moslaydi.
 */
const transformCart = (data) => {
  const items = data?.CartItems || (Array.isArray(data) ? data : []);
  return items.map(item => {
    // Mahsulot o'chirilgan bo'lsa, bu elementni o'tkazib yuboramiz
    if (!item.Product && item.productId) return null;
    const product = item.Product || item;
    const transformed = transformProduct(product);
    if (!transformed || !transformed.id) return null;
    if (!transformed.name) return null;
    if (isNaN(Number(transformed.id)) && !String(transformed.id).startsWith('static')) return null;
    return {
      ...transformed,
      quantity: Number(item.quantity || 1)
    };
  }).filter(Boolean);
};

/**
 * transformWishlist: Backend ma'lumotlarini frontendga moslaydi.
 */
const transformWishlist = (data) => {
  const items = Array.isArray(data) ? data : [];
  return items.map(item => {
    // Mahsulot o'chirilgan bo'lsa, bu elementni o'tkazib yuboramiz
    if (!item.Product && item.productId) return null;
    const product = item.Product || item;
    const transformed = transformProduct(product);
    if (!transformed || !transformed.id) return null;
    if (!transformed.name) return null;
    if (isNaN(Number(transformed.id)) && !String(transformed.id).startsWith('static')) return null;
    return transformed;
  }).filter(Boolean);
};

// --- API ACTIONS ---

export const loginUser = createAsyncThunk('shop/loginUser', async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
});

export const registerUser = createAsyncThunk('shop/registerUser', async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
});

export const googleLoginUser = createAsyncThunk('shop/googleLoginUser', async (userData) => {
  const response = await api.post('/auth/google', userData);
  return response.data;
});

export const fetchProducts = createAsyncThunk('shop/fetchProducts', async () => {
  const response = await api.get('/products');
  return response.data;
});

export const fetchCategories = createAsyncThunk('shop/fetchCategories', async () => {
  const response = await api.get('/categories');
  return response.data;
});

export const fetchCart = createAsyncThunk('shop/fetchCart', async () => {
  const response = await api.get('/cart');
  return transformCart(response.data);
});

export const fetchWishlist = createAsyncThunk('shop/fetchWishlist', async () => {
  const response = await api.get('/wishlist');
  return transformWishlist(response.data);
});

export const addToCart = createAsyncThunk('shop/addToCart', async (product, { getState }) => {
  const { user } = getState().shop;
  if (user && !String(product.id).startsWith('static')) {
    const response = await api.post('/cart/add', { productId: product.id, quantity: 1 });
    return transformCart(response.data);
  }
  return { ...transformProduct(product), quantity: 1 };
});

export const removeFromCart = createAsyncThunk('shop/removeFromCart', async (productId, { getState }) => {
  const { user } = getState().shop;
  if (user && !String(productId).startsWith('static')) {
    const response = await api.delete(`/cart/remove/${productId}`);
    return transformCart(response.data);
  }
  return productId;
});

export const addtoWishlist = createAsyncThunk('shop/addtoWishlist', async (product, { getState }) => {
  const { user } = getState().shop;
  if (user && !String(product.id).startsWith('static')) {
    const response = await api.post('/wishlist/add', { productId: product.id });
    return transformWishlist(response.data);
  }
  return transformProduct(product);
});

export const removeFromWish = createAsyncThunk('shop/removeFromWish', async (productId, { getState }) => {
  const { user } = getState().shop;
  if (user && !String(productId).startsWith('static')) {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return transformWishlist(response.data);
  }
  return productId;
});

export const createOrder = createAsyncThunk('shop/createOrder', async () => {
  const response = await api.post('/orders');
  return response.data;
});

// --- SLICE ---

const getLocalCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem('cart')) || [];
    return data.filter(i => i && i.id && (!isNaN(Number(i.id)) || String(i.id).startsWith('static')));
  } catch(e) { return []; }
};

const getLocalWishlist = () => {
  try {
    const data = JSON.parse(localStorage.getItem('wishlist')) || [];
    return data.filter(i => i && i.id && (!isNaN(Number(i.id)) || String(i.id).startsWith('static')));
  } catch(e) { return []; }
};

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    products: [],
    categories: [],
    cart: getLocalCart(),
    wishlist: getLocalWishlist(),
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.cart = [];
      state.wishlist = [];
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(i => Number(i.id) === Number(id));
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    }
  },
  extraReducers: (builder) => {
    // Auth Success
    const authSuccess = (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    };
    builder.addCase(loginUser.fulfilled, authSuccess);
    builder.addCase(registerUser.fulfilled, authSuccess);
    builder.addCase(googleLoginUser.fulfilled, authSuccess);

    // Fetching
    builder.addCase(fetchProducts.fulfilled, (state, action) => { 
        state.products = action.payload.map(p => transformProduct(p)); 
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => { 
        state.categories = action.payload; 
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => { 
        state.cart = action.payload; 
        localStorage.setItem('cart', JSON.stringify(state.cart));
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => { 
        state.wishlist = action.payload; 
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    });

    // Cart Logic
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.cart = action.payload;
      } else {
        const product = action.payload;
        const item = state.cart.find(i => Number(i.id) === Number(product.id));
        if (item) item.quantity++;
        else state.cart.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.cart = action.payload;
      } else {
        state.cart = state.cart.filter(i => String(i.id) !== String(action.payload));
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    });

    // Wishlist Logic
    builder.addCase(addtoWishlist.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.wishlist = action.payload;
      } else {
        const product = action.payload;
        const exists = state.wishlist.find(i => Number(i.id) === Number(product.id));
        if (!exists) state.wishlist.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    });
    builder.addCase(removeFromWish.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.wishlist = action.payload;
      } else {
        state.wishlist = state.wishlist.filter(i => String(i.id) !== String(action.payload));
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    });

    // Order Success
    builder.addCase(createOrder.fulfilled, (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    });
  }
});

export const { logout, updateQuantity, clearCart } = shopSlice.actions;
export default shopSlice.reducer;
