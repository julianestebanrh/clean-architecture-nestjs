export type OrderDirection = 'ASC' | 'DESC';

export interface OrderOption {
  field: string;
  direction: OrderDirection;
}

export class PageOptions {
  readonly page: number;
  readonly pageSize: number;
  readonly orders: OrderOption[];

  constructor(
    page: number = 1,
    pageSize: number = 10,
    orders: OrderOption[] = []
  ) {
    this.page = Math.max(1, page);
    this.pageSize = Math.max(1, Math.min(pageSize, 100)); // Límite máximo de 100
    this.orders = orders;
  }

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }

  get take(): number {
    return this.pageSize;
  }

  get typeormOrder(): Record<string, { direction: OrderDirection }> {
    return this.orders.reduce((acc, { field, direction }) => {
      acc[field] = { direction };
      return acc;
    }, {});
  }
} 