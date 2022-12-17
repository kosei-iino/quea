<template>
  <loginWapper>
    <template v-slot:header-title>{{ pageName }}</template>
    <template v-slot:content-title>{{ title }}</template>
  </loginWapper>
</template>

<script>
import loginWapper from '@/components/login/loginWapper.vue';
export default {
  name: 'tmp_signup',
  data() {
    return {
      pageName: 'tmp_signup',
      title: '新規登録',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'tmp_signup');
  },
  components: {
    loginWapper,
  },
};
</script>
