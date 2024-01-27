export interface IService {
  execute<Input = undefined, Output>(input?: Input): Output | Promise<Output>;
}

export interface IServiceImplementation<Input = undefined, Output>
  extends IService {
  new (...args: any[]): IService<Input, Output>;
}
