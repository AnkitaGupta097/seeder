import mongoose from 'mongoose'

const mongoConnect = () => mongoose
    .connect(process.env.MONGODB_URI as string)

export default mongoConnect;    