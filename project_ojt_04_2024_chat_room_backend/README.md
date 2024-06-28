# Rikkeisoft (DN1) training Rikkei Academy (202311)

## 1. Overview

- Rikkeisoft (DN1) training Rikkei Academy (202311)

## 2. Prerequisite

- [NodeJS](https://nodejs.org) (v18)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## 3. Techniques
- [NestJS](https://docs.nestjs.com/) (v10)
- [MySQL](https://dev.mysql.com/doc/refman/8.0/en/) (v8.0)
- [TypeORM](https://docs.nestjs.com/techniques/database)

## 4. Directory Structure
```
├───database/
│   └───migrations/
│           {timestamp}-create-xxx-table.ts
│           {timestamp}-create-yyy-table.ts
├───src/
│   │   app.module.ts
│   │   main.ts
│   │   @core/ # Lõi chứa các lớp xử lý chung
│   │   @config/ # Thiết lập thông số cấu hình
│   │   └───xxx.config.ts
│   │   └───yyy.config.ts
│   │   @utilities/ # Chứa các lớp tiện ích xử lý
│   └─── Modules
│           │  
│        {module-name}
│           │   {module-name}.module.ts
│           ├───controllers # Layer điều hướng request
│           │       xxx.controller.ts
│           │       yyy.controller.ts
│           ├───enums # Chứa các định nghĩa hằng số
│           │       xxx.enum.ts
│           │       yyy.enum.ts
│           ├───entities # Chứa thực thể mapping với bảng trong cơ sở dữ liệu
│           │       xxx.entity.ts
│           │       yyy.entity.ts
│           ├───services # Layer xử lý logic
│           │       xxx.service.ts
│           │       yyy.service.ts
│           ├───requests # Chứa định nghĩa các request resources (bao gồm validation)
│           │       xxx-search.request.ts
│           │       xxx-create.request.ts
│           │       xxx-update.request.ts
│           │       yyy-search.request.ts
│           │       yyy-create.request.ts
│           │       yyy-update.request.ts
│           └───responses # Chứa định nghĩa các response resources
│                   xxx.response.ts
│                   yyy.response.ts
```

## 5. Hướng dẫn Docker

### 5.1. Start docker containers
Chạy Terminal ở thư mục này

```bash
$ docker compose up -d
```

> Lưu ý: trước khi thực hiện cần bật sẵn phần mềm Docker

### 5.2. Một số câu lệnh thường sử dụng
|No.|Command|Mục đích|
|---|-------|--------|
|1| docker compose up -d| Start docker containers|
|2| docker compose stop| Stop docker containers|
|3| docker compose down| Down docker containers|

###### Reference
- [Docker compose command lines](https://docs.docker.com/engine/reference/commandline/compose/)

## 6. Installation

### 6.1. Install Yarn

Chạy Terminal bằng quyền Admin

```bash
$ npm install -g yarn
```

### 6.2. Install dependencies
Chạy Terminal ở thư mục này

```bash
$ yarn install
```

## 7. Database migration
Chạy Terminal ở thư mục này

```bash
# Create a migration file
$ yarn typeorm migration:create ./database/migrations/{migration-name}
# Example
$ yarn typeorm migration:create ./database/migrations/create-users-table

# Run
$ yarn migration:run
```

## 8. Running the app
Chạy Terminal ở thư mục này

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 9. Code quality
Chạy Terminal ở thư mục này

```bash
# Format code (bắt buộc chạy trước khi commit code)
$ yarn format

# Lint code (bắt buộc chạy trước khi commit code)
$ yarn lint
```

## 10. Build
Chạy Terminal ở thư mục này

```bash
# Build (bắt buộc chạy trước khi commit code)
$ yarn build
```

## 11. Kết nối
### 11.1. Kết nối cơ sở dữ liệu

Sử dụng MySQL Workbench và kết nối theo thông tin dưới đây

|Name|Value|
|---|---|
|Protocol| `IP/TCP` |
|Host|`127.0.0.1`|
|Port|`3307`|
|User|`rikkei`|
|Password|`Password123`|
|Database|`dn1_ra_202311`|

### 12.2. Kết nối API

- Base URL: http://127.0.0.1:3000/

## 13. References
- [NestJS Controller](https://docs.nestjs.com/controllers)
- [NestJS Provider](https://docs.nestjs.com/providers)
- [NestJS Module](https://docs.nestjs.com/modules)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [NestJS Class Validator](https://docs.nestjs.com/pipes#class-validator)
- [TypeORM](https://typeorm.io/)
- [TypeORM Migrations](https://typeorm.io/migrations#creating-a-new-migration)
