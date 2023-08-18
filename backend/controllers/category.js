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
        const allCategory = await Category.find()
        // console.log(`all category  : - > ${allCategory}`);
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

const categoryPageDetail = async (req, res) => {
    try {

        // fetch category id
        const { categoryId } = req.body

        // get course for specific category id
        const selectedCategory = await Category.findById(categoryId).populate("course").exec()

        // validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "courses not found"
            })
        }

        // get courses for different category
        const differentCategory = await Category.find(
            { _id: { $ne: categoryId } }
        ).populate("course").exec()

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory
            }
        })
    } catch (err) {
        console.log(`issue with fetching the category course : - >${err}`);
        return res.status(404).json({
            success: false,
            message: 'issue with fetching the category course',
            error: err.message
        })
    }
}

module.exports = { createCategory, showAllCategory, categoryPageDetail }