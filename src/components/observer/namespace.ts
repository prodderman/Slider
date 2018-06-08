export interface IObserver<A> {
  attach(listener: (args: A) => void): void;
  remove(listener: (args: A) => void): void;
  notify(args: A): void;
}
