import { TSliderType, TOrientation  } from './components/view/namespace';
import { TCallback  } from './components/controller/namespace';

export interface IOptions {
    type?: TSliderType;
    orientation?: TOrientation;
    min?: number | string;
    max?: number | string;
    from?: number | string;
    fromFixed?: boolean | string;
    to?: number | string;
    toFixed?: boolean | string;
    step?: number | string;

    onCreate?: TCallback;
    onStart?: TCallback;
    onSlide?: TCallback;
    onEnd?: TCallback;
    onUpdate?: TCallback;
  }

export type TNode = Element | HTMLElement | HTMLCollection | string | null;
