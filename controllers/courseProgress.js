const CourseProgress = require("../models/courseProgress");
const SubSection = require("../models/subSection");


const updateCourseProgress = async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    try {
        //check if the subsection is valid
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Invalid SUbSection"
            });
        }

        console.log("SubSection Validation Done", subSection);

        //check for old entry 
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });
        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress does not exist"
            });
        }
        else {
            console.log("Course Progress Validation Done");
            //check for re-completing video/subsection
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    error: "Subsection already completed",
                });
            }

            //push into completed video
            courseProgress.completedVideos.push(subSectionId);
            console.log("Course Progress Push Done");
        }
        await courseProgress.save();
        console.log("Course Progress Save call Done");
        return res.status(200).json({
            success: true,
            message: "Course Progress Updated Successfully",
            data: courseProgress
        })
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: "issue occur in updating the course progress",
            error: err.message

        });
    }
}

module.exports = { updateCourseProgress }