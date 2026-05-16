import { Router } from 'express';
import { ConnectionController } from '../controllers/connection.controller';
import { ConnectionService } from '../services/connection.service';
import { ConnectionRepository } from '../repositories/connection.repository';

const router = Router();

const repository = new ConnectionRepository();
const service = new ConnectionService(repository);
const controller = new ConnectionController(service);

router.post('/:userId/follow/:targetId', controller.followUser);
router.delete('/:userId/follow/:targetId', controller.unfollowUser);
router.get('/:userId/followers', controller.getFollowers);
router.get('/:userId/following', controller.getFollowing);

export default router;
