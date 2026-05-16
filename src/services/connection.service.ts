import { ConnectionRepository } from '../repositories/connection.repository';
import { Connection } from '../models/connection.model';

export class ConnectionService {
  constructor(private connectionRepository: ConnectionRepository) {}

  async followUser(followerId: string, followingId: string): Promise<Connection> {
    if (followerId === followingId) {
      throw new Error("A user cannot follow themselves.");
    }
    return this.connectionRepository.addConnection(followerId, followingId);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    return this.connectionRepository.removeConnection(followerId, followingId);
  }

  async getFollowers(userId: string): Promise<string[]> {
    return this.connectionRepository.getFollowers(userId);
  }

  async getFollowing(userId: string): Promise<string[]> {
    return this.connectionRepository.getFollowing(userId);
  }
}
