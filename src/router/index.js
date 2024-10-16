import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue'; // Ensure this path is correct
import LoginScreen from '@/components/LoginScreen.vue'; // Ensure this path is correct
import RegisterScreen from '@/components/RegisterScreen.vue';
const routes = [
  {
    path: '/HomePage',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/',
    name: 'LoginScreen',
    component: LoginScreen 
    ,
  } ,
  {
    path: '/Register',
    name: 'RegisterScreen',
    component:  RegisterScreen
    ,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
