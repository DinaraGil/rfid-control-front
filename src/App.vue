<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useUserStore } from '@/stores/user'
  import Header from './components/Header.vue';

  onMounted(() => {
    const userStore = useUserStore()
    userStore.fetchMe()
  })

</script>

<template>
  <Header />
  <router-view />
</template>