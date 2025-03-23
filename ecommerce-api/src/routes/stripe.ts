import express from "express"
import { createHostedCheckoutSession } from "../controllers/stripeController"
const router = express.Router()

router.post("/create-checkout-session-hosted", createHostedCheckoutSession)

export default router