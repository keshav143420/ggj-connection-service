import request from 'supertest';
import app from '../app';

describe('Connection API', () => {
  it('should allow user A to follow user B', async () => {
    const res = await request(app).post('/users/userA/follow/userB');
    expect(res.status).toBe(201);
    expect(res.body.followerId).toBe('userA');
    expect(res.body.followingId).toBe('userB');
  });

  it('should not allow user to follow themselves', async () => {
    const res = await request(app).post('/users/userA/follow/userA');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('A user cannot follow themselves.');
  });

  it('should return 404 when unfollowing a non-existent connection', async () => {
    const res = await request(app).delete('/users/userX/follow/userY');
    expect(res.status).toBe(404);
  });

  it('should correctly list followers and following', async () => {
    // Setup connections
    await request(app).post('/users/user1/follow/user2');
    await request(app).post('/users/user3/follow/user2');

    // Check followers of user2
    let res = await request(app).get('/users/user2/followers');
    expect(res.status).toBe(200);
    expect(res.body).toContain('user1');
    expect(res.body).toContain('user3');
    expect(res.body.length).toBe(2);

    // Check following of user1
    res = await request(app).get('/users/user1/following');
    expect(res.status).toBe(200);
    expect(res.body).toContain('user2');
    expect(res.body.length).toBe(1);
  });

  it('should successfully unfollow a user', async () => {
    await request(app).post('/users/userC/follow/userD');
    
    // Unfollow
    const res = await request(app).delete('/users/userC/follow/userD');
    expect(res.status).toBe(200);

    // Verify
    const following = await request(app).get('/users/userC/following');
    expect(following.body).not.toContain('userD');
  });
});
