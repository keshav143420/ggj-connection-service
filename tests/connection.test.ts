import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/data-source";
import { ConnectionRepository } from "../src/repositories/ConnectionRepository";
import { kafkaProducer } from "../src/kafka/producer";
import { DataSource, DeepPartial } from "typeorm";
import { Connection } from "../src/models/Connection";

// Mock kafka producer
jest.mock("../src/kafka/producer", () => ({
    kafkaProducer: {
        connect: jest.fn(),
        disconnect: jest.fn(),
        emitConnectionCreated: jest.fn().mockResolvedValue(undefined),
        emitConnectionDeleted: jest.fn().mockResolvedValue(undefined)
    }
}));

// We must also mock the underlying AppDataSource so it doesn't try to connect to real Postgres during testing
jest.mock("../src/data-source", () => {
    return {
        AppDataSource: {
            getRepository: () => ({
                extend: (obj: any) => ({
                    ...obj,
                    findOne: jest.fn(),
                    find: jest.fn(),
                    create: jest.fn(),
                    save: jest.fn(),
                    remove: jest.fn()
                })
            }),
            initialize: jest.fn()
        }
    }
});

describe("Connection Service Tests", () => {
    let testDataSource: DataSource;

    beforeAll(async () => {
        // Setup SQLite for testing
        testDataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            synchronize: true,
            logging: false,
            entities: [Connection],
        });
        await testDataSource.initialize();
        
        const repo = testDataSource.getRepository(Connection);
        
        // Monkey-patch ConnectionRepository methods
        ConnectionRepository.findConnection = async (followerId: string, followingId: string) => {
            return repo.findOne({ where: { followerId, followingId } });
        };
        ConnectionRepository.getFollowers = async (userId: string) => {
            return repo.find({ where: { followingId: userId } });
        };
        ConnectionRepository.getFollowing = async (userId: string) => {
            return repo.find({ where: { followerId: userId } });
        };
        ConnectionRepository.create = ((entityLike?: any) => {
            if (entityLike) return repo.create(entityLike);
            return repo.create();
        }) as any;
        ConnectionRepository.save = (async (entity: any) => repo.save(entity)) as any;
        ConnectionRepository.remove = (async (entity: any) => repo.remove(entity)) as any;
    });

    afterAll(async () => {
        if (testDataSource.isInitialized) {
            await testDataSource.destroy();
        }
    });

    it("should allow a user to follow another user", async () => {
        const res = await request(app)
            .post("/api/connections/follow")
            .send({ followerId: "user1", followingId: "user2" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.followerId).toBe("user1");
        expect(res.body.followingId).toBe("user2");
        expect(kafkaProducer.emitConnectionCreated).toHaveBeenCalledWith("user1", "user2");
    });

    it("should not allow a user to follow the same user again", async () => {
        const res = await request(app)
            .post("/api/connections/follow")
            .send({ followerId: "user1", followingId: "user2" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Already following");
    });

    it("should not allow a user to follow themselves", async () => {
        const res = await request(app)
            .post("/api/connections/follow")
            .send({ followerId: "user1", followingId: "user1" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Cannot follow yourself");
    });

    it("should retrieve followers", async () => {
        const res = await request(app).get("/api/connections/followers/user2");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].followerId).toBe("user1");
    });

    it("should retrieve following", async () => {
        const res = await request(app).get("/api/connections/following/user1");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].followingId).toBe("user2");
    });

    it("should allow a user to unfollow", async () => {
        const res = await request(app)
            .post("/api/connections/unfollow")
            .send({ followerId: "user1", followingId: "user2" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Unfollowed successfully");
        expect(kafkaProducer.emitConnectionDeleted).toHaveBeenCalledWith("user1", "user2");
    });

    it("should fail to unfollow if not following", async () => {
        const res = await request(app)
            .post("/api/connections/unfollow")
            .send({ followerId: "user1", followingId: "user3" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Not following");
    });
});
