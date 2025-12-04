
import { envVar } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";



export const seedSuperAdmin = async () => {
    try {
       const isSuperAdminExist = await User.findOne({email: envVar.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
           console.log("Super Admin Allready Exist!!");
            return;
        }
        console.log("Trying to create super admin... ")

        const provider : IAuthProvider = {
            provider: "credentials",
            providerId: envVar.SUPER_ADMIN_EMAIL,
        }

        const hashedPassword = await bcrypt.hash(envVar.SUPER_ADMIN_PASSWORD, Number(envVar.BCRYPT_SALT_ROUND));

        const payload : IUser = {
            name: "Super Admin",
            email: envVar.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auths: [provider],
        }

        const superAdmin = User.create(payload);

        console.log("super admin created successfully \n")
        console.log(superAdmin)            
         
    } catch (error) {
        console.log("Error while seeding Super Admin !*!", error)
    }
}

