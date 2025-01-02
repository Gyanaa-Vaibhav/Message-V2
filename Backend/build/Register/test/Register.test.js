var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import express from 'express';
import RegisterRoute from '../routes/RegisterRoute.ts';
const app = express();
app.use('/Register', RegisterRoute);
describe('Register Route', () => {
    it('should render the Register page', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app).get('/Register');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Render Register page here');
    }));
});
