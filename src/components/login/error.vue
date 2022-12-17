<template>
  <loginWapper>
    <template v-slot:header-title>{{ pageName }}</template>
    <template v-slot:content-title>{{ title }}</template>
  </loginWapper>
</template>

<script>
import loginWapper from '@/components/login/loginWapper.vue';
export default {
  name: 'error',
  data() {
    return {
      pageName: 'error',
      title: '',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'error');
  },
  components: {
    loginWapper,
  },
};
</script>
