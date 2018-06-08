import { IObserver } from './namespace';

class Observer<A> implements IObserver<A> {
  private listeners: Set<(args: A) => void>;

  public constructor() {
    this.listeners = new Set();
  }

  public attach(listener: (args: A) => void): void {
    this.listeners.add(listener);
  }

  public remove(listener: (...args: A[]) => void) {
    this.listeners.delete(listener);
  }

  public notify(args: A): void {
    this.listeners.forEach((listener) => {
      listener(args);
    });
  }
}

export default Observer;
