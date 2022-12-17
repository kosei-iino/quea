<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'search',
  data() {
    return {
      pageName: 'SEARCH',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'searchPost');
  },
  components: {
    wapper,
  },
};
</script>
