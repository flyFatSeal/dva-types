import {
  GenerateActionInner,
  Args,
  ArgsWithoutFirst,
  UnionToIntersection,
  Model,
  GenerateActionByField,
  ValueType,
} from './util';

/**
 * 生成model对应的action类型
 * 用于对外导出
 */
export type ModelAction<M extends Model> = GenerateActionInner<M>;

/**
 * 生成model对应的state类型
 */
export type ModelState<
  M extends {namespace: string; state: Record<string, any>}
> = M['state'];

/**
 * 生成model对应的saga command类型
 * 用于model内部类型限定
 */
export type Commands<M extends Model, O extends any[] = never[]> = {
  put: (action: GenerateActionInner<M, O>) => any;
  call: <F extends (arg: any) => any>(api: F, ...payload: Args<F>) => any;
  select: <F extends (state: any, ...arg: any[]) => any>(
    selector?: F,
    ...args: ArgsWithoutFirst<F>
  ) => any;
  take: (...args: any[]) => any;
  cancel: (...args: any[]) => any;
  all: (commands: any[]) => any;
  [key: string]: any;
};

/**
 * 用于effect中的yield类型推导
 */
export type Result<F> = F extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

/* dva-loading 插件提示 */
export interface Loading<GlobalModels extends {[key: string]: Model}> {
  global: boolean;
  models: {
    [M in keyof GlobalModels]: boolean;
  };
  effects: ValueType<
    {
      [M in keyof GlobalModels]: GenerateActionByField<
        GlobalModels[M],
        'effects'
      > extends {type: infer typeName}
        ? {[P in typeName & string]: boolean}
        : never;
    }
  >;
}

export type ExtractState<AllModels extends {[key: string]: Model}> = {
  [k in keyof AllModels]: {};
};

export type GlobalModels<T extends {[key: string]: Model}> = {
  [k in keyof T]: T[k]['state'];
} & {loading: Loading<T>};
