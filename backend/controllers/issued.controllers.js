import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getLatestFile = async (req, res) => {
    try {
        const ISSUED_URL = process.env.ISSUED_URL;
        const response = await axios.get(`${ISSUED_URL}/latest-file`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};