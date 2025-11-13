export default interface IBaseRepository<T> {
  create(query: string): Promise<T>;
  read(query: string): Promise<T | T[] | null>;
  update(query: string): Promise<T>;
  delete(query: string): Promise<boolean>;
  withTransaction<R>(callback: () => Promise<R>): Promise<R>;
}
