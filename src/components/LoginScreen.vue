<template>
  <div class="login-container">
    <h1>LOGIN</h1>
    <p>Welcome Back!</p>

    <form @submit.prevent="login">
      <div class="input-group">
        <label for="username">
          <span class="icon">👤</span>
          <input type="text" id="username" placeholder="Username" v-model="username" required />
        </label>
      </div>
      <div class="input-group">
        <label for="password">
          <span class="icon">🔒</span>
          <input type="password" id="password" placeholder="Password" v-model="password" required />
          <span class="toggle-password" @click="togglePassword">👁️</span>
        </label>
      </div>
      <button type="submit" class="login-button">Log In</button>
      <div class="reset-password">
        <div class="reset-password">
        <router-link to="/Register">If you don't have an account already?<span> Register</span></router-link>
      </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginScreen',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://iinfluencer.net/api/dashboard/login', {
          email: this.username, 
          password: this.password
        });
        
        const accessToken = response.data.access_token;

        localStorage.setItem('access_token', accessToken);

        console.log('Login successful:', accessToken);

        this.$router.push({ name: 'HomePage' });
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
      const passwordField = document.querySelector('#password');
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
};
console.log("$accessToken")
</script>

<style scoped>
@import "@/assets/css/styles.css";
</style>
