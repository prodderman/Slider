import Model from './../model';
import { assert, expect } from 'chai';

interface supposedOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  from_fixed: boolean;
  to: number;
  to_fixed: boolean;
  step: number;
}

describe('( Test Model )', () => {
  describe('( method init )', () => {
    it('test init parameters 1', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 50,
        max: 100,
        from: 50,
        from_fixed: false,
        to: 0,
        to_fixed: false,
        step: 3
      }

      model.init({
        min: 50,
        step: 3
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test init parameters 2', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 150,
        max: 150,
        from: 150,
        from_fixed: false,
        to: 0,
        to_fixed: false,
        step: 1
      }

      model.init({
        min: 150,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test init parameters 3', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 150,
        max: 150,
        from: 150,
        from_fixed: false,
        to: 150,
        to_fixed: false,
        step: 1
      }

      model.init({
        type: true,
        min: 150,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test init parameters 4', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 0,
        max: 150,
        from: 0,
        from_fixed: false,
        to: 150,
        to_fixed: false,
        step: 1
      }

      model.init({
        type: true,
        min: 0,
        max: 150,
        from: -341,
        to: 231,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test init parameters 5', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: true,
        min: 0,
        max: 150,
        from: 100,
        from_fixed: false,
        to: 100,
        to_fixed: false,
        step: 1
      }

      model.init({
        type: true,
        min: 0,
        max: 150,
        from: 100,
        to: 30,
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });

    it('test init parameters 6', () => {
      const model = new Model();
      const options: supposedOptions = {
        type: false,
        min: 0,
        max: 150,
        from: 150,
        from_fixed: false,
        to: -30,
        to_fixed: false,
        step: 1
      }

      model.init({
        min: 0,
        max: 150,
        from: 1000,
        to: -30,
        step: -1
      })

      assert.deepEqual(model.data, options, `must ${JSON.stringify(options)}, \nreturn ${JSON.stringify(model.data)}\n`);
    });
  });

  describe('( method calcFromWithStep)', () => {

    function r(min:number, max:number) {
      return Math.random() * (max - min) + min;
    }

    function onStepInRange(step: number, value: number) {
      const model = new Model({ min: 10, step: step });
      const supposedValue = Math.round(( value - model.data.min ) / step) * step + model.data.min;
      if ( value < model.data.min ) {

        it('at a value less then minimum, must return minimum', () => {
          model.calcFromWithStep(-435);
          assert.equal(model.data.from, model.data.min);
        });

      } else if ( value > model.data.max ) {

        it('at a value greater then maximum, must return maximum', () => {
          model.calcFromWithStep(124);
          assert.equal(model.data.from, model.data.max);
        });

      } else {

        it(`at a value of ${value} with step ${step}, must return ${supposedValue}`, () => {
          model.calcFromWithStep(value);
          assert.equal(model.data.from, supposedValue);
        });
      }
    }
    it('at model.type == true and at a value greater then model.to, must return model.to', () => {
      const model = new Model({type: true, step: 2.4, to: 77 });
      model.calcFromWithStep(88);
      assert.equal(model.data.from, model.data.to);
    });

    for (let i = 0; i < 15; i++) {
      onStepInRange(+r(0.001,10).toFixed(2),+r(-180,180).toFixed(2));
    }
  });

  describe('( method calcToWithStep)', () => {
    
    function r(min:number, max:number) {
      return Math.random() * (max - min) + min;
    }

    function onStepInRange(step: number, value: number) {
      const model = new Model({type: true, from: 10, step: step });
      const supposedValue = Math.round(( value - model.data.min ) / step) * step + model.data.min;
      if ( value < model.data.from ) {

        it('at a value less then model.from, must return model.from', () => {
          model.calcToWithStep(-435);
          assert.equal(model.data.to, model.data.from);
        });

      } else if ( value > model.data.max ) {

        it('at a value greater then maximum, must return maximum', () => {
          model.calcToWithStep(124);
          assert.equal(model.data.to, model.data.max);
        });

      } else {

        it(`at a value of ${value} with step ${step}, must return ${supposedValue}`, () => {
          model.calcToWithStep(value);
          assert.equal(model.data.to, supposedValue);
        });
      }
    }

    for (let i = 0; i < 15; i++) {
      onStepInRange(+r(0.001,10).toFixed(2),+r(-180,180).toFixed(2));
    }
  });
})