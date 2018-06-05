import './view.scss';
import './theme.scss';
import { bind } from 'decko';

import IEvent from './../observer/observer';
import { IOptions, IEvents, INodes, TRoot, initialOptions } from './namespace';

interface IHandle extends HTMLSpanElement {
  [key: string]: any;
}

export default class View {
  private handle: IHandle | null = null;

  private viewEvents: IEvents  = {
    slideStart: new IEvent(),
    slideEnd: new IEvent(),
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  };

  private options: IOptions = {...initialOptions};

  private nodes!: INodes;

  constructor(private root: TRoot) {
    this.init();
  }

  get data(): IOptions { return this.options; }
  get events(): IEvents { return this.viewEvents; }
  get nodesData(): INodes { return this.nodes; }
  get rootObject(): TRoot { return this.root; }

  public update(viewOptions: IOptions) {
    this.setOptions(viewOptions);
    this.nodes.track.innerHTML = '';
    this.setNodes();
    this.render();
  }

  public calcFrom(from: number): void {
    const opt = this.options;
    const nodes = this.nodes;
    const base = opt.orientation === 'vertical' ? 'bottom' : 'left';
    nodes.from.style[base] = `${from}%`;
    this.calcRange();
  }

  public calcTo(to: number): void {
    if (this.options.type !== 'double') { return; }
    const opt = this.options;
    const nodes = this.nodes;
    const base = opt.orientation === 'vertical' ? 'bottom' : 'left';
    nodes.to.style[base] = `${to}%`;
    this.calcRange();
  }

  private init(): void {
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
    this.options = {...options};
  }

  private render(): void {
    const opt = this.options;
    const nodes = this.nodes;
    nodes.track.appendChild(nodes.from);

    if (opt.type !== 'single') {
      nodes.track.appendChild(nodes.range);
    }

    if (opt.type === 'double') {
      nodes.track.appendChild(nodes.to);
    }
  }

  private setHandlers(): void {
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
    this.nodes.track.addEventListener('mousedown', this.mouseDown);
  }

  private calcRange(): void {
    if (this.options.type === 'single') { return; }
    const opt = this.options;
    const nodes = this.nodes;
    const baseStart = opt.orientation === 'vertical' ? 'bottom' : 'left';
    const baseEnd = opt.orientation === 'vertical' ? 'top' : 'right';
    const handle = opt.type === 'double' ? 'to' : 'from';
    nodes.range.style[baseStart] = opt.type === 'from-start' ? '0' : nodes.from.style[baseStart];
    nodes.range.style[baseEnd] = opt.type === 'from-end' ? '0' : `${100 - parseFloat(<string>nodes[handle].style[baseStart])}%`;
  }

  private setNodes(): void {
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
  private mouseDown(event: MouseEvent): void {
    const nodes = this.nodes;
    const coord = this.getRelativeCoord(event);

    if (event.target === nodes.from) {
      this.handle = nodes.from;
    } 
    
    if (event.target === nodes.to) {
      this.handle = nodes.to;
    } 
    
    if (event.target === nodes.range || event.target === nodes.track) {
      this.handle = this.chooseHandle(coord);
      this.mouseMove(event);
    }

    nodes.from.classList.remove('vanilla-slider__handle_last-type');
    nodes.to.classList.remove('vanilla-slider__handle_last-type');

    if (this.handle) {
      this.handle.classList.add('active');
      this.handle.classList.add('vanilla-slider__handle_last-type');
      this.viewEvents.slideStart.notify<IHandle>(this.handle);
    }
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
  }

  @bind
  private mouseMove(event: MouseEvent): void {
    const nodes = this.nodes;
    const coord = this.getRelativeCoord(event);
    const eventForNotify = this.handle === nodes.from ? 'fromChanged' : 'toChanged';
    this.viewEvents[eventForNotify].notify<number>(coord);
  }

  @bind
  private mouseUp(event: MouseEvent): void {
    if (!this.handle) { return; }
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
    this.handle.classList.remove('active');
    this.viewEvents.slideEnd.notify(this.handle);
    this.handle = null;
  }

  private chooseHandle(mouseCoord: number): IHandle | null {
    const opt = this.options;
    const nodes = this.nodes;
    if (this.handle) { return this.handle; }
    if (opt.type !== 'double') { return nodes.from; }
    if (opt.fromFixed && opt.toFixed) { return null; } 
    if (opt.fromFixed) { return nodes.to; } 
    if (opt.toFixed) { return nodes.from;}

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

  private getHandleCoord(handle: IHandle): number {
    const offset = this.options.orientation === 'horizontal' ? 'offsetLeft' : 'offsetRight';
    const size = this.options.orientation === 'horizontal' ? 'offsetWidth' : 'offsetHeight'
    return handle[offset] + handle[size] / 2;
  }
}