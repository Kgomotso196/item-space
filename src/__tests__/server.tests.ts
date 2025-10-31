import request from 'supertest';

import { app, items } from '../server';

describe('Backend API', () => {
  beforeEach(() => {
    items.length = 0;
  });

  it('GET /api/items returns empty array initially', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/items adds a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Item');
  });

  it('DELETE /api/items/:id removes an item', async () => {
    const postRes = await request(app)
      .post('/api/items')
      .send({ name: 'Item to Delete' });

    const id = postRes.body.id;

    const deleteRes = await request(app).delete(`/api/items/${id}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.id).toBe(id);

    const getRes = await request(app).get('/api/items');
    expect(getRes.body).toHaveLength(0);
  });
});
