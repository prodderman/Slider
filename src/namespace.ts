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
    onSlideStart?: TCallback;
    onSlide?: TCallback;
    onSlideFinish?: TCallback;
    onUpdate?: TCallback;
  }

export type TNode = Element | HTMLCollection | string | null;
