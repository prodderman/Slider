import { assert } from 'chai';
import { spy } from 'sinon';

import IObserver from './../../observer/observer';
import Model from '../model';
import { initialOptions as initialModelOptions } from '../initial';
import { getStateWhenSliderSingle, getStateWhenSliderDouble, modelOptionsWithDouble, optionsMap } from './model-data';
import { THandleType } from '../namespace';

describe('Test Model', () => {
  describe('Model init', () => {
    const model = new Model();

    it('initial options', () => {
      assert.deepEqual(model.options, initialModelOptions,
        `must ${JSON.stringify(initialModelOptions)},
        \nreturned ${JSON.stringify(model.options)}\n`);
    });

    it('initial state', () => {
      assert.deepEqual(model.state, { from: model.options.from, to: model.options.to },
        `must ${JSON.stringify(model.state)},
        \nreturned ${JSON.stringify({ from: model.options.from, to: model.options.to })}\n`);
    });

    it('initial events', () => {
      assert.deepEqual(model.events, { stateChanged: new IObserver<{ handle: THandleType, value: number }>() });
    });
  });

  describe('Model update options', () => {
    optionsMap.forEach((expectedOptions, options) => {
      it(`update options with ${JSON.stringify(options)} must return ${JSON.stringify(expectedOptions)}`, () => {
        const model = new Model();
        model.updateOptions(options);
        assert.deepEqual(expectedOptions, model.options,
          `must ${JSON.stringify(expectedOptions)}, \nreturned ${JSON.stringify(model.options)}\n`);
      });
    });
  });

  describe(`Model updateState when type is Single with options: ${JSON.stringify(initialModelOptions)}`, () => {
    const data = getStateWhenSliderSingle(new Model().options);
    data.forEach((expectedState, state) => {
      it(`update state with ${JSON.stringify(state)} must return ${JSON.stringify(expectedState)}`, () => {
        const model = new Model();
        model.updateState(state);
        assert.deepEqual(model.state, expectedState,
          `must ${JSON.stringify(expectedState)}, \nreturned ${JSON.stringify(model.state)}\n`);
      });
    });
  });

  describe(`Model updateState when type is Double with options: ${JSON.stringify(modelOptionsWithDouble)}`, () => {
    const modelForData = new Model();
    modelForData.updateOptions(modelOptionsWithDouble);
    const data = getStateWhenSliderDouble(modelForData.options, modelForData.state);
    data.forEach((expectedState, state) => {
      it(`update state with ${JSON.stringify(state)} must return ${JSON.stringify(expectedState)}`, () => {
        const model = new Model();
        model.updateOptions(modelOptionsWithDouble);
        model.updateState(state);
        assert.deepEqual(model.state, expectedState,
          `must ${JSON.stringify(expectedState)}, \nreturned ${JSON.stringify(model.state)}\n`);
      });
    });
  });

  describe('Model events', () => {
    const model = new Model();

    it('call callback after attach and takes needed arguments', () => {
      const callback = spy();
      const expectedValue = 20;
      const describe = model.events.stateChanged.attach(callback);
      model.updateState({ from: expectedValue });
      assert.isTrue(callback.called);
      assert.deepEqual(callback.args[0][0], { handle: 'from', value: expectedValue });
      describe();
    });

    it('callback is not called after describe', () => {
      const callback = spy();
      const describe = model.events.stateChanged.attach(callback);
      describe();
      model.updateState({ from: 20 });
      assert.isFalse(callback.called);
    });
  });
});
