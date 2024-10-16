<template>
  <div class="content-container">
    <!-- Campaigns Table Section -->
    <div class="table-section">
      <div class="table-container">
        <div class="product-table">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Description</th>
                <th>Objective</th>
                <th>Budget</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Influencer Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(campaign, index) in campaigns" :key="index">
                <td>{{ campaign.campaign.campaign_name || 'N/A' }}</td>
                <td>{{ campaign.campaign.campaign_description }}</td>
                <td>{{ campaign.campaign.campaign_objective }}</td>
                <td>{{ campaign.campaign.campaign_budget }}</td>
                <td>{{ campaign.campaign.start_date }}</td>
                <td>{{ campaign.campaign.end_date }}</td>
                <td>{{ getInfluencerNames(campaign.influencers) }}</td>
                <td>
                  <button class="delete-button" @click="deleteCampaign(campaign.campaign.id)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Update Campaign Section -->
    <div class="form-section">
      <div class="add-product-form"> 
          <h3>Start New Campaign</h3>

          <form @submit.prevent="saveCampaign">
              <div class="input-group">
            <input type="text" v-model="campaign.campaign_name" placeholder="Campaign Name" required />
          </div>
          <div class="input-group">
            <input type="text" v-model="campaign.campaign_description" placeholder="Campaign Description" required />
          </div>
          <div class="input-group">
            <input type="text" v-model="campaign.campaign_objective" placeholder="Campaign Objective" required />
          </div>
          <div class="input-group">
            <input type="number" v-model="campaign.campaign_budget" placeholder="Campaign Budget" required />
          </div>
          <div class="input-group">
            <h5>Enter start date </h5>

            <input type="date" v-model="campaign.start_date" placeholder="Start Date" required />
          </div>
          <div class="input-group">
            <h5>Enter end date </h5>

            <input type="date" v-model="campaign.end_date" placeholder="End Date" required />
          </div> 
          <button type="submit" class="add-product-button">Start</button>

        </form>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios';

export default {
  name: 'CampaignList',
  data() {
    return {
      campaigns: [],
      campaign: {
        campaign_name: '',
        campaign_description: '',
        campaign_objective: '',
        campaign_budget: '',
        start_date: '',
        end_date: ''
      }
    };
  },
  methods: {
    // Fetch campaigns
    async fetchCampaigns() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/campaign', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.campaigns = response.data;
      } catch (error) {
        console.error('Failed to fetch campaigns', error);
      }
    },
    
    // Get Influencer Names
    getInfluencerNames(influencers) {
      return influencers.map(influencer => influencer.name).join(', ');
    },

  async saveCampaign() {
    const token = localStorage.getItem('access_token');

    // Ensure the dates are in the correct format (YYYY-MM-DD)
    const formattedStartDate = this.campaign.start_date ? new Date(this.campaign.start_date).toISOString().split('T')[0] : null;
    const formattedEndDate = this.campaign.end_date ? new Date(this.campaign.end_date).toISOString().split('T')[0] : null;

    // Prepare the payload
    const campaignPayload = {
      campaign_name: this.campaign.campaign_name,
      campaign_description: this.campaign.campaign_description,
      campaign_objective: this.campaign.campaign_objective,
      campaign_budget: this.campaign.campaign_budget,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    };

    try {
      await axios.post('{{url}}/campaign/store', campaignPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.fetchCampaigns(); // Refresh the list after adding
      this.resetForm(); // Reset the form fields
    } catch (error) {
      console.error('Failed to save campaign', error);
    }
  },
  // Other methods remain unchanged


    // Delete a campaign
    async deleteCampaign(id) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/campaign/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.fetchCampaigns(); // Refresh the list after deletion
      } catch (error) {
        console.error('Failed to delete campaign', error);
      }
    },

    // Reset the form after saving
    resetForm() {
      this.campaign = {
        campaign_name: '',
        campaign_description: '',
        campaign_objective: '',
        campaign_budget: '',
        start_date: '',
        end_date: ''
      };
    }
  },
  mounted() {
    this.fetchCampaigns();
  }
};
</script>

  <style scoped>
  @import "@/assets/css/tablesandframe.css";

  </style>
  