import './index.scss';
import VanillaSlider from './slider';
import $ from 'jquery';

$(document).ready(function() {

  const create = $('.create');
  const slide =$('.slide');
  const start =$('.start');
  const end =$('.end');
  const update =$('.update');
  const from = $('#from');
  const to = $('#to');
  let timeId;

  const remove = function() {
    $('.callback').removeClass('active');
  }

  const slider = new VanillaSlider('#slider', {
    orientation: "vertica",
    from: 10,
    to: 50,
    onCreate: (e, d) => {
      create.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onStart: (e, d) => {
      from.val(d.from);
      to.val(d.to);
      start.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onSlide: (e, d) => {
      from.val(d.from);
      to.val(d.to);
      slide.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onEnd: (e, d) => {
      from.val(d.from);
      to.val(d.to);
      end.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    },
    onUpdate: (e, d) => {
      from.val(d.from);
      to.val(d.to);
      update.addClass('active');
      clearTimeout(timeId);
      timeId = setTimeout(remove, 200);
    }
  });

  $('input[name="type"]').change(function() {
    slider.set({
      type: this.value
    });
  });

  $('input[name="orientation"]').change(function() {
    slider.set({
      orientation: this.value
    });
  });

  $('input[name="min"]').focusout(function() {
    slider.set({
      min: this.value
    });
  });

  $('input[name="max"]').focusout(function() {
    slider.set({
      max: this.value
    });
  });

  $('input[name="from"]').focusout(function() {
    slider.set({
      from: this.value
    });
  });

  $('input[name="to"]').focusout(function() {
    slider.set({
      to: this.value
    });
  });

  $('input[name="fixed-from"]').change(function() {
    slider.set({
      fromFixed: this.checked
    });
  });

  $('input[name="fixed-to"]').change(function() {
    slider.set({
      toFixed: this.checked
    });
  });

  $('input[name="step"]').focusout(function() {
    slider.set({
      step: this.value
    });
  });
});

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}