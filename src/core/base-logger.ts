export default interface IBaseLogger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string | Error, meta?: any): void;
}
