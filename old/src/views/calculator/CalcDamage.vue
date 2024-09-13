<template>
  <div>
    <input type="number" v-model="sumBill" /><button @click="calcBill">
      计算伤害
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sumBill: 0,
      numberOfPeople: 0,
      everyBill: [],
      needToPay: [],
    };
  },
  methods: {
    calcBill() {
      let wrongSumBill = this.everyBill.reduce((pre, v) => pre + v);
      for (let i = 0; i < this.numberOfPeople; i++) {
        this.$set(
          this.needToPay,
          i,
          (this.everyBill[i] / wrongSumBill) * this.sumBill
        );
      }
    },
  },
  watch() {},
};
</script>

<style scoped>
</style>
