<template>
  <div class="vuego-pan" ref="pan">
    <slot></slot>
  </div>
</template>

<script>
import Hammer from 'hammerjs';

export default {
  name: 'vuego-pan',
  props: ['start', 'move', 'end'],
  data() {
    return {
      hammer: null,
    };
  },
  mounted() {
    const elm = this.$refs.pan;
    const hammer = this.hammer = new Hammer(elm);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 1,
    });

    hammer.on('panstart', e => this.start(e));
    hammer.on('panmove', e => this.move(e));
    hammer.on('panend pancancel', e => this.end(e));
  },
  beforeDestroy() {
    this.hammer.destroy();
    this.hammer = null;
  },
};
</script>
