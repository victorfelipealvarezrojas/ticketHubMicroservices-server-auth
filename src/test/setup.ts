import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: MongoMemoryServer;
//se ejecuta antes que todas las pruebas
beforeAll(async () => {
    process.env.JWT_KEY = 'variabledeentornodepruebaylaproductivaestaenunsecretodentrodelpoddek8s';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        //useNewUrlParser:true
    });
});

//para restablecer la base de datos
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let item of collections) {
        await item.deleteMany({});
    }
});

//detener ese servidor de memoria Mongo DB y también le vamos a decir a MongoMemoryServer que se desconecte de mongo
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});