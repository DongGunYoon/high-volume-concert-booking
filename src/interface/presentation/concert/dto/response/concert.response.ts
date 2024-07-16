import { Nullable } from 'src/common/type/native';
import { Concert } from 'src/domain/concert/model/concert.domain';

export class ConcertResponse {
  constructor(
    public id: number,
    public title: string,
    public description: Nullable<string>,
  ) {}

  static from(concert: Concert): ConcertResponse {
    return new ConcertResponse(concert.id, concert.title, concert.description);
  }
}
