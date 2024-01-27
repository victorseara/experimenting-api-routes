type TServiceOptionalize<T extends K, K> = Omit<T, keyof K> & Partial<K>;

export type TService<Output, Input = undefined> = Input extends undefined
  ? TServiceOptionalize<
      IBaseService<Output, Input>,
      { execute(input?: Input): Output | Promise<Output> }
    >
  : IBaseService<Output, Input>;

export interface IServiceImplementation<Output, Input = undefined> {
  new (...args: any[]): TService<Output, Input>;
}
