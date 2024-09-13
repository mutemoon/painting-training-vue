<template>
  <div style="border: none">
    <input :value="cn1" @input="changeN1" />
    <input :value="cn2" @input="changeN2" />
  </div>
</template>

<script>
export default {
  props: {
    n1: Number,
    n2: Number,
  },
  data() {
    return {
      cn1: this.n1,
      cn2: this.n2,
    };
  },
  methods: {
    changeN1(event) {
      this.cn1 = event.target.value;
      this.$emit("n1Changed", Number(this.cn1));
    },
    changeN2(event) {
      this.cn2 = event.target.value;
      this.$emit("n2Changed", Number(this.cn2));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>