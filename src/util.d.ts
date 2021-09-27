export interface Model {
  state: any;
  namespace: string;
  reducers: {[k: string]: (...args: any[]) => any};
  effects?: {[k: string]: ((...args: any[]) => any) | any[]};
}

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ValueType<T extends Record<any, any>> = T[keyof T];

/**
 * 获取函数第一个参数的payload类型
 */
export type FirstPayload<F> = F extends (first: infer S, second: never) => any
  ? S extends never
    ? 1
    : S extends {payload: any}
    ? S['payload']
    : never
  : never;

/**
 * 获取函数第二个参数的payload类型
 */
export type SecondPayload<F> = F extends (first: never, second: infer S) => any
  ? S extends never
    ? never
    : S extends {payload: any}
    ? S['payload']
    : never
  : never;

/**
 * 获取函数的参数类型
 */
export type Args<T> = T extends (...args: infer A) => any ? A : never;

/**
 * 获取函数的第二个参数以后的参数类型
 */
export type ArgsWithoutFirst<T> = T extends (_: any, ...args: infer A) => any
  ? A
  : never;

/**
 * 过滤掉never类型的type
 */
export type WithoutNever<T> = Pick<
  T,
  {[k in keyof T]: T[k] extends never ? never : k}[keyof T]
>;

/**
 * 生成当前model内需要的action类型
 * 用于model内部做类型限定
 */
export type GenerateActionInner<
  M extends Model,
  OuterActions extends any[] = never[]
> =
  | GenerateActionByField<M, 'reducers'>
  | GenerateActionByField<M, 'effects'>
  | OuterActions[number]; // 外加外部的一些action

export type GenerateActionByField<
  M extends Model,
  F extends 'effects' | 'reducers'
> = {
  // 从effect生成action type
  [k in keyof M[F]]: WithoutNever<{
    type: F extends 'reducers' ? k : `${M['namespace']}/${string & k}`;
    payload: F extends 'effects'
      ? FirstPayload<M[F][k]>
      : SecondPayload<M[F][k]>;
  }>;
}[keyof M[F]];
