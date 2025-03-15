import { Result } from '../result';
import { PageMeta } from './page-meta';

export class Page<T> {
  readonly data: T[];
  readonly meta: PageMeta;

  private constructor(data: T[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }

  static create<T>(data: T[], meta: PageMeta): Result<Page<T>> {
    return Result.success(new Page(data, meta));
  }
} 