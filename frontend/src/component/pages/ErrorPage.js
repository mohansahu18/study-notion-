import { useRouteError } from "react-router-dom";
import SOMETHING_WRONG from "../../assets/Images/someth-went-wrong.png"

const Error = () => {
    const err = useRouteError();
    const { status, statusText } = err
    console.log(err);
    return (
        <div className="flex text-white flex-col justify-center items-center flex-wrap">
            <h3 className=" font-medium text-2xl text-red-500 pt-5">  {status + ":" + statusText} </h3>
            <div className="flex flex-col justify-center flex-wrap" >
                <img src={SOMETHING_WRONG} />
            </div>
        </div>
    )

}
export default Error;