# 📂 프로젝트 현황 보고서: JH바이오팜 템플릿 개발 프로젝트

> **이 문서는 프로젝트의 방향성과 모든 컨텍스트를 담고 있는 "마스터 인계장"입니다. 새로운 세션 시작 시 반드시 이 파일을 정독하고 업무를 시작하십시오.**

---

## 1. 프로젝트 핵심 목표 (Core Objectives)
본 프로젝트는 단일 서비스를 만드는 것이 아니라, **다양한 아이디어를 즉시 검증할 수 있는 소프트웨어 템플릿(프레임워크)을 구축**하는 것입니다.

### 🚩 Two-Track 전략
1.  **Track 1. 버티컬 커뮤니티 템플릿 (현재 진행 중)**
    *   **목표:** 특정 관심사(Vertical)를 가진 사람들을 모아 시장성을 검증하는 커뮤니티 구축용 템플릿.
    *   **특징:** 주제가 바뀌어도(예: 반려동물 → 와인 → 육아) 즉시 대응 가능한 **모듈형 구조** 지향.
    *   **Pilot Project:** **오픈펫케어랩 (반려동물)**을 통해 템플릿을 개발 및 검증 중.
2.  **Track 2. 광고 수익형 콘텐츠 템플릿 (향후 예정)**
    *   **목표:** 사주, 심리테스트 등 트래픽 기반 광고 수익 창출 모델.
    *   **타겟:** 글로벌(영어권, 동남아 등) 시장.

---

## 2. Gemini 행동 요령 & 코딩 컨벤션 (Guidelines)
**이 프로젝트를 수행하는 모든 AI 에이전트는 아래 규칙을 엄수해야 합니다.**

### 🔹 개발 및 아키텍처 원칙 (Architecture)
1.  **템플릿화(Templating):** 코드를 작성할 때 특정 도메인(반려동물)에 너무 종속되지 않도록 **범용적 설계**를 지향하십시오.
2.  **관심사 분리(Separation of Concerns):**
    *   `pages/`는 레이아웃과 데이터 로딩(`fetch`)만 담당합니다.
    *   복잡한 UI와 로직은 반드시 `components/`로 분리하십시오. (예: `PostForm`, `PostItem`)
3.  **상태 관리(State Management):**
    *   여러 컴포넌트가 공유하는 데이터(게시글 목록 등)는 `ref` 대신 **`useState`**를 사용하여 데이터 동기화를 보장하십시오.

### 🔹 UI/UX 방어 코드 (Safety First)
1.  **로딩 상태 필수:** 모든 서버 통신(저장, 삭제, 업로드) 버튼에는 `isSubmitting`, `isDeleting` 등의 로딩 상태를 적용하십시오.
2.  **중복 방지:** 로딩 중에는 버튼을 `disabled` 처리하여 중복 클릭을 원천 차단하십시오.
3.  **에러 피드백:** 실패 시 `alert` 등을 통해 사용자에게 명확한 이유를 알려주십시오.

### 🔹 코딩 스타일 (Coding Style)
1.  **가독성 우선:** 변수명과 함수명은 줄임말보다는 **의미가 명확히 전달되도록 풀어서 작성**하십시오.
2.  **주석 규칙:** 문장형 서술을 피하고, **핵심 기능만 간결하게 명시**하십시오.
    *   *Bad:* `// 이 함수는 사용자가 입력한 이메일 주소가 유효한지 검사합니다.`
    *   *Good:* `// 이메일 유효성 검사`

### 🔹 시스템 관리 원칙
1.  **로그 업데이트 (최우선):** 유의미한 작업 후에는 반드시 이 파일(`conversation_log.md`)을 즉시 업데이트하십시오. (자동 프로토콜)
2.  **DB 컬럼명:** `posts` 테이블의 날짜는 `post_created`, `comments`는 `created_at`입니다.
3.  **이미지 처리:**
    *   파일명은 반드시 **영문 난수(Random String)**로 변환하여 저장.
    *   데이터 삭제 시 **Storage 파일도 반드시 동반 삭제** (`decodeURIComponent` 필수).

---

## 3. 기술 스택 (Tech Stack)
*   **Frontend:** Nuxt.js 3 (Vue 3)
*   **Styling:** TailwindCSS
*   **Backend / DB:** Supabase (PostgreSQL, Auth, Storage)
*   **Language:** JavaScript / TypeScript

## 4. 현재 개발 진행 상황 (Current Status)
**작성일:** 2026년 1월 5일
**단계:** Track 1 (커뮤니티 템플릿) - MVP 모듈화 개발 및 안정화 완료

### ✅ 구현된 템플릿 모듈 (Modules)
1.  **인증 모듈 (Auth)**
    *   Supabase Auth 연동 (이메일/OAuth).
2.  **피드/게시판 모듈 (Board) - [현업 수준 리팩토링 완료]**
    *   **구조 개선:** `PostForm`(입력), `PostItem`(조회), `index`(배치)로 컴포넌트 분리 완료.
    *   **상태 동기화:** `useState` 적용으로 글 작성 시 목록 자동 갱신 구현.
    *   **UX 강화:** 저장/삭제 시 로딩 인디케이터 및 중복 클릭 방지 적용.
    *   **기능:** 이미지 업로드(난수명), 삭제(스토리지 연동), 댓글 시스템 정상 작동.

### ⚠️ 현재 이슈 및 해결 방법
*   **현재 이슈 없음:** 게시판 모듈 안정화 완료.

---

## 5. 데이터베이스 구조 & 보안 정책 (Database Schema & RLS)
템플릿의 기반이 되는 핵심 테이블 구조입니다.

### `posts` 테이블 (게시글/피드)
*   **RLS:** 누구나 조회 / 로그인 유저 작성 / 본인 글 삭제
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | bigint | PK (Auto Increment) |
| `user_id` | uuid | 작성자 ID (Auth 연동) |
| `email` | text | 작성자 이메일 |
| `content` | text | 내용 |
| `image_url` | text | 이미지 URL |
| `post_created` | timestamp | **작성일** (created_at 아님) |

### `comments` 테이블 (댓글)
*   **RLS:** 누구나 조회 / 로그인 유저 작성 / 본인 댓글 삭제
| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | bigint | PK |
| `post_id` | bigint | FK (posts.id) |
| `user_id` | uuid | 작성자 ID |
| `email` | text | 작성자 이메일 |
| `content` | text | 내용 |
| `created_at` | timestamp | 작성일 |

---

## 6. 필수 설정 SQL (Storage)
*이미 적용 완료됨 (참고용)*
```sql
-- Storage 설정 SQL (이미지 업로드/삭제용)
insert into storage.buckets (id, name, public) values ('images', 'images', true);
create policy "Give public access to images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Enable upload for authenticated users" on storage.objects for insert to authenticated with check ( bucket_id = 'images' );
create policy "Enable delete for authenticated users" on storage.objects for delete to authenticated using ( bucket_id = 'images' );
```

---

## 7. 다음 개발 목표 (Next Steps)
**'범용 퀘스트(미션) 모듈' 개발**
*   **목표:** 사용자의 행동을 유도하는 Gamification 시스템 구축.
*   **Pilot 적용:** 반려동물 변 상태 기록, 사료 급여 인증 등.
*   **설계 방향:** `quests` (미션 정보) + `user_quest_logs` (수행 기록) 형태로 설계하여 주제가 바뀌어도 데이터만 바꾸면 되도록 구현.