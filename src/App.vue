<template>
  <div id="app">
    <header>
      <h3>Vuego Slider</h3>
      <a href="#">GitHub</a>
    </header>
    <div class="demo">
      <vuego-slider
        v-model="value"
        :max="100"
        :min="-50"
        :step="0"
        :disabled="false"
        :tooltip-tpl="tooltip"
        :tooltip="2">
      </vuego-slider>
      <p>{{value}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      value: 94,
    };
  },
  methods: {
    tooltip(val) {
      return `${val}px`;
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 800px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.demo {
  padding:  50px;
}
</style>
