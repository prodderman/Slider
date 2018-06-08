import { IOptions, TSliderType, TOrientation } from './namespace';

export const initialOptions: IOptions = {
  type: TSliderType['from-start'],
  orientation: TOrientation.horizontal,
  hasRange: true,
  isFromFixed: false,
  isToFixed: false,
};
