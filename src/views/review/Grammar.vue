<template>
  <div>

      <div v-if="isNew">
        <div class="text-h4 purple--text font-weight-black">今 天</div>
        <div class="text-h1 mt-8 secondary--text">学习新的内容</div>
        <v-form ref="form">
          <v-row class="mt-10" justify="end">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="insertParams.title"
                color="purple"
                label="今天学习的内容是"
              ></v-text-field>
              <v-text-field
                v-model="insertParams.url"
                color="purple"
                label="视频链接"
              ></v-text-field>
              <v-btn
                class="px-16 white--text float-right mt-10"
                color="purple"
                @click="insertReview"
              >
                提交
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div v-else>
        <div class="text-h4 purple--text font-weight-black">今 天</div>
        <div class="text-h5 mt-1 secondary--text">
          第{{
            { second: "一", third: "二", fourth: "三", fifth: "四" }[
              updateParams.times
            ]
          }}次复习要复习的是：
        </div>
        <v-row class="mt-6" justify="end">
          <v-col
            class="
              text-h2
              purple--text
              font-weight-black font-italic
              text-right
            "
            cols="12"
            md="4"
            >{{ review.title }}</v-col
          >
        </v-row>
        <v-row class="mt-1" justify="end">
          <v-col
            class="
              text-caption
              secondary--text
              text-decoration-underline
              mt-16
              text-right
            "
            :href="review.url"
            cols="12"
            md="4"
            >{{ review.url }}</v-col
          >
        </v-row>
        <v-row class="mt-1" justify="end">
          <v-btn
            class="white--text mt-8"
            style="width: 100%; height: 4em"
            color="purple"
            @click="updateReview"
          >
            完成今天的复习
          </v-btn>
        </v-row>
      </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isNew: false,
      insertParams: { title: "", url: "" },
      updateParams: { times: "" },
      reviews: [],
      review: {},
    };
  },
  methods: {
    insertReview() {
      axios
        .get(
          `http://www.mutemoon.com:8080/review/insertReview?title=${this.insertParams.title}&url=${
            this.insertParams.url
          }&date=${new Date().toLocaleDateString()}`
        )
        .then((res) => {
          console.log(res);
        });
    },

    async getAllRecord() {
      return axios
        .get(`http://www.mutemoon.com:8080/review/getAllReview`)
        .then(({ data: { code, data } }) => {
          if (code == "SUCCESS") {
            return data;
          } else {
            return [];
          }
        });
    },

    async updateReview() {
      return axios
        .get(
          `http://www.mutemoon.com:8080/review/updateReview?id=${this.review.id}&times=${this.updateParams.times}`
        )
        .then(({ data: { code } }) => {
          if (code == "SUCCESS") {
            return true;
          } else {
            return false;
          }
        });
    },
  },

  async mounted() {
    let reviews = await this.getAllRecord();
    // let reviews = [
    //   {
    //     title: "1",
    //     url: "",
    //     first: "2021-12-2",
    //     second: "2021-12-6",
    //     third: null,
    //     fourth: null,
    //     fifth: null,
    //   },
    //   {
    //     title: "2",
    //     url: "",
    //     first: "2021-12-3",
    //     second: null,
    //     third: null,
    //     fourth: null,
    //     fifth: null,
    //   },
    //   {
    //     title: "3",
    //     url: "",
    //     first: "2021-12-1",
    //     second: "2021-12-7",
    //     third: null,
    //     fourth: null,
    //     fifth: null,
    //   },
    // ];
    console.log(reviews);
    if (reviews.length === 0) {
      this.isNew = true;
      return;
    }

    if (reviews.length > 1) {
      reviews.sort((a, b) => new Date(a.first) - new Date(b.first));
    }

    for (let desc of [
      { times: "second", duration: 1000 * 60 * 60 * 24 * 3 },
      { times: "third", duration: 1000 * 60 * 60 * 24 * 10 },
      { times: "fourth", duration: 1000 * 60 * 60 * 24 * 41 },
      { times: "fifth", duration: 1000 * 60 * 60 * 24 * 101 },
    ]) {
      for (let review of reviews) {
        if (
          review[desc.times] === null &&
          new Date() - new Date(review.first) > desc.duration
        ) {
          this.review = review;
          this.updateParams.times = desc.times;
          return;
        }
      }
    }
    this.isNew = true;
  },
};
</script>

<style scoped>
.main {
  margin: 1vw 0 0 10vw;
}
input {
  height: 100px;
}
</style>


