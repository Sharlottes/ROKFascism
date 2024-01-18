# Project: F.O.K.

## 개요

**Project: F.O.K.** 는 파시즘으로 타락한 대한민국이 혼란스러운 국제 정세 속에서 동북아시아와 전쟁하는 배경의 Mindustry 맵입니다.
이 레포지토리는 맵에서 사용되는 스크립트 및 데이터, 자료들을 저장한 저장소입니다.

- `/assets`: 비-소스코드 리소스들입니다. 시나리오, 코어 위치 등 여러 자료들을 담고 있습니다.
- `/scripts`: 인게임 런타임에 직접적으로 사용되진 않는 스크립트들입니다. watcher 모드, 맵 규칙 설정 자동화 등 여러 편의성 스크립트들이 있습니다.
- `/src`: world processor의 소스 코드입니다. 소스코드는 mlogjs에 의해 mlog(mindustry logic) 언어로 컴파일됩니다.

## 시작하기

`/src`에 있는 타입스크립트의 타입 정의는 **기본 정의가 아닙니다.** `npm i -g mlogjs` 명령어로 mlogjs를 설치하고 `mlogjs setup` 명령어로 이 CLI가 타입 정의를 `lib` 폴더 내에 세팅하게끔 만들어야 합니다. 또한 `/scripts`의 일부 스크립트들은 Node.js에서 실행되므로 타입 정의가 필요합니다. 그러므로 `npm i` 명령어로 타입 정의 패키지도 다운해야 합니다.

컴파일은 `yarn watch` 스크립트 명령어를 통해 손쉽게 모든 소스코드를 워치 모드로 컴파일할 수 있습니다.
그러나 컴파일을 위해선 로컬 mlogjs가 필요합니다.

## 로컬 MLogJS 셋업하기

Mlogjs는 Typescript를 유사 어셈블리 언어인 MLog(Mindustry Logic)로 컴파일하는 컴파일러입니다.  
Mlogjs는 컴파일을 위해 CLI를 기본적으로 제공해주고 있으며, Mindustry BE 버전에 대한 개발이 진행중입니다.  
그러나 별도의 베타 버전이 없으므로 직접 git clone하여 사용해야 합니다.

```
mkdir local_mlogjs
git clone https://github.com/mlogjs/mlogjs local_mlogjs
cd local_mlogjs
git switch mindustry-v147-features
pnpm install
pnpm -C compiler build
cd ..
pnpm install ./local_mlogjs/compiler

# run mlogjs
pnpm exec mlogjs file --watch
```
