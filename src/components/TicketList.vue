<template>
  <div class="content-container">
    <!-- Tickets Table Section -->
    <div class="table-section">
      <div class="table-container">
        <div class="ticket-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ticket, index) in tickets" :key="index">
                <td>{{ ticket.title }}</td>
                <td>{{ ticket.status }}</td>
                <td>
                  <button class="edit-button" @click="editTicket(ticket.id)">✏️</button>
                  <button class="delete-button" @click="deleteTicket(ticket.id)">🗑️</button>
                  <button class="view-responses-button" @click="fetchResponses(ticket.id)">💬</button>
                  <button class="view-description-button" @click="showDescription(ticket.description)">View Description</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Responses Modal Dialog -->
    <div v-if="selectedTicketResponses.length" class="modal-overlay">
      <div class="modal-content">
        <h3>Responses for Ticket :</h3>
        <div class="responses-list">
          <div v-for="response in selectedTicketResponses" :key="response.id" class="response-item">
            <div class="response-header">
              <span class="response-user">{{ response.user.full_name }}</span>
              <span class="response-date">{{ new Date(response.created_at).toLocaleString() }}</span>
            </div>
            <div class="response-message">
              {{ response.response_message }}
            </div>
          </div>
        </div>
        <button v-if="!isResponsesClosed" class="close-responses-button" @click="clearResponses">Close</button>
      </div>
    </div>

    <!-- Add/Update Ticket Section -->
    <div class="form-section">
      <div class="add-ticket-form">
        <h3>{{ editMode ? 'Update Ticket' : 'Add New Ticket' }}</h3>
        <form @submit.prevent="saveTicket">
          <div class="input-group">
            <input type="text" v-model="ticket.title" placeholder="Ticket Title" required />
          </div>
          <div class="input-group">
            <input type="text" v-model="ticket.description" placeholder="Ticket Description" required />
          </div>
          <div class="input-group">
            <select v-model="ticket.status" required>
              <option value="opened">Opened</option>
              <option value="pending">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button type="submit" class="save-ticket-button">{{ editMode ? 'Update Ticket' : 'Add Ticket' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'TicketList',
  data() {
    return {
      tickets: [],
      ticket: {
        title: '',
        description: '',
        status: 'opened'
      },
      editMode: false,
      ticketId: null,
      selectedTicketId: null,
      selectedTicketResponses: [],
      isResponsesClosed: false,
      selectedDescription: '',
      isDialogOpen: false
    };
  },
  methods: {
    async fetchTickets() {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('https://iinfluencer.net/api/ticket', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.tickets = response.data;
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    },
    async saveTicket() {
      const token = localStorage.getItem('access_token');
      try {
        if (this.editMode) {
          const response = await axios.put(`https://iinfluencer.net/api/ticket/update/${this.ticketId}`, this.ticket, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const index = this.tickets.findIndex(ticket => ticket.id === this.ticketId);
          if (index !== -1) {
            this.tickets[index] = response.data;
          }
        } else {
          const response = await axios.post('https://iinfluencer.net/api/ticket/store', this.ticket, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.tickets.push(response.data);
        }
        this.resetForm();
        this.fetchTickets();
      } catch (error) {
        console.error('Error saving ticket:', error);
      }
    },
    async editTicket(id) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`https://iinfluencer.net/api/ticket/show/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.ticket = response.data;
        this.ticketId = id;
        this.editMode = true;
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    },
    async deleteTicket(id) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`https://iinfluencer.net/api/ticket/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.tickets = this.tickets.filter(ticket => ticket.id !== id);
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    },
    async fetchResponses(ticketId) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`https://iinfluencer.net/api/ticket/ticket-response?ticket_id=${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.selectedTicketId = ticketId;
        this.selectedTicketResponses = response.data;
        this.isResponsesClosed = false;
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    },
    clearResponses() {
      this.selectedTicketId = null;
      this.selectedTicketResponses = [];
      this.isResponsesClosed = true;
    },
    resetForm() {
      this.ticket = {
        title: '',
        description: '',
        status: 'opened'
      };
      this.editMode = false;
      this.ticketId = null;
    },
    showDescription(description) {
      this.selectedDescription = description;
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    }
  },
  mounted() {
    this.fetchTickets();
  }
};
</script>

<style scoped>
.content-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 20px;
}

.form-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: 2px solid #C6CEDC;
  font-size: 16px;
  outline: none;
}

.save-ticket-button {
  width: 100%;
  padding: 15px;
  background: #E8C6CC;
  border-radius: 30px;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-ticket-button:hover {
  background-color: #D6A6B4;
}

.ticket-table {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
}

th {
  background-color: #C6CEDC;
  font-weight: bold;
}

td {
  background-color: #FFFFFF;
}

tr:nth-child(even) td {
  background-color: #F9F9F9;
}

.edit-button, .delete-button, .view-responses-button, .view-description-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.edit-button {
  color: #007BFF;
}

.delete-button {
  color: #FF4C4C;
}

.view-responses-button {
  color: #4CAF50;
}

.view-description-button {
  background-color: #FFC107;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.view-description-button:hover {
  background-color: #FFA000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure the modal is on top */
}

.modal-content {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto; /* Scroll if the content exceeds modal height */
}

.close-responses-button {
  background-color: #E8C6CC;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.close-responses-button:hover {
  background-color: #D6A6B4;
}

.responses-list {
  max-height: 300px;
  overflow-y: auto;
}

.response-item {
  background-color: #FFFFFF;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.response-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.response-user {
  font-weight: bold;
  color: #333333;
}

.response-date {
  font-size: 12px;
  color: #999999;
}

.response-message {
  color: #555555;
}
</style>
