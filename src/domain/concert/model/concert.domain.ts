import { Nullable } from 'src/common/type/native';

export class Concert {
  constructor(
    public id: number,
    public title: string,
    public description: Nullable<string>,
  ) {}
}
