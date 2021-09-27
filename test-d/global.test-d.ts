import {expectType} from 'tsd';
import {GlobalModels} from '../src';

import type {TodoModel} from './index.test-d';

type AllModels = {
  todo: TodoModel;
};

export type GlobalDva = GlobalModels<AllModels>;

/**
 * todoState type
 */
declare const todoState: TodoModel['state'];

expectType<GlobalDva['todo']>(todoState);
