import './index.scss';
import VanillaSlider from './slider';
import $ from 'jquery';

$(document).ready(function() { 
  const constrols = {
    $from: $('.js-field__input-from'),
    $to: $('.js-field__input-to'),
    $min: $('.js-field__input-min'),
    $max: $('.js-field__input-max'),
    $type: $('.js-field__input-type'),
    $orientation: $('.js-field__input-orientaion'),
    $step: $('.js-field__input-step'),
    $fromFixed: $('.js-field__input-from-fixed'),
    $toFixed: $('.js-field__input-to-fixed')
  }

  const indicators = {
    $create: $('.js-indicator-oncreate'),
    $slide: $('.js-indicator-onslide'),
    $start: $('.js-indicator-onstart'),
    $end: $('.js-indicator-onend'),
    $update: $('.js-indicator-onupdate'),
  }

  let onCreateTimeId,
      onStartTimeId,
      onSlideTimeId,
      onEndTimeId,
      onUpdateTimeId;

  const remove = function() {
    $('.js-indicator').removeClass('active');
  }

  const slider = new VanillaSlider('.js-slider', {
    type: 'single',
    min: -100,
    from: 10,
    to: 50,
    onCreate: (event, data) => {
      constrols.$from.val(data.from);
      constrols.$to.val(data.to);
      constrols.$min.val(data.min);
      constrols.$max.val(data.max);
      constrols.$step.val(data.step);
      constrols.$fromFixed.attr('checked', data.fromFixed);
      constrols.$toFixed.attr('checked', data.toFixed);
      constrols.$type.filter(`input[value=${data.type}]`).prop('checked', true);
      constrols.$orientation.filter(`input[value=${data.orientation}]`).prop('checked', true);
      indicators.$create.addClass('active');
      clearTimeout(onCreateTimeId);
      onCreateTimeId = setTimeout(remove, 200);
    },
    onStart: (event, data) => {
      constrols.$from.val(data.from);
      constrols.$to.val(data.to);
      indicators.$start.addClass('active');
      clearTimeout(onStartTimeId);
      onStartTimeId = setTimeout(remove, 200);
    },
    onSlide: (event, data) => {
      constrols.$from.val(data.from);
      constrols.$to.val(data.to);
      indicators.$slide.addClass('active');
      clearTimeout(onSlideTimeId);
      onSlideTimeId = setTimeout(remove, 200);
    },
    onEnd: (event, data) => {
      constrols.$from.val(data.from);
      constrols.$to.val(data.to);
      indicators.$end.addClass('active');
      clearTimeout(onEndTimeId);
      onEndTimeId = setTimeout(remove, 200);
    },
    onUpdate: (event, data) => {
      constrols.$from.val(data.from);
      constrols.$to.val(data.to);
      constrols.$min.val(data.min);
      constrols.$max.val(data.max);
      constrols.$step.val(data.step);
      constrols.$fromFixed.attr('checked', data.fromFixed);
      constrols.$toFixed.attr('checked', data.toFixed);
      constrols.$type.filter(`input[value=${data.type}]`).prop('checked', true);
      constrols.$orientation.filter(`input[value=${data.orientation}]`).prop('checked', true);
      indicators.$update.addClass('active');
      clearTimeout(onUpdateTimeId);
      onUpdateTimeId = setTimeout(remove, 200);
    }
  });

  constrols.$type.change((event) => {
    setSliderOption(slider, 'type', event.target.value);
  });

  constrols.$orientation.change((event) => {
    setSliderOption(slider, 'orientation', event.target.value);
  });

  constrols.$min.focusout((event) => {
    setSliderOption(slider, 'min', event.target.value);
  });

  constrols.$max.focusout((event) => {
    setSliderOption(slider, 'max', event.target.value);
  });

  constrols.$from.focusout((event) => {
    setSliderOption(slider, 'from', event.target.value);
  });

  constrols.$to.focusout((event) => {
    setSliderOption(slider, 'to', event.target.value);
  });

  constrols.$fromFixed.change((event) => {
    setSliderOption(slider, 'fromFixed', event.target.checked);
  });

  constrols.$toFixed.change((event) => {
    setSliderOption(slider, 'toFixed', event.target.checked);
  });

  constrols.$step.focusout((event) => {
    setSliderOption(slider, 'step', event.target.value);
  });
});

function setSliderOption(slider, optionName, value) {
  slider.setOptions({
    [optionName]: value
  })
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}