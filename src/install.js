import VuegoSlider from './components/Slider.vue';

const install = (Vue) => {
  Vue.component('vuego-slider', VuegoSlider);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export { VuegoSlider };
export default { install };
