export interface IEvent {
  attach(listener: Function): void;
  remove(listener: Function): void;
  notify<A>(args?: A): void;
}
