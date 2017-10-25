import './index.scss';
import VanillaSlider from './slider';

const slider = new VanillaSlider('.slider', {
  
});

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}