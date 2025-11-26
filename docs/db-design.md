# Database Design – Ticketing Warrior

본 문서는 Ticketing Warrior 서비스의 데이터베이스 구조 중  
**History(기록) 테이블의 논리 설계(Logical Design)** 를 정의한다.

---

## 1. ERD – History 테이블

- 테이블명: **history**
- 용도: 좌석 예매 수행 시간(소요시간) 및 기록 생성 시점을 저장하는 테이블

---

## 2. 테이블 정의 (Logical Table Definition)

### 📌 History 테이블

| 컬럼명         | 타입        | 설명                  |
|--------------|------------|----------------------|
| id (PK)      | INT        | 고유 식별자, 자동 증가 ID |
| duration_ms  | INT        | 예매 과정 소요 시간(ms)  |
| created_at   | DATETIME   | 기록 생성 시각          |

---

## 3. 제약조건 및 인덱스

- **Primary Key**  
  - `id`
- **Index (Optional)**  
  - `created_at` (최근 기록 조회가 필요한 경우)

---

## 4. 데이터 규칙

- `duration_ms`는 밀리초 단위 정수만 저장  
- `created_at`은 서버에서 현재 시간을 기본값으로 삽입  
- 사용자 테이블과의 FK 연동은 현재 스키마에는 포함되지 않음
