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
  let t;

  const r = function() {
    $('.cb').removeClass('active');
  }

  const slider = new VanillaSlider('#slider', {
    orientation: "vertica",
    from: 10,
    to: 50,
    onCreate: (e, d) => {
      from.html(`from: ${d.from}`);
      to.html(`to: ${d.to}`);
      create.addClass('active');
      clearTimeout(t);
      t = setTimeout(r, 200);
    },
    onStart: (e, d) => {
      from.html(`from: ${d.from}`);
      to.html(`to: ${d.to}`);
      start.addClass('active');
      clearTimeout(t);
      t = setTimeout(r, 200);
    },
    onSlide: (e, d) => {
      from.html(`from: ${d.from}`);
      to.html(`to: ${d.to}`);
      slide.addClass('active');
      clearTimeout(t);
      t = setTimeout(r, 200);
    },
    onEnd: (e, d) => {
      from.html(`from: ${d.from}`);
      to.html(`to: ${d.to}`);
      end.addClass('active');
      clearTimeout(t);
      t = setTimeout(r, 200);
    },
    onUpdate: (e, d) => {
      from.html(`from: ${d.from}`);
      to.html(`to: ${d.to}`);
      update.addClass('active');
      clearTimeout(t);
      t = setTimeout(r, 200);
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
      from_fixed: this.checked
    });
  });

  $('input[name="fixed-to"]').change(function() {
    slider.set({
      to_fixed: this.checked
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