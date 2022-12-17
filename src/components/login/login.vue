<template>
  <loginWapper>
    <template v-slot:header-title>{{ pageName }}</template>
    <template v-slot:content-title>{{ titleName }}</template>
  </loginWapper>
</template>

<script>
import loginWapper from '@/components/login/loginWapper.vue';
export default {
  name: 'login',
  data() {
    return {
      pageName: 'login',
      titleName: 'ログイン画面',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'login');
  },
  components: {
    loginWapper,
  },
};
</script>
