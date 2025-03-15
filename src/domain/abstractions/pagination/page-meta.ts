import { PageOptions } from "./page-options";

export class PageMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;

  constructor(pageOptions: PageOptions, totalItems: number) {
    this.page = pageOptions.page;
    this.pageSize = pageOptions.pageSize;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.hasNextPage = this.page < this.totalPages;
    this.hasPreviousPage = this.page > 1;
  }
} 