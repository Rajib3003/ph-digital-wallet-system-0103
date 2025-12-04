/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVar } from "./env";
import { isActived, Role } from "../modules/user/user.interface";


passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
},async(email,password,done)=>{
    try {
        const isUserExist = await User.findOne({email})
        if(!isUserExist){
            return done(null, false, {message: "User not found !*!"})
        }
        
        if(!isUserExist.password){
            return done(null, false, {message: "Password is not set for this user !*!"})
        }

        const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string )
        if(!isPasswordMatched){
            return done(null, false, {message: "Invalid password !*!"})
        }
        return done(null, isUserExist);

    } catch (error) {
        console.log("Local Strategy Error", error)
        done(error)
    }
}))

passport.use(new GoogleStrategy({
    clientID: envVar.GOOGLE_CLIENT_ID,
    clientSecret: envVar.GOOGLE_CLIENT_SECRET,
    callbackURL: envVar.GOOGLE_CALLBACK_URL,   
}, async ( accessToken: string, refreshToken : string, profile: Profile, done: VerifyCallback) => {
    try {
        
        const email = profile.emails?.[0].value;
        if(!email){
            return done(null, false, {message: "No email found in Google profile !*!"});
        }
        let isUserExist = await User.findOne({email});

        if(isUserExist && !isUserExist.isVerified){
            return done(null, false, {message: "User is not Verified Yet !*!"});
        }
        if (isUserExist && (isUserExist.isActived === isActived.BLOCKED || isUserExist.isActived === isActived.INACTIVE)){
            return done(`User is ${isUserExist.isActived}`);
        }
        if (isUserExist && isUserExist.isDeleted){
            return done(null, false, {message: "User is deleted !*!"});
        }
        if (!isUserExist) {
            isUserExist = await User.create({
                email,
                name: profile.displayName,
                picture: profile.photos?.[0].value,
                role: Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "Google",
                        providerId: profile.id
                    }
                ]
            })
        }
        return done(null, isUserExist);


    } catch (error) {
        console.log("Google Strategy Error !*!", error);
        return done(error as any);
    }
}));

passport.serializeUser((user: any, done:(err: any, id?: unknown)=> void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error)
        done(error);
    }
});