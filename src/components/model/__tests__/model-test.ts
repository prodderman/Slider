import Model from './../model';
import { assert, expect } from 'chai';

interface supposedOptions {
  range: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
}

describe('( class Model )', () => {
  describe('( method validate )', () => {
    const model = new Model();

    it('test validate parameters 1', () => {
      const options: supposedOptions = {
        range: false,
        min: 50,
        max: 100,
        from: 50,
        to: 50,
        step: 3
      }

      model.validate({
        min: 50,
        step: 3
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 2', () => {
      const options: supposedOptions = {
        range: false,
        min: 150,
        max: 150,
        from: 150,
        to: 150,
        step: 1
      }

      model.validate({
        min: 150,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 3', () => {
      const options: supposedOptions = {
        range: true,
        min: 0,
        max: 150,
        from: 0,
        to: 150,
        step: 1
      }

      model.validate({
        min: 150,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 4', () => {
      const options: supposedOptions = {
        range: true,
        min: 0,
        max: 150,
        from: 0,
        to: 150,
        step: 1
      }

      model.validate({
        min: 0,
        max: 1,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 5', () => {
      const options: supposedOptions = {
        range: true,
        min: 0,
        max: 150,
        from: 100,
        to: 100,
        step: 1
      }

      model.validate({
        min: 0,
        max: 150,
        from: 100,
        to: 30,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 5', () => {
      const options: supposedOptions = {
        range: true,
        min: 0,
        max: 150,
        from: 150,
        to: 150,
        step: 1
      }

      model.validate({
        min: 0,
        max: 150,
        from: 1000,
        to: -30,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });
  });
})