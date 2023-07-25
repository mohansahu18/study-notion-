const Category = require("../models/category")

const createCategory = async (req, res) => {
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
        const categoryDetails = await Category.create({
            name, description
        })

        // return success response
        return res.status(200).json({
            success: true,
            message: "category created successfully",
            data: categoryDetails
        })
    } catch (err) {
        console.error(`Failed to create category : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: "Unable to create category. Please try again later."
        })
    }
}

const showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({},
            { name: true },
            { description: true }
        )
        return res.status(200).json({
            success: true,
            message: "category fetched successfully",
            data: allCategory
        })

    } catch (err) {
        console.error(`Failed to fetch category : - > ${err}`);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch category. Please try again later."
        })

    }
}
module.exports = { createCategory, showAllCategory }