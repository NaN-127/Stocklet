import User from "../models/User.js";


export const addToWatchList = async(req, res) => {
    try {
        const {symbol} = req.body;

        const user = await User.findById(req.user.id);

        if(user.watchList.includes(symbol.toUpperCase())){
            return res.status(400).json({
                message: "Stock already added to watchlist"
            });
        }

        user.watchList.push(symbol.toUpperCase());
        
        await user.save();

        res.status(200).json({

            message: "Stock added to watchlist",
            watchList: user.watchList
        });

    } catch(err) {

        res.status(500).json({ message: "Internal server error: " + err.message });
    }
}


export const removeFromwatchList = async(req, res) => {
    try {
        const {symbol} = req.params;

        const user = await User.findById(req.user.id);

        if(!user.watchList.includes(symbol.toUpperCase() )){
            return res.status(400).json({
                message: "Stock not found in watchlist"
            });
        }

        user.watchList.pull(symbol.toUpperCase());

        await user.save();

        res.status(200).json({
            message: "Stock removed from watchlist",

            watchList: user.watchList
        });
    } catch(err) {
        res.status(500).json({ message: "Internal server error: " + err.message });
    }
}


export const getWatchList = async(req, res) => {


    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            watchList: user.watchList
        });
    } catch(err) {


        res.status(500).json({ message: "Internal server error: " + err.message });
    }
}