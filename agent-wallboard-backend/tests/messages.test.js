const request = require('supertest');

jest.mock('../services/messageService');
const messageService = require('../services/messageService');
const { createApp } = require('../app');

beforeEach(() => jest.resetAllMocks());

describe('POST /api/messages', () => {
  test('rejects an invalid message with every validation problem', async () => {
    const res = await request(createApp()).post('/api/messages').send({ priority: 'urgent' });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveLength(3); // from, content, priority
    expect(messageService.create).not.toHaveBeenCalled();
  });

  test('creates a message, strips unknown fields and broadcasts it', async () => {
    const saved = { _id: '1', from: 'SUP01', to: 'A001', content: 'Break at 3pm', priority: 'normal' };
    messageService.create.mockResolvedValue(saved);
    const app = createApp();
    const io = { emit: jest.fn() };
    app.set('io', io);

    const res = await request(app).post('/api/messages')
      .send({ from: 'SUP01', to: 'A001', content: '  Break at 3pm  ', isAdmin: true });

    expect(res.status).toBe(201);
    expect(messageService.create).toHaveBeenCalledWith({ from: 'SUP01', to: 'A001', content: 'Break at 3pm' });
    expect(io.emit).toHaveBeenCalledWith('message:new', saved);
  });
});

test('GET /api/messages/agent/:id returns the inbox with an unread count', async () => {
  messageService.getForAgent.mockResolvedValue([{ isRead: false }, { isRead: true }, { isRead: false }]);
  const res = await request(createApp()).get('/api/messages/agent/A001');
  expect(res.status).toBe(200);
  expect(res.body.unread).toBe(2);
});

describe('PUT /api/messages/:id/read', () => {
  test('rejects a malformed id without querying the database', async () => {
    const res = await request(createApp()).put('/api/messages/not-an-id/read');
    expect(res.status).toBe(400);
    expect(messageService.markAsRead).not.toHaveBeenCalled();
  });

  test('returns 404 when the message does not exist', async () => {
    messageService.markAsRead.mockResolvedValue(null);
    const res = await request(createApp()).put('/api/messages/507f1f77bcf86cd799439011/read');
    expect(res.status).toBe(404);
  });
});
