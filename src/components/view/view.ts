import './view.scss';
import './theme.scss';
import { bind } from 'decko';

import IEvent from './../observer/observer';
import { IOptions, IEvents, INodes, TRoot, IView } from './namespace';
import { initialOptions } from './initial';

class View implements IView {
  private handle: HTMLSpanElement | null = null;

  private viewEvents: IEvents  = {
    slideStart: new IEvent(),
    slideEnd: new IEvent(),
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  };

  private options: IOptions = { ...initialOptions };

  private nodes!: INodes;

  constructor(private root: TRoot) {
    this.init();
  }

  get data(): IOptions { return this.options; }
  get events(): IEvents { return this.viewEvents; }
  get nodesData(): INodes { return this.nodes; }
  get rootObject(): TRoot { return this.root; }

  @bind
  public update(viewOptions: IOptions) {
    this.setOptions(viewOptions);
    this.nodes.track.innerHTML = '';
    this.setNodes();
    this.render();
  }

  @bind
  public calcFrom(fromValue: number) {
    const orientation = this.options.orientation;
    const from = this.nodes.from;
    const base: keyof CSSStyleDeclaration = orientation === 'vertical' ? 'bottom' : 'left';
    from.style[base] = `${fromValue}%`;
    this.calcRange();
  }

  @bind
  public calcTo(toValue: number) {
    if (this.options.type !== 'double') { return; }
    const orientation = this.options.orientation;
    const to = this.nodes.to;
    const base: keyof CSSStyleDeclaration = orientation === 'vertical' ? 'bottom' : 'left';
    to.style[base] = `${toValue}%`;
    this.calcRange();
  }

  private init() {
    this.nodes = {
      track: document.createElement('div'),
      from: document.createElement('span'),
      to: document.createElement('span'),
      range: document.createElement('div')
    };

    this.root.innerHTML = '';
    this.root.appendChild(this.nodes.track);
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

    if (type !== 'single') {
      nodes.track.appendChild(nodes.range);
    }

    if (type === 'double') {
      nodes.track.appendChild(nodes.to);
    }
  }

  private setHandlers() {
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    this.nodes.track.addEventListener('mousedown', this.startDragging);
  }

  private calcRange() {
    if (this.options.type === 'single') { return; }
    const opt = this.options;
    const nodes = this.nodes;
    const baseStart: keyof CSSStyleDeclaration = opt.orientation === 'vertical' ? 'bottom' : 'left';
    const baseEnd: keyof CSSStyleDeclaration = opt.orientation === 'vertical' ? 'top' : 'right';
    const handle = opt.type === 'double' ? 'to' : 'from';
    nodes.range.style[baseStart] = opt.type === 'from-start' ? '0' : nodes.from.style[baseStart];
    nodes.range.style[baseEnd] = opt.type === 'from-end' ? '0' : `${100 - parseFloat(<string>nodes[handle].style[baseStart])}%`;
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
      this.handle = nodes.from;
    }

    if (event.target === nodes.to) {
      this.handle = nodes.to;
    }

    if (event.target === nodes.range || event.target === nodes.track) {
      this.handle = this.chooseHandle(coord);
    }

    if (this.handle) {
      this.handle.classList.add('active');
      this.handle.classList.add('vanilla-slider__handle_last-type');
      this.viewEvents.slideStart.notify(this.handle);
      this.drag(event);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.finishDragging);
    }
  }

  @bind
  private drag(event: MouseEvent) {
    const nodes = this.nodes;
    const coord = this.getRelativeCoord(event);
    const eventForNotify = this.handle === nodes.from ? 'fromChanged' : 'toChanged';
    this.viewEvents[eventForNotify].notify(coord);
  }

  @bind
  private finishDragging(event: MouseEvent) {
    if (!this.handle) { return; }
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    this.handle.classList.remove('active');
    this.viewEvents.slideEnd.notify(this.handle);
    this.handle = null;
  }

  private chooseHandle(mouseCoord: number): HTMLSpanElement | null {
    const opt = this.options;
    const nodes = this.nodes;
    if (this.handle) { return this.handle; }
    if (opt.type !== 'double') { return nodes.from; }
    if (opt.fromFixed && opt.toFixed) { return null; }
    if (opt.fromFixed) { return nodes.to; }
    if (opt.toFixed) { return nodes.from; }

    const fromCoord = this.getHandleCoord(nodes.from);
    const toCoord = this.getHandleCoord(nodes.to);

    if (opt.orientation === 'horizontal' && (mouseCoord < fromCoord)) { return nodes.from; }
    if (opt.orientation === 'horizontal' && (mouseCoord > toCoord)) { return nodes.to; }
    if (opt.orientation === 'vertical' && (mouseCoord > fromCoord)) { return nodes.from; }
    if (opt.orientation === 'vertical' && (mouseCoord < toCoord)) { return nodes.to; }
    return Math.abs(fromCoord - mouseCoord) < Math.abs(toCoord - mouseCoord) ? nodes.from : nodes.to;
  }

  private getRelativeCoord(event: MouseEvent): number {
    const nodes = this.nodes;
    const axis = this.options.orientation === 'horizontal' ? 'pageX' : 'pageY';
    const offset = this.options.orientation === 'horizontal' ? 'offsetLeft' : 'offsetTop';
    return event[axis] - nodes.track[offset];
  }

  private getHandleCoord(handle: HTMLSpanElement): number {
    const offset: keyof typeof handle = this.options.orientation === 'horizontal' ? 'offsetLeft' : 'offsetTop';
    const size = this.options.orientation === 'horizontal' ? 'offsetWidth' : 'offsetHeight';
    return handle[offset] + handle[size] / 2;
  }
}

export default View;
