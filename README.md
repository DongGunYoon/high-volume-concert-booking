# High-Volume Concert Booking

## 개요

대용량 트래픽이 예상되는 콘서트 예약 시스템을 위한 백엔드 애플리케이션입니다. 본 시스템은 다수의 서버 인스턴스 환경에서도 동시성 문제를 방지하고 안정적으로 작동할 수 있도록 설계되었습니다. 대기열을 이용한 유저 유입량 조절을 통해 서버 부하를 줄이고 효율적인 콘서트 예약 기능을 지원합니다.

## 주요 기능

대기열 시스템: 동시성 문제 해결을 위한 유저 대기열 관리
예약 기능: 예약 가능 날짜 및 좌석 조회, 좌석 예약 요청
결제 기능: 예약된 좌석에 대한 결제 처리
사용자 인증: JWT 기반 사용자 인증
포인트 관리: 잔액 충전 및 조회 기능

## 기술 스택

- 백엔드: NestJS, TypeScript
- 데이터베이스: PostgreSQL, TypeORM
- 테스트: Jest (Unit, Integration, e2e)
- 패키지관리: yarn

## 요구 사항

- 각 기능 및 제약사항에 대해 단위 테스트를 반드시 하나 이상 작성하도록 합니다.
- 다수의 인스턴스로 어플리케이션이 동작하더라도 기능에 문제가 없도록 작성하도록 합니다.
- 동시성 이슈를 고려하여 구현합니다.
- 대기열 개념을 고려해 구현합니다.

## API 목록

세부적인 API 명세는 [포스트맨 Document](https://documenter.getpostman.com/view/12809852/2sA3dyhAWT)로 작성했습니다.

- 유저 토큰 발급 API (`POST /users/queue`)
- 예약 가능 날짜 조회 API (`GET /concerts/:concertId/schedules/bookable`)
- 예약 가능 좌석 조회 API (`GET /concerts/schedules/:concertScheduleId/seats`)
- 좌석 예약 요청 API (`POST /concerts/seats/:concertSeatId/book`)
- 결제 API (`POST /concerts/bookings/:concertBookingId/pay`)
- 잔액 충전 API (`POST /points/charge`)
- 잔액 조회 API (`GET /points`)

## Milestone

프로젝트의 주요 [마일스톤](https://github.com/users/DongGunYoon/projects/2)은 다음과 같습니다.

![Milestone](asset/milestone_calendar.png)

## ERD

```mermaid
erDiagram
 UserEntity {
 int id PK
 varchar name
 timestamptz createdAt
 timestamptz updatedAt
 }
 UserQueueEntity {
 int id PK
 int userId FK
 varchar token
 timestamptz createdAt
 timestamptz expiresAt
 }
 PointEntity {
 int id PK
 int userId FK
 int amount
 timestamptz createdAt
 timestamptz updatedAt
 }
 PointHistoryEntity {
 int id PK
 int userId FK
 int pointId FK
 int amount
 enum transactionType
 timestamptz createdAt
 }
 ConcertEntity {
 int id PK
 varchar title
 varchar description
 timestamptz createdAt
 timestamptz updatedAt
 }
 ConcertSeatEntity {
 int id PK
 int concertId FK
 int concertScheduleId FK
 int price
 int number
 enum status
 timestamptz createdAt
 timestamptz updatedAt
 }
 ConcertScheduleEntity {
 int id PK
 int concertId FK
 timestamptz bookingStartAt
 timestamptz bookingEndAt
 timestamptz startAt
 timestamptz endAt
 timestamptz createdAt
 timestamptz updatedAt
 }
 ConcertPaymentHistoryEntity {
 int id PK
 int userId FK
 int concertId FK
 int concertScheduleId FK
 int concertSeatId FK
 int concertBookingId FK
 varchar concertTitle
 int price
 enum status
 timestamptz createdAt
 }
 ConcertBookingEntity {
 int id PK
 int userId FK
 int concertId FK
 int concertScheduleId FK
 int concertSeatId FK
 enum status
 timestamptz createdAt
 timestamptz expiresAt
 timestamptz updatedAt
 }

 UserEntity ||--|| PointEntity : has
 UserEntity ||--o{ UserQueueEntity : has
 UserEntity ||--o{ PointHistoryEntity : has
 UserEntity ||--o{ ConcertBookingEntity : books
 UserEntity ||--o{ ConcertPaymentHistoryEntity : pays

 PointEntity ||--o{ PointHistoryEntity : has

 ConcertEntity ||--o{ ConcertScheduleEntity : schedules
 ConcertScheduleEntity ||--o{ ConcertSeatEntity : contains
 ConcertSeatEntity ||--o{ ConcertBookingEntity : bookedFor
 ConcertBookingEntity ||--o{ ConcertPaymentHistoryEntity : paidFor

```

## 시퀀스 다이어그램

아래는 각 주요 API에 대한 시퀀스 다이어그램입니다. 이 다이어그램들은 각 API의 동작 흐름을 표현합니다.

### 유저 토큰 발급 API

```mermaid
sequenceDiagram
    title 유저가 대기열 토큰을 발급한다.

    사용자->>APIGateway: POST /api/user/queue

    APIGateway->>UserAuthGuard: 유저 인증 토큰 검증
    alt 토큰 인증 성공
		  UserAuthGuard-->>APIGateway: 인증 성공 (토큰 정보)
		  APIGateway->>IssueUserQueueUseCase: 유저 대기열 토큰 발급 요청
		  IssueUserQueueUseCase->>UserQueue: 유저 대기열 추가 요청

		  UserQueue->>UserQueue: 만료되지 않은 유저 대기열 조회
		  opt 만료되지 않은 대기열이 없다면
			  UserQueue->>UserQueue: 대기열에 유저 생성
			end

			UserQueue-->>IssueUserQueueUseCase: 조회/생성된 토큰 반환
			alt 유저가 서비스 입장 가능 상태면
				IssueUserQueueUseCase->>Jwt: 유저 대기열 토큰 생성 요청
				Jwt-->>IssueUserQueueUseCase: 유저 대기열 토큰 반환
				IssueUserQueueUseCase-->>사용자: 유저 대기열 토큰 정보 반환

			else 유저가 서비스 입장 불가능 상태면
				IssueUserQueueUseCase-->>사용자: 현재 유저의 대기열 상태를 반환
			end


	  else 토큰 인증 실패
		  UserAuthGuard-->>사용자: 인증 실패
		end
```

### 예약 가능 날짜 조회 API

```mermaid
sequenceDiagram
    title 유저가 예약 가능한 콘서트 날짜를 조회한다.

    사용자->>APIGateway: GET /api/concerts/:concertId/bookable-dates

    APIGateway->>UserQueueGuard: 유저 대기열 토큰 검증
    alt 토큰 인증 성공
		  UserQueueGuard-->>APIGateway: 인증 성공 (토큰 정보)
		  APIGateway->>ScanConcertBookableDatesUseCase: 예약 가능한 콘서트 날짜 조회 요청

		  ScanConcertBookableDatesUseCase->>Concert: 콘서트 유효성 검증
			alt is 유효함
			  Concert-->>ScanConcertBookableDatesUseCase: 유효성 검증 성공
  			ScanConcertBookableDatesUseCase->>ConcertSchedule: 예약 가능한 콘서트 스케쥴 조회 요청
  			ConcertSchedule-->>사용자: 조회한 예약 가능 콘서트 날짜 정보 반환

		  else is 유효하지 않음
			  Concert-->>사용자: 유효하지 않은 콘서트 에러
			end

	  else 토큰 인증 실패
		  UserQueueGuard-->>사용자: 인증 실패
		end
```

### 예약 가능 좌석 조회 API

```mermaid
sequenceDiagram
    title 유저가 예약 가능 좌석을 조회한다.

    사용자->>APIGateway: GET /api/concerts/schedules/:concertScheduleId/seats

    APIGateway->>UserQueueGuard: 유저 대기열 토큰 검증
    alt 토큰 인증 성공
		  UserQueueGuard-->>APIGateway: 인증 성공 (토큰 정보)
		  APIGateway->>ScanConcertSeatsUseCase: 예약 가능한 콘서트 좌석 조회 요청

		  ScanConcertSeatsUseCase->>ConcertSchedule: 콘서트 스케쥴 유효성 검증
			alt is 유효함
			  ConcertSchedule-->>ScanConcertSeatsUseCase: 유효성 검증 성공
  			ScanConcertSeatsUseCase->>ConcertSeat: 예약 가능한 콘서트 좌석 조회 요청
  			ConcertSeat-->>사용자: 조회한 예약 가능 콘서트 날짜 정보 반환

		  else is 유효하지 않음
			  Concert-->>사용자: 유효하지 않은 콘서트 스케쥴 에러
			end

	  else 토큰 인증 실패
		  UserQueueGuard-->>사용자: 인증 실패
		end
```

### 좌석 예약 요청 API

```mermaid
sequenceDiagram
    title 유저가 좌석 예약을 요청한다.

    사용자->>APIGateway: POST /api/concerts/seats/:concertSeatId

    APIGateway->>UserQueueGuard: 유저 대기열 토큰 검증
    alt 토큰 인증 성공
		  UserQueueGuard-->>APIGateway: 인증 성공 (토큰 정보)
		  APIGateway->>BookConcertSeatUseCase: 콘서트 좌석 예약 요청

		  BookConcertSeatUseCase->>ConcertSchedule: 콘서트 스케쥴 유효성 검증
			alt is 예약 가능 시간
			  ConcertSchedule-->>BookConcertSeatUseCase: 유효성 검증 성공

  			BookConcertSeatUseCase->>ConcertSeat: 콘서트 좌석 예약 요청
  			alt is 콘서트 좌석 정보 존재
	  			ConcertSeat-->>BookConcertSeatUseCase: 조회한 예약 가능 콘서트 날짜 정보 반환
	  			alt is 콘서트 좌석 예약 가능 상태
		  			ConcertSeat->>ConcertSeat: 콘서트 좌석 예약
			  		ConcertSeat-->>BookConcertSeatUseCase: 예약된 콘서트 좌석 정보 반환
			  		BookConcertSeatUseCase->>ConcertBooking: 예약한 좌석 관련 콘서트 예약 생성 요청
			  		ConcertBooking->>ConcertBooking: 콘서트 예약 생성
			  		ConcertBooking-->>BookConcertSeatUseCase: 콘서트 예약 정보 반환
			  		BookConcertSeatUseCase-->>사용자: 좌석 예약 요청 관련 정보 반환

		  		else is 콘서트 좌석 예약 불가능 상태
			  		ConcertSeat-->>사용자: 콘서트 예약 불가능 에러
				  end
				else is 콘서트 좌석 미존재
					ConcertSeat-->>사용자: 유효하지 않은 콘서트 좌석 에러
				end

		  else is 예약 불가능 시간
			  ConcertSchedule-->>사용자: 유효하지 않은 콘서트 스케쥴 에러
			end

	  else 토큰 인증 실패
		  UserQueueGuard-->>사용자: 인증 실패
		end
```

### 잔액 충전 API

```mermaid
sequenceDiagram
    title 유저가 잔액을 충전한다.

    사용자->>APIGateway: POST /api/points/charge

    APIGateway->>UserAuthGuard: 유저 인증 토큰 검증
    alt 토큰 인증 성공
		  UserAuthGuard-->>APIGateway: 인증 성공 (토큰 정보)
			APIGateway->>ChargeUserPointUseCase: 포인트 충전 요청

			ChargeUserPointUseCase->>User: 유저 유효성 검증
			alt is 유효함
			  User-->>ChargeUserPointUseCase: 유효성 검증 성공
  			ChargeUserPointUseCase->>Point: 요청한 값만큼 포인트 충전

				Point->>Point: 포인트 충전
				alt is 충전 성공
					Point-->>ChargeUserPointUseCase: 충전된 포인트 정보 반환
					ChargeUserPointUseCase->>PointHistory: 포인트 충전 내역 생성 요청
					PointHistory->>PointHistory: 포인트 충전 내역 생성
					ChargeUserPointUseCase-->>사용자: 포인트 정보 반환

				else is 충전 실패
					Point-->>사용자: 충전 실패 발생 에러
				end

		  else is 유효하지 않음
			  User-->>사용자: 유효하지 않은 유저 에러
			end

	  else 토큰 인증 실패
		  UserAuthGuard-->>사용자: 인증 실패 에러
		end
```

### 잔액 조회 API

```mermaid
sequenceDiagram
    title 유저가 잔액을 조회한다.

    사용자->>APIGateway: GET /api/points

    APIGateway->>UserAuthGuard: 유저 인증 토큰 검증
    alt 토큰 인증 성공
		  UserAuthGuard-->>APIGateway: 인증 성공 (토큰 정보)
			APIGateway->>ReadUserPointUseCase: 포인트 조회 요청

			ReadUserPointUseCase->>User: 유저 유효성 검증
			alt is 유효함
			  User-->>ReadUserPointUseCase: 유효성 검증 성공
  			ReadUserPointUseCase->>Point: 포인트 조회 요청
  			Point-->>사용자: 조회한 포인트 정보 반환

		  else is 유효하지 않음
			  User-->>사용자: 유효하지 않은 유저 에러
			end

	  else 토큰 인증 실패
		  UserAuthGuard-->>사용자: 인증 실패 에러
		end
```

### 결제 API

```mermaid
sequenceDiagram
    title 유저가 예약된 좌석을 결제한다.

    사용자->>APIGateway: POST /api/concerts/bookings/:concertBookingId/pay

    APIGateway-->>UserQueueGuard: 유저 대기열 토큰 검증
    alt 토큰 인증 성공
		  UserQueueGuard-->>APIGateway: 인증 성공 (토큰 정보)
		  APIGateway->>PayConcertBookingUseCase: 콘서트 예약 결제 요청

			PayConcertBookingUseCase->>ConcertBooking: 콘서트 예약 수정 요청
			alt is 콘서트 예약 정보 존재
				ConcertBooking->>ConcertBooking: 콘서트 예약 정보 수정
				alt is 콘서트 예약 정보 수정 가능
					ConcertBooking-->>PayConcertBookingUseCase: 수정된 콘서트 예약 정보 반환

					PayConcertBookingUseCase->>UserPoint: 포인트 차감 요청
					alt is 포인트가 충분하다면
						UserPoint->>UserPoint: 포인트 차감
						PayConcertBookingUseCase->>PointHistory: 포인트 차감 내역 생성 요청
						PointHistory->>PointHistory: 포인트 차감 내역 생성
						PayConcertBookingUseCase->>ConcertSeat: 콘서트 좌석 상태 수정 요청
						ConcertSeat->>ConcertSeat: 콘서트 좌석 상태 수정
						ConcertSeat-->>PayConcertBookingUseCase: 수정된 콘서트 좌석 정보 반환
						PayConcertBookingUseCase->>ConcertPaymentHistory: 콘서트 결제 내역 생성 요청
						ConcertPaymentHistory->>ConcertPaymentHistory: 콘서트 결제 내역 생성
						ConcertPaymentHistory-->>PayConcertBookingUseCase: 콘서트 결제 내역 정보 반환
						PayConcertBookingUseCase->>UserQueue: 유저 대기열 토큰 만료 처리 요청
						UserQueue->>UserQueue: 유저 대기열 토큰 만료 처리
						PayConcertBookingUseCase-->>사용자: 예약 좌석 결제 관련 정보 반환
					else is 포인트가 부족하다면
						UserPoint-->>사용자: 포인트 부족 에러
					end

				else is 콘서트 예약 정보 수정 불가능 (예약자 다름 OR 결제 대기 상태 아님)
					ConcertBooking->>사용자: 콘서트 예약 결제 불가
				end

			else is 콘서트 예약 미존재
				ConcertBooking-->>사용자: 유효하지 않은 콘서트 좌석 에러
			end

	  else 토큰 인증 실패
		  UserQueueGuard-->>사용자: 인증 실패
		end
```
