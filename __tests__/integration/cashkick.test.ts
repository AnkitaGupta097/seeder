import supertest, { Test } from 'supertest';
import app from '../../src/app'
import TestAgent from 'supertest/lib/agent';
import Contract from '../../src/models/contract'
import Cashkick from '../../src/models/cashkick'
import User from '../../src/models/user'
import mongoose from 'mongoose';

describe("cashkick routes", () => {

    let token: string;
    let httpRequest: TestAgent<Test>;
    let newCashkick: any
    let user: any;

    beforeAll(async () => {
        httpRequest = supertest(app)

        const response = await httpRequest
            .post('/v1/auth/login')
            .send({ email: "user3@example.com", password: "expressPassword@123" });
        token = response.body.token
        user = await User.findOne({ email: "user3@example.com" })
    }, 10000)


    it('POST /cashkicks/', async () => {

        //@ts-ignore
        const contract = await Contract.findOne({ name: 'new contract' }).select('_id')

        const cashkick = {
            name: "cashkick1",
            totalAmount: 1200000,
            totalFinanced: 1300000,
            contractIds: [contract?._id]
        }

        await httpRequest
            .post('/v1/cashkicks')
            .set("Authorization", `Bearer ${token}`)
            .send(cashkick)
            .then((response: any) => {
                expect(response.statusCode).toBe(201);
                expect(response.body.id).toBeDefined();
                expect(response.body.name).toEqual("cashkick1");
                newCashkick = response.body
            })
    })

    it('POST /cashkicks/ when giving random contracts', async () => {
        const cashkick = {
            name: "cashkick1",
            totalAmount: 1200000,
            totalFinanced: 1300000,
            contractIds: ["contractId"]
        }

        await httpRequest
            .post('/v1/cashkicks')
            .set("Authorization", `Bearer ${token}`)
            .send(cashkick)
            .then((response: any) => {
                expect(response.statusCode).toBe(400);
            })
    })

    it('GET /cashkicks/', async () => {
        const existsingCashkicks = await Cashkick.find({ user: user._id }).countDocuments()

        await httpRequest
            .get(`/v1/cashkicks`)
            .set("Authorization", `Bearer ${token}`)
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBe(existsingCashkicks);
            })

    })

    it('GET /cashkicks/:id', async () => {
        await httpRequest
            .get(`/v1/cashkicks/${newCashkick.id}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response: any) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.id).toBe(newCashkick.id);
            })

    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})