<template>
    <div class="orders-container">
      <div class="orders-list-container">
        <h3>Company Employee List</h3>
        <div class="orders-list">
          <div 
            v-for="employee in employees" 
            :key="employee.id" 
            class="order-item" 
            @click="viewEmployeeDetails(employee)"
          >
            <div class="order-details">
              <h4>{{ employee.user.full_name }}</h4>
              <p>{{ employee.user.phone || 'No phone available' }}</p>
            </div>
            <button @click.stop="deleteEmployee(employee.id)" class="delete-button">🗑️</button>
          </div>
        </div>
      </div>
  
      <div class="add-employee-form">
        <h3>Add New Employee</h3>
        <form @submit.prevent="addEmployee">
          <div class="input-group">
            <label for="full_name">
              <input 
                type="text" 
                v-model="newEmployee.full_name" 
                placeholder="Full Name" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="email">
              <input 
                type="email" 
                v-model="newEmployee.email" 
                placeholder="Email" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="phone">
              <input 
                type="text" 
                v-model="newEmployee.phone" 
                placeholder="Phone" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="user_name">
              <input 
                type="text" 
                v-model="newEmployee.user_name" 
                placeholder="Username" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="password">
              <input 
                type="password" 
                v-model="newEmployee.password" 
                placeholder="Password" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="role_ids">Roles</label>
            <select multiple v-model="newEmployee.role_ids" class="roles-select">
              <option 
                v-for="role in roles" 
                :key="role.id" 
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
          </div>
          <button type="submit" class="add-product-button">Add Employee</button>
        </form>
      </div>
  
      <!-- Dialog for viewing and editing employee details -->
      <dialog v-if="selectedEmployee" @close="selectedEmployee = null" open>
        <div>
          <h3>{{ selectedEmployee.user.full_name }}</h3>
          <p><strong>Participation Date:</strong> {{ selectedEmployee.participation_date || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ selectedEmployee.user.email }}</p>
          <p><strong>Phone:</strong> {{ selectedEmployee.user.phone || 'N/A' }}</p>
          <p><strong>Username:</strong> {{ selectedEmployee.user.user_name }}</p>
          <h4>Roles</h4>
          <ul>
            <li v-for="role in selectedEmployee.roles" :key="role.id">{{ role.name }}</li>
          </ul>
        </div>
        <button @click="closeDialog">Close</button>
      </dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        employees: [],
        roles: [],
        newEmployee: {
          full_name: '',
          email: '',
          phone: '',
          user_name: '',
          password: '',
          role_ids: []
        },
        selectedEmployee: null,
      };
    },
    methods: {
      async fetchEmployees() {
        const token = localStorage.getItem('access_token');
        try {
          const response = await axios.get('https://iinfluencer.net/api/company-employees', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.employees = response.data.companyEmployee;
        } catch (error) {
          console.error('Failed to fetch employees', error);
        }
      },
      async fetchRoles() {
        const token = localStorage.getItem('access_token');
        try {
          const response = await axios.get('https://iinfluencer.net/api/company/role', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.roles = response.data.roles;
        } catch (error) {
          console.error('There was an error fetching the roles!', error);
        }
      },
      async addEmployee() {
        const token = localStorage.getItem('access_token');
        try {
          await axios.post('https://iinfluencer.net/api/company-employees/store', this.newEmployee, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.fetchEmployees(); // Refresh the list after adding
          this.resetForm(); // Reset the form fields
        } catch (error) {
          console.error('Failed to add employee', error);
        }
      },
      async deleteEmployee(id) {
        const token = localStorage.getItem('access_token');
        try {
          await axios.delete(`https://iinfluencer.net/api/company-employees/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.fetchEmployees(); // Refresh the list after deletion
        } catch (error) {
          console.error('Failed to delete employee', error);
        }
      },
      viewEmployeeDetails(employee) {
        this.selectedEmployee = employee;
      },
      closeDialog() {
        this.selectedEmployee = null;
      },
      resetForm() {
        this.newEmployee = {
          full_name: '',
          email: '',
          phone: '',
          user_name: '',
          password: '',
          role_ids: []
        };
      }
    },
    mounted() {
      this.fetchEmployees();
      this.fetchRoles();
    }
  };
  </script>
  
  <style>
  .orders-container {
    display: flex;
    flex-direction: row;
    gap: 20px; /* Adds space between the list and the form */

  }
  
.orders-list-container {
  flex: 1; /* Make the orders list container take up all available space */
  margin-left: 20px; /* Move it 20px to the right */
}

  .orders-list { 
width: 400px;
    height: 400px; /* Set a fixed height for the form */
  overflow-y: auto; /* Enable vertical scrolling */

  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
    margin-bottom: 10px;
    border-radius: 15px;
    cursor: pointer;
  }
  
  .order-details {
    flex-grow: 1;
  }
  
  .delete-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .add-employee-form {
    margin-left: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px; 
    height: 400px; /* Set a fixed height for the form */
  overflow-y: auto; /* Enable vertical scrolling */

  } 
  
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group input,
  .input-group select {
    width: 100%;
    padding: 10px;
    border-radius: 30px;
    border: 2px solid #C6CEDC;
  }
  
  .roles-select {
    height: 70px;
    overflow-y: auto;
  }
  
  .add-product-button {
    padding: 15px;
    background-color: #E8C6CC;
    border-radius: 30px;
    border: none;
    color: white;
    cursor: pointer;
  }
  
  .add-product-button:hover {
    background-color: #D6A6B4;
  }
  </style>
  