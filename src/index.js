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
    $toFixed: $('.js-field__input-to-fixed'),
    $hasRange: $('.js-field__input-range'),
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
    type: controls.$type.filter(`:checked`).val(),
    orientation: controls.$orientation.filter(`:checked`).val(),
    min: controls.$min.val(),
    max: controls.$max.val(),
    from: controls.$from.val(),
    to: controls.$to.val(),
    isFromFixed: controls.$fromFixed.prop('checked'),
    isToFixed: controls.$toFixed.prop('checked'),
    step: controls.$step.val(),
    range: controls.$orientation.filter(`:checked`).val(),
    onCreate: () => {
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
      indicators.$update.addClass('active');
      clearTimeout(onUpdateTimeId);
      onUpdateTimeId = setTimeout(remove, 200);
    }
  });

  document.addEventListener('vanillaslide', (event) => {
    console.log(event.detail);
  })

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
    setSliderOption(slider, 'isFromFixed', event.target.checked);
  });

  controls.$toFixed.change((event) => {
    setSliderOption(slider, 'isToFixed', event.target.checked);
  });

  controls.$step.focusout((event) => {
    setSliderOption(slider, 'step', event.target.value);
  });

  controls.$hasRange.change((event) => {
    setSliderOption(slider, 'hasRange', event.target.checked);
  })
});

function setSliderOption(slider, optionName, value) {
  slider.setOptions({
    [optionName]: value
  })
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}
