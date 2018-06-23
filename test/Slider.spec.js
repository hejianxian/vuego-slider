import { mount, shallow } from '@vue/test-utils';
import Slider from '@/components/Slider.vue';

describe('Slider.vue', () => {
  it('matches snapshot', () => {
    const wrapper = mount(Slider);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('click Slider normally', () => {
    const wrapper = mount(Slider);
    wrapper.vm.sliderMaxWidth = 400;
    wrapper.vm.sliderOffsetLeft = 50;
    wrapper.find('.v-slider').trigger('click', { pageX: 200 });
    expect(wrapper.vm.handlePositionLeft).toEqual({left: '34%'});
  });

  it('click on Slider edge', () => {
    const wrapper = mount(Slider);
    wrapper.vm.sliderMaxWidth = 400;
    wrapper.vm.sliderOffsetLeft = 50;
    wrapper.find('.v-slider').trigger('click', { pageX: 460 });
    expect(wrapper.vm.handlePositionLeft).toEqual({left: '100%'});
  });

  it('the length of marks should be 11', () => {
    const wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 50,
        step: 5,
      },
    });
    const marks = wrapper.vm.marks;
    expect(marks.length).toBe(11);
  });

  it('mark positon', (done) => {
    const wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 50,
        step: 5,
      },
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$el.querySelectorAll('.v-slider__mark')[2].style.left).toBe('20%');
      done();
    });
  });

  it('step', () => {
    const wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 50,
        step: 5,
      },
    });
    wrapper.vm.sliderMaxWidth = 400;
    wrapper.vm.sliderOffsetLeft = 50;
    wrapper.vm.markWidth = 40;
    wrapper.find('.v-slider').trigger('click', { pageX: 411 });
    expect(wrapper.vm.handlePositionLeft).toEqual({left: '90%'});
  });
});
