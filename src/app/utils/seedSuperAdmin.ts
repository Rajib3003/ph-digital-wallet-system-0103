
import { envVar } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";



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

        const superAdmin = await User.create(payload);
        const wallet = await Wallet.create({
            owner: superAdmin._id,
            balance: 0            
        });
        superAdmin.wallet = wallet._id;
        await superAdmin.save();

        console.log("super admin created successfully \n")
        console.log(superAdmin)            
         
    } catch (error) {
        console.log("Error while seeding Super Admin !*!", error)
    }
}

