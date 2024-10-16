<template>
    <div class="login-container">
      <h1>REGISTER</h1>
      <p>Create Your Account</p>
  
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="full_name">
            <span class="icon">👤</span>
            <input type="text" id="full_name" placeholder="Full Name" v-model="full_name" required />
          </label>
        </div>
        <div class="input-group">
          <label for="email">
            <span class="icon">✉️</span>
            <input type="email" id="email" placeholder="Email" v-model="email" required />
          </label>
        </div>
        <div class="input-group">
          <label for="user_name">
            <span class="icon">👤</span>
            <input type="text" id="user_name" placeholder="Username" v-model="user_name" required />
          </label>
        </div>
        <div class="input-group">
          <label for="password">
            <span class="icon">🔒</span>
            <input type="password" id="password" placeholder="Password" v-model="password" required />
            <span class="toggle-password" @click="togglePassword">👁️</span>
          </label>
        </div>
        <button type="submit" class="login-button">Register</button>
        <div class="reset-password">
        <div class="reset-password">
        <router-link to="/">If you do have an account <span> LOGIN</span></router-link>
      </div>
      </div>
      </form> 

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RegisterScreen',
    data() {
      return {
        full_name: '',
        email: '',
        user_name: '',
        password: '',
        showPassword: false
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('https://iinfluencer.net/api/register', {
            full_name: this.full_name,
            email: this.email,
            password: this.password,
            user_name: this.user_name,
           
          });
  
          console.log('Registration successful:', response.data);
  
          this.$router.push({ name: 'LoginScreen' });
        } catch (error) {
  console.error('Registration failed:', error.response ? error.response.data : error.message);
  alert(`Registration failed: ${error.response ? error.response.data.message : 'Please check your information.'}`);
}

      },
      togglePassword() {
        this.showPassword = !this.showPassword;
        const passwordField = document.querySelector('#password');
        passwordField.type = this.showPassword ? 'text' : 'password';
      }
    }
  };
  </script>
  
  <style scoped>
@import "@/assets/css/styles.css";
</style>
  