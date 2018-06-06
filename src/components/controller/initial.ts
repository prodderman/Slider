import { CustomEvents, ICallbacks } from './namespace';

export const initialCustomEvents: CustomEvents = {
  create: new CustomEvent('vanillacreate'),
  start: new CustomEvent('vanillastart'),
  slide: new CustomEvent('vanillaslide'),
  end: new CustomEvent('vanillaend'),
  update: new CustomEvent('vanillaupdate'),
};

export const initialOptions: ICallbacks = {
  onCreate: null,
  onStart: null,
  onSlide: null,
  onEnd: null,
  onUpdate: null
};
