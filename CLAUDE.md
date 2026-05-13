@AGENTS.md

# 고구마마켓

중고 물품을 사고팔 수 있는 웹 서비스.

## 기술 스택

- **Next.js** (App Router, `src/` 디렉토리)
- **Supabase** (데이터베이스, 인증)
- **Tailwind CSS** (스타일링)
- **TypeScript**

## MCP

- Supabase MCP 연결됨 — DB 조작 시 MCP를 통해 직접 수행

## 규칙

- 한국어 UI
- 가격은 원화(₩) — `₩10,000` 형태로 표시
- 모바일 반응형 필수
- 디자인은 깔끔하고 모던한 스타일
- 색상 테마: 주황색 계열 (고구마 컨셉)

## 주요 기능

- 상품 목록 (메인 페이지)
- 상품 등록/상세/수정/삭제
- 소셜 로그인 (카카오/구글)
- 결제 (토스페이먼츠)

## 데이터베이스

### profiles

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | Supabase auth.users FK |
| username | text | 닉네임 |
| avatar_url | text | 프로필 이미지 URL |
| location | text | 동네 (예: 마포구 서교동) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### products

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| seller_id | uuid | profiles FK |
| title | text | 상품명 |
| description | text | 상품 설명 |
| price | integer | 가격 (원) |
| category | text | 카테고리 |
| status | enum | `selling` / `reserved` / `sold` |
| images | text[] | 이미지 URL 배열 |
| location | text | 거래 희망 장소 |
| view_count | integer | 조회수 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### chats

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| product_id | uuid | products FK |
| buyer_id | uuid | profiles FK |
| seller_id | uuid | profiles FK |
| created_at | timestamptz | |

### messages

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| chat_id | uuid | chats FK |
| sender_id | uuid | profiles FK |
| content | text | 메시지 내용 |
| created_at | timestamptz | |

## 프로젝트 구조

```
src/
├── app/                  # App Router 페이지
├── components/           # 공용 컴포넌트
├── lib/
│   └── supabase/
│       ├── client.ts     # 브라우저용 클라이언트
│       ├── server.ts     # 서버 컴포넌트용 클라이언트
│       └── middleware.ts # 세션 갱신 + 인증 보호
├── types/
│   └── database.ts       # Supabase DB 타입
└── middleware.ts          # Next.js 미들웨어
```

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
