# Welcome to Backend project

# Project Structure

API > Service Layer > Business Logic Layer > Database Layer

For example, Add a client

POST/PUT /client/ with body { id: 1234, name: "David" }

addClient({ id: 1234, name: "David" })

db.dbPut({ id: 1234, name: "David" })

dynaomdb add a item.

# Visual Code Extension

You need to install the following extension:

- Code Spell Checker
- Prettier - Code formatter

# Unit Test

when you run command "jest", "npm run test", or pipeline test step

jest will set the NODE_ENV => "test"

src/lambda/db/db.ts will mock the dynamodb client if NODE_ENV == "test"
