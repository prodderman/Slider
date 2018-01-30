export interface IOptions {
    type?: string;
    orientation?: string;
    min?: number | string;
    max?: number | string;
    from?: number | string;
    from_fixed?: boolean | string;
    to?: number | string;
    to_fixed?: boolean | string;
    step?: number | string;

    onCreate?: TCallback;
    onStart?: TCallback;
    onSlide?: TCallback;
    onEnd?: TCallback;
    onUpdate?: TCallback;
  }

export type Selector = HTMLElement | HTMLCollection | string;
export type TCallback = (event?: Event, data?: IOptions) => void;