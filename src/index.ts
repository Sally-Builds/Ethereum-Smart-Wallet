import express, { Application, Request, Response } from 'express'
import walletRouter from './walletRoute'
import 'express-async-errors'



const main = (PORT: number) => {
    const app: Application = express()

    console.log('---------initialize middleware------------------')
    app.use(express.json())


     
    console.log('---------initialize routes----------------------')

    app.use('/api/wallet', walletRouter)

    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({msg: "Resource Not Found"})
    })

    app.listen(PORT, () => {
        console.log(`Application is running on port ${PORT}`)
    })
}

main(3000)