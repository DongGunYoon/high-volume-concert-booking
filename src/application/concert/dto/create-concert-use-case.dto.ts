import { Nullable } from 'src/common/type/native';
import { CreateConcertDTO } from 'src/domain/concert/dto/create-concert.dto';

export class CreateConcertUseCaseDTO {
  title: string;
  description: Nullable<string>;

  constructor(title: string, description: Nullable<string>) {
    this.title = title;
    this.description = description;
  }

  toCreateConcertDTO(): CreateConcertDTO {
    return {
      title: this.title,
      description: this.description,
    };
  }
}
