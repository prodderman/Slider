import './view.scss';
import './theme.scss';

import IEvent from './../observer/observer';
import { IModel as Model, IModelEvents, IModelOptions } from '../model/namespace';
import { IViewOptions, IViewEvents } from './namespace';

interface IMandatoryOptions extends IViewOptions {
  type: SliderTypes;
  orientation: Orient;
  fromFixed: boolean;
  toFixed: boolean;
}

interface INodes {
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to?: HTMLSpanElement;
  range?: HTMLDivElement;
}

type Direction = 'top' | 'left' | 'right' | 'bottom';
type Orient = 'horizontal' | 'vertical';
type SliderTypes = 'single' | 'min' | 'max' | 'double';

export default class View {

  private handle: HTMLSpanElement | null = null;
  private mousemove = this.mouseMove.bind(this);
  private mouseup = this.mouseUp.bind(this);

  private triggers: IViewEvents  = {
    slideStart: new IEvent(),
    slideEnd: new IEvent(),
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  };

  private options: IMandatoryOptions = {
    type: 'single',
    orientation: 'horizontal',
    fromFixed: false,
    toFixed: false
  };

  private nodes: INodes = {
    track: document.createElement('div'),
    from: document.createElement('span')
  };

  constructor(private root: HTMLDivElement | HTMLSpanElement, viewOptions: IViewOptions = {}) {
      this.init(viewOptions);
  }

  // ======================= accessors =========================

  get data(): IMandatoryOptions {
    return this.options;
  }

  get events(): IViewEvents {
    return this.triggers;
  }

  get nodesData(): INodes {
    return this.nodes;
  }

  get rootObject(): HTMLDivElement | HTMLSpanElement {
    return this.root;
  }

  // ======================= public methods ======================

  public init(viewOptions: IViewOptions): void {

    if (viewOptions.type) {
      this.options.type = <SliderTypes>viewOptions.type;
    }
    if (viewOptions.orientation) {
      this.options.orientation = <Orient>viewOptions.orientation;
    }
    if (viewOptions.fromFixed !== undefined) {
      this.options.fromFixed = viewOptions.fromFixed;
    }
    if (viewOptions.toFixed !== undefined) {
      this.options.toFixed = viewOptions.toFixed;
    }

    this.rootEmpty();
    this.setNodes();
    this.render();
    this.setHandlers();
  }

  public calcFrom(from: number): void {
    if (this.options.orientation === 'horizontal') {
      this.nodes.from.style.left = `${from}%`;
    } else {
      this.nodes.from.style.bottom = `${from}%`;
    }

    this.calcRange();
  }

  public calcTo(to: number): void {
    let base: Direction = 'left';

    if (this.options.type !== 'double' || !this.nodes.to) {
      return;
    }

    if (this.options.orientation === 'vertical') {
      base = 'bottom';
    }

    this.nodes.to.style[base] = `${to}%`;
    this.calcRange();
  }

  // ================= private methods ===================

  private render(): void {
    this.root.appendChild(this.nodes.track);
    this.nodes.track.appendChild(this.nodes.from);

    if (this.nodes.range) {
      this.nodes.track.appendChild(this.nodes.range);
    }
    if (this.nodes.to) {
      this.nodes.track.appendChild(this.nodes.to);
    }
    if (this.options.orientation === 'horizontal' && !this.nodes.track.clientWidth) {
      throw 'zero container width';
    } else if (this.options.orientation === 'vertical' && !this.nodes.track.clientHeight) {
      throw 'zero container height';
    }
  }

  private setHandlers(): void {
    window.removeEventListener('mousemove', this.mousemove);
    this.nodes.track.removeEventListener('mousedown', this.mouseDown.bind(this));
    window.removeEventListener('mouseup', this.mouseup);

    this.nodes.track.addEventListener('mousedown', this.mouseDown.bind(this));
  }

  private calcRange(): void {
    let baseStart: Direction = 'left';
    let baseEnd: Direction = 'right';

    if (this.options.type === 'single' || !this.nodes.range) {
      return;
    }

    if (this.options.orientation === 'vertical') {
      baseStart = 'bottom';
      baseEnd = 'top';
    }

    if (this.options.type === 'min') {
      this.nodes.range.style[baseStart] = `0`;
      this.nodes.range.style[baseEnd] = `${100 - parseFloat(<string>this.nodes.from.style[baseStart])}%`;
    } else if (this.options.type === 'max') {
      this.nodes.range.style[baseStart] = this.nodes.from.style[baseStart];
      this.nodes.range.style[baseEnd] = `0`;
    } else if (this.options.type === 'double' && this.nodes.to) {
      this.nodes.range.style[baseStart] = this.nodes.from.style[baseStart];
      this.nodes.range.style[baseEnd] = `${100 - parseFloat(<string>this.nodes.to.style[baseStart])}%`;
    }
  }

  private setNodes(): void {

    this.nodes = {
      track: document.createElement('div'),
      from: document.createElement('span')
    };

    if (this.root.className.indexOf('vanilla') < 0) {
      this.root.className += ' vanilla';
    }
    this.nodes.track.setAttribute('class', `vanilla-slider vanilla-${this.options.type} vanilla-${this.options.orientation}`);

    this.nodes.from.setAttribute('tabindex', `0`);
    this.nodes.from.setAttribute('class', `vanilla-handle vanilla-handle-from`);

    if (this.options.fromFixed) {
      this.nodes.from.classList.add(`vanilla-handle-fixed`);
    }

    if (this.options.type !== 'single') {
      this.nodes.range = document.createElement('div');
      this.nodes.range.setAttribute('class', `vanilla-range vanilla-range-${this.options.type}`);
    } else {
      delete this.nodes.range;
    }

    if (this.options.type === 'double') {
      this.nodes.to = document.createElement('span');
      this.nodes.to.setAttribute('tabindex', `0`);
      this.nodes.to.setAttribute('class', `vanilla-handle vanilla-handle-to`);

      if (this.options.toFixed) {
        this.nodes.to.classList.add(`vanilla-handle-fixed`);
      }
    } else {
      delete this.nodes.to;
    }
  }

  private rootEmpty(): void {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }
  }

  private mouseDown(event: MouseEvent): void {
    const coord = this.getCoord(event);

    event.preventDefault();

    if (event.target === this.nodes.from) {
      this.handle = this.nodes.from;
    } else if (event.target === this.nodes.to) {
      this.handle = this.nodes.to;
    } else if (event.target === this.nodes.range || event.target === this.nodes.track) {
      this.handle = this.chooseHandle(coord);
      this.mouseMove(event);
    }

    this.nodes.from.classList.remove('last-type');
    if (this.nodes.to) {
      this.nodes.to.classList.remove('last-type');
    }

    const value = this.getCoord(event);

    if (this.handle) {
      this.handle.classList.add('active');
      this.handle.classList.add('last-type');
      this.events.slideStart.notify<HTMLSpanElement | number>(this.handle, value);
    }
    window.addEventListener('mousemove', this.mousemove);
    window.addEventListener('mouseup', this.mouseup);
  }

  private mouseMove(event: MouseEvent): void {
    const value = this.getCoord(event);
    if (this.handle === this.nodes.from) {
      this.events.fromChanged.notify<HTMLSpanElement | number>(this.handle, value);
    } else if (this.handle === this.nodes.to) {
      this.events.toChanged.notify<HTMLSpanElement | number>(this.handle, value);
    }
  }

  private mouseUp(event: MouseEvent): void {
    const value = this.getCoord(event);

    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);
    if (this.handle) {
      this.handle.classList.remove('active');
      this.events.slideEnd.notify<HTMLSpanElement | number>(this.handle, value);
    }
    this.handle = null;
  }

  private chooseHandle(coord: number): HTMLSpanElement | null {
    let result: HTMLSpanElement;

    if (this.handle) {
      return this.handle;
    }

    if (this.options.type !== 'double') {
      return this.nodes.from;
    }

    if (this.options.fromFixed && this.options.toFixed) {
      return null;
    } else if (this.options.fromFixed) {
      return this.nodes.to as HTMLElement;
    } else if (this.options.toFixed) {
      return this.nodes.from;
    }

    const fromCoord = this.offset(this.nodes.from);
    const toCoord = this.offset(this.nodes.to as HTMLElement);

    if (fromCoord === toCoord) {
      if (this.options.orientation === 'horizontal')
        result = <HTMLSpanElement>(coord < fromCoord ? this.nodes.from : this.nodes.to);
      else
        result = <HTMLSpanElement>(coord > fromCoord ? this.nodes.from : this.nodes.to);
    } else {
      result = <HTMLSpanElement>(Math.abs(fromCoord - coord) < Math.abs(toCoord - coord) ? this.nodes.from : this.nodes.to);
    }
    return result;
  }

  private getCoord(event: MouseEvent): number {
    if (this.options.orientation === 'horizontal') {
       return event.pageX - this.nodes.track.offsetLeft;
    } else {
      return event.pageY - this.nodes.track.offsetTop;
    }
  }

  private outerWidth(node: HTMLElement): number {
    const style = getComputedStyle(node);
    const width = node.offsetWidth + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);

    return width;
  }

  private outerHeight(node: HTMLElement): number {
    const style = getComputedStyle(node);
    const height = node.offsetHeight + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);

    return height;
  }

  private offset(node: HTMLElement): number {
    if (this.options.orientation === 'horizontal') {
      return node.offsetLeft + this.outerWidth(node) / 2;
    } else {
      return node.offsetTop + this.outerHeight(node) / 2;
    }
  }
}