import { IOptions as ViewOptions, TOrientation, TSliderType } from '../namespace';
import { initialOptions } from '../initial';

export const optionsMap = new Map<ViewOptions, ViewOptions>();

optionsMap.set({
  ...initialOptions,
  hasRange: false,
  isFromFixed: true,
  isToFixed: true,
  orientation: TOrientation.vertical,
  type: TSliderType.double,
}, {
  hasRange: false,
  isFromFixed: true,
  isToFixed: true,
  orientation: TOrientation.vertical,
  type: TSliderType.double,
});

optionsMap.set({
  ...initialOptions,
  type: TSliderType['from-end'],
}, {
  ...initialOptions,
  type: TSliderType['from-end'],
});
