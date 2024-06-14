import {promises as fs} from 'fs'
import path from 'path'
import {ethers} from 'ethers'

        
const provider: ethers.Provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545")

export const createWallet = async (username: string, password: string) => {
    try {
        
        const Wallet =  ethers.Wallet.createRandom()
        Wallet.connect(provider)
        const encryptedWallet = await Wallet.encrypt(password)

        await storeToFileSystem(username, encryptedWallet)

        const balance = await ethers.getDefaultProvider().getBalance(Wallet.address)
        return {
            address: Wallet.address,
            balance: ethers.formatUnits(balance)
        }
    }catch(e) {
        throw new Error("Error: Creating Wallet")
    }
}

export const loginToWallet = async (username: string, password: string) => {
    try {
        const encryptedWallet = await retrieveJson(username)
        const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet.toString('utf-8'), password)
        const balance = await provider.getBalance(wallet.address)
        
        return {
            address: wallet.address,
            balance: ethers.formatEther(balance)
        }
    }catch(e) {
        console.log(e)
        throw new Error("Invalid Credentials")
    }
}


export const transferTo = async (username: string, password: string, to: string, amount: number) => {
    try {
        const encryptedWallet = await retrieveJson(username)
        const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet.toString('utf-8'), password)
        const balance = await provider.getBalance(wallet.address)

        const signer = await new ethers.Wallet(wallet.privateKey, provider)

        if(!ethers.isAddress(to)) throw new Error("Please Provide a Valid Address")


        const tx = await signer.sendTransaction({
            to: to,
            value: ethers.parseUnits(`${amount}`, 'ether'),
        });

      const gasFeeEstimate = await provider.estimateGas(tx)
      if(ethers.parseEther(`${amount}`) >= (balance + gasFeeEstimate)) {
        console.log("entered")
        throw new Error("Insufficient funds")
      }

      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();


      return transaction 
    }catch(e:any) {
        throw new Error(e)
    }
    
}

const storeToFileSystem = async (fileName: string, data: string) => {
         await fs.writeFile(`${fileName}.json`, data)
}

const retrieveJson = async (username: string): Promise<Buffer> => {
    const data = await fs.readFile(`${username}.json`)
    return data
}