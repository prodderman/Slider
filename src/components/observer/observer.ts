import {IEvent} from './namespace';

export default class Event implements IEvent{
  private listeners: Set<Function>;

  public constructor() {
    this.listeners = new Set();  
  }

  public attach(listener: Function): void {
    this.listeners.add(listener);
  }

  public remove(listener: Function) {
    this.listeners.delete(listener);
  }
  
  public notify<A>(...args: A[]): void {
    this.listeners.forEach((listener) => {
      listener(...args);
    })
  }
}