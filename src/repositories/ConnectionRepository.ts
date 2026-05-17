import { AppDataSource } from "../data-source";
import { Connection } from "../models/Connection";

export const ConnectionRepository = {
    getRepository() {
        return AppDataSource.getRepository(Connection);
    },
    async findConnection(followerId: string, followingId: string) {
        return this.getRepository().findOne({
            where: {
                followerId,
                followingId,
            },
        });
    },
    async getFollowers(userId: string) {
        return this.getRepository().find({ where: { followingId: userId } });
    },
    async getFollowing(userId: string) {
        return this.getRepository().find({ where: { followerId: userId } });
    },
    create(entityLike: any) {
        return this.getRepository().create(entityLike);
    },
    async save(entity: any) {
        return this.getRepository().save(entity);
    },
    async remove(entity: any) {
        return this.getRepository().remove(entity);
    }
};
