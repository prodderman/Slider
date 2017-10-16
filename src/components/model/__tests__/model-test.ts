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
        step: -1
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('validate with changes and with update parameter should call notify', () => {
      const model = new Model();
      let checkEvent = false;
      model.sliderChanged.attach(() => {
        checkEvent = true;
      });

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

      model.validate({
        max: 100,
      }, true);

      expect(checkEvent).to.be.false;
    });
  });

  describe('( method calcFromWithStep)', () => {

    function r(min:number, max:number) {
      return Math.random() * (max - min) + min;
    }

    function onStepInRange(step: number, value: number) {
      const model = new Model({ min: 10 });
      const supposedValue = Math.round(( value - model.min ) / step) * step + model.min;
      if ( value < model.min ) {

        it('at a value less then minimum, must return minimum', () => {
          model.calcFromWithStep(-435);
          assert.equal(model.from, model.min);
        });

      } else if (value > model.max) {

        it('at a value greater then maximum, must return maximum', () => {
          model.calcFromWithStep(124);
          assert.equal(model.from, model.max);
        });

      } else {

        it(`at a value of ${value} with step ${step}, must return ${supposedValue}`, () => {
          model.calcFromWithStep(value);
          assert.equal(model.from, supposedValue);
        });
      }
    }
    it('at model.type == true and at a value greater then model.to, must return model.to', () => {
      const model = new Model({type: true, step: 2.4, to: 77 });
      model.calcFromWithStep(88);
      assert.equal(model.from, model.to);
    });

    for (let i = 0; i < 15; i++) {
      onStepInRange(+r(0.001,10).toFixed(2),+r(-180,180).toFixed(2));
    }
  });
})