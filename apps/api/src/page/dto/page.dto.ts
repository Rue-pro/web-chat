import { EdgeDto, PageInfoDto } from '.';

export class PageDto<T> {
  edges: EdgeDto<T>[];

  pageInfo: PageInfoDto;

  totalCount: number;

  constructor(partial: Partial<PageDto<T>>) {
    Object.assign(this, partial);
  }
}
