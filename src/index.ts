import Slider from './slider';

const element = <HTMLElement>document.getElementById("slider");
const slider = new Slider(element);

if ((module as any).hot && process.env.NODE_ENV !== 'production') {
  (module as any).hot.accept()
}