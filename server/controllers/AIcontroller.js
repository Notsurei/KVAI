const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require('../models/ContentHistory');
const User = require('../models/User');

const AIGenerated = (async (req, res) => {
    const {prompt} = req.body;
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).json({message: text});

        const newContent = await ContentHistory.create({
            user: req.user._id,
            content: text
        });

        const userFound = await User.findById(req?.user?.id);
        userFound.ContentHistory.push(newContent?._id);
        userFound.apiRequestCount += 1;
        
        await userFound.save();
        res.status(200).json(result);
    } catch (error) {
        // return res.status(400).json({message: error.message});
    }
});

module.exports = {AIGenerated};
