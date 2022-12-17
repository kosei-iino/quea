<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'like',
  data() {
    return {
      pageName: 'LIKE',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'like');
  },
  components: {
    wapper,
  },
};
</script>
