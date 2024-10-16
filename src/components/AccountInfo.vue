<template>
    <div class="container">
      <div class="account-info">
        <h2>Account Information</h2>
        <p><strong>Full Name:</strong> {{ user.full_name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Username:</strong> {{ user.user_name }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
        <p><strong>Domain:</strong> {{ user.domain }}</p>
        <p><strong>Industry:</strong> {{ user.industry }}</p>
        <p><strong>Created At:</strong> {{ user.created_at }}</p>
        <!-- Add more fields as needed --> 
  
        <h3>Location Information</h3>
        <p><strong>City:</strong> {{ location.city }}</p>
        <p><strong>State:</strong> {{ location.state }}</p>
        <p><strong>Province:</strong> {{ location.province }}</p>
        <p><strong>Country:</strong> {{ location.country }}</p>
        <p><strong>Address Line:</strong> {{ location.address_line }}</p> 
        <button @click="showLocationDialog = true" class="edit-location-button">Edit Location</button>

      </div>
  
      <div class="role-list">
        <h2>Roles in Company</h2>
        <ul>
          <li v-for="role in roles" :key="role.id" class="role-item">
            <div>
              <strong>{{ role.name }}</strong>
              <p>{{ role.level }}</p>
            </div>
            <button @click="deleteRole(role.id)" class="delete-button">
              &#x1F5D1;
            </button>
          </li>
        </ul>
        <!-- Button to open the add role dialog -->
        <button @click="showDialog = true" class="add-role-button">Add Roles</button>

        <!-- Edit Location Dialog -->
        <div v-if="showLocationDialog" class="dialog-overlay" @click="closeLocationDialog">
          <div class="dialog-content" @click.stop>
            <h2>Edit Location</h2>
            <div class="input-group">
              <label for="city">City</label>
              <input type="text" id="city" v-model="location.city" placeholder="Enter city">
            </div>
            <div class="input-group">
              <label for="state">State</label>
              <input type="text" id="state" v-model="location.state" placeholder="Enter state">
            </div>
            <div class="input-group">
              <label for="province">Province</label>
              <input type="text" id="province" v-model="location.province" placeholder="Enter province">
            </div>
            <div class="input-group">
              <label for="country">Country</label>
              <input type="text" id="country" v-model="location.country" placeholder="Enter country">
            </div>
            <div class="input-group">
              <label for="address-line">Address Line</label>
              <input type="text" id="address-line" v-model="location.address_line" placeholder="Enter address line">
            </div>
            <button @click="editLocation" class="add-product-button">Save Location</button>
            <button @click="closeLocationDialog" class="close-dialog-button">Cancel</button>
          </div>
          </div>

          <!-- Dialog for adding new roles -->
          <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
          <div class="dialog-content" @click.stop>
            <h2>Add New Role</h2>
            <div class="input-group">
              <label for="role-name">Role Name</label>
              <input type="text" id="role-name" v-model="newRole.name" placeholder="Enter role name">
            </div>
            <div class="input-group">
              <label for="role-level">Role Level</label>
              <input type="number" id="role-level" v-model="newRole.level" placeholder="Enter role level">
            </div>
            <button @click="addRole" class="add-product-button">Add Role</button>
            <button @click="closeDialog" class="close-dialog-button">Cancel</button>
          </div>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        showLocationDialog: false,
        locationId: null, // Store the location ID
        location: { 
          city: '',
          state: '',
          province: '',
          country: '',
          address_line: ''
        },
        roles: [],
        newRole: {
          name: '',
          level: ''
        },
        showDialog: false
      };
    }, 
    computed: {
      ...mapState(['user'])
    },
    mounted() {
      this.fetchLocation();
      this.fetchRoles();
    },

    methods: {
        fetchLocation() {  
    const token = localStorage.getItem('access_token');
    
    axios.get('https://iinfluencer.net/api/location', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      const data = response.data;
      if (data && data.length > 0) {
        this.location = {
          city: data[0].city,
          state: data[0].state,
          province: data[0].province,
          country: data[0].country,
          address_line: data[0].address_line
        };
        this.locationId = data[0].id; // Store the location ID
      }
    })
    .catch(error => {
      console.error("There was an error fetching the location!", error);
    });
  },

  editLocation() {
  const token = localStorage.getItem('access_token');
  axios.put(`https://iinfluencer.net/api/location/update/${this.locationId}`, {
    city: this.location.city,
    state: this.location.state,
    province: this.location.province,
    country: this.location.country,
    address_line: this.location.address_line
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("Location updated successfully:", response.data);
    this.showLocationDialog = false; // Close the dialog
    return this.fetchLocation(); // Re-fetch the updated location data
  })
  .then(() => {
    console.log("Location refetched successfully");
  })
  .catch(error => {
    console.error("There was an error updating the location!", error);
  });
},
      closeLocationDialog() {
        this.showLocationDialog = false;
      },

      fetchRoles() {
        const token = localStorage.getItem('access_token');
        axios.get('https://iinfluencer.net/api/company/role', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.roles = response.data.roles;
        })
        .catch(error => {
          console.error("There was an error fetching the roles!", error);
        });
      },
      
      deleteRole(roleId) {
        const token = localStorage.getItem('access_token');
        axios.delete(`https://iinfluencer.net/api/company/role/delete/${roleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          this.roles = this.roles.filter(role => role.id !== roleId);
        })
        .catch(error => {
          console.error("There was an error deleting the role!", error);
        });
      },
      
      addRole() {
        const token = localStorage.getItem('access_token');
        axios.post('https://iinfluencer.net/api/company/role/store', {
          name: this.newRole.name,
          level: this.newRole.level
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.roles.push(response.data); // Add the newly created role to the list
          this.newRole.name = ''; // Clear the form
          this.newRole.level = '';
          this.showDialog = false; // Close the dialog
        })
        .catch(error => {
          console.error("There was an error adding the role!", error);
        });
      },
      
      closeDialog() {
        this.showDialog = false;
      }
    }  
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .account-info {
    margin-right: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    width: 45%; /* Adjust the width as needed */
  }
  
  .role-list {
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    width: 45%; /* Adjust the width as needed */
    max-height: 440px; /* Set a maximum height for the list */
  overflow-y: auto; /* Enable vertical scrolling if the content exceeds the max height */

  }
  
  .role-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #ffffff;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .role-item div {
    display: flex;
    flex-direction: column;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #ff0000;
    font-size: 18px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    color: #cc0000;
  }
  
  .add-role-button {
    margin-top: 20px;
    width: 170px;
    padding: 15px;
    background: #E8C6CC;
    border-radius: 30px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-size: 16px;
    color: #FFFFFF;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .add-role-button:hover {
    background-color: #D6A6B4;
  }
  
  /* Dialog styles */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
  }
  
  .close-dialog-button {
    margin-top: 10px;
    padding: 10px;
    background: #ccc;
    border-radius: 5px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .close-dialog-button:hover {
    background-color: #bbb;
  }
  
  .input-group {
    margin-bottom: 15px;
    position: relative;
  }
  
  .input-group label {
    display: block;
    position: relative;
    width: 100%;
  }
  
  .input-group input {
    width: 100%;
    padding: 15px;
    padding-left: 20px;
    border-radius: 30px;
    border: 2px solid #C6CEDC;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }
  
  .input-group input:focus {
    border-color: #86ADC3;
  }
  
  .add-product-button {
    width: 100%;
    padding: 15px;
    background: #E8C6CC;
    border-radius: 30px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-size: 16px;
    color: #FFFFFF;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .add-product-button:hover {
    background-color: #D6A6B4;
  } 
  .edit-location-button {
    margin-top: 20px;
    width: 170px;
    padding: 15px;
    background: #E8C6CC;
    border-radius: 30px;
    border: none;
    font-family: 'Urbanist', sans-serif;
    font-size: 16px;
    color: #FFFFFF;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .edit-location-button:hover {
    background-color: #D6A6B4;
  }
  
  </style>
