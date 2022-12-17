<template>
  <wapper>
    <template v-slot:header-title>{{ pageName }}</template>
  </wapper>
</template>

<script>
import wapper from '@/components/main/wapper.vue';
export default {
  name: 'profiles',
  data() {
    return {
      pageName: 'PROFILES',
    };
  },
  created() {
    this.$store.dispatch('chengeDisplay', 'profileElse');
  },
  components: {
    wapper,
  },
};
</script>
