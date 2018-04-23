import { TType, TOrientation  } from './components/view/namespace';

export interface IOptions {
    type?: TType;
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

export type TNode = HTMLElement | HTMLCollection | string;
export type TCallback = (event?: Event, data?: IOptions) => void;
