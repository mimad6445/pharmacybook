import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { createAdmin, login, getAllAdmin, deleteAdmin, updateAdmin } from '../controller/admin.controller';
import admindb from '../model/admin.model';
import httpStatusText from '../utils/httpStatusText';

const app = express();
app.use(express.json());

app.post('/admin', createAdmin);
app.post('/admin/login', login);
app.get('/admin/all', getAllAdmin);
app.delete('/admin/:id', deleteAdmin);
app.patch('/admin/:id', updateAdmin);

// Mock the database model

// Mock bcrypt
jest.mock('bcryptjs');

describe('Admin Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('createAdmin', () => {
        it('should create a new admin', async () => {
            const reqBody = {
                fullname: 'Test Admin',
                email: 'test@admin.com',
                password: 'password123',
                avatar: 'avatar.png'
            };
            const hashedPassword = 'hashedpassword123';
            
            const res = await request(app)
                .post('/admin')
                .send(reqBody);
            expect(res.status).toBe(201);
            expect(res.body.status).toBe(httpStatusText.SUCCESS);
            expect(res.body.data.addNewAdmin.email).toBe(reqBody.email);
        });
        it('should return an error if save fails', async () => {
            const reqBody = {
                fullname: 'Test Admin',
                email: 'test@admin.com',
                password: 'password123',
                avatar: 'avatar.png'
            };
            const res = await request(app)
                    .post('/admin')
                    .send(reqBody);
            expect(res.status).toBe(500);
            expect(res.body.status).toBe(httpStatusText.ERROR);
            expect(res.body.msg).toBe('server thing');
        });
    });
    describe('login', () => {
        it('should login an admin', async () => {
            const reqBody = {
                email: 'test@admin.com',
                password: 'password123'
            };
            const adminData = {
                _id: '1',
                fullname: 'Test Admin',
                email: 'test@admin.com',
                password: 'hashedpassword123',
                avatar: 'avatar.png'
            };
            const res = await request(app)
                    .post('/admin/login')
                    .send(reqBody);
            expect(res.status).toBe(200);
            expect(res.body.status).toBe(httpStatusText.SUCCESS);
            expect(res.body.data.email).toBe(reqBody.email);
        });
        it('should return an error if email does not exist', async () => {
            const reqBody = {
                email: 'nonexistent@admin.com',
                password: 'password123'
            };
            const res = await request(app)
                    .post('/admin/login')
                    .send(reqBody);
            expect(res.status).toBe(404);
            expect(res.body.status).toBe(httpStatusText.FAIL);
            expect(res.body.message).toBe("Email doesn't exist");
        });
        it('should return an error if password is incorrect', async () => {
            const reqBody = {
                email: 'test@admin.com',
                password: 'wrongpassword'
            };
            const adminData = {
                _id: '1',
                fullname: 'Test Admin',
                email: 'test@admin.com',
                password: 'hashedpassword123',
                avatar: 'avatar.png'
            };
            const res = await request(app)
                    .post('/admin/login')
                    .send(reqBody);
            expect(res.status).toBe(404);
            expect(res.body.status).toBe(httpStatusText.FAIL);
            expect(res.body.message).toBe('Incorrect password');
        });
    });
});
