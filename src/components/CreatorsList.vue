<template>
    <div class="orders-container">
      <div class="orders-list-container">
        <h3>Creators List</h3>
        <div class="orders-list">
          <div 
            v-for="influencer in influencers" 
            :key="influencer.id" 
            class="order-item" 
            @click="viewInfluencerDetails(influencer)"
          >
            <div class="order-details">
              <h4>{{ influencer.name }}</h4>
              <p>{{ influencer.bio || 'No bio available' }}</p>
            </div>
            <button @click.stop="deleteInfluencer(influencer.id)" class="delete-button">🗑️</button>
          </div>
        </div>
      </div>
  
      <div class="add-employee-form">
        <h3>Add New Influencer</h3>
        <form @submit.prevent="addInfluencer">
          <div class="input-group">
            <label for="name">
              <input 
                type="text" 
                v-model="newInfluencer.name" 
                placeholder="Name" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="number_of_posts">
              <input 
                type="text" 
                v-model="newInfluencer.number_of_posts" 
                placeholder="Number of Posts" 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="followers_number">
              <input 
                type="text" 
                v-model="newInfluencer.followers_number" 
                placeholder="Followers Number" 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="following_number">
              <input 
                type="text" 
                v-model="newInfluencer.following_number" 
                placeholder="Following Number" 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="threads_account">
              <input 
                type="text" 
                v-model="newInfluencer.threads_account" 
                placeholder="Threads Account" 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="bio">
              <textarea 
                v-model="newInfluencer.bio" 
                placeholder="Bio" 
                rows="4"
                required
              ></textarea>
            </label>
          </div>
          <button type="submit" class="add-product-button">Add Influencer</button>
        </form>
      </div>
  
      <!-- Dialog for viewing and adding influencer to a list -->
      <dialog v-if="selectedInfluencer" @close="selectedInfluencer = null" open>
        <div>
          <h3>{{ selectedInfluencer.name }}</h3>
          <p><strong>Number of Posts:</strong> {{ selectedInfluencer.number_of_posts || 'N/A' }}</p>
          <p><strong>Followers Number:</strong> {{ selectedInfluencer.followers_number || 'N/A' }}</p>
          <p><strong>Following Number:</strong> {{ selectedInfluencer.following_number || 'N/A' }}</p>
          <p><strong>Threads Account:</strong> {{ selectedInfluencer.threads_account || 'N/A' }}</p>
          <p><strong>Bio:</strong> {{ selectedInfluencer.bio || 'No bio available' }}</p>
          <div class="input-group">
            <label for="list_id">Select List</label>
            <select v-model="selectedListId" class="lists-select">
              <option 
                v-for="list in lists" 
                :key="list.id" 
                :value="list.id"
              >
                {{ list.list_name }}
              </option>
            </select>
          </div>
          <button @click="addToList">Add to List</button>
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
      influencers: [],
      lists: [],
      newInfluencer: {
        name: '',
        number_of_posts: null,
        followers_number: null,
        following_number: null,
        threads_account: null,
        bio: ''
      },
      selectedInfluencer: null,
      selectedListId: null
    };
  },
  methods: {
    async fetchInfluencers() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/influencer-account', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.influencers = response.data;
      } catch (error) {
        console.error('Failed to fetch influencers', error);
      }
    },
    async fetchLists() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.lists = response.data;
      } catch (error) {
        console.error('Failed to fetch lists', error);
      }
    },
    async addInfluencer() {
      const token = localStorage.getItem('access_token');
      try {
        await axios.post('https://iinfluencer.net/api/influencer-account/store', this.newInfluencer, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.fetchInfluencers(); // Refresh the list after adding
        this.resetForm(); // Reset the form fields
      } catch (error) {
        console.error('Failed to add influencer', error);
      }
    },
    async deleteInfluencer(id) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/influencer-account/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.fetchInfluencers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Failed to delete influencer', error);
      }
    },
    viewInfluencerDetails(influencer) {
      this.selectedInfluencer = influencer;
    },
    async addToList() {
      const token = localStorage.getItem('access_token');
      try {
        await axios.post('https://iinfluencer.net/api/list-influencer-account/store', {
          list_id: this.selectedListId,
          influencer_account_ids: [this.selectedInfluencer.id]
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.closeDialog(); // Close the dialog after adding
      } catch (error) {
        console.error('Failed to add influencer to list', error);
      }
    },
    closeDialog() {
      this.selectedInfluencer = null;
      this.selectedListId = null;
    },
    resetForm() {
      this.newInfluencer = {
        name: '',
        number_of_posts: null,
        followers_number: null,
        following_number: null,
        threads_account: null,
        bio: ''
      };
    }
  },
  mounted() {
    this.fetchInfluencers();
    this.fetchLists();
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
