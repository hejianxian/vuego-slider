<template>
  <div class="v-slider" :class="[isDragging, isDisabled]" @click="handleClicked" ref="slider">
    <div class="v-slider__container">
      <div class="v-slider__track"></div>
      <div class="v-slider__mark" v-for="mark in marks" :key="mark.index" :style="{left: mark.left}"></div>
      <div class="v-slider__track is-active" :style="[trackActiveWidth]"></div>
      <div class="v-slider__handle" :style="[handlePositionLeft]">
        <div class="v-slider__tooltips" v-if="showTooltip">
          <div>{{tooltipContent}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Hammer from 'hammerjs';

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
      showMark: {
        type: Boolean,
        default: true,
      },
      step: {
        type: Number,
        default: 0,
      },
      disabled: {
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
    },
    data() {
      return {
        handleWidth: 22,
        sliderMaxWidth: 0,
        sliderOffsetLeft: 0,
        positionLeft: 0,
        marks: [],
        markWidth: 0,
        dragging: false,
      };
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      hasStep() {
        return this.step && this.step > 0;
      },
      handlePositionLeft() {
        let left = '0%';
        if (this.hasStep && !this.dragging) return { left: this.positionLeft };
        if (this.positionLeft < 0) return { left };
        if (this.sliderMaxWidth > 0) {
          if (this.positionLeft > this.sliderMaxWidth) {
            left = '100%';
          } else {
            left = this.positionLeft / this.sliderMaxWidth * 100;
            left = left > 50 ? Math.ceil(left) : Math.floor(left);
            left += '%';
          }
        }
        return { left };
      },
      trackActiveWidth() {
        return { width: this.handlePositionLeft.left };
      },
      showTooltip() {
        if (this.tooltip === 0) return false;
        if (this.tooltip === 1 && this.dragging) return true;
        if (this.tooltip === 2) return true;
        return false;
      },
      tooltipContent() {
        if (typeof this.tooltipTpl === 'string') {
          return this.tooltipTpl.replace('{value}', this.model);
        }
        if (typeof this.tooltipTpl === 'function') {
          return this.tooltipTpl(this.model);
        }
      },

      isDragging() {
        return { 'is-dragging': this.dragging };
      },
      isDisabled() {
        return { 'is-disabled': this.disabled };
      },
    },
    watch: {
      handlePositionLeft(val) {
        const { left } = val;
        this.getModelValue(left);
      },
      hasStep(val) {
        if (val) {
          this.createMarkByStep();
        }
      },
      showMark(val) {
        if (val) {
          this.createMarkByStep();
        }
      },
    },
    methods: {
      getModelValue(precentage) {
        const precent = precentage.replace('%', '') / 100;
        const len = (this.max - this.min) * precent;
        this.model = Math.ceil(this.min + len);
      },
      checkRangeAndStep() {
        if (process.env.NODE_ENV !== 'production') {
          if (this.max <= this.min) {
            throw new Error('[vuego-slider]: Max must be greater than min.');
          }
          if (this.hasStep) {
            if ((this.max - this.min) % this.step !== 0) {
              throw new Error('[vuego-slider]: Please enter a reasonable step value.');
            }
          }
        }
      },
      createMarkByStep() {
        if (this.hasStep && this.showMark) {
          const markCount = (this.max - this.min) / this.step;
          this.markWidth = this.sliderMaxWidth / markCount;

          for (let i = 0; i < markCount + 1; i += 1) {
            this.marks.push({
              index: i,
              left: `${i / markCount * 100}%`,
            });
          }
        }
      },
      initHandlePosition() {
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
        this.updateHandlePosition({ pageX: this.sliderOffsetLeft + this.sliderMaxWidth * percentage });
      },
      updateHandlePosition(e) {
        const { pageX } = e;
        let positionLeft = pageX - this.sliderOffsetLeft - this.handleWidth / 2;

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
          positionLeft = this.marks[currentMark]['left'];
        }
        this.positionLeft = positionLeft;
      },
      handleClicked(e) {
        if (this.disabled) return;

        this.updateHandlePosition(e);
      },

      bindTouchEvent() {
        const handle = this.$refs.slider.querySelector('.v-slider__handle');
        const hammer = new Hammer(handle);

        hammer.get('pan').set({
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 1,
        });

        hammer.on('panstart', (e) => {
          this.touchStart(e);
        });
        hammer.on('panmove', (e) => {
          this.touchMove(e);
        });
        hammer.on('panend pancancel', (e) => {
          this.touchEnd(e);
        });
      },
      touchStart(e) {
        this.dragging = true;
      },
      touchMove(e) {
        this.handleClicked(e.srcEvent);
      },
      touchEnd(e) {
        this.dragging = false;
        this.handleClicked(e.srcEvent);
      },
    },
    mounted() {
      const $slider = this.$refs.slider;
      this.sliderOffsetLeft = $slider.offsetLeft;
      this.sliderMaxWidth = $slider.offsetWidth - this.handleWidth;

      this.checkRangeAndStep();
      this.createMarkByStep();
      this.initHandlePosition();
      this.bindTouchEvent();
    },
  };
</script>

<style lang="less" scoped>
@handleSize: 22px;

.v-slider {
  width: 100%;
  height: 30px;
  user-select: none;
  color: #f00;
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
      background: #a98eff;
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
    box-shadow: 0 1px 8px rgba(0,0,0,.2), 0 3px 4px rgba(0,0,0,.14), 0 3px 3px -2px rgba(0,0,0,.12);
  }
  &__tooltips {
    border-radius: 2px;
    background: #a98eff;
    color: #fff;
    font-size: 13px;
    line-height: 16px;
    display: inline-flex;
    transform: translateX(-50%) translateY(-139%) scale(1);
    position: absolute;
    top: 0;
    left: @handleSize / 2 - 1;
    div {
      padding: 2px 4px;
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
  }
  &.is-dragging {
    .v-slider__track, .v-slider__handle {
      transition: none;
    }
    .v-slider__tooltips {
      transform: translateX(-50%) translateY(-150%) scale(1.2);
    }
  }
  &.is-disabled {
    cursor: not-allowed;
    opacity: .6;
  }
}
</style>
