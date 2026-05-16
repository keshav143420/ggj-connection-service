import { Request, Response } from 'express';
import { ConnectionService } from '../services/connection.service';

export class ConnectionController {
  constructor(private connectionService: ConnectionService) {}

  followUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, targetId } = req.params;
      const connection = await this.connectionService.followUser(userId as string, targetId as string);
      res.status(201).json(connection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  unfollowUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, targetId } = req.params;
      const success = await this.connectionService.unfollowUser(userId as string, targetId as string);
      if (success) {
        res.status(200).json({ message: "Successfully unfollowed" });
      } else {
        res.status(404).json({ message: "Connection not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const followers = await this.connectionService.getFollowers(userId as string);
      res.status(200).json(followers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const following = await this.connectionService.getFollowing(userId as string);
      res.status(200).json(following);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
