<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'setting',
  data() {
    return {
      pageName: 'SETTING',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'setting');
  },
  components: {
    wapper,
  },
};
</script>
