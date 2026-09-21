const request=require('supertest');
const app=require('./server');
const { response } = require('./server');

describe('Analytics API',()=>{
    test('returns Session not found for an invalid session ID',async ()=>{
        const response=await request(app).get('/session/999999/analytics');
        expect(response.body.message).toBe('Session not found');
    });

    test('returns Session did not end for an active session', async () => {
        const startResponse=await request(app)
        .post('/session/start')
        .send({
            allowedDomains:['github.com'],
            duration: 30
        })
        const sessionId=startResponse.body.newSession.sessionId
        const response = await request(app)
        .get(`/session/${sessionId}/analytics`);

        expect(response.body.message).toBe('Session did not end');
    })

     test('creates a new session correctly', async () => {
        const response = await request(app)
            .post('/session/start')
            .send({
                allowedDomains: ['github.com', 'stackoverflow.com'],
                duration: 30
            });

        expect(response.body.newSession.status).toBe('active');
        expect(response.body.newSession.allowedDomains)
            .toEqual(['github.com', 'stackoverflow.com']);
        expect(response.body.newSession.duration).toBe(30);
    });
});