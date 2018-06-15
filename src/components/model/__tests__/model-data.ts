import { IOptions as ModelOptions, IState, Partial } from '../namespace';
import { initialOptions } from '../initial';

export const modelOptionsWithDouble: ModelOptions = { ...initialOptions, isDouble: true, from: 50, to: 50 };

export const optionsMap = new Map<ModelOptions, ModelOptions>();

optionsMap.set(
  {
    ...initialOptions,
    min: 300,
    max: 200,
    step: -1,
  },
  {
    ...initialOptions,
    min: 200,
    max: 200,
    from: 200,
    to: 200,
    step: 1,
  },
);

optionsMap.set(
  {
    ...initialOptions,
    step: 200,
  },
  {
    ...initialOptions,
    step: initialOptions.max - initialOptions.min,
  },
);

export function getStateWhenSliderSingle(options: ModelOptions): Map<Partial<IState>, IState> {
  const stateMap = new Map<Partial<IState>, IState>();
  const { min, max, from, to, step } = options;

  stateMap.set(
    { from: min - 100 },
    { from: min, to },
  );

  stateMap.set(
    { from: max + 100 },
    { from: max, to },
  );

  stateMap.set(
    { to: max + 100 },
    { from, to: max },
  );

  stateMap.set(
    { to: min - 100 },
    { from, to: min },
  );

  const value = (max - min) / 1.9;
  const valueWithStep = Math.round((value - min) / step) * step + min;
  stateMap.set(
    { from: value },
    { from: valueWithStep, to },
  );

  stateMap.set(
    { to: value },
    { from, to: valueWithStep },
  );

  return stateMap;
}

export function getStateWhenSliderDouble(options: ModelOptions, state: IState): Map<Partial<IState>, IState> {
  const stateMap = new Map<Partial<IState>, IState>();
  const { min, max } = options;
  const { from, to } = state;

  stateMap.set(
    { from: max },
    { from: to, to },
  );

  stateMap.set(
    { from: min - 100 },
    { from: min, to },
  );

  stateMap.set(
    { to: min },
    { from, to: from },
  );

  stateMap.set(
    { to: max + 100 },
    { from, to: max },
  );

  return stateMap;
}
