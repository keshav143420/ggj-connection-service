import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { kafkaProducer } from "../kafka/producer";

export class ConnectionService {
    async follow(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new Error("Cannot follow yourself");
        }

        const existing = await ConnectionRepository.findConnection(followerId, followingId);
        if (existing) {
            throw new Error("Already following");
        }

        const connection = ConnectionRepository.create({ followerId, followingId });
        await ConnectionRepository.save(connection);

        await kafkaProducer.emitConnectionCreated(followerId, followingId).catch(err => {
            console.error("Failed to emit connection-created event", err);
        });

        return connection;
    }

    async unfollow(followerId: string, followingId: string) {
        const connection = await ConnectionRepository.findConnection(followerId, followingId);
        if (!connection) {
            throw new Error("Not following");
        }

        await ConnectionRepository.remove(connection);

        await kafkaProducer.emitConnectionDeleted(followerId, followingId).catch(err => {
            console.error("Failed to emit connection-deleted event", err);
        });

        return true;
    }

    async getFollowers(userId: string) {
        return ConnectionRepository.getFollowers(userId);
    }

    async getFollowing(userId: string) {
        return ConnectionRepository.getFollowing(userId);
    }
}

export const connectionService = new ConnectionService();
