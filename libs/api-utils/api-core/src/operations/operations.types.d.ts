interface IBaseOperation<Output, Input> {
  execute(input: Input): Output | Promise<Output>;
}

type TOperationOptionalize<T extends K, K> = Omit<T, keyof K> & Partial<K>;

export type TOperation<Output, Input = undefined> = Input extends undefined
  ? TOperationOptionalize<
      IBaseOperation<Output, Input>,
      { execute(input?: Input): Output | Promise<Output> }
    >
  : IBaseOperation<Output, Input>;

export interface IOperationImplementation<Output, Input = undefined> {
  new (...args: any[]): TOperation<Output, Input>;
}
