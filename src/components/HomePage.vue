<template>
  <div id="app">
    <SidebarMenu />
    <MainContent />
  </div>
</template>

<script>
import MainContent from '@/components/MainContent.vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    SidebarMenu,
    MainContent,
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['fetchUserData']),
  },
  created() {
    // Fetch user data when HomePage is created
    this.fetchUserData();
  }


};
</script>

<style>
@import '@/assets/css/homestyle.css'
/* Global styles */
</style>
