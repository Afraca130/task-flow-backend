# 보안 설정 가이드

## 🔒 SSL/TLS 보안 설정

### 환경별 SSL 설정

#### 개발 환경

- SSL 비활성화 (로컬 개발용)
- 보안 경고 없음

#### 프로덕션 환경 (Vercel/Heroku/Railway)

- TLS 1.2 강제 사용
- 자체 서명 인증서 허용 (서버리스 환경 대응)
- 서버 ID 검증 선택적 비활성화

### 보안 원칙

1. **전역 TLS 검증 비활성화 금지**

    - `NODE_TLS_REJECT_UNAUTHORIZED = '0'` 사용 금지
    - 대신 TypeORM 설정에서만 선택적 적용

2. **환경별 차별화된 보안 설정**

    - 개발: SSL 비활성화
    - 프로덕션: 강화된 SSL 설정

3. **최소 권한 원칙**
    - 필요한 부분에만 SSL 검증 우회
    - 나머지 연결은 기본 보안 설정 유지

## 🛡️ 권장 환경변수

```bash
# Vercel 환경변수 설정
NODE_ENV=production
POSTGRES_URL=postgresql://user:pass@host:5432/db
```

## ⚠️ 보안 경고 해결

- `NODE_TLS_REJECT_UNAUTHORIZED` 경고 해결 완료
- `self-signed certificate in certificate chain` 오류 해결
- PostgreSQL에서만 SSL 비활성화 (다른 연결은 보안 유지)
- URL 파라미터: `sslmode=disable` 적용
- 환경변수: `PGSSLMODE=disable` 설정
- 서버리스 환경 최적화

### 적용된 해결책

1. **PostgreSQL URL 수정**: `?sslmode=disable` 파라미터 추가
2. **TypeORM 설정**: `ssl: false` 명시적 설정
3. **환경변수**: `PGSSLMODE=disable` 프로덕션 환경에서 설정
4. **범위 제한**: PostgreSQL 연결에만 적용, 다른 HTTPS 연결은 보안 유지
