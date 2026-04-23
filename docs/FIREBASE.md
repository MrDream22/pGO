# Firebase 설정

## 1. 콘솔에서 활성화

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성.
2. **Authentication** → Sign-in method → **익명** 사용 설정.
3. **Firestore Database** 생성(프로덕션 모드 권장). 위치는 사용자에 가까운 리전.
4. **Storage** 기본 버킷 생성.
5. **Hosting** 연결(Blaze 요금제가 필요한 경우 Storage 대역 등 확인).

## 2. 웹 앱 등록

프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가 → 구성 값을 복사해 [`pGO/js/firebase-config.js`](../pGO/js/firebase-config.js)의 `PGO_FIREBASE_CONFIG`에 붙여 넣습니다.

## 3. CLI 배포

```bash
npm install -g firebase-tools
firebase login
cd /path/to/pGo
cp .firebaserc.example .firebaserc
# .firebaserc 의 프로젝트 ID 수정
firebase deploy --only firestore:rules,storage:rules,hosting
```

[`firebase.json`](../firebase.json)은 `public` 폴더를 사이트 루트로 호스팅합니다. 실제 HTML/JS는 저장소 루트 [`pGO/`](../pGO/)에 두고, [`public/pGO`](../public/pGO)는 그 폴더로의 **심볼릭 링크**입니다. 배포 URL은 `/pGO/dataupload.html` 등이 됩니다. (Windows에서 링크가 안 되면 `pGO` 내용을 `public/pGO`에 그대로 복사해도 됩니다.)

## 4. 보안 규칙

- Firestore: [`firestore.rules`](../firestore.rules)  
  - `spawns` 생성은 인증 사용자만, `imagePath`는 본인 `uploads/{uid}/` 접두사.
  - `caught`는 본인 `uid` 경로에만 생성, 필드 키 제한.
- Storage: [`storage.rules`](../storage.rules)  
  - `uploads/{uid}/**` 읽기는 로그인 사용자, 쓰기는 본인 폴더 + 이미지 + 5MB.

규칙 수정 후 반드시 `firebase deploy --only firestore:rules,storage` 로 반영합니다.

## 5. 인덱스

현재 쿼리는 `spawns` 단일 필드 `active == true` 필터만 사용합니다. 추가 복합 쿼리 시 [`firestore.indexes.json`](../firestore.indexes.json)에 인덱스를 정의합니다.
