import { Nullable } from 'src/common/type/native';

export class UserQueueResponse {
  constructor(
    public id: number,
    public userId: number,
    public currentOrder: number,
    public token: Nullable<string>,
    public expiresAt: Nullable<Date>,
  ) {}
}
