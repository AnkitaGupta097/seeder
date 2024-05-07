import supertest, { Test } from 'supertest';
import app from '../../src/app'
import TestAgent from 'supertest/lib/agent';
import mongoose from 'mongoose';
import { contractType } from '../../src/utils/enums';
import Contract from '../../src/models/contract';


describe("contract routes", () => {
    let newContract: any
    let httpRequest: TestAgent<Test>;

    describe("PROVIDER contract routes", () => {

        let token: string;

        beforeAll(async () => {
            httpRequest = supertest(app)

            const response = await httpRequest
                .post('/v1/auth/login')
                .send({ email: "user2@example.com", password: "expressPassword@123" });
            token = response.body.token
        }, 10000)

        it('POST /contracts/', async () => {
            newContract = {
                name: "contract1",
                termLength: 12,
                type: contractType.YEARLY,
                termRate: 12,
                totalAmount: 12000,
                totalFinanced: 14000,
                perPayment: 1100,

            }

            await httpRequest
                .post('/v1/contracts')
                .set("Authorization", `Bearer ${token}`)
                .send(newContract)
                .then((response: any) => {
                    expect(response.statusCode).toBe(201);
                    expect(response.body.name).toBe(newContract.name);
                    expect(response.body._id).toBeDefined();
                    newContract.id = response.body._id
                    return Promise.resolve({})
                })

        })

        it('GET /contracts/', async () => {

            await httpRequest
                .get('/v1/contracts')
                .set("Authorization", `Bearer ${token}`)
                .then((response: any) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body?.length).toBe(1);
                    expect(response.body[0]?.name).toEqual(newContract.name);
                    expect(response.body[0]?._id).toEqual(newContract.id);
                })

        })
    })

    describe("RECIPIENT contract routes", () => {

        let token: string;

        beforeAll(async () => {
            httpRequest = supertest(app)

            const response = await httpRequest
                .post('/v1/auth/login')
                .send({ email: "user3@example.com", password: "expressPassword@123" });
            token = response.body.token
        }, 10000)

        it('GET /contracts/', async () => {

            await httpRequest
                .get('/v1/contracts')
                .set("Authorization", `Bearer ${token}`)
                .then((response: any) => {
                    expect(response.statusCode).toBe(200);
                })

        })

        it('GET /contracts/:id', async () => {
            const contract = await Contract.findOne({ name: "new contract" }).select("_id")

            await httpRequest
                .get(`/v1/contracts/${contract?._id}`)
                .set("Authorization", `Bearer ${token}`)
                .then((response: any) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toBeDefined();
                    expect(response.body?.contractDetail?._id).toEqual(contract?._id.toString());
                })
        })

    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})