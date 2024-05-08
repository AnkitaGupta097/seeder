import supertest, { Test } from 'supertest';
import app from '../../src/app'
import TestAgent from 'supertest/lib/agent';
import User from '../../src/models/user'
import mongoose from 'mongoose';
import { UserRole } from '../../src/utils/enums';

describe("user routes", () => {
    let token: string;
    let httpRequest: TestAgent<Test>;
    let loggedInUser: any;

    beforeAll(async () => {
        httpRequest = supertest(app)

        const response = await httpRequest
            .post('/v1/auth/login')
            .send({ email: "user1@example.com", password: "expressPassword@123" });
        token = response.body.token
        loggedInUser = await User.findOne({ email: "user1@example.com" })
    }, 10000)


    it('GET /users/:userId', async () => {
        await httpRequest
            .get(`/v1/users/${loggedInUser._id.toString()}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.email).toBe(loggedInUser.email);
            })

    })

    it('POST /users/', async () => {
        await httpRequest
            .post('/v1/users')
            .send({ email: "newemail@gmail.com", password: "newPassword@123", role: UserRole.RECIPIENT, name: "ankita gupta" })
            .then((response: any) => {
                expect(response.statusCode).toBe(201);
                expect(response.body.email).toBe("newemail@gmail.com");
                expect(response.body.id).toBeDefined();
            })

    })

    it('PATCH /users/', async () => {
        await httpRequest
            .patch('/v1/users')
            .set("Authorization", `Bearer ${token}`)
            .send({ password: "updatedPassword@123", confirmPassword: "updatedPassword@123", currentPassword: "expressPassword@123" })
            .then((response: any) => {
                expect(response.statusCode).toBe(201);
            })

    })


    it('PATCH /users/ when current password do not match', async () => {
        await httpRequest
            .patch('/v1/users')
            .set("Authorization", `Bearer ${token}`)
            .send({ password: "updated2Password@123", confirmPassword: "updated2Password@123", currentPassword: "password@123" })
            .then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.message).toBe("Invalid current password");
            })

    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})