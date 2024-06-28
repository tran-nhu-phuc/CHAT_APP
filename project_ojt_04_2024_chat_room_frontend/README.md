## Overview
- Rikkeisoft (DN1) training Rikkei Academy (202311)

## 2. Prerequisite

- [NodeJS](https://nodejs.org) (v18)
- [TypeScript](https://www.typescriptlang.org/)

## 3. Techniques
- [ReactJS](https://legacy.reactjs.org/) (v18)
- [react-bootstrap](https://react-bootstrap.netlify.app/) (2.8)
- [@reduxjs/toolkit](https://redux-toolkit.js.org/) (1.9)

## 4. Directory structure
```
└───src
    │   App.tsx
    │   index.tsx
    ├───apis/                           # Chứa định nghĩa liên quan tới API
    │   │   base.api.ts
    │   └───{xxx}/
    │       └───{yyy}/
    │           │   index.ts            # Định nghĩa API endpoints
    │           ├───requests/           # Định nghĩa API request types
    │           └───responses/          # Định nghĩa API response types
    ├───assets/                         # Chứa các static files
    ├───components/                     # Chứa các components
    │   ├───atoms/                     # Common components liên quan tới atoms (input/button)
    │   ├───molecules/                       # Common components liên quan tới molecules (search bar, Input group)
    │   ├───organisms/                   # Common components liên quan tới organisms (Sidebar, Header, Footer)
    │   └───templates/                      # Components dành cho các layout, cụm chức năng
    ├───pages/                          # Chứa các page components
    │   │   DashboardPage.tsx
    │   │   LoginPage.tsx
    │   ├───{xxx}/
    │   └───{yyy}/
    ├───routes/                         # Định nghĩa các routes
    ├───store/
    │   │   index.ts                    # Khởi tạo redux store
    │   └───slices/                    # Chứa các redux slices
    │           xxx.slice.ts
    │           yyy.slice.ts
    │
    ├───types/                          # Chứa các định nghĩa types
    └───utilities/                      # Chứa các xử lý common
            xxx.util.ts
            yyy.util.ts
```

## 5. Installation

Chạy Terminal ở thư mục này
```bash
$ yarn install
```

## 6. Running the app
Chạy Terminal ở thư mục này
```bash
# development
$ yarn dev
```

## 7. Code quality
Chạy Terminal ở thư mục này

```bash
# Format code (bắt buộc chạy trước khi commit code)
$ yarn format

# Lint code (bắt buộc chạy trước khi commit code)
$ yarn lint
```

## 8. Build
Chạy Terminal ở thư mục này

```bash
# Build (bắt buộc chạy trước khi commit code)
$ yarn build
```
