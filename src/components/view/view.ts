import './view.scss';
import './theme.scss';

import IEvent from './../observer/observer';
import { IModel as Model, IModelEvents, IModelOptions } from '../model/namespace';
import { IViewOptions, IViewEvents, TType, TOrientation } from './namespace';

interface IMandatoryOptions extends IViewOptions {
  type: TType;
  orientation: TOrientation;
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
    const opt = this.options;
    if (viewOptions.type) {
      opt.type = <TType>viewOptions.type;
    }
    if (viewOptions.orientation) {
      opt.orientation = <TOrientation>viewOptions.orientation;
    }
    if (!this.isUndefined(viewOptions.fromFixed)) {
      opt.fromFixed = <boolean>viewOptions.fromFixed;
    }
    if (!this.isUndefined(viewOptions.toFixed)) {
      opt.toFixed = <boolean>viewOptions.toFixed;
    }

    this.rootEmpty();
    this.setNodes();
    this.render();
    this.setHandlers();
  }

  public calcFrom(from: number): void {
    const opt = this.options;
    if (opt.orientation === 'horizontal') {
      this.nodes.from.style.left = `${from}%`;
    } else {
      this.nodes.from.style.bottom = `${from}%`;
    }

    this.calcRange();
  }

  public calcTo(to: number): void {
    const opt = this.options;
    const nodes = this.nodes;
    let base: Direction = 'left';

    if (opt.type !== 'double' || !nodes.to) {
      return;
    }

    if (opt.orientation === 'vertical') {
      base = 'bottom';
    }

    nodes.to.style[base] = `${to}%`;
    this.calcRange();
  }

  // ================= private methods ===================

  private render(): void {
    const opt = this.options;
    const nodes = this.nodes;
    this.root.appendChild(nodes.track);
    nodes.track.appendChild(nodes.from);

    if (nodes.range) {
      nodes.track.appendChild(nodes.range);
    }
    if (nodes.to) {
      nodes.track.appendChild(nodes.to);
    }
    if (opt.orientation === 'horizontal' && !nodes.track.clientWidth) {
      throw 'zero container width';
    } else if (opt.orientation === 'vertical' && !nodes.track.clientHeight) {
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
    const opt = this.options;
    const nodes = this.nodes;
    let baseStart: Direction = 'left';
    let baseEnd: Direction = 'right';

    if (opt.type === 'single' || !nodes.range) {
      return;
    }

    if (opt.orientation === 'vertical') {
      baseStart = 'bottom';
      baseEnd = 'top';
    }

    if (opt.type === 'min') {
      nodes.range.style[baseStart] = `0`;
      nodes.range.style[baseEnd] = `${100 - parseFloat(<string>nodes.from.style[baseStart])}%`;
    } else if (opt.type === 'max') {
      nodes.range.style[baseStart] = nodes.from.style[baseStart];
      nodes.range.style[baseEnd] = `0`;
    } else if (opt.type === 'double' && nodes.to) {
      nodes.range.style[baseStart] = nodes.from.style[baseStart];
      nodes.range.style[baseEnd] = `${100 - parseFloat(<string>nodes.to.style[baseStart])}%`;
    }
  }

  private setNodes(): void {
    const opt = this.options;
    this.nodes = {
      track: document.createElement('div'),
      from: document.createElement('span')
    };

    const nodes = this.nodes;

    nodes.track.setAttribute('class', `vanilla-slider vanilla-slider_${opt.type} vanilla-slider_${opt.orientation}`);
    nodes.from.setAttribute('tabindex', `0`);
    nodes.from.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_from`);

    if (opt.fromFixed) {
      nodes.from.classList.add(`vanilla-slider__handle_fixed`);
    }

    if (opt.type !== 'single') {
      nodes.range = document.createElement('div');
      nodes.range.setAttribute('class', `vanilla-slider__range vanilla-slider__range_${opt.type}`);
    } else {
      delete nodes.range;
    }

    if (opt.type === 'double') {
      nodes.to = document.createElement('span');
      nodes.to.setAttribute('tabindex', `0`);
      nodes.to.setAttribute('class', `vanilla-slider__handle vanilla-slider__handle_to`);

      if (opt.toFixed) {
        nodes.to.classList.add(`vanilla-slider__handle_fixed`);
      }
    } else {
      delete nodes.to;
    }
  }

  private rootEmpty(): void {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }
  }

  private mouseDown(event: MouseEvent): void {
    const nodes = this.nodes;
    const coord = this.getCoord(event);

    event.preventDefault();

    if (event.target === nodes.from) {
      this.handle = nodes.from;
    } else if (event.target === nodes.to) {
      this.handle = nodes.to;
    } else if (event.target === nodes.range || event.target === nodes.track) {
      this.handle = this.chooseHandle(coord);
      this.mouseMove(event);
    }

    nodes.from.classList.remove('last-type');
    if (nodes.to) {
      nodes.to.classList.remove('last-type');
    }

    if (this.handle) {
      this.handle.classList.add('active');
      this.handle.classList.add('last-type');
      this.events.slideStart.notify<HTMLSpanElement>(this.handle);
    }
    window.addEventListener('mousemove', this.mousemove);
    window.addEventListener('mouseup', this.mouseup);
  }

  private mouseMove(event: MouseEvent): void {
    const nodes = this.nodes;
    const coord = this.getCoord(event);
    if (this.handle === nodes.from) {
      this.events.fromChanged.notify<number>(coord);
    } else if (this.handle === nodes.to) {
      this.events.toChanged.notify<number>(coord);
    }
  }

  private mouseUp(event: MouseEvent): void {
    const coord = this.getCoord(event);

    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);
    if (this.handle) {
      this.handle.classList.remove('active');
      this.events.slideEnd.notify<HTMLSpanElement>(this.handle);
    }
    this.handle = null;
  }

  private chooseHandle(coord: number): HTMLSpanElement | null {
    const opt = this.options;
    const nodes = this.nodes;
    if (this.handle) {
      return this.handle;
    }

    if (opt.type !== 'double') {
      return nodes.from;
    }

    if (opt.fromFixed && opt.toFixed) {
      return null;
    } else if (opt.fromFixed) {
      return nodes.to as HTMLElement;
    } else if (opt.toFixed) {
      return nodes.from;
    }

    const fromCoord = this.getOffset(nodes.from);
    const toCoord = this.getOffset(nodes.to as HTMLElement);

    let result: HTMLSpanElement;

    if (fromCoord === toCoord) {
      if (opt.orientation === 'horizontal')
        result = <HTMLSpanElement>(coord < fromCoord ? nodes.from : nodes.to);
      else
        result = <HTMLSpanElement>(coord > fromCoord ? nodes.from : nodes.to);
    } else {
      result = <HTMLSpanElement>(Math.abs(fromCoord - coord) < Math.abs(toCoord - coord) ? nodes.from : nodes.to);
    }
    return result;
  }

  private getCoord(event: MouseEvent): number {
    const nodes = this.nodes;
    if (this.options.orientation === 'horizontal') {
       return event.pageX - nodes.track.offsetLeft;
    } else {
      return event.pageY - nodes.track.offsetTop;
    }
  }

  private getOuterWidth(node: HTMLElement): number {
    const style = getComputedStyle(node);
    const width = node.offsetWidth + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);
    return width;
  }

  private getOuterHeight(node: HTMLElement): number {
    const style = getComputedStyle(node);
    const height = node.offsetHeight + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);
    return height;
  }

  private getOffset(node: HTMLElement): number {
    if (this.options.orientation === 'horizontal') {
      return node.offsetLeft + this.getOuterWidth(node) / 2;
    } else {
      return node.offsetTop + this.getOuterHeight(node) / 2;
    }
  }

  private isUndefined(value: any): boolean {
    return value === undefined;
  }
}