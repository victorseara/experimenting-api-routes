interface IOperationBase<Output, Input> {
  execute(input: Input): Output | Promise<Output>;
}

export type Optionalize<T extends K, K> = Omit<T, keyof K> & Partial<K>;

export type TOperation<Output, Input = undefined> = Input extends undefined
  ? Optionalize<
      IOperationBase<Output, Input>,
      { execute(input?: Input): Output | Promise<Output> }
    >
  : IOperationBase<Output, Input>;

export interface IOperationImplementation<Output, Input = undefined> {
  new (...args: any[]): TOperation<Output, Input>;
}
