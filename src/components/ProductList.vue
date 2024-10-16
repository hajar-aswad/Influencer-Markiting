<template>
  <div class="content-container">
    <!-- Table Section -->
    <div class="table-section">
      <div class="table-container">
        <div class="product-table">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>BRAND</th>
                <th>PRICE</th>
                <th>DESCRIPTION</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in products" :key="index">
                <td class="product-info">
                  <span>{{ product.name }}</span>
                </td>
                <!-- Safeguard against undefined product.brand -->
                <td>{{ product.brand ? product.brand.name : 'Unknown Brand' }}</td>
                <td>{{ product.price || 'N/A' }}</td> <!-- Show price or 'N/A' if null -->
                <td>{{ product.description || 'N/A' }}</td> <!-- Show description or fallback text -->
                <td>
                  <button class="delete-button" @click="deleteProduct(product.id)">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Product Section -->
    <div class="form-section">
      <div class="add-product-form">
        <h3>Add New Product</h3>
        <form @submit.prevent="addProduct">
          <div class="input-group">
            <label for="productName">
              <input type="text" v-model="newProduct.name" placeholder="Product Name" />
            </label>
          </div>
          <div class="input-group select-wrapper">
            <label for="brandSelect">
              select a brand 
              <select v-model="newProduct.brand_id" class="styled-select">
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </label>
          </div>
          <div class="input-group">
            <label for="productPrice">
              <input type="number" v-model="newProduct.price" placeholder="Price" />
            </label>
          </div>
          <div class="input-group">
            <label for="productDescription">
              <input type="text" v-model="newProduct.description" placeholder="Description" />
            </label>
          </div>
          <button type="submit" class="add-product-button">Add Product</button>
        </form>
      </div>
    </div>
  </div>
</template>




<script>
import axios from 'axios';


export default {
  name: 'ProductList',
  data() {
    return {
      products: [], // Initialize products array
      brands: [], // Initialize brands array
      newProduct: {
        name: '',
        brand_id: '', // Track the selected brand ID
        price: null, // Track the price
        description: '', // Track the description
      },
    };

  },
  methods: {
    // Fetch products from the backend
    async fetchProducts() {
  const token = localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://iinfluencer.net/api/product', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    this.products = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
,
    // Fetch brands from the backend
    async fetchBrands() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/brand', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.brands = response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    },
    // Add a new product to the backend
    async addProduct() {
  const token = localStorage.getItem('access_token');

  // Log the product data to verify it's being populated correctly
  console.log("New Product Data: ", this.newProduct);

  if (!this.newProduct.brand_id) {
    console.error('Brand ID is required');
    return;
  }

  try {
    const response = await axios.post(
      'https://iinfluencer.net/api/product/store',
      this.newProduct,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Product added successfully:', response.data);

    this.products.push(response.data); // Assuming the API returns the created product
    // Reset form fields 
    this.newProduct = {
      name: '',
      brand_id: '',
      price: null,
      description: '',
    };
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
  }
}

,    // Delete a product from the backend
    async deleteProduct(productId) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/product/delete/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.products = this.products.filter(product => product.id !== productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  },
  mounted() {
    this.fetchProducts(); // Fetch products when the component is mounted
    this.fetchBrands(); // Fetch brands when the component is mounted
  }
};
</script> 



<style scoped>
@import "@/assets/css/tablesandframe.css";
</style>









  
  