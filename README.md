# JOB★QUEST

던글랜드(Dongle Land) 픽셀 아케이드 스타일 직업 선택 화면입니다.
Vite + React + TypeScript로 만들어졌고, 기존 프로토타입(job-quest.html)과 동일하게 동작하도록 이식했습니다.

## 로컬 개발 (VS Code)

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 빌드

```bash
npm run build   # dist/ 폴더에 정적 파일 생성
npm run preview # 빌드 결과 로컬 미리보기
```

## 프로젝트 구조

```
src/
  App.tsx        # 전체 화면 마크업 (JSX)
  App.css        # 전체 스타일 (원본 프로토타입의 <style> 그대로 이식)
  gameLogic.ts   # 게임 로직 전체 (원본 <script>를 그대로 이식, 상태관리는 React state가 아닌
                 # DOM 조작 방식 그대로 유지 — 동작을 100% 동일하게 보존하기 위함)
  data/jobs.ts   # 직업 목록 (이미지 import 포함)
  assets/jobs/   # 직업별 이미지 파일 (대장장이/연금술사/요리사/농부/다이버)
```

> `gameLogic.ts`는 원본 vanilla JS를 그대로 옮긴 파일이라 `// @ts-nocheck`가 붙어 있어요.
> 추후 React state 기반으로 리팩토링하고 싶으면 이 파일부터 손보면 됩니다.

## GitHub + Vercel 배포

1. 이 폴더를 GitHub 저장소로 push
   ```bash
   git init
   git add .
   git commit -m "Initial commit: JOB★QUEST"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)에서 "Add New → Project" → 방금 만든 GitHub 저장소 선택
3. Framework Preset은 **Vite**로 자동 인식됩니다 (Build Command: `vite build`, Output Directory: `dist`) — 별도 설정 없이 바로 Deploy 하면 됩니다.

## 참고

- 폰트: `NeoDunggeunGothicPro` (jsDelivr CDN, `@font-face`로 로드)
- 사운드 효과는 별도 오디오 파일 없이 Web Audio API로 직접 합성해서 재생합니다.
- 이미지 선명화를 위해 SVG `feConvolveMatrix` 필터(`#sharpenFilter`)를 사용합니다.
