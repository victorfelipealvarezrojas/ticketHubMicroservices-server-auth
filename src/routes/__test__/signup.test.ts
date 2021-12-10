import request from 'supertest';
import { app } from '../../app';
import express, { Request, Response } from "express";

it('returns a 201 on seccessful signup', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '123456',
        })
        .expect(201);
});

it('returns a 400  with an invalid email', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'emailIncorrect',
            password: '123456',
        })
        .expect(400);
});

it('returns a 400  with an invalid password', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '123',
        })
        .expect(400);
});

it('returns a 400  with missing email and password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/sign-up')
        .send({
            password: '123456',
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '123456',
        })
        .expect(201);

    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '123456',
        })
        .expect(400);
});

//esto no funcionara con la configuracion del app.ts xq    secure: true, no permite que se compartan cookies entre app de distintomdominio
//y este metodo intenta obtener la coockie de la peticion para evaluarla
it('sets a cookie after seccessfull signup', async () => {
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '123456',
        })
        .expect(201);
        //permite buscar cualquiera de los encabezados de la respuesta
        expect(response.get('Set-Cookie')).toBeDefined();

});



