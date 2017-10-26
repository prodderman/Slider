import './index.scss';
import VanillaSlider from './slider';

[].forEach.call(document.querySelectorAll('.slider'), (node, index) => {
  new VanillaSlider(node, {
    type: "min"
  })
});

VanillaSlider.for('.slider-1').set({
  type: "double",
  to: "100"
});

VanillaSlider.for('.slider-2').set({
  orientation: "vertical",
  type: "double",
  from: "50",
  step: 1
});


if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}