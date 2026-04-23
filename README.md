# pGO (웹)

Firebase Hosting에 올리는 **포켓몬 고 스타일** 모바일 웹 프로토타입입니다.

웹 자산은 저장소 루트의 **[`pGO/`](pGO/)** 폴더에 둡니다. Firebase Hosting의 배포 루트는 `public`이며, **`public/pGO` → `pGO` 심볼릭 링크**로 연결되어 사이트 경로는 `/pGO/...` 가 됩니다.

- 업로드: [`pGO/dataupload.html`](pGO/dataupload.html)
- 플레이: [`pGO/getImage.html`](pGO/getImage.html)

## 빠른 시작

1. Firebase 콘솔에서 프로젝트를 만들고 [docs/FIREBASE.md](docs/FIREBASE.md)에 따라 익명 로그인, Firestore, Storage, Hosting을 켭니다.
2. [`pGO/js/firebase-config.example.js`](pGO/js/firebase-config.example.js)를 `pGO/js/firebase-config.js`로 복사한 뒤, Firebase 웹 앱 설정 값을 넣습니다. [`pGO/js/google-maps-config.example.js`](pGO/js/google-maps-config.example.js)도 동일하게 `google-maps-config.js`로 복사해 Maps API 키를 넣습니다.
3. 규칙 배포:

```bash
firebase deploy --only firestore:rules,storage
```

4. 호스팅 배포:

```bash
cp .firebaserc.example .firebaserc   # 프로젝트 ID 편집
firebase deploy --only hosting
```

배포 후 URL 예시:

- `https://<your-hosting-domain>/pGO/dataupload.html`
- `https://<your-hosting-domain>/pGO/getImage.html`

## 로컬에서 파일만 열어보기

`file://` 로 열면 Geolocation 등이 막힐 수 있습니다. 로컬 HTTP로 띄우세요.

```bash
cd public && python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080/pGO/getImage.html` — 일부 기능은 HTTPS 배포 환경에서만 정상입니다.

## 문서

| 문서 | 내용 |
|------|------|
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | 요구사항·수용 기준 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 구조·데이터·흐름 |
| [docs/FIREBASE.md](docs/FIREBASE.md) | 콘솔 설정·규칙·배포 |
| [docs/MOBILE_LIMITATIONS.md](docs/MOBILE_LIMITATIONS.md) | 모바일 웹 제약·QA 체크리스트 |

## 상수 튜닝

근접 거리(미터)는 [`pGO/getImage.html`](pGO/getImage.html) 상단 스크립트의 `PROXIMITY_M` 값으로 조정합니다.
