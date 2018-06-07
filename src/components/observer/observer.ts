import { IObserver } from './namespace';

class Observer<T extends Function> implements IObserver<T> {
  private listeners: Set<T>;

  public constructor() {
    this.listeners = new Set();
  }

  public attach(listener: T): void {
    this.listeners.add(listener);
  }

  public remove(listener: T) {
    this.listeners.delete(listener);
  }

  public notify<A>(...args: A[]): void {
    this.listeners.forEach((listener) => {
      listener(...args);
    });
  }
}

export default Observer;
