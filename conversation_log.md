# 📂 프로젝트 현황 보고서: 오픈펫케어랩 (Open Pet Care Lab)

> **이 문서는 프로젝트의 모든 컨텍스트를 담고 있는 "마스터 인계장"입니다. 새로운 세션 시작 시 반드시 이 파일을 정독하고 업무를 시작하십시오.**

---

## 1. 프로젝트 개요 (Project Goal)
*   **서비스명:** 오픈펫케어랩 (Open Pet Care Lab)
*   **핵심 가치:** "보호자의 기록이 펫푸드 산업의 기준이 된다."
*   **문제 해결:** 펫푸드 시장의 정보 비대칭 및 신뢰도 저하 문제를 해결하기 위해, 보호자가 직접 반려동물의 급여 반응(변 상태, 기호성 등)을 기록하고 데이터를 공유하는 플랫폼.
*   **주요 기능:**
    1.  **퀘스트 기반 기록:** 게임화된 미션을 통한 지속적인 기록 유도.
    2.  **오픈 위키형 DB:** 집단지성을 활용한 중립적 제품 정보 구축.
    3.  **데이터 리포트:** 축적된 기록을 분석하여 맞춤형 PDF/웹 리포트 제공.

## 2. Gemini 행동 요령 (Action Guidelines)
**이 프로젝트를 수행하는 모든 AI 에이전트는 아래 규칙을 엄수해야 합니다.**

1.  **로그 업데이트 (최우선 순위):**
    *   **기능 구현, 버그 수정, SQL 변경 등 유의미한 작업 후에는 반드시 이 파일(`conversation_log.md`)을 즉시 업데이트하십시오.**
    *   사용자가 별도로 요청하지 않아도 수행해야 하는 **자동 프로토콜**입니다.
2.  **DB 컬럼명 엄수:**
    *   `posts` 테이블의 날짜 컬럼은 `created_at`이 아니라 **`post_created`**입니다.
    *   `comments` 테이블은 `created_at`입니다.
3.  **Storage(이미지) 처리 원칙:**
    *   **파일명:** 한글/특수문자 에러 방지를 위해 반드시 **영문 난수(Random String)**로 변환하여 저장해야 합니다.
    *   **삭제:** DB 레코드 삭제 시 `decodeURIComponent`를 거쳐 Storage 파일도 함께 삭제해야 합니다.
4.  **에러 핸들링:**
    *   `alert` 창 등을 통해 구체적인 에러 메시지를 사용자에게 노출하여 디버깅을 도와야 합니다.

## 3. 기술 스택 (Tech Stack)
*   **Frontend:** Nuxt.js 3 (Vue 3)
*   **Styling:** TailwindCSS
*   **Backend / DB:** Supabase (PostgreSQL, Auth, Storage)
*   **Language:** JavaScript / TypeScript

## 4. 현재 개발 진행 상황 (Current Status)
**작성일:** 2026년 1월 5일
**단계:** 초기 MVP 개발 및 핵심 기능 구현

### ✅ 구현 완료된 기능
1.  **사용자 인증 (Auth)**
    *   Supabase Auth 연동 (이메일/OAuth).
2.  **게시글 (Posts - 메인 피드)**
    *   목록 조회, 게시글 작성, 삭제 기능 구현.
    *   **[완료]** 이미지 업로드 구현 (한글명 에러 해결을 위해 **영문 난수 변환 로직** 적용).
    *   **[완료]** 게시글 삭제 시 Storage 이미지 자동 삭제 구현.
    *   **[완료]** 작성일(`post_created`) 표시 정상화.
3.  **댓글 (Comments)**
    *   게시글별 댓글 작성, 조회, 삭제 기능 구현.

### ⚠️ 현재 이슈 및 해결 방법 (Pending Actions)
*   **현재 이슈 없음:** 게시판 CRUD 및 이미지 기능 정상 작동 중.
*   **다음 과제:** 퀘스트 기능 기획 및 구현 시작 필요.

## 5. 데이터베이스 구조 & 보안 정책 (Database Schema & RLS)
코드 작성 시 아래 컬럼명과 보안 규칙을 정확히 준수해야 합니다.

### `posts` 테이블 (게시글)
*   **RLS 정책:**
    *   `SELECT`: 누구나 가능 (public)
    *   `INSERT`: 로그인한 사용자만 (authenticated)
    *   `DELETE`: 본인이 작성한 글만 (`auth.uid() = user_id`)

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | bigint | Primary Key (Auto Increment) |
| `user_id` | uuid | 작성자 ID (Auth 연동) |
| `email` | text | 작성자 이메일 |
| `content` | text | 게시글 내용 |
| `image_url` | text | 업로드된 이미지 URL |
| `post_created` | timestamp | **작성일** (주의: created_at 아님) |

### `comments` 테이블 (댓글)
*   **RLS 정책:**
    *   `SELECT`: 누구나 가능 (public)
    *   `INSERT`: 로그인한 사용자만 (authenticated)
    *   `DELETE`: 본인이 작성한 댓글만 (`auth.uid() = user_id`)

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | bigint | Primary Key |
| `post_id` | bigint | FK (posts.id) - On Delete Cascade |
| `user_id` | uuid | 작성자 ID |
| `email` | text | 작성자 이메일 |
| `content` | text | 댓글 내용 |
| `created_at` | timestamp | 작성일 |

## 6. 다음 개발 목표 (Next Steps)
1.  **퀘스트(Quest) 기능 구현:** 사용자가 수행할 미션 UI 및 DB 설계.
2.  **위키(Wiki) 데이터베이스:** 제품 정보 등록 및 수정 기능.
3.  **마이페이지/리포트:** 사용자가 기록한 데이터를 시각화하여 보여주는 대시보드.

## 7. 필수 설정 SQL (Storage)
*이미 적용 완료됨 (참고용)*
```sql
-- Storage 설정 SQL (이미지 업로드/삭제용)
insert into storage.buckets (id, name, public) values ('images', 'images', true);
create policy "Give public access to images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Enable upload for authenticated users" on storage.objects for insert to authenticated with check ( bucket_id = 'images' );
create policy "Enable delete for authenticated users" on storage.objects for delete to authenticated using ( bucket_id = 'images' );
```