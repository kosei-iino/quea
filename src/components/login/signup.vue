\/
<template>
  <loginWapper>
    <template v-slot:header-title>{{ pageName }}</template>
    <template v-slot:content-title>{{ titleName }}</template>
  </loginWapper>
</template>

<script>
import loginWapper from '@/components/login/loginWapper.vue';
export default {
  name: 'signup',
  data() {
    return {
      pageName: 'signup',
      titleName: '本登録画面',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'signup');
  },
  components: {
    loginWapper,
  },
};
</script>
