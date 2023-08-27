const Category = require("../models/category")
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

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
        // Fetch category id from query parameters
        const categoryId = req.query.categoryId;
        // console.log("categoryId from query:", categoryId);

        // get course for specific category id
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReview",
                populate: "instructor",

            })
        // console.log("selected category:", selectedCategory)
        // validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            })
        }
        // where are no courses in category
        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // get courses for other category
        const categoriesExceptSelected = await Category.find(
            { _id: { $ne: categoryId } }
        )
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        ).populate({
            path: "course",
            match: { status: "Published" },
        })

        // top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses
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