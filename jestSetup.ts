import mongoConnect from './src/database';
import User from './src/models/user'
import Contract from './src/models/contract'
import { UserRole, contractStatus, contractType } from './src/utils/enums';
import dotenv from "dotenv";
import bcrypt from 'bcryptjs'

export default async () => {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

    await mongoConnect().then(() => {
        let user: any;
        return bcrypt.hash('expressPassword@123', 12)
            .then((hashedPassword) => {
                return User.create([
                    { name: 'user1', email: 'user1@example.com', password: hashedPassword, role: UserRole.RECIPIENT },
                    { name: 'user2', email: 'user2@example.com', password: hashedPassword, role: UserRole.PROVIDER },
                    { name: 'user3', email: 'user3@example.com', password: hashedPassword, role: UserRole.RECIPIENT },
                ]).then((users) => {
                    const providerUser = users.find((user) => user.role == UserRole.PROVIDER);
                    user = users.find((user) => user.email == "user3@example.com");

                    return Contract.create({
                        name: "new contract",
                        termLength: 12,
                        type: contractType.YEARLY,
                        termRate: 12,
                        totalAmount: 1200000,
                        totalFinanced: 1300000,
                        perPayment: 12000,
                        contractOwner: providerUser?._id
                    })

                }).then((contract) => {
                    user.contracts[UserRole.PROVIDER] = [contract]
                    user.contracts[UserRole.RECIPIENT] = [{ contractDetail: contract?._id, status: contractStatus.AVAILABLE }]
                    return user.save()
                })
            })
    })
}