# frontend

4조 프로젝트 프론트엔드 레포입니다.

## 브렌치 전략

- main: 완성된 코드가 올라옵니다.
- dev: 기능개발이 완료된 코드가 합쳐집니다.
- feature: 기능개발이 진행됩니다.

![image](https://user-images.githubusercontent.com/97277365/222688335-2270edd3-7375-4e13-b6ff-756232d752d3.png)

-핫픽스는 없습니다.

</br>

## 풀리퀘 규칙

- 3명이상의 승인을 받아야 머지를 할 수 있습니다.
- 승인을 받으면 풀리퀘를 작성하신 분이 직접 머지를 합니다.
- main 브렌치를 직접적으로 수정하지 않습니다.
- 작업시 각자 브렌치를 만들어 작업합니다.
- 머지가 끝난 브렌치는 삭제합니다.
  </br>

## 브렌치 생성 방법

### cli 환경에서 브랜치 생성

```
git clone [레포주소]
git checkout -b 브랜치이름

// 작업완료 후
git push origin [브랜치이름]
```

- 브렌치 이름은 자신의 작업을 나타낼 수 있는 이름으로 사용합니다.
- feature/{기능요약} ex) 메인페이지를 만드는 경우 feature/MainPage

### github 에서 브랜치 만들기

![image](https://user-images.githubusercontent.com/97277365/222694689-30f1c1b2-d628-45f9-9793-074af146ee84.png)

- view all branches를 눌러서 들어갑니다.

![image](https://user-images.githubusercontent.com/97277365/222694887-7f09143b-6924-4bb8-b27f-bf4dc3b5699d.png)

- 우측 상단 new branch를 누릅니다.

![image](https://user-images.githubusercontent.com/97277365/222695033-b0f54ec9-f307-49f1-af38-e2be87bfff31.png)

- branch source 를 dev 변경한 뒤

![image](https://user-images.githubusercontent.com/97277365/222695202-b876c9ab-3625-46f3-9b9f-7a50084258e6.png)

- 브렌치 이름을 작성하고 create branch를 클릭합니다.
- 새로운 브랜치가 만들어집니다!

![image](https://user-images.githubusercontent.com/97277365/222696481-b5b5c157-4274-4a06-9e7d-68c7e01c6edf.png)

- 로컬에서 git clone을 한 후
- git checkout [자신이 만든 브랜치 이름] 을 입력하여 브랜치를 전환합니다.
- 작업을 시작하시면 됩니다 :)
