export interface IObserver<A> {
  attach(listener: Function): void;
  remove(listener: Function): void;
  notify(...args: A[]): void;
}
