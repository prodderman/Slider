import './index.scss';
import VanillaSlider from './slider';
import $ from 'jquery';

$(document).ready(function() { 
  const controls = {
    $from: $('.js-field__input-from'),
    $to: $('.js-field__input-to'),
    $min: $('.js-field__input-min'),
    $max: $('.js-field__input-max'),
    $type: $('.js-field__input-type'),
    $orientation: $('.js-field__input-orientation'),
    $step: $('.js-field__input-step'),
    $fromFixed: $('.js-field__input-from-fixed'),
    $toFixed: $('.js-field__input-to-fixed')
  }

  const indicators = {
    $create: $('.js-indicator-oncreate'),
    $slide: $('.js-indicator-onslide'),
    $start: $('.js-indicator-onstart'),
    $finish: $('.js-indicator-onfinish'),
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
      controls.$from.val(data.from);
      controls.$to.val(data.to);
      controls.$min.val(data.min);
      controls.$max.val(data.max);
      controls.$step.val(data.step);
      controls.$fromFixed.attr('checked', data.fromFixed);
      controls.$toFixed.attr('checked', data.toFixed);
      controls.$type.filter(`input[value=${data.type}]`).prop('checked', true);
      controls.$orientation.filter(`input[value=${data.orientation}]`).prop('checked', true);
      indicators.$create.addClass('active');
      clearTimeout(onCreateTimeId);
      onCreateTimeId = setTimeout(remove, 200);
    },
    onSlideStart: (event, data) => {
      controls.$from.val(data.from);
      controls.$to.val(data.to);
      indicators.$start.addClass('active');
      clearTimeout(onStartTimeId);
      onStartTimeId = setTimeout(remove, 200);
    },
    onSlide: (event, data) => {
      controls.$from.val(data.from);
      controls.$to.val(data.to);
      indicators.$slide.addClass('active');
      clearTimeout(onSlideTimeId);
      onSlideTimeId = setTimeout(remove, 200);
    },
    onSlideFinish: (event, data) => {
      controls.$from.val(data.from);
      controls.$to.val(data.to);
      indicators.$finish.addClass('active');
      clearTimeout(onEndTimeId);
      onEndTimeId = setTimeout(remove, 200);
    },
    onUpdate: (event, data) => {
      controls.$from.val(data.from);
      controls.$to.val(data.to);
      controls.$min.val(data.min);
      controls.$max.val(data.max);
      controls.$step.val(data.step);
      controls.$fromFixed.attr('checked', data.fromFixed);
      controls.$toFixed.attr('checked', data.toFixed);
      controls.$type.filter(`input[value=${data.type}]`).prop('checked', true);
      controls.$orientation.filter(`input[value=${data.orientation}]`).prop('checked', true);
      indicators.$update.addClass('active');
      clearTimeout(onUpdateTimeId);
      onUpdateTimeId = setTimeout(remove, 200);
    }
  });

  // get slider instance by node
  const slider2 = VanillaSlider.getInstance(document.getElementsByClassName('js-slider')[0]);

  // change options
  slider2.setOptions({min: -200, max: 200});

  controls.$type.change((event) => {
    setSliderOption(slider, 'type', event.target.value);
  });

  controls.$orientation.change((event) => {
    setSliderOption(slider, 'orientation', event.target.value);
  });

  controls.$min.focusout((event) => {
    setSliderOption(slider, 'min', event.target.value);
  });

  controls.$max.focusout((event) => {
    setSliderOption(slider, 'max', event.target.value);
  });

  controls.$from.focusout((event) => {
    setSliderOption(slider, 'from', event.target.value);
  });

  controls.$to.focusout((event) => {
    setSliderOption(slider, 'to', event.target.value);
  });

  controls.$fromFixed.change((event) => {
    setSliderOption(slider, 'fromFixed', event.target.checked);
  });

  controls.$toFixed.change((event) => {
    setSliderOption(slider, 'toFixed', event.target.checked);
  });

  controls.$step.focusout((event) => {
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