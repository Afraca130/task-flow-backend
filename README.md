<div align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</div>

<div align="center">
  <p>A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  
  <p>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
    </a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank">
      <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
    </a>
  </p>
  
  <p>
    <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
      <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
    </a>
    <a href="https://discord.gg/G7Qnnhy" target="_blank">
      <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
    </a>
    <a href="https://opencollective.com/nest#backer" target="_blank">
      <img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" />
    </a>
  </p>
  
  <p>
    <a href="https://opencollective.com/nest#sponsor" target="_blank">
      <img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" />
    </a>
    <a href="https://paypal.me/kamilmysliwiec" target="_blank">
      <img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/>
    </a>
    <a href="https://twitter.com/nestframework" target="_blank">
      <img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter">
    </a>
  </p>
</div>

---

# TaskFlow Backend

<div align="center">
  <h3>🚀 Modern Project Management Backend API</h3>
  <p>Built with NestJS, following Clean Architecture principles and comprehensive Swagger documentation.</p>
</div>

## 📋 목차

- [개요](#-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [아키텍처](#-아키텍처)
- [빠른 시작](#-빠른-시작)
- [API 문서](#-api-문서)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [설정](#-설정)
- [테스트](#-테스트)
- [배포](#-배포)

## 🚀 개요

TaskFlow Backend는 팀 협업, 작업 관리, 프로젝트 추적을 위한 강력하고 확장 가능한 API입니다. 실시간 알림과 상세한 활동 로깅을 제공합니다.

## ✨ 주요 기능

<table>
  <tr>
    <td align="center" width="50%">
      <h4>🔐 인증 및 보안</h4>
      <ul align="left">
        <li>JWT 기반 인증 (Refresh Token)</li>
        <li>역할 기반 접근 제어</li>
        <li>bcrypt 패스워드 해싱</li>
        <li>API 키 지원</li>
      </ul>
    </td>
    <td align="center" width="50%">
      <h4>📊 프로젝트 관리</h4>
      <ul align="left">
        <li>완전한 프로젝트 생명주기 관리</li>
        <li>상태 추적 시스템</li>
        <li>우선순위 레벨 관리</li>
        <li>멤버 초대 시스템</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <h4>✅ 작업 관리</h4>
      <ul align="left">
        <li>포괄적인 작업 시스템</li>
        <li>작업 우선순위 및 할당</li>
        <li>마감일 관리</li>
        <li>대량 작업 지원</li>
      </ul>
    </td>
    <td align="center" width="50%">
      <h4>🐛 이슈 추적</h4>
      <ul align="left">
        <li>버그 리포트 시스템</li>
        <li>기능 요청 관리</li>
        <li>이슈 타입 분류</li>
        <li>프로젝트 워크플로우 통합</li>
      </ul>
    </td>
  </tr>
</table>

<div align="center">
  <h4>📢 추가 기능</h4>
  <p>
    <strong>💬 계층형 댓글 시스템</strong> • 
    <strong>🔔 실시간 알림</strong> • 
    <strong>📋 활동 로깅</strong> • 
    <strong>👥 사용자 관리</strong>
  </p>
</div>

## 🛠 기술 스택

<div align="center">
  <table>
    <tr>
      <th>카테고리</th>
      <th>기술</th>
    </tr>
    <tr>
      <td align="center"><strong>Framework</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Language</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Database</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
        <img src="https://img.shields.io/badge/TypeORM-FF6B6B?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Authentication</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Documentation</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Testing</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest">
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Deployment</strong></td>
      <td align="center">
        <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
      </td>
    </tr>
  </table>
</div>

## 🏗 아키텍처

### Clean Architecture 구현

```
src/
├── application/           # 애플리케이션 계층
│   ├── auth/             # 인증 유스케이스
│   ├── project/          # 프로젝트 관리
│   ├── task/             # 작업 관리
│   ├── issue/            # 이슈 추적
│   ├── comment/          # 댓글 시스템
│   ├── notification/     # 알림 시스템
│   ├── activity-log/     # 활동 로깅
│   └── user/             # 사용자 관리
├── domain/               # 도메인 계층
│   ├── entities/         # 핵심 비즈니스 엔티티
│   └── */               # 도메인 서비스 & 리포지토리
├── common/               # 공통 유틸리티
│   ├── decorators/       # 커스텀 데코레이터
│   ├── guards/           # 인증 가드
│   ├── interceptors/     # 인터셉터
│   └── enums/           # 애플리케이션 열거형
└── main.ts              # 애플리케이션 진입점
```

<div align="center">
  <h4>계층별 책임</h4>
  <table>
    <tr>
      <td align="center"><strong>Domain Layer</strong></td>
      <td>핵심 비즈니스 엔티티와 규칙</td>
    </tr>
    <tr>
      <td align="center"><strong>Application Layer</strong></td>
      <td>유스케이스와 비즈니스 로직 오케스트레이션</td>
    </tr>
    <tr>
      <td align="center"><strong>Infrastructure Layer</strong></td>
      <td>외부 어댑터 (데이터베이스, 이메일 등)</td>
    </tr>
    <tr>
      <td align="center"><strong>Presentation Layer</strong></td>
      <td>컨트롤러, DTO, API 문서</td>
    </tr>
  </table>
</div>

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18+
- PostgreSQL 13+
- npm 또는 yarn

### 설치

**1. 저장소 클론**

```bash
git clone <repository-url>
cd TaskFlowBackend
```

**2. 의존성 설치**

```bash
npm install
```

**3. 환경 설정**

```bash
cp .env.example .env
# 환경 변수 구성하기
```

**4. 데이터베이스 설정**

```bash
# 데이터베이스 생성
createdb taskflow

# 마이그레이션 실행 (있는 경우)
npm run typeorm:migration:run
```

**5. 개발 서버 시작**

```bash
npm run start:dev
```

<div align="center">
  <h3>🎉 API가 실행되었습니다!</h3>
  <p>
    <strong>API Base URL:</strong> <code>http://localhost:3000</code><br>
    <strong>Swagger 문서:</strong> <code>http://localhost:3000/api/docs</code>
  </p>
</div>

## 📚 API 문서

### Swagger/OpenAPI 기능

<div align="center">
  <table>
    <tr>
      <td align="center">🔍 <strong>대화형 API 탐색기</strong></td>
      <td>브라우저에서 직접 엔드포인트 테스트</td>
    </tr>
    <tr>
      <td align="center">📖 <strong>완전한 스키마 문서</strong></td>
      <td>모든 DTO와 엔티티 문서화</td>
    </tr>
    <tr>
      <td align="center">🔐 <strong>인증 예제</strong></td>
      <td>JWT 및 API 키 인증</td>
    </tr>
    <tr>
      <td align="center">⚠️ <strong>에러 응답 예제</strong></td>
      <td>표준화된 에러 형식</td>
    </tr>
  </table>
</div>

**문서 접근:** `http://localhost:3000/api/docs`

### 주요 API 엔드포인트

<details>
<summary><strong>🔐 Authentication</strong></summary>

```
POST   /auth/register         # 사용자 등록
POST   /auth/login           # 사용자 로그인
POST   /auth/refresh         # 토큰 갱신
```

</details>

<details>
<summary><strong>📊 Projects</strong></summary>

```
GET    /projects             # 프로젝트 목록
POST   /projects             # 프로젝트 생성
GET    /projects/:id         # 프로젝트 상세
PATCH  /projects/:id         # 프로젝트 수정
DELETE /projects/:id         # 프로젝트 삭제
```

</details>

<details>
<summary><strong>✅ Tasks</strong></summary>

```
GET    /tasks                # 작업 목록
POST   /tasks                # 작업 생성
GET    /tasks/:id            # 작업 상세
PATCH  /tasks/:id            # 작업 수정
DELETE /tasks/:id            # 작업 삭제
```

</details>

<details>
<summary><strong>🐛 Issues</strong></summary>

```
GET    /issues               # 이슈 목록
POST   /issues               # 이슈 생성
GET    /issues/:id           # 이슈 상세
PATCH  /issues/:id           # 이슈 수정
DELETE /issues/:id           # 이슈 삭제
```

</details>

## 🗄 데이터베이스 스키마

### 핵심 엔티티

<div align="center">
  <table>
    <tr>
      <th>엔티티</th>
      <th>설명</th>
    </tr>
    <tr>
      <td><strong>User</strong></td>
      <td>사용자 프로필 및 인증</td>
    </tr>
    <tr>
      <td><strong>Project</strong></td>
      <td>프로젝트 정보 및 설정</td>
    </tr>
    <tr>
      <td><strong>ProjectMember</strong></td>
      <td>역할을 가진 프로젝트 멤버십</td>
    </tr>
    <tr>
      <td><strong>Task</strong></td>
      <td>상태 추적이 있는 작업 관리</td>
    </tr>
    <tr>
      <td><strong>Issue</strong></td>
      <td>이슈 추적 및 버그 리포트</td>
    </tr>
    <tr>
      <td><strong>Comment</strong></td>
      <td>계층형 댓글 시스템</td>
    </tr>
    <tr>
      <td><strong>Notification</strong></td>
      <td>사용자 알림 시스템</td>
    </tr>
    <tr>
      <td><strong>ActivityLog</strong></td>
      <td>포괄적인 감사 로깅</td>
    </tr>
  </table>
</div>

## 🔧 설정

### 환경 변수

```env
# 데이터베이스 설정
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=taskflow

# JWT 설정
SUPABASE_JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# 애플리케이션 설정
NODE_ENV=development
PORT=3000
API_PREFIX=v1

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov

# 감시 모드
npm run test:watch
```

## 📦 배포

### Vercel 배포

애플리케이션은 Vercel 서버리스 배포용으로 구성되어 있습니다.

```bash
npm install -g vercel
vercel --prod
```

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 개발 가이드라인

- Clean Architecture 원칙 준수
- 포괄적인 테스트 작성
- Swagger 문서 업데이트
- TypeScript 모범 사례 준수
- 컨벤셔널 커밋 사용

## 🚀 로드맵

- [ ] WebSocket을 사용한 실시간 협업
- [ ] 파일 첨부 시스템
- [ ] 고급 리포팅 및 분석
- [ ] 모바일 앱 API 최적화
- [ ] GraphQL API 지원
- [ ] 고급 검색 및 필터링
- [ ] 통합을 위한 웹훅 시스템

---
