const request = require('supertest');

jest.mock('../services/agentService');
const agentService = require('../services/agentService');
const { createApp } = require('../app');

function appWithSocketSpy() {
  const app = createApp();
  const io = { emit: jest.fn() };
  app.set('io', io);
  return { app, io };
}

const agent = { code: 'A001', name: 'Somchai', status: 'Available' };

beforeEach(() => jest.resetAllMocks());

describe('GET /api/agents', () => {
  test('returns every agent', async () => {
    agentService.getAll.mockResolvedValue([agent]);
    const res = await request(createApp()).get('/api/agents');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [agent] });
  });

  test('returns 404 for an unknown agent', async () => {
    agentService.getById.mockResolvedValue(null);
    const res = await request(createApp()).get('/api/agents/NOPE');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/agents/:id/login', () => {
  test('logs the agent in and broadcasts the change', async () => {
    agentService.login.mockResolvedValue(agent);
    const { app, io } = appWithSocketSpy();
    const res = await request(app).post('/api/agents/A001/login').send({ name: 'Somchai' });
    expect(res.status).toBe(201);
    expect(agentService.login).toHaveBeenCalledWith('A001', 'Somchai');
    expect(io.emit).toHaveBeenCalledWith('agent:updated', agent);
  });
});

describe('PATCH /api/agents/:id/status', () => {
  test('requires a status', async () => {
    const res = await request(createApp()).patch('/api/agents/A001/status').send({});
    expect(res.status).toBe(400);
    expect(agentService.updateStatus).not.toHaveBeenCalled();
  });

  test('maps service validation errors to 400', async () => {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    agentService.updateStatus.mockRejectedValue(err);
    const res = await request(createApp()).patch('/api/agents/A001/status').send({ status: 'Sleeping' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid status');
  });

  test('updates the status and broadcasts it', async () => {
    const updated = { ...agent, status: 'Wrap Up' };
    agentService.updateStatus.mockResolvedValue(updated);
    const { app, io } = appWithSocketSpy();
    const res = await request(app).patch('/api/agents/A001/status').send({ status: 'Wrap Up' });
    expect(res.status).toBe(200);
    expect(io.emit).toHaveBeenCalledWith('agent:updated', updated);
  });

  test('hides internal error details behind a 500', async () => {
    agentService.updateStatus.mockRejectedValue(new Error('connection reset'));
    const res = await request(createApp()).patch('/api/agents/A001/status').send({ status: 'Active' });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});

test('unknown routes return a JSON 404', async () => {
  const res = await request(createApp()).get('/api/nothing-here');
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
});
