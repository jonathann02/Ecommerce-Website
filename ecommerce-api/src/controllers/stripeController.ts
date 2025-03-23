import { Request, Response } from "express"
import { db } from "../config/db"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export const createHostedCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { order_id, line_items } = req.body

        const session = await stripe.checkout.session.create({
            line_items, 
            mode: "payment",
            success_url: 'http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/cart',
            client_reference_id: order_id?.toString(), 
        })

        await db.query("UPDATE orders SET payment_id=?, payment_status='Unpaid' WHERE id=?", [session.id, order_id])

        res.json({
            checkout_url: session.url, 
            session_id: session.id
        })
    } catch(error: any) {
        res.status(500).json({ error: error.message })
    }
    }
