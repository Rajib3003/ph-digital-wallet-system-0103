

GitMind workflow create kora
draw.io database draw kora 
git init, git checkout -b "development"
git subbranch create kora , git checkout -b "project-setup" 
<!-- project start -->
npm init -y 
npm install -D typescript 
tsc --init <!-- tsconfig.json file rootDir text a ./src likhte hobe and outDir te likhte hobe ./dist -->
npm i express mongoose zod jsonwebtoken cors dotenv
npm i ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken 
<!-- root folder a src folder create kora dist folder create kora, src maje server.ts app.ts and App folder create korte hobe. -->



# step by step work list
- global error handler
- catchAsync handeling
- zodValidation 
- Auth 
- eslint (unuse variable, extra code error diye check)
- http-status-codes