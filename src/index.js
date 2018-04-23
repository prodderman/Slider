import './index.scss';
import VanillaSlider from './slider';
import $ from 'jquery';

$(document).ready(function() { 
  const $create = $('.js-callback_create'),
        $slide =$('.js-callback_slide'),
        $start =$('.js-callback_start'),
        $end =$('.js-callback_end'),
        $update =$('.js-callback_update'),
        $from = $('input[name="from"]'),
        $to = $('input[name="to"]'),
        $min = $('input[name="min"]'),
        $max = $('input[name="max"]'),
        $type = $('input[name="type"]'),
        $orientation = $('input[name="orientation"]'),
        $step = $('input[name="step"]'),
        $fromFixed = $('input[name="fixed-from"]'),
        $toFixed = $('input[name="fixed-to"]');
  let timeId;

  const remove = function() {
    $('.callback').removeClass('active');
  }

  const slider = new VanillaSlider('.js-slider', {
    min: -100,
    from: 10,
    to: 50,
    onCreate: (event, data) => {
      $from.val(data.from);
      $to.val(data.to);
      $min.val(data.min);
      $max.val(data.max);
      $step.val(data.step);
      $fromFixed.attr('checked', data.fromFixed);
      $toFixed.attr('checked', data.toFixed);
      $type.attr('checked', data.type);
      $orientation.attr('checked', data.orientation);
      $create.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onStart: (event, data) => {
      $from.val(data.from);
      $to.val(data.to);
      $start.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onSlide: (event, data) => {
      $from.val(data.from);
      $to.val(data.to);
      $slide.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onEnd: (event, data) => {
      $from.val(data.from);
      $to.val(data.to);
      $end.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onUpdate: (event, data) => {
      $from.val(data.from);
      $to.val(data.to);
      $min.val(data.min);
      $max.val(data.max);
      $step.val(data.step);
      $fromFixed.attr('checked', data.fromFixed);
      $toFixed.attr('checked', data.toFixed);
      $type.attr('checked', data.type);
      $orientation.attr('checked', data.orientation);
      $update.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    }
  });

  $type.change((event) => {
    setSliderOption(slider, 'type', event.target.value);
  });

  $orientation.change((event) => {
    setSliderOption(slider, 'orientation', event.target.value);
  });

  $min.focusout((event) => {
    setSliderOption(slider, 'min', event.target.value);
  });

  $max.focusout((event) => {
    setSliderOption(slider, 'max', event.target.value);
  });

  $from.focusout((event) => {
    setSliderOption(slider, 'from', event.target.value);
  });

  $to.focusout((event) => {
    setSliderOption(slider, 'to', event.target.value);
  });

  $fromFixed.change((event) => {
    setSliderOption(slider, 'fromFixed', event.target.checked);
  });

  $toFixed.change((event) => {
    setSliderOption(slider, 'toFixed', event.target.checked);
  });

  $step.focusout((event) => {
    setSliderOption(slider, 'step', event.target.value);
  });
});

function setSliderOption(slider, optionName, value) {
  slider.set({
    [optionName]: value
  })
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}