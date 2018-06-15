import { IObserver } from './namespace';

class Observer<A> implements IObserver<A> {
  private listeners: Set<(args: A) => void>;

  public constructor() {
    this.listeners = new Set();
  }

  public attach(listener: (args: A) => void): () => void {
    this.listeners.add(listener);
    return () => this.remove(listener);
  }

  public notify(args: A): void {
    this.listeners.forEach((listener) => {
      listener(args);
    });
  }

  private remove(listener: (args: A) => void): void {
    this.listeners.delete(listener);
  }
}

export default Observer;
