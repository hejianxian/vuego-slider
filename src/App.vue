<template>
  <div id="app">
    <header class="header">
      <a id="logo" href="/"><span>Vuego Slider</span></a>
    </header>
    <div class="example-list">
      <div class="example-item">
        <h3 class="item-title">Default</h3>
        <div class="item-content">
          <div class="item-sub-title">Standalone</div>
          <vuego-slider v-model="value1"></vuego-slider>
        </div>
      </div>
      <div class="example-item">
        <h3 class="item-title">Width Step Marks</h3>
        <div class="item-content">
          <div class="item-sub-title">Step 10</div>
          <vuego-slider
            v-model="value2"
            :max="10"
            :min="1"
            @change="onChange"
            :show-mark="true"
            :step="1">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Step 0.01</div>
          <vuego-slider
            v-model="value3"
            :max="0.5"
            :min="0.1"
            :accuracy="2"
            :show-mark="true"
            :step="0.05">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Hide marks</div>
          <vuego-slider
            v-model="value8"
            :max="10"
            :min="-10"
            :step="2">
          </vuego-slider>
        </div>
      </div>
      <div class="example-item">
        <h3 class="item-title">Tooltip</h3>
        <div class="item-content">
          <div class="item-sub-title">Width custom tooltip template</div>
          <vuego-slider
            v-model="value4"
            :max="50"
            :min="-50"
            :tooltip="2"
            tooltip-tpl="{value}m">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Width custom tooltip callback</div>
          <vuego-slider
            v-model="value5"
            :max="200"
            :min="100"
            :step="20"
            :tooltip="2"
            :tooltip-tpl="tooltip">
          </vuego-slider>
        </div>
      </div>
      <div class="example-item">
        <h3 class="item-title">Status</h3>
        <div class="item-content">
          <div class="item-sub-title">Disabled status</div>
          <vuego-slider
            v-model="value6"
            :max="100"
            :min="0"
            :disable="true">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Readonly status</div>
          <vuego-slider
            v-model="value7"
            :max="100"
            :min="0"
            :readonly="true">
          </vuego-slider>
        </div>
      </div>
      <div class="example-item">
        <h3 class="item-title">Type</h3>
        <div class="item-content">
          <div class="item-sub-title">Success</div>
          <vuego-slider
            v-model="value10"
            :max="100"
            :min="0"
            type="success">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Warning</div>
          <vuego-slider
            v-model="value10"
            :max="100"
            :min="0"
            type="warning">
          </vuego-slider>
        </div>
        <div class="item-content">
          <div class="item-sub-title">Error</div>
          <vuego-slider
            v-model="value10"
            :max="100"
            :min="0"
            type="error">
          </vuego-slider>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>
        <a href="http://hejx.space/" target="_blank" title="Hejx">Hejx</a> |
        <a href="https://github.com/hejianxian/vuego-slider" target="_blank" title="GitHub">GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      value1: 66,
      value2: 4,
      value3: 0.20,
      value4: 20,
      value5: 160,
      value6: 70,
      value7: 80,
      value8: 4,
      value9: 14,
      value10: 20,
      value11: 40,
    };
  },
  methods: {
    tooltip(val) {
      return `${val}px`;
    },
    onChange(val) {
      console.log(`@change: ${val}`);
    },
  },
};
</script>

<style lang="less">
html, body {
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: #ffffff;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
  max-width: 800px;
}

.header, .footer {
  height: 40px;
  padding: 40px 60px;
  position: relative;
  text-align: center;
}
.header {
  margin: 50px 0;
}

a {
  color: #42b983;
  padding: 0 10px;
}

#logo {
  display: inline-block;
  font-size: 4em;
  line-height: 40px;
  color: #2c3e50;
  text-decoration: none;
  span {
    font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-weight: 500;
  }
}

.example-list {
  padding: 10px 60px;
  .example-item {
    .item-title {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      &::before {
        content: '#';
        display: inline-block;
        width: 1em;
        height: auto;
        color: #42b983;
      }
    }
    .item-content {
      padding: 0 0 8px 0;
      .item-sub-title {
        font-size: 13px;
        color: #666;
        padding-left: 1em;
        padding-bottom: 22px
      }
    }
  }
}

</style>
