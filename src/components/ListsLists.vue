<template>
  <div class="content-container">
    <!-- Table Section -->
    <div class="table-section">
      <div class="table-container">
        <div class="product-table">
          <table>
            <thead>
              <tr>
                <th>List Name</th>
                <th>Filtering Criteria</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="list in lists" :key="list.id">
                <td @click="openDialog(list)">{{ list.list_name }}</td> <!-- List name -->
                <td @click="openDialog(list)">{{ list.filtering_criteria || 'N/A' }}</td> <!-- Show filtering criteria or fallback text -->
                <td>
                  <button class="delete-button" @click.stop="deleteList(list.id)">
                    🗑️
                  </button>
                  <button class="add-button" @click.stop="openAddInfluencerDialog(list)">
                    ➕
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add List Section -->
    <div class="form-section">
      <div class="add-product-form">
        <h3>Add New List</h3>
        <form @submit.prevent="createList">
          <div class="input-group">
            <label for="listName">
              <input type="text" v-model="newList.list_name" placeholder="List Name" />
            </label>
          </div>
          <div class="input-group">
            <label for="filteringCriteria">
              <input type="text" v-model="newList.filtering_criteria" placeholder="Filtering Criteria" />
            </label>
          </div>

          <button type="submit" class="add-product-button">Add New List</button>
        </form>
      </div> 
    </div>  

    <!-- Dialog for Viewing Influencers in the List -->
    <dialog v-if="showDialog" class="dialog-container" @close="closeDialog" open>
      <div class="dialog-content">
        <h3>{{ selectedList.list_name }} Influencers in this List</h3>
        <p><strong>Filtering Criteria:</strong> {{ selectedList.filtering_criteria || 'N/A' }}</p>
        <div v-if="influencers.length > 0">
          <div v-for="influencer in influencers" :key="influencer.id" class="influencer-card">
            <p><strong>Name:</strong> {{ influencer.name }}</p>
            <p><strong>Number of Posts:</strong> {{ influencer.number_of_posts || 'N/A' }}</p>
            <p><strong>Followers:</strong> {{ influencer.followers_number || 'N/A' }}</p>
            <p><strong>Following:</strong> {{ influencer.following_number || 'N/A' }}</p>
            <p><strong>Threads Account:</strong> {{ influencer.threads_account || 'N/A' }}</p>
            <p><strong>Bio:</strong> {{ influencer.bio }}</p>
            <button class="delete-button" @click="deleteInfluencer(selectedList.id, influencer.id)">
              🗑️ Delete
            </button>
          </div>
        </div>
        <button @click="closeDialog">Close</button>
      </div>
    </dialog>

    <!-- Dialog for Adding Influencers to a List -->
    <dialog v-if="showAddInfluencerDialog" class="dialog-container" @close="closeAddInfluencerDialog" open>
      <div class="dialog-content">
        <h3>Add Influencers to {{ selectedList.list_name }}</h3>
        <p><strong>Filtering Criteria:</strong> {{ selectedList.filtering_criteria || 'N/A' }}</p>
        <div class="input-group">
          <label for="influencer_ids">Select Influencers</label>
          <select multiple v-model="selectedInfluencerIds" class="influencer-select">
            <option 
              v-for="influencer in influencers" 
              :key="influencer.id" 
              :value="influencer.id"
            >
              {{ influencer.name }}
            </option>
          </select>
        </div>
        <button @click="addInfluencersToList">Add to List</button>
        <button @click="closeAddInfluencerDialog">Close</button>
      </div>
    </dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'ListsLists',

  data() {
    return {
      lists: [],
      influencers: [],
      newList: {
        list_name: '',
        filtering_criteria: ''
      },
      showDialog: false,
      showAddInfluencerDialog: false,
      selectedList: {},
      selectedInfluencerIds: []
    };
  },

  methods: {
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
        console.error('Error fetching lists:', error);
      }
    },

    async createList() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.post('https://iinfluencer.net/api/list/store', {
          list_name: this.newList.list_name,
          filtering_criteria: this.newList.filtering_criteria
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.lists.push(response.data);
        this.newList = { list_name: '', filtering_criteria: '' };
      } catch (error) {
        console.error('Error creating list:', error);
      }
    },

    async deleteList(id) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/list/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.lists = this.lists.filter(list => list.id !== id);
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    },

    async openDialog(list) {
      this.selectedList = list;
      this.showDialog = true;
      await this.fetchInfluencers(list.id);
    },

    async openAddInfluencerDialog(list) {
      this.selectedList = list;
      this.selectedInfluencerIds = []; // Reset the selected influencer IDs
      this.showAddInfluencerDialog = true;
      await this.fetchAllInfluencers(); // Fetch all influencers for the multi-select dropdown
    },

    async fetchInfluencers(listId) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`https://iinfluencer.net/api/list-influencer-account/${listId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.influencers = response.data;
      } catch (error) {
        console.error('Error fetching influencers:', error);
      }
    },

    async fetchAllInfluencers() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/influencer-account', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.influencers = response.data;
      } catch (error) {
        console.error('Error fetching all influencers:', error);
      }
    },

    async addInfluencersToList() {
      const token = localStorage.getItem('access_token');
      try {
        await axios.post('https://iinfluencer.net/api/list-influencer-account/store', {
          list_id: this.selectedList.id,
          influencer_account_ids: this.selectedInfluencerIds
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.closeAddInfluencerDialog();
      } catch (error) {
        console.error('Error adding influencers to list:', error);
      }
    },

    async deleteInfluencer(listId, influencerId) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/list-influencer-account/delete/${listId}/${influencerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.influencers = this.influencers.filter(influencer => influencer.id !== influencerId);
      } catch (error) {
        console.error('Error deleting influencer:', error);
      }
    },

    closeDialog() {
      this.showDialog = false;
      this.selectedList = {};
      this.influencers = [];
    },

    closeAddInfluencerDialog() {
      this.showAddInfluencerDialog = false;
      this.selectedList = {};
      this.selectedInfluencerIds = [];
    }
  },

  mounted() {
    this.fetchLists();
  }
};
</script>

 <style scoped>
 @import "@/assets/css/tablesandframe.css";

 .dialog-container { 
  background: #86ADC3; /* Set background color */

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
  height: 220px; /* Set fixed height */
  overflow-y: auto; /* Make it scrollable if content overflows */
  background-color: white; /* Background color for the influencer cards */
  z-index: 1000; 
}

.dialog-content {
  max-width: 500px;
  width: 100%; 
  
}


.influencer-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px; 
  
}

.delete-button {
  background-color:white;
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
}

.delete-button:hover {
  background-color: gray;
}

 </style>
