<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'home',
  data() {
    return {
      pageName: 'HOME',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'homeMy');
  },
  components: {
    wapper,
  },
};
</script>
