<template>
  <div>
    <input type="range" v-model.number="numberOfPeople" max="10" />
    <button @click="calcBill">计算账单</button>
    <input v-model.number="sumBill" type="number" />{{ sumBill }}
    <input v-num="sumBill" v-model.number="sumBill" type="number" />
    <div v-for="bill of numberOfPeople" :key="bill">
      <label :for="'people' + bill">人头{{ bill }}</label>
      <input
        :id="'people' + bill"
        type="number"
        v-model.number="everyBill[bill - 1]"
      />{{ needToPay[bill - 1] }}
    </div>
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
  computed: {},
};
</script>

<style scoped>
</style>
