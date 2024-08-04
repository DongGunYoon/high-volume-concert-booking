import { IsOptional, IsString } from 'class-validator';
import { CreateConcertUseCaseDTO } from 'src/application/concert/dto/create-concert-use-case.dto';
import { Nullable } from 'src/common/type/native';

export class CreateConcertRequest {
  constructor(title: string, description: Nullable<string>) {
    this.title = title;
    this.description = description;
  }

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: Nullable<string> = null;

  toUseCaseDTO(): CreateConcertUseCaseDTO {
    return new CreateConcertUseCaseDTO(this.title, this.description);
  }
}
