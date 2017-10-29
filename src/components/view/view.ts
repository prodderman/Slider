import './view.scss';
import './theme.scss';

import IEvent from './../observer/observer';
import { IModel as Model, IModelEvents, IModelOptions } from '../model/namespace';
import { IViewOptions, IViewEvents } from './namespace';

interface IMandatoryOptions extends IViewOptions {
  type: string;
  orientation: string;
  from_fixed: boolean;
  to_fixed: boolean;
}

interface INodes {
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to?: HTMLSpanElement;
  range?: HTMLDivElement;
}

type Style = 'top' | 'left' | 'right' | 'bottom';

export default class View {

  private handle: HTMLSpanElement | null = null;
  private mousemove = this.mouseMove.bind(this);
  private mouseup = this.mouseUp.bind(this);

  private triggers: IViewEvents  = {
    slideStart: new IEvent(),
    slideEnd: new IEvent(),
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  }

  static types = { 
    single: 'single', 
    min: 'min', 
    max: 'max', 
    double: 'double' 
  };

  static orientations = {
    horizontal: 'horizontal',
    vertical: 'vertical'
  }

  private options: IMandatoryOptions = {
    type: View.types.single,
    orientation: View.orientations.horizontal,
    from_fixed: false,
    to_fixed: false
  }

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

  get nodesData() {
    return this.nodes;
  }

  get rootObject() {
    return this.root;
  }

  // ======================= public methods ======================

  public init(viewOptions: IViewOptions, isUpdate?: boolean) {
    const o = this.options;
    const v = viewOptions;

    if (v.type && v.type in View.types) {
      o.type = v.type;
    }
    if (v.orientation && v.orientation in View.orientations) {
      o.orientation = v.orientation;
    }
    if (v.from_fixed !== undefined) {
      o.from_fixed = v.from_fixed; 
    }
    if (v.to_fixed !== undefined) {
      o.to_fixed = v.to_fixed; 
    }
    
    this.rootEmpty();
    this.setNodes();
    this.render();
    this.setHandlers();
  }

  public calcFrom(from: number) {
    const o = this.options;
    const d = View.orientations;
    const n = this.nodes;
    
    if (o.orientation === d.horizontal) {
      n.from.style.left = `${from}%`;
    } else {
      n.from.style.bottom = `${from}%`;
    }
    
    this.calcRange();
  }

  public calcTo(to: number) {
    const o = this.options;
    const d = View.orientations;
    const t = View.types;
    const n = this.nodes;
    let base: Style = 'left';

    if (o.type !== t.double || !n.to) {
      return;
    }

    if (o.orientation === d.vertical) {
      base = 'bottom';
    }
      
    n.to.style[base] = `${to}%`;
    this.calcRange();
  }

  // ================= private methods ===================

  private render() {
    const o = this.options;
    const r = this.root;
    const n = this.nodes;
    const d = View.orientations;

    r.appendChild(n.track);
    n.track.appendChild(n.from);

    if (n.range) {
      n.track.appendChild(n.range);
    }
    if (n.to) {
      n.track.appendChild(n.to)
    }
    if (o.orientation === d.horizontal && !n.track.clientWidth) {
      throw "zero container width";
    } else if (o.orientation === d.vertical && !n.track.clientHeight) {
      throw "zero container height";
    }
  }

  private setHandlers() {
    const t = this.triggers;
    const n = this.nodes;

    window.removeEventListener('mousemove', this.mousemove);
    n.track.removeEventListener('mousedown', this.mouseDown.bind(this));
    window.removeEventListener('mouseup', this.mouseup);
    
    n.track.addEventListener('mousedown', this.mouseDown.bind(this));
  }

  private setEvents() {

  }

  private calcRange() {
    const o = this.options;
    const d = View.orientations;
    const t = View.types;
    const n = this.nodes;
    
    let baseF: Style = 'left';
    let baseT: Style = 'right';

    if (o.type === t.single || !n.range) {
      return;
    }

    if (o.orientation === d.vertical) { 
      baseF = 'bottom';
      baseT = 'top';
    }
    
    if (o.type === t.min) {
      n.range.style[baseF] = `0`;
      n.range.style[baseT] = `${100 - parseFloat(<string>n.from.style[baseF])}%`;
    } else if (o.type === t.max) {
      n.range.style[baseF] = n.from.style[baseF];
      n.range.style[baseT] = `0`;
    } else if (o.type === t.double && n.to) {
      n.range.style[baseF] = n.from.style[baseF];
      n.range.style[baseT] = `${100 - parseFloat(<string>n.to.style[baseF])}%`;
    }
  }

  private setNodes() {

    this.nodes = {
      track: document.createElement('div'),
      from: document.createElement('span')
    }

    const o = this.options;
    const n = this.nodes;

    if (this.root.className.indexOf('vanilla') < 0) {
      this.root.className += ' vanilla';
    }
    n.track.setAttribute('class', `vanilla-slider vanilla-${o.type} vanilla-${o.orientation}`);

    n.from.setAttribute('tabindex', `0`);
    n.from.setAttribute('class', `vanilla-handle vanilla-handle-from`);

    if (o.from_fixed) {
      n.from.classList.add(`vanilla-handle-fixed`);
    }

    if (o.type !== View.types.single) {
      n.range = document.createElement('div');
      n.range.setAttribute('class', `vanilla-range vanilla-range-${o.type}`);
    } else {
      delete n.range;
    }

    if (o.type === View.types.double) {
      n.to = document.createElement('span');
      n.to.setAttribute('tabindex', `0`);
      n.to.setAttribute('class', `vanilla-handle vanilla-handle-to`);

      if (o.to_fixed) {
        n.to.classList.add(`vanilla-handle-fixed`);
      }
    } else {
      delete n.to;
    }
  }

  private rootEmpty() {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }
  }

  private mouseDown(event: MouseEvent) {
    const o = this.options;
    const n = this.nodes;
    const d = View.orientations;
    const e = this.events;
    const coord = (o.orientation === d.horizontal ? 
                                     event.pageX - n.track.offsetLeft : 
                                     event.pageY - n.track.offsetTop);
                                     
    event.preventDefault();

    if (event.target === n.from) {
      this.handle = n.from;
    } else if (event.target === n.to) {
      this.handle = n.to;
    } else if (event.target === n.range || event.target === n.track) {
      this.handle = this.chooseHandle(coord);
      this.mouseMove(event);
    }

    n.from.classList.remove('last-type');
    if (n.to) {
      n.to.classList.remove('last-type');
    }

    const value = this.getCoord(event);

    if (this.handle) {
      this.handle.classList.add('active');
      this.handle.classList.add('last-type');
      e.slideStart.notify<HTMLSpanElement | number>(this.handle, value);
    }
    window.addEventListener('mousemove', this.mousemove);
    window.addEventListener('mouseup', this.mouseup);
  }

  private mouseMove(event: MouseEvent) {
    const e = this.events;
    const n = this.nodes;
    const value = this.getCoord(event);
    if (this.handle === n.from) {
      e.fromChanged.notify<HTMLSpanElement | number>(this.handle, value);
    } else if (this.handle === n.to) {
      e.toChanged.notify<HTMLSpanElement | number>(this.handle, value);
    }
  }

  private mouseUp(event: MouseEvent) {
    const n = this.nodes;
    const t = event.target;
    const e = this.events;
    const value = this.getCoord(event);

    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);
    if (this.handle) {
      this.handle.classList.remove('active');
      e.slideEnd.notify<HTMLSpanElement | number>(this.handle, value);
    }
    this.handle = null;
  }

  private chooseHandle(coord: number): HTMLSpanElement | null {
    const o = this.options;
    const t = View.types;
    const d = View.orientations;
    const n = this.nodes;
    let result: HTMLSpanElement;

    if (this.handle) {
      return this.handle;
    }

    if (o.type !== t.double) {
      return n.from;
    }

    if (o.from_fixed && o.to_fixed) {
      return null;
    } else if (o.from_fixed) {
      return n.to as HTMLElement;
    } else if (o.to_fixed) {
      return n.from;
    }
    
    const fromCoord = this.offset(n.from);
    const toCoord = this.offset(n.to as HTMLElement);

    if (fromCoord === toCoord) {
      result = <HTMLSpanElement>(coord < fromCoord ? n.from : n.to);
    } else {
      result = <HTMLSpanElement>(Math.abs(fromCoord - coord) < Math.abs(toCoord - coord) ? n.from : n.to);
    }
    return result;
  }

  private getCoord(event: MouseEvent) {
    const o = this.options;
    const d = View.orientations;
    const n = this.nodes;

    if (o.orientation === d.horizontal) {
       return event.pageX - n.track.offsetLeft;
    } else {
      return event.pageY - n.track.offsetTop;
    }
  }

  private outerWidth(node: HTMLElement) {
    const style = getComputedStyle(node);
    const width = node.offsetWidth + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);

    return width;
  }

  private outerHeight(node: HTMLElement) {
    const style = getComputedStyle(node);
    const height = node.offsetHeight + parseInt(style.marginLeft as string) + parseInt(style.marginRight as string);

    return height;
  }

  private offset(node: HTMLElement) {
    const o = this.options;
    const d = View.orientations;

    if (o.orientation === d.horizontal) {
      return node.offsetLeft + this.outerWidth(node)/2;
    } else {
      return node.offsetTop + this.outerHeight(node)/2;
    } 
  }
}