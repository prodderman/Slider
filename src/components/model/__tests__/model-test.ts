import Model from './../model';
import assert = require('assert');
import { expect } from 'chai';

interface supposedOptions {
  range: boolean;
  min: number;
  max: number;
  value: number;
  valueAlt: number;
}

describe('( class Model )', () => {
  describe('( new Model() )', () => {
    const model = new Model({
      range: true,
      min: 20,
      max: 50,
      value: 10,
      valueAlt: 25
    });

    const modelObj: supposedOptions = {
      range: model.range,
      min: model.min,
      max: model.max,
      value: model.value,
      valueAlt: model.valueAlt
    }

    const supposedOptionsObj: supposedOptions = {
      range: true,
      min: 20,
      max: 50,
      value: 20,
      valueAlt: 25
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

    it('при изменении min, если range == true, valueAlt вернет min, если min стало больше valueAlt', () => {
      const model = new Model()
      model.range = true;
      model.valueAlt = 20;
      model.min = 30;
      assert(model.valueAlt  === model.min);
    });
  });

  describe('( set max )', () => {
    it('при значении меньше min getter max вернет переданное значение, a значение min станет равным max', () => {
      const model = new Model()
      model.max = -20;
      assert(model.max  === -20 && model.min === model.max);
    });

    it('при изменении max, value вернет max, если max стало меньше value', () => {
      const model = new Model()
      model.value = 90;
      model.max = 80;
      assert(model.value  === model.max);
    });

    it('при изменении max, если range == true, valueAlt вернет max, если max стало меньше valueAlt', () => {
      const model = new Model()
      model.range = true;
      model.valueAlt = 80;
      model.min = 70;
      assert(model.valueAlt  === model.max);
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

  describe('( set value )', () => {
    it('в промежутке [min = 0, min = 100] если range == false, getter value вернет 5 при передачи 5', () => {
      const model = new Model()
      model.value = 5;
      assert(model.value  === 5);
    });

    it('в промежутке [min = 0, max = 100] если range == false getter value вернет min при значении меньше min', () => {
      const model = new Model()
      model.value = - 5;
      assert(model.value  === model.min);
    });

    it('в промежутке [min = 0, max = 100] если range == false getter value вернет max при значении меньше max', () => {
      const model = new Model()
      model.value = 102;
      assert(model.value  === model.max);
    });

    it('если range == true getter value вернет valueAlt при значении меньше valueAlt', () => {
      const model = new Model();
      model.range = true;
      model.valueAlt = 20;
      model.value = 2;
      assert(model.value === model.valueAlt);
    });
  });

  describe('( set valueAlt )', () => {
    it('если range == false, getter valueAlt вернет null при любом значении', () => {
      const model = new Model()
      model.valueAlt = 1535;
      assert(model.valueAlt === null);
    });
    it('если range == false, getter valueAlt вернет null при любом значении', () => {
      const model = new Model()
      model.valueAlt = -1535;
      assert(model.valueAlt === null);
    });

    it('если range == true, getter valueAlt вернет min при значениях меньше min', () => {
      const model = new Model()
      model.range = true;
      model.valueAlt = -124;
      assert(model.valueAlt === model.min);
    });

    it('если range == true, getter valueAlt вернет value при значениях больше value', () => {
      const model = new Model()
      model.range = true;
      model.value = 20;
      model.valueAlt = 100;
      assert(model.valueAlt === model.value);
    });

    it('если range == true и value = 20, valueAlt вернет 5 при значении 5', () => {
      const model = new Model({range: true, value: 20})
      model.valueAlt = 5;
      assert(model.valueAlt === 5);
    });
  });
})