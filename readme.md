# TASK BLOG

## Introduction

This tack is completed using Node.js,express,prisma ORM for database

## Installation

To install the project, follow these steps:

## Don't forget to update the .env file

1. Clone the repository:

```bash
git clone https://github.com/ghimirepraveen/task.git

```

2. Navigate to the project directory:

```bash
cd server
```

3. Install dependencies:

```bash
npm install
```

4. Migrate server:

```bash
npx prisma migrate dev
```

5. Navigate to the project directory:

```bash
cd ..
```

6. Start the server:

```bash
# if running dev server
npm run dev

# if running prod server
npm run build
npm run live
```

Dev server instances
[server side](http://localhost:4000)

Prod server instances
[server side](https://task-fdml.onrender.com/)

## Usage

Development
[Postman Documentation ](https://documenter.getpostman.com/view/26824707/2sA3rwMuHc)

Production
[Postman Documentation ](https://documenter.getpostman.com/view/26824707/2sA3rwNEvU)

If you get problem to run code on localmachine then you can directly use Production server as mentioned above and its Postman Documentation is as avilable so you can directly import it on Postman and test without any enviroment variables.

## Note :-

For reset link you will get it on response for both Production and Development and you will recive it on your mail too. Just paste the link on Postman's resetpassword request
