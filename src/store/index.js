import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: {},
    startPage: 'LoginScreen',
    boxes: ['Account', 'Employee','Products', 'Brands', 'Lists', 'Campaigns', 'Creators', 'Support', 'Orders'],
    selectedBox: null,
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    selectBox(state, index) {
      state.selectedBox = state.boxes[index];
    }
  },
  actions: {
    async fetchUserData({ commit }) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        commit('setUser', response.data.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    }
  },
  modules: {
    // your modules
  }
});
