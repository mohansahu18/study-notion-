import React, { useEffect, useState } from 'react'
// import Footer from '../common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/api';
import getCatalogaPageData from '../../services/operation/pageandcomponent';
import Course_Card from '../core/catalog/Course_Card';
import CourseSlider from '../core/catalog/CourseSlider';
import { useSelector } from "react-redux"
// import Error from './ErrorPage';

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
    const { catalogName } = useParams()
    // console.log("catalogName : - >", catalogName)

    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    //Fetch all categories
    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("res from show all categorry", res.data.data);
            const category_id =
                res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            // console.log("category id : - >", category_id);
            setCategoryId(category_id);
        }
        getCategories();
    }, [catalogName]);

    const getCategoryDetails = async () => {
        // console.log("sate category id", categoryId);
        try {
            const res = await getCatalogaPageData(categoryId);
            console.log("PRinting res: ", res);
            setCatalogPageData(res);
            // console.log("catalogPageData", catalogPageData);
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (categoryId !== null) {
            getCategoryDetails();
        }

    }, [categoryId]);


    if (loading || !catalogPageData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    if (!loading && !catalogPageData.success) {
        // return <Error />
    }

    return (
        <>
            {/* Hero Section */}
            <div className=" box-content  bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-yellow-25">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>
                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </p>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className=" mx-auto box-content w-full  px-4 py-12 max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider
                        Courses={catalogPageData?.data?.selectedCategory?.course}
                    />
                </div>
            </div>
            {/* Section 2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Top courses in {catalogPageData?.data?.differentCategory?.name}
                </div>
                <div className="py-8">
                    <CourseSlider
                        Courses={catalogPageData?.data?.differentCategory?.course}
                    />
                </div>
            </div>

            {/* Section 3 */}
            {catalogPageData?.data?.mostSellingCourses[0] !== null &&
                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className="section_heading">Frequently Bought</div>
                    <div className="py-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {console.log("CATELOG PAGE DATA : - >", catalogPageData)}
                            {
                                catalogPageData?.data?.mostSellingCourses
                                    ?.slice(0, 4)
                                    .map((course, i) => (
                                        <Course_Card course={course} key={i} Height={"h-[400px]"} />
                                    ))
                            }
                            {/* {catalogPageData?.data?.mostSellingCourses
                            ?.slice(0, 4)
                            .map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[400px]"} />
                            ))} */}
                        </div>
                    </div>
                </div>
            }
            {/* <Footer /> */}
        </>
    )
}

export default Catalog