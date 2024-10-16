<template>
  <div class="orders-container">
    <div class="orders-list-container">
      <h3>Advertisement Request Lists</h3>

      <div class="orders-list">
        <div 
          v-for="ad in ads" 
          :key="ad.id" 
          class="order-item" 
          @click="viewAdDetails(ad)"
        >
          <div class="order-details">
            <h4>{{ ad.title }}</h4>
            <p>{{ ad.description }}</p>
          </div>
          <button @click.stop="deleteAd(ad.id)" class="delete-icon">🗑️</button>
        </div>
      </div>
       </div>
       <div width= 20px>  

       </div >
    <div class="add-advertisement-form">
      <h3>Add New Advertisement Request</h3>
      <form @submit.prevent="addAdvertisementRequest">
          <div class="input-group">
            <label for="title">
              <input 
                type="text" 
                v-model="newAd.title" 
                placeholder="Title" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="description">
              <input 
                type="text" 
                v-model="newAd.description" 
                placeholder="Description" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="target_audience">
              <input 
                type="text" 
                v-model="newAd.target_audience" 
                placeholder="Target Audience" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="request_budget">
              <input 
                type="text" 
                v-model="newAd.request_budget" 
                placeholder="Request Budget" 
                required 
              />
            </label>
          </div>
          <div class="input-group">
            <label for="campaign_id">
                <select v-model="newAd.campaign_id" required> 
                    Select an influencer
  <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id"> 
    
    {{ campaign.campaign_name }}
  </option>
</select>

            </label>
          </div>
          <div class="input-group">
            <label for="influencer_account_id">
              <select v-model="newAd.influencer_account_id" required>
                <option 
                  v-for="influencer in influencers" 
                  :key="influencer.id" 
                  :value="influencer.id"
                >
                  {{ influencer.name }}
                </option>
              </select>
            </label>
          </div>
          <button type="submit" class="add-ad-button">Add Advertisement Request</button>
        </form>
      </div>
  
      <!-- Dialog for viewing and editing advertisement details -->
      <dialog v-if="selectedAd" @close="selectedAd = null" open>
        <div>
          <h3>{{ selectedAd.title }}</h3>
          <p>{{ selectedAd.description }}</p>
          <p><strong>Target Audience:</strong> {{ selectedAd.target_audience }}</p>
          <p><strong>Request Budget:</strong> {{ selectedAd.request_budget }}</p>
  <p><strong>Added by:</strong> {{ selectedAd.employee_name }}</p>
  <p><strong>Influencer Name:</strong> {{ selectedAd.influencer_name }}</p>
  <p><strong>Campaign Name:</strong> {{ selectedAd.campaign_name }}</p>

          <div>
            <h4>Quota Information</h4>
            <p v-if="selectedQuota.proposed_content">Content: {{ selectedQuota.proposed_content }}</p>
            <p v-if="selectedQuota.proposed_price">Price: {{ selectedQuota.proposed_price }}</p>
            <div v-else>No quota information available.</div>
            <!-- Add quota form fields here -->
            <h4>Add/Edit Quota</h4>
            <form @submit.prevent="addQuota">
              <div class="input-group">
                <label for="proposed_content">
                  <input 
                    type="text" 
                    v-model="quotaForm.proposed_content" 
                    placeholder="Proposed Content" 
                    required 
                  />
                </label>
              </div>
              <div class="input-group">
                <label for="proposed_price">
                  <input 
                    type="text" 
                    v-model="quotaForm.proposed_price" 
                    placeholder="Proposed Price" 
                    required 
                  />
                </label>
              </div>
              <button type="submit" class="add-quota-button">Save Quota</button>
            </form>
          </div>
        </div>
        <button @click="selectedAd = null">Close</button>
      </dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        ads: [],
        campaigns: [],
        influencers: [],
        newAd: {
          title: '',
          description: '',
          target_audience: '',
          request_budget: '',
          campaign_id: null,
          influencer_account_id: null,
        },
        selectedAd: null,
        selectedQuota: {},
        quotaForm: {
          proposed_content: '',
          proposed_price: ''
        },
      };
    },
    methods: { 
        resetQuotaForm() {
    this.quotaForm.proposed_content = '';
    this.quotaForm.proposed_price = '';
  },
  closeDialog() {
    this.selectedAd = null;
    this.resetQuotaForm();  // Reset fields when closing the dialog
  }
,
      async fetchAds() {
        try {
          const response = await axios.get('https://iinfluencer.net/api/advertisement_request');
          this.ads = response.data;
        } catch (error) {
          console.error('Failed to fetch ads', error);
        }
      },
      async fetchCampaigns() {
        const token = localStorage.getItem('access_token');
        try {
          const response = await axios.get('https://iinfluencer.net/api/campaign', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.campaigns = response.data.map(item => ({
      id: item.campaign.id,
      campaign_name: item.campaign.campaign_name,
    }));
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      }
,
      async fetchInfluencers() {
        try {
          const response = await axios.get('https://iinfluencer.net/api/influencer-account');
          this.influencers = response.data;
        } catch (error) {
          console.error('Failed to fetch influencers', error);
        }
      },
      async addAdvertisementRequest() { 
        const token = localStorage.getItem('access_token');

        try {
          const response = await axios.post('https://iinfluencer.net/api/advertisement_request/store',  this.newAd, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.ads.push(response.data.advertisement_request); // Add the new ad to the list
          this.newAd = {
            title: '',
            description: '',
            target_audience: '',
            request_budget: '',
            campaign_id: null,
            influencer_account_id: null,
          }; // Reset the form
        } catch (error) {
          console.error('Failed to add ad request', error);
        }
      }, 















      async deleteAd(id) {
        try {
          await axios.delete(`https://iinfluencer.net/api/advertisement_request/delete/${id}`);
          this.fetchAds(); // Refresh the list after deletion
        } catch (error) {
          console.error('Failed to delete ad', error);
        }
      },
      async viewAdDetails(ad) { 
        this.proposed_content='',
        this.proposed_price='',
        this.selectedAd = ad;
        try {
          const response = await axios.get(`https://iinfluencer.net/api/quota?advertisement_request_id=${ad.id}`);
          this.selectedQuota = response.data.find(q => q.advertisement_request_id === ad.id) || {};
        } catch (error) {
          console.error('Failed to fetch quota', error);
        }
      },
      async addQuota() {
        try {
          const response = await axios.post('https://iinfluencer.net/api/quota/store', {
            advertisement_request_id: this.selectedAd.id,
            proposed_content: this.quotaForm.proposed_content,
            proposed_price: this.quotaForm.proposed_price,
          });
          this.selectedQuota = response.data;
        } catch (error) {
          console.error('Failed to add quota', error);
        } 
          this.quotaForm={
         
          proposed_content: '',
          proposed_price: ''
        }

      }
    },
    mounted() {
      this.fetchAds();
      this.fetchCampaigns();
      this.fetchInfluencers(); 
      this.resetQuotaForm();
    },
  };
  </script>
  
  <style>
.orders-container {
  display: flex;
}

.orders-list {
  overflow-y: auto;
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
    display: flex;
   justify-content: space-between; /* Adjusts the items to take up available space */
   align-items: center;
   width: 100%;
}

.delete-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.add-advertisement-form {  
    margin-left: 40px; /* Adds space below the form */

  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.add-ad-button,
.add-quota-button {
  background-color: #86ADC3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

</style>