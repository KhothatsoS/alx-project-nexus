const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://modestwear.onrender.com';

const getAuthHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return {
      access: data.data.tokens.access_token,
      refresh: data.data.tokens.refresh_token,
      user: data.data.user
    };
  },
  
  register: async (email: string, password: string, full_name: string) => {
    const res = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, full_name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return {
      access: data.data.tokens.access_token,
      refresh: data.data.tokens.refresh_token,
      user: data.data.user
    };
  },
  
  googleLogin: async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth/social/google/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google login failed');
    return data;
  },
  
  getProfile: async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth/profile/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
  
  updateProfile: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/auth/profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },
  
  logout: async (token: string, refreshToken: string) => {
    const res = await fetch(`${API_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ refresh: refreshToken })
    });
    return res.ok;
  }
};

export const productsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/api/catalog/products/`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  
  getDetail: async (category: string, slug: string) => {
    const res = await fetch(`${API_URL}/api/catalog/products/${category}/${slug}/`);
    if (!res.ok) throw new Error('Failed to fetch product detail');
    return res.json();
  },
  
  search: async (query: string) => {
    const res = await fetch(`${API_URL}/api/catalog/products/search/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },
  
  getCategories: async () => {
    const res = await fetch(`${API_URL}/api/catalog/categories/`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },
  
  getFilters: async () => {
    const res = await fetch(`${API_URL}/api/catalog/filters/`);
    if (!res.ok) throw new Error('Failed to fetch filters');
    return res.json();
  }
};

export const cartAPI = {
  get: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/cart/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },
  
  add: async (token: string, variantId: number, quantity: number) => {
    const res = await fetch(`${API_URL}/api/orders/cart/add/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ variant_id: variantId, quantity })
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return res.json();
  },
  
  update: async (token: string, itemId: number, quantity: number) => {
    const res = await fetch(`${API_URL}/api/orders/cart/update/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ item_id: itemId, quantity })
    });
    if (!res.ok) throw new Error('Failed to update cart');
    return res.json();
  },
  
  remove: async (token: string, itemId: number) => {
    const res = await fetch(`${API_URL}/api/orders/cart/remove/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ item_id: itemId })
    });
    return res.ok;
  }
};

export const ordersAPI = {
  getAll: async (token: string) => {
    const res = await fetch(`${API_URL}/api/orders/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },
  
  checkout: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/orders/checkout/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Checkout failed');
    return res.json();
  }
};

export const recommendationsAPI = {
  popular: async () => {
    const res = await fetch(`${API_URL}/api/catalog/recommendations/popular/`);
    if (!res.ok) throw new Error('Failed to fetch popular products');
    return res.json();
  },
  
  trending: async () => {
    const res = await fetch(`${API_URL}/api/catalog/recommendations/trending/`);
    if (!res.ok) throw new Error('Failed to fetch trending products');
    return res.json();
  },
  
  forMe: async (token: string) => {
    const res = await fetch(`${API_URL}/api/catalog/recommendations/for-me/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  }
};

export const outfitsAPI = {
  getAll: async (token: string) => {
    const res = await fetch(`${API_URL}/api/outfits/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch outfits');
    return res.json();
  },
  
  create: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/outfits/create/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create outfit');
    return res.json();
  },
  
  delete: async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/api/outfits/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return res.ok;
  }
};
