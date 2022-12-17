<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'comment',
  data() {
    return {
      pageName: 'COMMENT',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'comment');
  },
  components: {
    wapper,
  },
};
</script>
