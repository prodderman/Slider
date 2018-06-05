// import Model from './../model';
// import { assert, expect } from 'chai';

// interface SupposedOptions {
//   type: boolean;
//   min: number;
//   max: number;
//   from: number;
//   fromFixed: boolean;
//   to: number;
//   toFixed: boolean;
//   step: number;
// }

// interface ModelOptions {
//   type?: boolean;
//   min?: number;
//   max?: number;
//   from?: number;
//   fromFixed?: boolean;
//   to?: number;
//   toFixed?: boolean;
//   step?: number;
//   [key: string]: number | boolean | undefined;
// }

// const optionsMap = new Map<SupposedOptions, ModelOptions>();
// optionsMap.set({
//     type: false,
//     min: 50,
//     max: 100,
//     from: 50,
//     fromFixed: false,
//     to: 0,
//     toFixed: false,
//     step: 3
//   }, {
//     min: 50,
//     step: 3
//   });

// optionsMap.set({
//     type: false,
//     min: 150,
//     max: 150,
//     from: 150,
//     fromFixed: false,
//     to: 0,
//     toFixed: false,
//     step: 1
//   }, {
//     min: 150,
//   });

// optionsMap.set({
//     type: true,
//     min: 150,
//     max: 150,
//     from: 150,
//     fromFixed: false,
//     to: 150,
//     toFixed: false,
//     step: 1
//   }, {
//     type: true,
//     min: 150,
//     from: -341,
//     to: 231,
//   });

// optionsMap.set({
//     type: true,
//     min: 0,
//     max: 150,
//     from: 0,
//     fromFixed: false,
//     to: 150,
//     toFixed: false,
//     step: 1
//   }, {
//     type: true,
//     min: 0,
//     max: 150,
//     from: -341,
//     to: 231,
//   });

// optionsMap.set({
//     type: true,
//     min: 0,
//     max: 150,
//     from: 100,
//     fromFixed: false,
//     to: 100,
//     toFixed: false,
//     step: 1
//   }, {
//     type: true,
//     min: 0,
//     max: 150,
//     from: 100,
//     to: 30,
//   });

// optionsMap.set({
//     type: false,
//     min: 0,
//     max: 150,
//     from: 150,
//     fromFixed: false,
//     to: -30,
//     toFixed: false,
//     step: 1
//   }, {
//     min: 0,
//     max: 150,
//     from: 1000,
//     to: -30,
//     step: -1
//   });

// describe('( Test Model )', () => {
//   describe('( method init )', () => {

//     optionsMap.forEach((modelOptions: ModelOptions, supposedOptions: SupposedOptions) => {
//       const model = new Model(modelOptions);
//       it(` test init with parameters ${JSON.stringify(modelOptions)} `, () => {
//         assert.deepEqual(model.data, supposedOptions, `must ${JSON.stringify(supposedOptions)}, \nreturn ${JSON.stringify(model.data)}\n`);
//       });
//     });
//   });

//   describe('( method calcFromWithStep)', () => {

//     function r(min: number, max: number) {
//       return Math.random() * (max - min) + min;
//     }

//     function onStepInRange(step: number, value: number) {
//       const model = new Model({ min: 10, step: step });
//       const supposedValue = Math.round(( value - model.data.min ) / step) * step + model.data.min;
//       if ( value < model.data.min ) {

//         it('at a value less then minimum, must return minimum', () => {
//           model.calcFromWithStep(-435);
//           assert.equal(model.data.from, model.data.min);
//         });

//       } else if ( value > model.data.max ) {

//         it('at a value greater then maximum, must return maximum', () => {
//           model.calcFromWithStep(124);
//           assert.equal(model.data.from, model.data.max);
//         });

//       } else {

//         it(`at a value of ${value} with step ${step}, must return ${supposedValue}`, () => {
//           model.calcFromWithStep(value);
//           assert.equal(model.data.from, supposedValue);
//         });
//       }
//     }
//     it('at model.type == true and at a value greater then model.to, must return model.to', () => {
//       const model = new Model({type: true, step: 2.4, to: 77 });
//       model.calcFromWithStep(88);
//       assert.equal(model.data.from, model.data.to);
//     });

//     for (let i = 0; i < 15; i++) {
//       onStepInRange(+r(0.001, 10).toFixed(2), +r(-180, 180).toFixed(2));
//     }
//   });

//   describe('( method calcToWithStep)', () => {
//     function r(min: number, max: number) {
//       return Math.random() * (max - min) + min;
//     }

//     function onStepInRange(step: number, value: number) {
//       const model = new Model({type: true, from: 10, step: step });
//       const supposedValue = Math.round(( value - model.data.min ) / step) * step + model.data.min;
//       if ( value < model.data.from ) {

//         it('at a value less then model.from, must return model.from', () => {
//           model.calcToWithStep(-435);
//           assert.equal(model.data.to, model.data.from);
//         });

//       } else if ( value > model.data.max ) {

//         it('at a value greater then maximum, must return maximum', () => {
//           model.calcToWithStep(124);
//           assert.equal(model.data.to, model.data.max);
//         });

//       } else {

//         it(`at a value of ${value} with step ${step}, must return ${supposedValue}`, () => {
//           model.calcToWithStep(value);
//           assert.equal(model.data.to, supposedValue);
//         });
//       }
//     }

//     for (let i = 0; i < 15; i++) {
//       onStepInRange(+r(0.001, 10).toFixed(2), +r(-180, 180).toFixed(2));
//     }
//   });
// });