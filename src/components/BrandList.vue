<template>
  <div class="content-container">
    <!-- Table Section -->
    <div class="table-section">
      <div class="table-container">
        <div class="product-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Target Audience</th>
                <th>Industry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(brand, index) in brands" :key="index">
                <td class="product-info">
                  <span>{{ brand.name }}</span>
                </td>
                <td>{{ brand.description || 'N/A' }}</td>
                <td>{{ brand.target_audience || 'N/A' }}</td>
                <td>{{ brand.industry || 'N/A' }}</td>
                <td>
                  <button class="delete-button" @click="deleteBrand(brand.id)">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    <!-- Add Brand Section -->
    <div class="form-section">
      <div class="add-product-form">
        <h3>Add New Brand</h3>
        <form @submit.prevent="addBrand">
          <div class="input-group">
            <label for="brandName">
              <input type="text" v-model="newBrand.name" placeholder="Brand Name" />
            </label>
          </div>
          <div class="input-group">
            <label for="brandDescription">
              <input type="text" v-model="newBrand.description" placeholder="Description" />
            </label>
          </div>
          <div class="input-group">
            <label for="brandIndustry">
              <input type="text" v-model="newBrand.industry" placeholder="Industry" />
            </label>
          </div>
          <div class="input-group">
            <label for="targetAudience">
              <input type="text" v-model="newBrand.target_audience" placeholder="Target Audience" />
            </label>
          </div>
          <button type="submit" class="add-product-button">Add Brand</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default { 
  name: 'BrandTable',
  data() {
    return {
      brands: [],
      newBrand: {
        name: '',
        description: '',
        industry: '',
        target_audience: '',
      },
    };
  },
  mounted() {
    this.fetchBrands();
  }, 

  methods: {
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

    async addBrand() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.post('https://iinfluencer.net/api/brand/store', this.newBrand, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.brands.push(response.data);
        // Reset the form fields using the newBrand object
        this.newBrand = {
          name: '',
          description: '',
          industry: '',
          target_audience: '',
        };
      } catch (error) {
        console.error('Error adding Brand:', error);
      }
    },

    async deleteBrand(id) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/brand/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.brands = this.brands.filter(brand => brand.id !== id);
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  },
};
</script>

<style scoped>
@import "@/assets/css/tablesandframe.css";
</style>
