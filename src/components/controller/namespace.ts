export interface ICallbacks {
  onCreate: TCallback | null;
  onStart: TCallback | null;
  onSlide: TCallback | null;
  onEnd: TCallback | null;
  onUpdate: TCallback | null;
  [key: string]: TCallback | null;
}

export type event = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

export interface CustomEvents {
  create?: event;
  start?: event;
  slide?: event;
  end?: event;
  update?: event;
}

export const initialOptions: ICallbacks = {
  onCreate: null,
  onStart: null,
  onSlide: null,
  onEnd: null,
  onUpdate: null
};

export type TCallback = (event?: Event, data?: any) => void;