import Model from './../model';
import { assert, expect } from 'chai';

interface supposedOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
}

describe('( class Model )', () => {
  describe('( method validate )', () => {
    it('test validate parameters 1', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 50,
        max: 100,
        from: 50,
        to: 0,
        step: 3
      }

      model.validate({
        min: 50,
        step: 3
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 2', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 150,
        max: 150,
        from: 150,
        to: 0,
        step: 1
      }

      model.validate({
        min: 150,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 3', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 150,
        max: 150,
        from: 150,
        to: 150,
        step: 1
      }

      model.validate({
        type: true,
        min: 150,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 4', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 0,
        max: 150,
        from: 0,
        to: 150,
        step: 1
      }

      model.validate({
        type: true,
        min: 0,
        max: 150,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 5', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 0,
        max: 150,
        from: 100,
        to: 100,
        step: 1
      }

      model.validate({
        type: true,
        min: 0,
        max: 150,
        from: 100,
        to: 30,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test validate parameters 6', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 0,
        max: 150,
        from: 150,
        to: -30,
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

    it('validate with changes and with update parameter should call notify', () => {
      const model = new Model();
      let checkEvent = false;
      model.sliderChanged.attach(() => {
        checkEvent = true;
      });

      const options: supposedOptions = {
        type: false,
        min: 0,
        max: 150,
        from: 0,
        to: 0,
        step: 1
      }

      model.validate({
        max: 150,
      }, true);

      expect(checkEvent).to.be.true;
    });

    it('validate with update parameter, but without changes should not call notify', () => {
      const model = new Model();
      let checkEvent = false;
      model.sliderChanged.attach(() => {
        checkEvent = true;
      });

      const options: supposedOptions = {
        type: false,
        min: 0,
        max: 150,
        from: 0,
        to: 0,
        step: 1
      }

      model.validate({
        max: 100,
      }, true);

      expect(checkEvent).to.be.false;
    });
  });
})