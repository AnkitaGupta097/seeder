import supertest, { Test } from 'supertest';
import app from '../../src/app'
import TestAgent from 'supertest/lib/agent';
import Contract from '../../src/models/contract';
import User from '../../src/models/user';

import mongoose from 'mongoose';
import { PaymentStatus } from '../../src/utils/enums';

describe("Payment routes", () => {

    let token: string;
    let httpRequest: TestAgent<Test>;
    let newPayment: any;
    let recipientUser: any;

    beforeAll(async () => {
        httpRequest = supertest(app)

        const response = await httpRequest
            .post('/v1/auth/login')
            .send({ email: "user3@example.com", password: "expressPassword@123" });
        token = response.body.token
        recipientUser = await User.findOne({ email: "user3@example.com" })
    }, 10000)


    it('POST /payments/', async () => {
        //@ts-ignore
        const contract = await Contract.findOne({ name: 'new contract' }).select('_id')

        const cashkickRequest = {
            name: "new_cashkick",
            totalAmount: 1200000,
            totalFinanced: 1300000,
            contractIds: [contract?._id]
        }

        await httpRequest
            .post('/v1/cashkicks')
            .set("Authorization", `Bearer ${token}`)
            .send(cashkickRequest)

        const payment = {
            dueDate: "05-06-2025",
            expectedAmount: 12000,
            outstandingAmount: 1288000,
            status: PaymentStatus.UPCOMING,
            contract: contract?._id,
            userId: recipientUser?._id
        }

        await httpRequest
            .post('/v1/payments')
            .send(payment)
            .then((response: any) => {
                expect(response.statusCode).toBe(201);
                expect(response.body.id).toBeDefined();
                newPayment = response.body
            })
    })

    it('POST /payments/ when giving wrong format of date', async () => {
        const contract = await Contract.findOne({ name: 'new contract' }).select('_id')

        const payment = {
            dueDate: "random",
            expectedAmount: 12000,
            outstandingAmount: 1288000,
            status: PaymentStatus.UPCOMING,
            contract: contract?._id,
            userId: recipientUser?._id
        }

        await httpRequest
            .post('/v1/payments')
            .send(payment)
            .then((response: any) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.errors[0].msg).toBe("Invalid Date");
            })
    })

    it('GET /payments/', async () => {
        await httpRequest
            .get(`/v1/payments`)
            .set("Authorization", `Bearer ${token}`)
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBe(1);
                expect(response.body[0]?.id).toEqual(newPayment?.id);
            })

    })

    it('GET /payments/:id', async () => {
        await httpRequest
            .get(`/v1/payments/${newPayment.id}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.id).toBe(newPayment.id);
            })

    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})