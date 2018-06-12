import { bind } from 'decko';

import IEvent from './../observer/observer';
import { IOptions, IEvents, INodes, TRoot, IView, THandleType, ISliderSize, TSliderType, TOrientation } from './namespace';
import { initialOptions } from './initial';

import './view.scss';
import './theme.scss';

class View implements IView {
  private handle: THandleType | null = null;
  private _events: IEvents  = {
    slideStart: new IEvent(),
    slideFinish: new IEvent(),
    slide: new IEvent(),
  };

  private _options: IOptions = { ...initialOptions };
  private nodes!: INodes;

  constructor(root: TRoot) {
    this.init(root);
  }

  get options(): IOptions { return { ...this._options }; }
  get sliderSize(): ISliderSize { return this.getSliderSize(); }
  get events(): IEvents { return { ...this._events }; }

  public updateOptions(viewOptions: IOptions) {
    this.setOptions(viewOptions);
    this.render();
  }

  public emitCustomEvent(event: CustomEvent, target: keyof INodes) {
    this.nodes[target].dispatchEvent(event);
  }

  public changeHandlePosition(handle: THandleType, position: number) {
    const orientation = this._options.orientation;
    const handleNode = this.nodes[handle];
    const base: keyof CSSStyleDeclaration = orientation === TOrientation.vertical ? 'bottom' : 'left';
    handleNode.style[base] = `${position}%`;
    this.calcRange();
  }

  private init(root: TRoot) {
    this.nodes = {
      root,
      track: document.createElement('div'),
      from: document.createElement('span'),
      to: document.createElement('span'),
      range: document.createElement('div'),
    };

    this.render();
    this.initDragHandlers();
  }

  private setOptions(options: IOptions) {
    this._options = { ...options };
  }

  private render() {
    const opt = this._options;
    const nodes = this.nodes;

    this.stylizeNodes();
    nodes.root.innerHTML = '';
    nodes.track.innerHTML = '';
    nodes.root.appendChild(nodes.track);

    if (opt.hasRange) {
      nodes.track.appendChild(nodes.range);
    }

    if (opt.type === TSliderType['from-start']) {
      nodes.track.appendChild(nodes.from);
    }

    if (opt.type === TSliderType['from-end']) {
      nodes.track.appendChild(nodes.to);
    }

    if (opt.type === TSliderType.double) {
      nodes.track.appendChild(nodes.from);
      nodes.track.appendChild(nodes.to);
    }
  }

  private initDragHandlers() {
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    this.nodes.track.addEventListener('mousedown', this.startDragging);
  }

  private calcRange() {
    if (!this._options.hasRange) { return; }
    const opt = this._options;
    const nodes = this.nodes;
    const baseStart: keyof CSSStyleDeclaration = opt.orientation === TOrientation.vertical ? 'bottom' : 'left';
    const baseSize: keyof CSSStyleDeclaration = opt.orientation === TOrientation.vertical ? 'top' : 'right';

    if (opt.type === TSliderType['from-start']) {
      nodes.range.style[baseStart] = '0';
      nodes.range.style[baseSize] = `${100 - parseFloat(nodes.from.style[baseStart] as string)}%`;
    }

    if (opt.type === TSliderType['from-end']) {
      nodes.range.style[baseStart] = nodes.to.style[baseStart];
      nodes.range.style[baseSize] = '0';
    }

    if (opt.type === TSliderType.double) {
      nodes.range.style[baseStart] = nodes.from.style[baseStart];
      nodes.range.style[baseSize] = `${100 - parseFloat(nodes.to.style[baseStart] as string)}%`;
    }
  }

  private stylizeNodes() {
    const opt = this._options;
    const nodes = this.nodes;
    nodes.track.setAttribute('class', `vanilla-slider vanilla-slider_${opt.type} vanilla-slider_${opt.orientation}`);
    nodes.range.setAttribute('class', `vanilla-slider__range vanilla-slider__range_${opt.type}`);
    nodes.range.removeAttribute('style');
    nodes.from.setAttribute('tabindex', `0`);
    nodes.from.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_from${opt.isFromFixed ? ' vanilla-slider__handle_fixed' : ''}`);
    nodes.from.removeAttribute('style');
    nodes.to.setAttribute('tabindex', `1`);
    nodes.to.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_to${opt.isToFixed ? ' vanilla-slider__handle_fixed' : ''}`);
    nodes.to.removeAttribute('style');
  }

  @bind
  private startDragging(event: MouseEvent) {
    const nodes = this.nodes;
    this.handle = this.chooseHandle(event);

    if (this.handle) {
      nodes.from.classList.remove('vanilla-slider__handle_last-type');
      nodes.to.classList.remove('vanilla-slider__handle_last-type');
      nodes[this.handle].classList.add('vanilla-slider__handle_active');
      nodes[this.handle].classList.add('vanilla-slider__handle_last-type');
      this.drag(event);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.finishDragging);
      this._events.slideStart.notify({ handle: this.handle });
    }
  }

  @bind
  private drag(event: MouseEvent) {
    if (this.handle) {
      const coords = this.getRelativeCoords(event);
      this._events.slide.notify({ handle: this.handle, pixels: coords });
    }
  }

  @bind
  private finishDragging() {
    if (this.handle) {
      window.removeEventListener('mousemove', this.drag);
      window.removeEventListener('mouseup', this.finishDragging);
      this.nodes[this.handle].classList.remove('vanilla-slider__handle_active');
      this._events.slideFinish.notify({ handle: this.handle });
      this.handle = null;
    }
  }

  private chooseHandle(event: MouseEvent): THandleType | null {
    const opt = this._options;

    if (opt.isFromFixed && opt.isToFixed) { return null; }

    if (opt.type === TSliderType['from-start']) {
      return opt.isFromFixed ? null : 'from';
    }

    if (opt.type === TSliderType['from-end']) {
      return opt.isToFixed ? null : 'to';
    }

    if (opt.type === TSliderType.double) {
      return this.chooseDoubleSliderHandle(event);
    }

    return null;
  }

  private chooseDoubleSliderHandle(event: MouseEvent): THandleType | null {
    const opt = this._options;
    const nodes = this.nodes;
    const target = event.target;

    if (target === nodes.from) { return opt.isFromFixed ? null : 'from'; }
    if (target === nodes.to) { return opt.isToFixed ? null : 'to'; }

    if (target === nodes.range || target === nodes.track) {
      if (opt.isFromFixed) { return 'to'; }
      if (opt.isToFixed) { return 'from'; }
      return this.chooseHandleByCoords(event);
    }
    return null;
  }

  private chooseHandleByCoords(event: MouseEvent): THandleType | null {
    const opt = this._options;
    const nodes = this.nodes;
    const fromCoords = this.getHandleCoords(nodes.from);
    const toCoords = this.getHandleCoords(nodes.to);
    const mouseCoords = this.getRelativeCoords(event);

    if (opt.orientation === TOrientation.horizontal && (mouseCoords < fromCoords)) { return 'from'; }
    if (opt.orientation === TOrientation.horizontal && (mouseCoords > toCoords)) { return 'to'; }
    if (opt.orientation === TOrientation.vertical && (mouseCoords > fromCoords)) { return 'from'; }
    if (opt.orientation === TOrientation.vertical && (mouseCoords < toCoords)) { return 'to'; }
    return Math.abs(fromCoords - mouseCoords) < Math.abs(toCoords - mouseCoords) ? 'from' : 'to';
  }

  private getRelativeCoords(event: MouseEvent): number {
    const nodes = this.nodes;
    const axis = this._options.orientation === TOrientation.horizontal ? 'pageX' : 'pageY';
    const offset = this._options.orientation === TOrientation.horizontal ? 'offsetLeft' : 'offsetTop';
    return event[axis] - nodes.track[offset];
  }

  private getHandleCoords(handle: HTMLSpanElement): number {
    const offset: keyof typeof handle = this._options.orientation === TOrientation.horizontal ? 'offsetLeft' : 'offsetTop';
    const size = this._options.orientation === TOrientation.horizontal ? 'offsetWidth' : 'offsetHeight';
    return handle[offset] + handle[size] / 2;
  }

  private getSliderSize(): ISliderSize {
    return {
      width: this.nodes.track.clientWidth,
      height: this.nodes.track.clientHeight,
    };
  }
}

export default View;
