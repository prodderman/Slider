import Model from './../model';
import assert = require('assert');
import { expect } from 'chai';

interface supposedOptions {
  range?: boolean;
  min?: number;
  max?: number;
  value?: number;
  values?: [number, number]
}

describe('( class Model )', () => {
  describe('( new Model() )', () => {
    const model = new Model({
      range: true,
      min: 20,
      max: 50,
      values: [10, 25], 
    });

    const modelObj: supposedOptions = {
      range: model.range,
      min: model.min,
      max: model.max,
      value: model.value,
    }

    const supposedOptionsObj: supposedOptions = {
      range: true,
      min: 20,
      max: 50,
      values: [20, 25]
    }

    it('при передаче параметров в модель, ее свойства должны быть заменены', () => {
      expect(modelObj).to.deep.equal(supposedOptionsObj);
    });    
  });

  describe('( set min )', () => {
    it('при значении больше max getter min вернет переданное значение, a значение max станет равным min', () => {
      const model = new Model()
      model.min = 101;
      assert(model.min  === 101 && model.max === model.min);
    });

    it('при изменении min, value вернет min, если min стало больше value', () => {
      const model = new Model()
      model.value = 20;
      model.min = 30;
      assert(model.value  === model.min);
    });

    it('при изменении min, если range == true, values[0] вернет min, если min стало больше values[0]', () => {
      const model = new Model()
      model.range = true;
      model.values = [0, 40]
      model.min = 30;
      assert(model.values[0]  === model.min);
    });
  });

  describe('( set max )', () => {
    it('при значении меньше min getter max вернет переданное значение, a значение min станет равным max', () => {
      const model = new Model()
      model.max = -20;
      assert(model.max  === -20 && model.min === model.max);
    });

    it('при изменении max, getter value вернет max, если max стало меньше value', () => {
      const model = new Model()
      model.value = 90;
      model.max = 80;
      assert(model.value  === model.max);
    });

    it('при изменении max, если range == true, values[1] вернет max, если max стало меньше values[1]', () => {
      const model = new Model()
      model.range = true;
      model.values = [0, 80];
      model.max = 70;
      assert(model.values[1]  === model.max);
    });
  });

  describe('( set value )', () => {
    it('в промежутке [min = 0, min = 100] getter value вернет 5 при передачи 5', () => {
      const model = new Model()
      model.value = 5;
      assert(model.value  === 5);
    });

    it('в промежутке [min = 0, max = 100] getter value вернет min при значении меньше min', () => {
      const model = new Model()
      model.value = - 5;
      assert(model.value  === model.min);
    });

    it('в промежутке [min = 0, max = 100] getter value вернет max при значении меньше max', () => {
      const model = new Model()
      model.value = 102;
      assert(model.value  === model.max);
    });

    it('если range == true getter value вернет undefined при любом значении', () => {
      const model = new Model();
      model.range = true;
      model.value = 2;
      assert(model.value === undefined);
    });
  });

  describe('( set segment )', () => {
    it('', () => {
      
    });
  });

  describe('( set values )', () => {
    it('', () => {
      
    });
  });
})