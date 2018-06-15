import { assert } from 'chai';
import { spy } from 'sinon';

import IObserver from './../../observer/observer';
import View from './../view';
import { initialOptions as initialViewOptions } from '../initial';
import { optionsMap } from './view-data';
import { THandleType } from '../namespace';

describe('Test View', () => {
  describe('View init', () => {
    const view = new View(document.createElement('div'));

    it('initial options', () => {
      assert.deepEqual(view.options, initialViewOptions,
        `must ${JSON.stringify(initialViewOptions)},
        \nreturned ${JSON.stringify(view.options)}\n`);
    });

    it('initial events', () => {
      assert.deepEqual(view.events, {
        slideStart: new IObserver<{ handle: THandleType }>(),
        slideFinish: new IObserver<{ handle: THandleType }>(),
        slide: new IObserver<{ handle: THandleType, pixels: number }>(),
      });
    });
  });

  describe('View update options', () => {
    optionsMap.forEach((expectedOptions, options) => {
      const view = new View(document.createElement('div'));
      view.updateOptions(options);
      it(`update options with ${JSON.stringify(options)}`, () => {
        assert.deepEqual(view.options, expectedOptions,
          `must ${JSON.stringify(expectedOptions)},
          \nreturned ${JSON.stringify(view.options)}\n`);
      });
    });
  });

  describe('View custom events', () => {
    it('handle called on custom event', () => {
      const view = new View(document.body);
      const eventName = 'testevent';
      const handler = spy();
      document.addEventListener(eventName, handler);
      const customEvent = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
      });
      view.emitCustomEvent(customEvent, 'track');
      assert.isTrue(handler.called);
    });
  });
});
