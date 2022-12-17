<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'profile',
  data() {
    return {
      pageName: 'PROFILE',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'profileMy');
  },
  components: {
    wapper,
  },
};
</script>
