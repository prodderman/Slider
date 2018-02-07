export interface IOptions {
    type?: string;
    orientation?: string;
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

export type Selector = HTMLElement | HTMLCollection | string;
export type TCallback = (event?: Event, data?: IOptions) => void;