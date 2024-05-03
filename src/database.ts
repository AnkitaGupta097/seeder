import mongoose from 'mongoose'

const MONGODB_URI = "mongodb+srv://ankitagupta:RQCrL1K1w09EQxhP@cluster0.88lgnov.mongodb.net/seeder-application?retryWrites=true&w=majority&appName=Cluster0";

const mongoConnect = () =>  mongoose
    .connect(MONGODB_URI)

export default mongoConnect;    