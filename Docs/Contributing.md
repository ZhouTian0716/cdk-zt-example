# Contributing Guidelines
This document outline the code guidelines and cooperation rules of this project. 

## Code Guidelines 
We follow the coding style and conventions outlined below:

## Documents
1. Use consistent indentation (2 spaces are required in this project).
2. Ensure your files is in the correct directory(e.g. src\, test\, script\)

## Naming Convention 
1. For Files: use **Cameral case** as function (e.g. createTable.sh).                 
2. For Class/Package: Capitalized **first** letter (e.g. ApiGateway, Dynamodb).
3. For Function/Variable: use **Cameral case** as function (e.g. createTable.sh)

## Code Guidelines
- Do not hard code. It means **do not** explicitly write the value directly into the code. You should separate the configuration or data from the code logic, allowing for easier modifications. Try to use **Config** files to read the data in different environment. 
- Save all constant variable to **Constant.ts**, and call this variable when use.
- Use function to solve duplicated code problem.

## Pull Request 
1. If your branch still in test, leave 'WIP'(stand for work in progress) in your commit message.
2. Test your change before pull request.
3. Create feature branch name: "feature/add-projectXXX", and suitably add comment in your code to explain.
4. Pull request should be reviewed by at least 2 people(one should be David).
5. Ensure your PR includes a clear description of the changes and any relevant information.
6. If this PR refer UI design, add relative screenshots to claim the change.
7. Click 'Resolve Conversation' to indicate that you already solved the required changes.  


