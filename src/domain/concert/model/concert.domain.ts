import { Nullable } from 'src/common/type/native';
import { CreateConcertDTO } from '../dto/create-concert.dto';

export class Concert {
  constructor(
    public id: number,
    public title: string,
    public description: Nullable<string>,
  ) {}

  static create(dto: CreateConcertDTO) {
    return new Concert(0, dto.title, dto.description);
  }
}
