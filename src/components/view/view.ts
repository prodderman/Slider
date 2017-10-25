import './view.scss';
import './theme.scss';

import IEvent from './../observer/observer';
import { IModel as Model, IModelEvents, IModelOptions } from '../model/namespace';
import { IViewOptions, IViewEvents } from './namespace';

interface IMandatoryOptions extends IViewOptions {
  type: string;
  orientation: string;
}

interface INodes {
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to?: HTMLSpanElement;
  range?: HTMLDivElement;
}

export default class View {

  private root: HTMLDivElement | HTMLSpanElement;
  private handle: HTMLSpanElement | null = null;
  private handler = this.mouseMove.bind(this);

  private triggers: IViewEvents  = {
    fromChanged: new IEvent(),
    toChanged: new IEvent()
  }

  private types = { 
    single: 'single', 
    min: 'min', 
    max: 'max', 
    double: 'double' 
  };

  private orientations = {
    horizontal: 'horizontal',
    vertical: 'vertical'
  }

  private options: IMandatoryOptions = {
    type: this.types.single,
    orientation: this.orientations.horizontal,
  }

  private nodes: INodes = {
    track: document.createElement('div'),
    from: document.createElement('span')
  };
  
  constructor(rootObject: HTMLElement | HTMLCollection | string, private model: Model, viewOptions: IViewOptions = {}) {
    if (this.setRoot(rootObject)) {
      this.init(viewOptions);
    }
  }

  // accessors

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

  // public methods

  public init(viewOptions: IViewOptions, isUpdate?: boolean) {
    const o = this.options;
    const v = viewOptions;
    if (v.type && v.type in this.types) {
      o.type = v.type;
    }

    if (v.orientation && v.orientation in this.orientations) {
      o.orientation = v.orientation;
    }

    this.render();
  }

  // private methods

  private render() {
    const o = this.options;
    const r = this.root;
    const n = this.nodes;
    const d = this.orientations;

    this.rootEmpty();
    this.setNodes();

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
    this.calcFrom();
    this.calcTo();
    this.calcRange();
    this.setHandlers();
  }

  private setHandlers() {
    const t = this.triggers;
    const n = this.nodes;
    const e = this.model.events;

    e.fromChanged.attach(() => {
      this.calcFrom();
      this.calcRange();
    });
    e.toChanged.attach(() => {
      this.calcTo();
      this.calcRange();
    });
    document.body.removeEventListener('mousemove', this.handler);
    n.track.removeEventListener('mousedown', this.mouseDown.bind(this));
    window.removeEventListener('mouseup', this.mouseUp.bind(this));
    
    n.track.addEventListener('mousedown', this.mouseDown.bind(this));
    window.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  private calcFrom() {
    const o = this.options;
    const d = this.orientations;
    const n = this.nodes;
    const m = this.model.data;
    
    if (o.orientation === d.horizontal) {
      n.from.style.left = `${this.converToPercent(m.from)}%`;
    } else {
      n.from.style.bottom = `${this.converToPercent(m.from)}%`;
    }    
  }

  private calcTo() {
    const o = this.options;
    const d = this.orientations;
    const t = this.types;
    const n = this.nodes;
    const m = this.model.data;

    if (o.type !== t.double || !n.to) {
      return;
    }

    if (o.orientation === d.horizontal) {
      n.to.style.left = `${this.converToPercent(m.to)}%`;
    } else {
      n.to.style.bottom = `${this.converToPercent(m.to)}%`;

    }
  }

  private calcRange() {
    const o = this.options;
    const d = this.orientations;
    const t = this.types;
    const n = this.nodes;
    const m = this.model.data;

    if (o.type === t.single || !n.range) {
      return;
    } else if (o.type === t.min) {
      if (o.orientation === d.horizontal) {
        n.range.style.left = '0';
        n.range.style.width = `${this.converToPercent(m.from)}%`;
      } else {
        n.range.style.bottom = '0';
        n.range.style.height = `${this.converToPercent(m.from)}%`;
      }
    } else if (o.type === t.max) {
      if (o.orientation === d.horizontal) {
        n.range.style.width = `${100 - this.converToPercent(m.from)}%`;
      } else {
        n.range.style.height = `${100 - this.converToPercent(m.from)}%`;
      }
    } else if (o.type === t.double && n.to) {
      if (o.orientation === d.horizontal) {
        n.range.style.left = `${this.converToPercent(m.from)}%`;
        n.range.style.width = `${this.converToPercent(m.to - m.from + m.min)}%`;
      } else {
        n.range.style.bottom = `${this.converToPercent(m.from)}%`;
        n.range.style.height = `${this.converToPercent(m.to - m.from + m.min)}%`;
      }
    }
  }

  private setNodes() {
    const o = this.options;
    const n = this.nodes;

    this.root.className += ' vanilla';
    n.track.setAttribute('class', `vanilla-slider vanilla-${o.type} vanilla-${o.orientation}`);

    n.from.setAttribute('tabindex', `0`);
    n.from.setAttribute('class', `vanilla-handle vanilla-handle-from`);

    if (o.type !== this.types.single) {
      n.range = document.createElement('div');
      n.range.setAttribute('class', `vanilla-range vanilla-range-${o.type}`);
    }

    if (o.type === this.types.double) {
      n.to = document.createElement('span');
      n.to.setAttribute('tabindex', `0`);
      n.to.setAttribute('class', `vanilla-handle vanilla-handle-to`);
    }
  }

  private convertToReal(pixels: number) {
    const o = this.options;
    const m = this.model.data;
    const n = this.nodes;
    const d = this.orientations;

    const range = m.max - m.min;

    if (o.orientation === d.horizontal) {
      const width = n.track.clientWidth;
      return +((pixels * range / width) + m.min).toFixed(10);
    } else {
      const height = n.track.clientHeight;
      return +(((height - pixels) * range / height) + m.min).toFixed(10);
    }    
  }

  private converToPercent(value: number) {
    const m = this.model.data;
    const range = m.max - m.min;
    return +((value - m.min) * 100 / range).toFixed(10);
  }

  private rootEmpty() {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }
  }

  private setRoot(root: HTMLElement | HTMLCollection | string) {
    if (root instanceof HTMLDivElement || root instanceof HTMLSpanElement) {
      this.root = root;
      return true;
    } else if (root instanceof HTMLCollection && root[0] instanceof HTMLDivElement) {
      this.root = <HTMLDivElement | HTMLSpanElement>root[0];
      return true;
    } else if (typeof root === 'string') {
      const t = document.querySelector(root);
      if (t instanceof HTMLDivElement || t instanceof HTMLSpanElement) {
        this.root = t;
        return true;
      } else {
        throw "Invalid node type, expected 'div'";
      }
    } 
    else{
      throw "Invalid node type, expected 'div'";
    }
  }

  private mouseDown(event: MouseEvent) {
    const o = this.options;
    const n = this.nodes;
    const d = this.orientations;
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
    document.addEventListener('mousemove', this.handler);
  }

  private mouseMove(event: MouseEvent) {
    const e = this.events;
    const n = this.nodes;
    const value = this.convertToReal(this.getCoord(event));
    console.log(value);
    if (this.handle === n.from) {
      e.fromChanged.notify(value);
    } else {
      e.toChanged.notify(value);
    }
  }

  private mouseUp() {
    document.removeEventListener('mousemove', this.handler);
    this.handle = null;
  }

  private chooseHandle(coord: number): HTMLSpanElement {
    const o = this.options;
    const t = this.types;
    const d = this.orientations;
    const n = this.nodes;

    if (o.type !== t.double) {
      return n.from;
    }
    const fromCoord = this.offset(n.from);
    const toCoord = this.offset(n.to as HTMLElement);

    return <HTMLSpanElement>(Math.abs(fromCoord - coord) < Math.abs(toCoord - coord) ? n.from : n.to);
  }

  private getCoord(event: MouseEvent) {
    const o = this.options;
    const d = this.orientations;
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
    const d = this.orientations;

    if (o.orientation === d.horizontal) {
      return node.offsetLeft + this.outerWidth(node)/2;
    } else {
      return node.offsetTop + this.outerHeight(node)/2;
    } 
  }
}