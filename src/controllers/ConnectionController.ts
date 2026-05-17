import { Request, Response } from "express";
import { connectionService } from "../services/ConnectionService";

export class ConnectionController {
    async follow(req: Request, res: Response) {
        try {
            const { followerId, followingId } = req.body;
            if (!followerId || !followingId) {
                return res.status(400).json({ error: "followerId and followingId are required" });
            }
            const connection = await connectionService.follow(followerId, followingId);
            return res.status(201).json(connection);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async unfollow(req: Request, res: Response) {
        try {
            const { followerId, followingId } = req.body;
            if (!followerId || !followingId) {
                return res.status(400).json({ error: "followerId and followingId are required" });
            }
            await connectionService.unfollow(followerId, followingId);
            return res.status(200).json({ message: "Unfollowed successfully" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getFollowers(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            const followers = await connectionService.getFollowers(userId);
            return res.status(200).json(followers);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getFollowing(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            const following = await connectionService.getFollowing(userId);
            return res.status(200).json(following);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const connectionController = new ConnectionController();
