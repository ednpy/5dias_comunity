import mongoose from "mongoose";

export const get5NoticiasDelDia = async (req, res) => {
    try {
        const settings = await mongoose.connection.db.collection('settings').findOne({ type: "5_del_dia" });
        if (!settings) {
            return res.status(404).json({ message: "Settings not found" });
        }
        res.json(settings["5_noticias_del_dia"]);
    } catch (error) {
        console.error("Error in get5NoticiasDelDia controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};