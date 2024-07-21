import { Nullable } from '../type/native';

export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: Nullable<string>;
  data: Nullable<T>;

  constructor(success: boolean, statusCode: number, message: Nullable<string>, data: Nullable<T>) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
