

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
