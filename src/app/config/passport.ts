import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";


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