import { Request, Response } from "express";
import { createWallet, loginToWallet, transferTo } from "./walletService";



export const createWalletController = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        const data = await createWallet(username, password)

        res.status(201).json({data})
    }catch(e: any) {
        res.status(400).json({error: e.message})
    }
}

export const loginToWalletController = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        const data = await loginToWallet(username, password)

        res.status(200).json({data}) 
    }catch(e: any) {
        console.log(e)
        res.status(400).json({error: e.message})
    }
}


export const TransferController = async (req: Request, res: Response) => {
    try {
        const {username, password, to, amount} = req.body
        const data = await transferTo(username, password, to, amount)

        res.status(200).json({data}) 
    }catch(e: any) {
        console.log(e)
        res.status(400).json({error: e.message})
    }
}