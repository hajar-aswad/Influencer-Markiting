<template>
  <div>
    <div class="top-bar">
      <div class="nav-items">
        <a href="#">Dashboards</a>
        <a href="#">Pages</a>
        <a href="#">Account</a>
        <a href="#">Auth</a>
        <a href="#">Apps</a>
        <a href="#">Resources</a>
      </div>
      <div class="icons">
        <div class="icon">🔍</div>
        <div class="icon">⋮</div>
      </div>
    </div>
    <div class="content-area">
      <template v-if="selectedBox === 'Products'">
        <ProductList :products="products" />
      </template>
      <template v-else-if="selectedBox === 'Brands'">
        <BrandList :brands="brands" />
      </template> 
      <template v-else-if="selectedBox === 'Lists'">
        <ListsLists :Lists="Lists" />
      </template> 
      <template v-else-if="selectedBox === 'Campaigns'">
        <CampaignList :Campaigns="Campaigns" />
      </template> 
      <template v-else-if="selectedBox === 'Account'">
        <AccountInfo :Account="Account" />
      </template> 
      <template v-else-if="selectedBox === 'Orders'">
        <OrderList :Orders="Orders" />
      </template>   
      <template v-else-if="selectedBox === 'Support'">
        <TicketList :Support="Support" />
      </template>   
      <template v-else-if="selectedBox === 'Employee'">
        <EmployeeList :Employee="Employee" />
      </template>  
      <template v-else-if="selectedBox === 'Creators'">
        <CreatorsList :Creators="Creators" />
      </template>  
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductList from '@/components/ProductList.vue';
import BrandList from '@/components/BrandList.vue';
import ListsLists from '@/components/ListsLists.vue';
import CampaignList from '@/components/CampaignList.vue';
import AccountInfo from '@/components/AccountInfo.vue';
import OrderList from '@/components/OrderList.vue';
import TicketList from '@/components/TicketList.vue';
import EmployeeList from '@/components/EmployeeList.vue';
import CreatorsList from '@/components/CreatorsList.vue';


export default {
  components: {
    ProductList,
    BrandList,
    ListsLists,
    CampaignList,
    AccountInfo,
    OrderList,
    TicketList,
    EmployeeList,
    CreatorsList
  },

  computed: {
    ...mapState(['selectedBox'])
  }

,
  data() {
    return {
      
    }; 
    
  }
};
</script>

<style scoped>
</style>
