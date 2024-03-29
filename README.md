# Erasys Task

Steps
------
- [Set up](#set-up)
- [Configuring Database](#configuring-database)
- [Running The Test](#running-the-test)
- [Validate Passwords](#validate-passwords)
- [Check Compromised Passwords](#check-compromised-passwords)
- [Validate and Check Compromised Passwords](#validate-and-check-compromised-passwords)


Set up
------
First, build docker container and run:

```bash
docker-compose build && docker-compose up -d
```

Configuring Database
------
You can set database configurations, use the following values in .env which lives in the root directory.

```
DATABASE_CLIENT=mysql
DATABASE_HOST=erasys-db
DATABASE_USER=testDbUser
DATABASE_PASSWORD=PRYjQRlcSIBMORtp
DATABASE_NAME=testDb
DATABASE_PORT=3306
```


Running The Test
------

```bash
docker exec -it erasys-api npm run test:e2e
```

Validate Passwords
------
Check password via password validation api and update valid field on database and print all passwords to console output.
```bash
docker exec -it erasys-api npm run cp
```

Check Compromised Passwords
------
Check passwords via erasys compromised api and print all compromised password to console output.
```bash
docker exec -it erasys-api npm run cpc
```

Validate and Check Compromised Passwords
------
Check passwords via password validation api and erasys compromised api and update valid field on database and print all passwords to console output.
```bash
docker exec -it erasys-api npm run fcp
```

>You can use  [Postman collection](https://raw.githubusercontent.com/datcal/erasys-task/main/erasys-task.postman_collection.json "erasys Postman Collection") for testing.


# Password Validation API

- Password validation API = http://localhost:3000

| Route | HTTP	 | Body	 |Header	 | Description	 |
| --- | --- | --- | --- | --- |
| /passwords | `POST` | {'password':'csds2'} |  | Validation for password. |


# Password Compromised API

- Password Compromised API = http://localhost:5001

| Route | HTTP	 | Body	 |Header	 | Description	 |
| --- | --- | --- | --- | --- |
| /compromised | `GET` | {'password':'%23nxzr1Bp'} |  | Compromised password control. |



Personal Notes
------
Normally, I would develop the CLI and API side as two separate projects, but for convenience, I developed it this way.