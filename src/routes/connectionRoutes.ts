import { Router } from "express";
import { connectionController } from "../controllers/ConnectionController";

const router = Router();

router.post("/follow", connectionController.follow);
router.post("/unfollow", connectionController.unfollow);
router.get("/followers/:userId", connectionController.getFollowers);
router.get("/following/:userId", connectionController.getFollowing);

export default router;
