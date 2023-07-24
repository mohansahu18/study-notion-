const Tags = require("../models/tags")

const createTag = async (req, res) => {
    try {

        // fetch data
        const { name, description } = req.body

        // validate
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "please fill all the fields"
            })
        }

        // create entry in db
        const tagsDetails = await Tags.create({
            name, description
        })

        // return success response
        return res.status(200).json({
            success: true,
            message: "tags created successfully",
            data: tagsDetails
        })
    } catch (err) {
        console.error(`Failed to create tags : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: "Unable to create tags. Please try again later."
        })
    }
}

const showAllTags = async (req, res) => {
    try {
        const allTags = await Tags.find({},
            { name: true },
            { description: true }
        )
        return res.status(200).json({
            success: true,
            message: "tags fetched successfully",
            data: allTags
        })

    } catch (err) {
        console.error(`Failed to create tags : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch tags. Please try again later."
        })

    }
}
module.exports = { createTag }