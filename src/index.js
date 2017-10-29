import './index.scss';
import VanillaSlider from './slider';


const slider = new VanillaSlider('#slider', {
  type: "double",
  from: 10,
  from_fixed: true,
  to: 20,
  onSlide: (e, d) => {
    document.querySelector('#settings').innerHTML = d.value;
  }
});


if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}