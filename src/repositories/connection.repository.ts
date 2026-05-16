import { Connection } from '../models/connection.model';

export class ConnectionRepository {
  private connections: Connection[] = [];

  async addConnection(followerId: string, followingId: string): Promise<Connection> {
    const existing = this.connections.find(
      (c) => c.followerId === followerId && c.followingId === followingId
    );
    if (existing) {
      return existing;
    }

    const newConnection: Connection = {
      followerId,
      followingId,
      createdAt: new Date(),
    };
    this.connections.push(newConnection);
    return newConnection;
  }

  async removeConnection(followerId: string, followingId: string): Promise<boolean> {
    const initialLength = this.connections.length;
    this.connections = this.connections.filter(
      (c) => !(c.followerId === followerId && c.followingId === followingId)
    );
    return this.connections.length < initialLength;
  }

  async getFollowers(userId: string): Promise<string[]> {
    return this.connections
      .filter((c) => c.followingId === userId)
      .map((c) => c.followerId);
  }

  async getFollowing(userId: string): Promise<string[]> {
    return this.connections
      .filter((c) => c.followerId === userId)
      .map((c) => c.followingId);
  }
}
