import { Router } from "express";
import { loginToWalletController, createWalletController, TransferController } from "./walletController";

const router = Router()


router.post('/create', createWalletController)
router.post('/login', loginToWalletController)
router.post('/transfer', TransferController)


export default router