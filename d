name: CDK Build & Deploy

on:
  push:
    branches:
      - '**' 

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16

    - name: Install dependencies
      run: npm ci

  deploy:
    if: github.ref == 'refs/heads/main' 
    needs: build
    runs-on: ubuntu-latest
    env:
      CRM_ENV: olivia

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16

    - name: Install dependencies
      run: npm ci

    - name: Set up AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2

    - name: Bootstrap AWS CDK
      run: npx cdk bootstrap

    - name: Synthesize CloudFormation template
      run: npx cdk synth

    - name: Deploy stack
      run: npx cdk deploy --require-approval never