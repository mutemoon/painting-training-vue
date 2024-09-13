<template>
  <div style="border: none">
    <div class="container">
      <label>v-model测试</label>
      <input v-model="content" @change="(x) => x" />
      <select name="" v-model="selectContentArray" multiple>
        <option value="水果">水果</option>
        <option value="气球">水果</option>
        <option value="飞机">水果</option>
        <option>拉格朗日方程</option>
      </select>
      {{ selectContent }}
      <select name="" v-model="selectContent">
        <option disabled value="">nmsl</option>
        <option value="水果">水果</option>
        <option value="气球">水果</option>
        <option value="飞机">水果</option>
        <option>拉格朗日方程</option>
      </select>
      <select name="" v-model="selectContent">
        <option disabled value="">nmsl</option>
        <option v-for="(value, key) of options" :key="key" :value="value">
          {{ key }}
        </option>
      </select>
      <select name="" v-model="selectContent">
        <option disabled value="">nmsl</option>
        <option
          v-for="(value, key, index) of options"
          :key="key"
          :value="fruits[index]"
        >
          {{ key }}
        </option>
      </select>
    </div>

    <div class="container">
      <label>watch测试</label>
      <input :value="watch_v1" @input="watch_v1=$event.target.value" />
      <input :value="watch_v2" @input="watch_v2=$event.target.value" />
      {{ watch_v1 }} {{ watch_v2 }}
      <child :n1='n1' :n2='n2' @n1Changed='n1 = $event' @n2Changed='n2 = $event' />
      {{ n1 }} {{ n2 }}
    </div>

    <div class="container">
      <label>v-if测试</label>
      <input v-if="show" type="username" name="1" />
      <input v-else type="username" name="2" />
      <button @click="shift">切换</button>
    </div>

    <div class="container">
      <label for="">v-for测试</label>
      <button v-for="(v, i) of fruits" :key="v">{{ i + ": " + v }}</button>
      <button v-for="(v, n, i) of { a: 1, b: 1, c: 1, d: 1, e: 1 }" :key="i">
        {{ n + ": " + v }}
      </button>
    </div>

    <div class="container">
      <label for="">修饰符测试</label>
      <button>监听document的keypress：{{ i }}</button>
      <button @click="task">小任务{{ i }}</button>
      <div class="outer" @click="log('outer')">
        @click
        <span class="inner" @click="log('inner')"> @click </span>
      </div>
      <div class="outer" @click="log('outer')">
        @click
        <span class="inner" @click.capture="log('inner')">
          @click.capture
        </span>
      </div>
      <div class="outer" @click.capture="log('outer')">
        @click.capture
        <span class="inner" @click.capture="log('inner')">
          @click.capture
        </span>
      </div>
      <div class="outer" @click.capture="log('outer')">
        @click.capture
        <span class="inner" @click="log('inner')"> @click </span>
      </div>
      <div class="outer" @click="log('outer')">
        @click
        <span class="inner" @click.self="log('inner')"> @click.self </span>
      </div>
      <div class="outer" @click.self="log('outer')">
        @click.self
        <span class="inner" @click="log('inner')"> @click </span>
      </div>
      <div class="outer" @click.capture="log('outer')">
        @click.capture
        <span class="inner" @click.stop="log('inner')"> @click.stop </span>
      </div>
      <div class="outer" @click="log('outer')">
        @click
        <span class="inner" @click.capture.stop="log('inner')">
          @click.capture.stop
        </span>
      </div>
      <div class="outer" @click.capture="log('outer')">
        @click.capture
        <span class="inner" @click.capture.stop="log('inner')">
          @click.capture.stop
        </span>
      </div>
    </div>

    <div class="container">
      <label>过滤器测试</label>
      <input v-model="content" /><br />
      <label>{{ content | dollar }}</label
      ><br />
      <span
        class="inner"
        onclick="
          window.alert('\{\{ (3.14159 | type) \}\}这样使用时符号|会进行或运算而非调用过滤器。')
        "
        >{{ "\{\{3.14159 | type\}\}：" }} {{ 3.14159 | type }}
      </span>
    </div>

    <div class="container">
      <label>传入插槽测试</label>
      <SlotThings><strong>你好</strong></SlotThings>
      <secondSlot><strong>你好</strong></secondSlot>
    </div>
  </div>
</template>

<script>
import SlotThings from "./SlotThings"
import child from "./child"

export default {
  name: "Test",
  data() {
    return {
      i: 0,
      show: true,
      fruits: ["apple", "banana", "orange"],
      content: "",
      selectContent: "",
      selectContentArray: [],
      options: { aa: "a", bb: "b", cc: "c" },
      watch_v1: 1,
      watch_v2: 1,
      n1: 1,
      n2: 1,
    };
  },
  methods: {
    shift() {
      this.show = !this.show;
      this.$set(this.fruits, 7, "pie");
    },
    task() {
      for (let j = 0; j < 1e6; j++) {
        this.i++;
      }
    },
    log(v) {
      //console.log(v);
      alert(v);
    },
  },
  computed: {},
  watch: {
    watch_v1(newValue) {
      this.watch_v2 = newValue * 2;
    },
    watch_v2(newValue) {
      this.watch_v1 = newValue / 2;
    },
  },
  components: {
    child,
    SlotThings, 
    secondSlot: {
      render(createElement) {
        return createElement('span', ["另一个slot，提供这个slot的子组件使用了render函数：", this.$slots.default])
      }
    }
  },
  filters: {
    dollar(v) {
      return "-----  " + v + "  -----";
    },
    type(v) {
      return typeof v;
    },
  },
  created() {
    window.vm = this;
    document.onkeypress = () => {
      this.i++;
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-size: 19px;
}

div {
  border: 2px solid rgb(99, 75, 104);
  border-radius: 0.5em;
}

span {
  border: 1px solid rgb(99, 75, 104);
  border-radius: 0.5em;
}

.container {
  border-width: 1px;
  padding: 1em 0;
  margin: 1em 0;
}

.outer {
  background-color: rgb(77, 77, 92);
  width: 40%;
  padding: 1em 1em;
  margin: 1em auto;
  color: rgb(255, 255, 255);
  user-select: none;
}

.inner {
  padding: 0.2em 0.5em;
  width: 70%;
  color: rgb(255, 255, 255);
  user-select: none;
  background-color: rgb(172, 55, 123);
}

.outer:hover {
  background-color: rgb(85, 85, 114);
}

.inner:hover {
  background-color: rgb(207, 55, 144);
}
</style>
