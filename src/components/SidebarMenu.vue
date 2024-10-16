<template> 
    <div class="sidebar">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="Iinfluencer Logo">
        </div>
        
        <div class="boxes">
            <div class="box" v-for="(box, index) in boxes" :key="index" @click="selectBox(index)">
                {{ box }}
            </div>
        </div> 
        
        <div class="user-info">
            <img src="../assets/images/user-avatar.png" alt="User Avatar">
            <div class="user-details">
              <p>{{ user.full_name }}</p>
              <p>Role: {{ user.role }}</p>
            </div>
    
            <!-- Logout icon, replaces the old options-icon div -->
            <div class="logout-icon" @click="logout">
              🔒 Logout
            </div>
        </div>
    </div>
    </template>
    
    <script>
    import { mapState } from 'vuex';
    import axios from 'axios';
    
    export default {
      name: 'SidebarMenu',
      
      computed: {
        ...mapState(['user']),
        boxes() {
          return this.$store.state.boxes;
        }
      },
    
      methods: {
        selectBox(index) {
          this.$store.commit('selectBox', index);
        },
        
        async logout() {
          const token = localStorage.getItem('access_token');
          
          try {
            await axios.get('https://iinfluencer.net/api/logout', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
            // Clear the token and navigate to the login screen
            localStorage.removeItem('access_token');
            this.$router.push({ name: 'LoginScreen' });
        } catch (error) {
            console.error('Logout failed', error);
          }
        }
      },
    
      created() {
        // Select the "Account" box by default when the component is created
        this.$store.commit('selectBox', 0); // Replace 0 with the index of the box you want to select by default
      }
    };
    </script>
    
    <style scoped>
    /* Add necessary styles */
    @import "@/assets/css/homestyle.css";
    
    .logout-icon {
      cursor: pointer;
      margin-top: 10px;
      color:white; /* Adjust color as needed */
      font-weight: bold;
    }
    
    .logout-icon:hover {
      color: #555; /* Change color on hover */
    }
    </style>
    