import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';

interface ErrorDetail {
  message: string;
  statusCode: HttpStatus;
}

export const ERROR_DETAILS: Record<ErrorCode, ErrorDetail> = {
  [ErrorCode.TOKEN_EXPIRED]: {
    message: '이미 만료된 토큰입니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.INVALID_TOKEN]: {
    message: '유효하지 않은 인증 토큰입니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_NOT_PROVIDED]: {
    message: '인증 토큰이 제공되지 않았습니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.UNAUTHORIZED_CONCERT_PAYMENT]: {
    message: '내가 예약한 콘서트만 결제 가능합니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PAYMENT_ALREADY_PROCESSED]: {
    message: '이미 결제가 처리되었습니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PAYMENT_EXPIRED]: {
    message: '결제 만료 시간이 초과되었습니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.BOOKING_NOT_STARTED]: {
    message: '아직 예약 신청 가능 일자가 아닙니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.BOOKING_ALREADY_PASSED]: {
    message: '이미 예약 신청 가능 일자가 지났습니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.SEAT_ALREADY_BOOKED]: {
    message: '선택한 콘서트 좌석은 이미 예약되었습니다.',
    statusCode: HttpStatus.CONFLICT,
  },
  [ErrorCode.SEAT_ALREADY_SOLD]: {
    message: '선택한 콘서트 좌석은 이미 판매되었습니다.',
    statusCode: HttpStatus.CONFLICT,
  },
  [ErrorCode.SEAT_NOT_RESERVED]: {
    message: '좌석이 예약된 상태가 아닙니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CONCERT_NOT_FOUND]: {
    message: '콘서트가 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.SCHEDULE_NOT_FOUND]: {
    message: '콘서트 스케쥴이 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.SEAT_NOT_FOUND]: {
    message: '콘서트 좌석이 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.BOOKING_NOT_FOUND]: {
    message: '콘서트 예약이 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.MINIMUM_CHARGE_AMOUNT]: {
    message: '충전 금액은 최소 0원 이상이어야 합니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MINIMUM_PAYMENT_AMOUNT]: {
    message: '결제 금액은 최소 0원 이상이어야 합니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INSUFFICIENT_POINT]: {
    message: '결제에 필요한 금액이 모자릅니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.POINT_NOT_FOUND]: {
    message: '유저의 포인트가 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.QUEUE_NOT_FOUND]: {
    message: '유저 대기열이 존재하지 않습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.OPTIMISTIC_LOCK_CONFLICT]: {
    message: '동시 요청으로 인해 작업을 완료할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    statusCode: HttpStatus.CONFLICT,
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    message: '핸들링 하지 못한 에러입니다.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
