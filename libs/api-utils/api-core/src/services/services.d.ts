export interface IService {
  execute<Input, Output>(input?: Input): Output | Promise<Output>;
}
