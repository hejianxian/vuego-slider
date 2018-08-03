<template>
  <div class="v-slider" :class="[isDragging, isDisable, isReadonly, typeClasses]" @click="onClick" ref="slider">
    <div class="v-slider__container">
      <div class="v-slider__track"></div>
      <template v-if="showMark">
        <div class="v-slider__mark" v-for="mark in marks" :key="mark.index" :style="{left: mark.left}"></div>
      </template>
      <div class="v-slider__track is-active" :style="[trackActiveWidth]"></div>
      <VuegoPan class="v-slider__handle"
        tabindex="0"
        :style="[handlePosition]"
        :start="panStart"
        :move="panMove"
        :end="panEnd"
        @keydown.native="onKeyDown"
        @keyup.native="onKeyUp">
        <div class="v-slider__tooltips" v-if="showTooltip">
          <div>{{tooltipContent}}</div>
        </div>
      </VuegoPan>
    </div>
  </div>
</template>

<script>
  import VuegoPan from './Pan.vue';

  export default {
    name: 'vuego-slider',
    props: {
      value: {
        type: Number,
        require: true,
      },
      max: {
        type: Number,
        default: 100,
      },
      min: {
        type: Number,
        default: 0,
      },
      step: {
        type: Number,
        default: 1,
      },
      accuracy: {
        type: Number,
        default: 0,
      },
      showMark: {
        type: Boolean,
        default: false,
      },
      disable: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      tooltip: {
        type: Number,
        default: 1,
      },
      tooltipTpl: {
        type: [String, Function],
        default: '{value}',
      },
      type: {
        type: String,
        default: 'base',
      },
    },
    data() {
      return {
        val: this.value,
        handleWidth: 22,
        sliderMaxWidth: 0,
        sliderOffsetLeft: 0,
        positionLeft: 0,
        marks: [],
        currentMark: 0,
        markWidth: 0,
        dragging: false,
        currentPercentage: (this.value - this.min) / (this.max - this.min)
      };
    },
    computed: {
      model: {
        get() {
          return this.val;
        },
        set(val) {
          this.$emit('input', val);
        },
       },
      editable () {
        return !this.disable && !this.readonly;
      },
      isDragging() {
        return { 'is-dragging': this.dragging };
      },
      isDisable() {
        return { 'is-disable': this.disable };
      },
      isReadonly() {
        return { 'is-readonly': this.readonly };
      },
      typeClasses() {
        return this.type !== '' ? `is-${this.type}` : '';
      },

      hasStep() {
        return this.step && this.step > 0;
      },

      trackActiveWidth() {
        const width = `${this.currentPercentage * 100}%`;
        return { width };
      },
      handlePosition() {
        const left = `${this.currentPercentage * 100}%`;
        return { left };
      },

      // tooltip
      showTooltip() {
        if (!this.editable) return false;
        if (this.tooltip === 0) return false;
        if (this.tooltip === 1 && this.dragging) return true;
        if (this.tooltip === 2) return true;
        return false;
      },
      tooltipContent() {
        if (typeof this.tooltipTpl === 'string') {
          return this.tooltipTpl.replace('{value}', this.value);
        }
        if (typeof this.tooltipTpl === 'function') {
          return this.tooltipTpl(this.value);
        }
      },
    },
    watch: {
      value(value) {
        if (this.dragging) {
          return;
        }
        if (value < this.min) {
          this.model = this.min;
        } else if (value > this.max) {
          this.model = this.max;
        } else {
          this.model = value;
        }
        this.currentPercentage = (value - this.min) / (this.max - this.min);
      },
      min(value) {
        if (this.model < value) {
          this.model = value;
          this.positionLeft = -1;
          return;
        }
        this.$nextTick(this.validateProps);
      },
      max(value) {
        if (this.model > value) {
          this.model = value;
          this.positionLeft = this.sliderMaxWidth + 1;
          return;
        }
        this.$nextTick(this.validateProps);
      },
      step() {
        this.$nextTick(this.validateProps);
      },

      percentage(val) {
        this.getModelValue(val.left);
      },
    },
    methods: {
      createMarks() {
        if (this.hasStep) {
          const markCount = (this.max - this.min) / this.step;
          this.markWidth = this.sliderMaxWidth / markCount;

          for (let i = 0; i < markCount + 1; i += 1) {
            this.marks.push({
              index: i,
              percentage: i / markCount,
              left: `${i / markCount * 100}%`,
            });
          }
        }
      },

      __init() {
        if (this.model > this.max) {
          this.model = this.max;
          this.positionLeft = this.sliderMaxWidth + 1;
          return;
        }
        if (this.model < this.min) {
          this.model = this.min;
          this.positionLeft = -1;
          return;
        }

        const percentage = (this.model - this.min) / (this.max - this.min);
        this.currentPercentage = percentage;
      },

      getPercentage(positionLeft) {
        if (positionLeft < 0) return 0;
        if (positionLeft > this.sliderMaxWidth) return 1;

        let percentage;
        if (this.hasStep && !this.dragging) {
          const mark = positionLeft / this.markWidth;
          let currentMark = Math.floor(mark);
          const offset = mark - currentMark;
          if (offset >= 0.5) {
            currentMark += 1;
          }

          const marksLength = this.marks.length;
          if (currentMark > marksLength) currentMark = marksLength - 1;
          if (currentMark < 0) currentMark = 0;
          percentage = this.marks[currentMark]['percentage'];
          this.currentMark = currentMark;
        } else {
          percentage = positionLeft / this.sliderMaxWidth;
        }
        return percentage;
      },

      getModelValue(percentage) {
        const len = (this.max - this.min) * percentage;
        return parseFloat((this.min + len).toFixed(this.accuracy));
      },

      __update(e) {
        if (!this.editable) return;

        const { pageX } = e;
        let positionLeft = pageX - this.sliderOffsetLeft - this.handleWidth / 2;

        const percentage = this.getPercentage(positionLeft);
        this.model = this.getModelValue(percentage);
        this.currentPercentage = percentage;
      },

      onClick(e) {
        this.__update(e);
      },

      // Touch evnets
      panStart(e) {
        this.dragging = true;
      },
      panMove(e) {
        this.__update(e.srcEvent);
      },
      panEnd(e) {
        this.dragging = false;
        this.__update(e.srcEvent);
      },

      // key events
      onKeyDown(e) {
        const keyCode = e.keyCode
        if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
          return
        }
        e.preventDefault();
        e.stopPropagation();

        const offset = [37, 40].includes(keyCode) ? -1 : 1;
        this.currentMark += offset;
        if (this.currentMark < 0) this.currentMark = 0;
        if (this.currentMark >= this.marks.length) this.currentMark = this.marks.length - 1;

        const percentage = this.marks[this.currentMark]['percentage'];
        this.model = this.getModelValue(percentage);
        this.currentPercentage = percentage;
      },
      onKeyUp(e) {
        const keyCode = e.keyCode
        if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
          return
        }
      },

      // Validate
      validateProps() {
        if (process.env.NODE_ENV !== 'production') {
          if (this.max <= this.min) {
            console.error('[vuego-slider]: Max must be greater than min.', this.$refs);
          }
          const res = (this.max - this.min) / this.step;
          if (String(res).split('.').length > 1) {
            console.error('[vuego-slider]: Please set a reasonable `step`.', this.$refs);
          }
        }
      },
    },
    mounted() {
      const $slider = this.$refs.slider;
      this.sliderOffsetLeft = $slider.offsetLeft;
      this.sliderMaxWidth = $slider.offsetWidth - this.handleWidth;

      this.validateProps();
      this.createMarks();
      this.__init();
    },
    components: {
      VuegoPan,
    },
  };
</script>

<style lang="less" scoped>
@handleSize: 22px;
@defaultColor: #279AFC;
@successColor: #42b983;
@warningColor: #FB8A35;
@errorColor: #F94768;

.v-slider {
  width: 100%;
  height: 30px;
  user-select: none;
  cursor: pointer;
  &__container {
    margin: 0 @handleSize / 2;
    position: relative;
    height: 100%;
  }
  &__track {
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #ddd;
    transition: all .3s ease;
    &.is-active {
      background: @defaultColor;
    }
  }
  &__handle {
    position: absolute;
    top: 50%;
    transform: translate3d(-50%,-50%,0);
    transform-origin: center;
    transition: all .3s ease;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    background: #fff;
    user-select: none;
    outline: none;
    box-shadow: 0 1px 8px rgba(0,0,0,.2), 0 3px 4px rgba(0,0,0,.14), 0 3px 3px -2px rgba(0,0,0,.12);
  }
  &__tooltips {
    border-radius: 2px;
    background: @defaultColor;
    color: #fff;
    font-size: 13px;
    line-height: 16px;
    display: inline-flex;
    transform: translateX(-50%) translateY(-139%) scale(1);
    position: absolute;
    top: 0;
    left: @handleSize / 2 - 1;
    transition: all .3s ease;
    div {
      padding: 2px 4px;
      word-wrap: none;
    }
    &::after {
      content: '';
      width: 9px;
      height: 9px;
      right: auto;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-78%) rotate(45deg);
      background: inherit;
      z-index: -1;
    }
  }
  &__mark {
    position: absolute;
    top: 50%;
    height: 4px;
    width: 2px;
    transform: translateX(-50%) translateY(-50%);
    opacity: .4;
    background: currentColor;
    border-radius: 1px;
  }
  &.is-dragging {
    .v-slider__track, .v-slider__handle {
      transition: none;
    }
    .v-slider__tooltips {
      transform: translateX(-50%) translateY(-150%) scale(1.15);
    }
  }
  &.is-disable, &.is-readonly {
    cursor: not-allowed;
    opacity: .7;
  }
  &.is-readonly {
    opacity: 1;
  }

  &.is-success {
    .v-slider__track.is-active, .v-slider__tooltips {
      background: @successColor;
    }
  }
  &.is-warning {
    .v-slider__track.is-active, .v-slider__tooltips {
      background: @warningColor;
    }
  }
  &.is-error {
    .v-slider__track.is-active, .v-slider__tooltips {
      background: @errorColor;
    }
  }
}
</style>
