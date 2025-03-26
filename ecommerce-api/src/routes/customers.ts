import express from "express";
import { 
  getCustomers, 
  getCustomerById,
  getCustomerByEmail, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer } from "../controllers/customerController";
const router = express.Router();

router.get("/", getCustomers)
router.get("/:id", getCustomerById)
router.post("/", createCustomer)
router.patch("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)
router.get("/email/:email", getCustomerByEmail)

export default router