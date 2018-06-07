import './view.scss';
import './theme.scss';
import { bind } from 'decko';

import IEvent from './../observer/observer';
import { IOptions, IEvents, INodes, TRoot, IView, THandle, ISliderSize, TSliderType, TOrientation } from './namespace';
import { initialOptions } from './initial';

class View implements IView {
  private handle: THandle | null = null;

  private viewEvents: IEvents  = {
    slideStart: new IEvent(),
    slideFinish: new IEvent(),
    slide: new IEvent(),
  };

  private options: IOptions = { ...initialOptions };

  private nodes!: INodes;

  constructor(root: TRoot) {
    this.init(root);
  }

  get data(): IOptions { return { ...this.options }; }
  get sliderSize(): ISliderSize { return this.getSliderSize(); }
  get events(): IEvents { return { ...this.viewEvents }; }

  public updateState(viewOptions: IOptions) {
    this.setOptions(viewOptions);
    this.nodes.track.innerHTML = '';
    this.setNodes();
    this.render();
  }

  public emitCustomEvent(event: CustomEvent, target: keyof INodes) {
    this.nodes[target].dispatchEvent(event);
  }

  public changeHandlePosition(handle: THandle, position: number) {
    const orientation = this.options.orientation;
    const handleNode = this.nodes[handle];
    const base: keyof CSSStyleDeclaration = orientation === TOrientation.vertical ? 'bottom' : 'left';
    handleNode.style[base] = `${position}%`;
    this.calcRange();
  }

  private init(root: TRoot) {
    this.nodes = {
      root: root,
      track: document.createElement('div'),
      from: document.createElement('span'),
      to: document.createElement('span'),
      range: document.createElement('div')
    };

    this.nodes.root.innerHTML = '';
    this.nodes.root.appendChild(this.nodes.track);
    this.setNodes();
    this.render();
    this.setHandlers();
  }

  private setOptions(options: IOptions) {
    this.options = { ...options };
  }

  private render() {
    const type = this.options.type;
    const nodes = this.nodes;
    nodes.track.appendChild(nodes.from);

    if (type !== TSliderType.single) {
      nodes.track.appendChild(nodes.range);
    }

    if (type === TSliderType.double) {
      nodes.track.appendChild(nodes.to);
    }
  }

  private setHandlers() {
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    this.nodes.track.addEventListener('mousedown', this.startDragging);
  }

  private calcRange() {
    if (this.options.type === TSliderType.single) { return; }
    const opt = this.options;
    const nodes = this.nodes;
    const baseStart: keyof CSSStyleDeclaration = opt.orientation === TOrientation.vertical ? 'bottom' : 'left';
    const baseEnd: keyof CSSStyleDeclaration = opt.orientation === TOrientation.vertical ? 'top' : 'right';
    const handle = opt.type === TSliderType.double ? 'to' : 'from';
    nodes.range.style[baseStart] = opt.type === TSliderType['from-start'] ? '0' : nodes.from.style[baseStart];
    nodes.range.style[baseEnd] = opt.type === TSliderType['from-end'] ? '0' : `${100 - parseFloat(<string>nodes[handle].style[baseStart])}%`;
  }

  private setNodes() {
    const opt = this.options;
    const nodes = this.nodes;
    nodes.track.setAttribute('class', `vanilla-slider vanilla-slider_${opt.type} vanilla-slider_${opt.orientation}`);
    nodes.range.setAttribute('class', `vanilla-slider__range vanilla-slider__range_${opt.type}`);
    nodes.range.removeAttribute('style');
    nodes.from.setAttribute('tabindex', `0`);
    nodes.from.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_from${opt.fromFixed ? ' vanilla-slider__handle_fixed' : ''}`);
    nodes.from.removeAttribute('style');
    nodes.to.setAttribute('tabindex', `1`);
    nodes.to.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_to${opt.toFixed ? ' vanilla-slider__handle_fixed' : ''}`);
    nodes.to.removeAttribute('style');
  }

  @bind
  private startDragging(event: MouseEvent) {
    const nodes = this.nodes;
    const coord = this.getRelativeCoord(event);
    nodes.from.classList.remove('vanilla-slider__handle_last-type');
    nodes.to.classList.remove('vanilla-slider__handle_last-type');

    if (event.target === nodes.from) {
      this.handle = 'from';
    }

    if (event.target === nodes.to) {
      this.handle = 'to';
    }

    if (event.target === nodes.range || event.target === nodes.track) {
      this.handle = this.chooseHandle(coord);
    }

    if (this.handle) {
      nodes[this.handle].classList.add('active');
      nodes[this.handle].classList.add('vanilla-slider__handle_last-type');
      this.viewEvents.slideStart.notify(this.handle);
      this.drag(event);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.finishDragging);
    }
  }

  @bind
  private drag(event: MouseEvent) {
    const coord = this.getRelativeCoord(event);
    if (this.handle) {
      this.viewEvents.slide.notify<THandle | number>(this.handle, coord);
    }
  }

  @bind
  private finishDragging() {
    if (!this.handle) { return; }
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    this.nodes[this.handle].classList.remove('active');
    this.viewEvents.slideFinish.notify(this.handle);
    this.handle = null;
  }

  private chooseHandle(mouseCoord: number): THandle | null {
    const opt = this.options;
    const nodes = this.nodes;
    if (this.handle) { return this.handle; }
    if (opt.type !== TSliderType.double) { return 'from'; }
    if (opt.fromFixed && opt.toFixed) { return null; }
    if (opt.fromFixed) { return 'to'; }
    if (opt.toFixed) { return 'from'; }

    const fromCoord = this.getHandleCoord(nodes.from);
    const toCoord = this.getHandleCoord(nodes.to);

    if (opt.orientation === TOrientation.horizontal && (mouseCoord < fromCoord)) { return 'from'; }
    if (opt.orientation === TOrientation.horizontal && (mouseCoord > toCoord)) { return 'to'; }
    if (opt.orientation === TOrientation.vertical && (mouseCoord > fromCoord)) { return 'from'; }
    if (opt.orientation === TOrientation.vertical && (mouseCoord < toCoord)) { return 'to'; }
    return Math.abs(fromCoord - mouseCoord) < Math.abs(toCoord - mouseCoord) ? 'from' : 'to';
  }

  private getRelativeCoord(event: MouseEvent): number {
    const nodes = this.nodes;
    const axis = this.options.orientation === TOrientation.horizontal ? 'pageX' : 'pageY';
    const offset = this.options.orientation === TOrientation.horizontal ? 'offsetLeft' : 'offsetTop';
    return event[axis] - nodes.track[offset];
  }

  private getHandleCoord(handle: HTMLSpanElement): number {
    const offset: keyof typeof handle = this.options.orientation === TOrientation.horizontal ? 'offsetLeft' : 'offsetTop';
    const size = this.options.orientation === TOrientation.horizontal ? 'offsetWidth' : 'offsetHeight';
    return handle[offset] + handle[size] / 2;
  }

  private getSliderSize(): ISliderSize {
    return {
      width: this.nodes.track.clientWidth,
      height: this.nodes.track.clientHeight
    };
  }
}

export default View;
