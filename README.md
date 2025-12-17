
# Digital Wallet API - Project Overview
The Digital Wallet API is a secure, modular and role based backend system by popular mobile financial services like bKash and Nagad.

it is built Node.js(express.js) and MongoDB (Mongoose), focusing on scalability, security and clean architecture.

This system enables users to manage digital wallets and perform core financial operations such as add money, cash-in funds and cash-out money while ensuring that every transaction is securely recorded and tranceable. 

The API support four distinct roles -Superadmin, Admin , User and Agent each with clearly defined permission enforced through JWT based authentication and role based authorization middleware. 

# API List
<!-- user registration locally -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/user/registration

<!-- user registration with google -->
https://ph-digital-wallet-system-0103.vercel.app/api/v1/auth/google

<!-- All user get -->
get - https://ph-digital-wallet-system-0103.vercel.app/api/v1/user

<!-- single user get -->
get - https://ph-digital-wallet-system-0103.vercel.app/api/v1/user/(id)

<!-- delete user -->
delete - https://ph-digital-wallet-system-0103.vercel.app/api/v1/user/(id)

<!-- update user -->
patch - https://ph-digital-wallet-system-0103.vercel.app/api/v1/user/(id)

<!-- login -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/auth/login

<!-- refresh token -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/auth/refresh-token

<!-- logout  -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/auth/logout

<!-- set password -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/auth/set-password

<!-- deposet -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/deposit

<!-- withdraw -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/withdraw

<!-- block -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/block/(id)

<!-- unblock -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/unblock/(id)

<!-- cash in  -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/agent/cash-in

<!-- cash out -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/agent/cash-out

<!-- send -->
post - https://ph-digital-wallet-system-0103.vercel.app/api/v1/wallet/send



# URL
<!-- vercel url -->
https://ph-digital-wallet-system-0103.vercel.app

<!-- githup link -->
https://github.com/Rajib3003/ph-digital-wallet-system-0103.git

<!-- video record link -->






# project instraction start

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
- bcryptjs
- cookie-parser



# create user access token 

- first login kaj ses korte hobe, then (npm install jsonwebtoken) and (npm install --save-dev @types/jsonwebtoken) ei 2 ta terminal e install korte hobe. .env file (JWT_ACCESS_SECRET= access_secret) (JWT_ACCESS_EXPIRES= 1d) (JWT_REFRESH_SECRET= refresh_secret) (JWT_REFRESH_EXPIRES= 30d) variable gulo add korte hobe. utils folder a userToken.ts name file create kore :
export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        user_id: user._id,
        email: user.email,
        role: user.role
    }
 

    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET,envVar.JWT_ACCESS_EXPIRES)

    return{
        accessToken
    }
}
ei vabe code likhte hobe. abar Utils folder a jwt.ts name a file create korte hobe: 
export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload,secret,{
        expiresIn
    }as SignOptions)
    return token
}
ei rokom code likhte hobe, then auth.controller.ts file a giye 
const userToken = createUserToken(user) createUserToken er maje user ta sent kore dite hobe jeta amra userToken file function create korechi.
summary: pakege install -> .env (variable) add -> utils (userToken.ts, jwt.ts) file create -> auth.controller.ts 


# forget password korte mail send korte

- npm i nodemailer
- npm i @types/nodemailer
- npm i ejs
- npm i @types/ejs


