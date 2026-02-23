# CLAUDE.md — Therapist Frontend

## 1. 프로젝트 개요

**프로젝트명**: Therapist Frontend

헬스케어 예약 서비스의 React 기반 프론트엔드 웹앱. React Native 앱에서 웹뷰로 임베딩되어 사용됨.

> 기술 스택은 `package.json`의 `dependencies` / `devDependencies`를 참조할 것.

### 주요 컨벤션

- 컴포넌트명: PascalCase
- 파일명: camelCase (컴포넌트 파일은 PascalCase)
- API 파일: `*.api.ts`
- 브랜치 명: `feat/기능명`, `fix/버그명`, `chore/작업명`
- 테스트: Jest + ts-jest (`.test.ts`, `.spec.ts`)

---

## 2. 라이브러리 관련 질문 — Context7 MCP 사용

라이브러리 API, 사용법, 최신 문법에 대한 질문 시 반드시 **Context7 MCP**를 활용하여 최신 문서를 조회한다.

```
# 순서:
1. mcp__plugin_context7_context7__resolve-library-id 로 라이브러리 ID 조회
2. mcp__plugin_context7_context7__query-docs 로 문서 검색
```

대상 예시: React Query, Zustand, React Router, MUI, Axios, Firebase, Vite, Tailwind CSS 등 프로젝트 내 모든 외부 라이브러리.

---

## 3. React 코드 작성 — vercel-react-best-practices 스킬 참조

React 컴포넌트 작성, 리팩토링, 성능 최적화 시 반드시 아래 스킬을 참조한다.

```
Skill: vercel-react-best-practices
```

트리거 조건:

- React 컴포넌트 신규 작성
- 기존 컴포넌트 리팩토링
- 데이터 페칭 로직 작성 (React Query 포함)
- 번들 최적화, 성능 개선 작업
- Vite 설정 변경

---

## 4. 업무 단계별 Superpowers 스킬 사용

아래 표에 따라 작업 단계에 맞는 스킬을 **반드시** 먼저 호출한다.

| 상황 | 사용할 스킬 |
|------|------------|
| 새 기능/컴포넌트 구현 전 아이디어 탐색 | `superpowers:brainstorming` |
| 멀티스텝 작업 계획 수립 | `superpowers:writing-plans` |
| 수립된 계획 실행 | `superpowers:executing-plans` |
| 기능 구현 / 버그 수정 코드 작성 | `superpowers:test-driven-development` |
| 버그 / 테스트 실패 / 예상치 못한 동작 발생 | `superpowers:systematic-debugging` |
| 독립적인 2개 이상의 작업 병렬 처리 | `superpowers:dispatching-parallel-agents` |
| 작업 완료 후 검증 전 | `superpowers:verification-before-completion` |
| PR 생성 / 머지 전 코드 리뷰 요청 | `superpowers:requesting-code-review` |
| 코드 리뷰 피드백 수신 후 | `superpowers:receiving-code-review` |
| 개발 브랜치 작업 완료 | `superpowers:finishing-a-development-branch` |
| 격리된 워크트리에서 작업 필요 | `superpowers:using-git-worktrees` |
