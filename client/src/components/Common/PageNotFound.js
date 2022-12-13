import { Result } from "antd";
import "../../styles/page-not-found.css";

const PageNotFound = () => {
    return (
        <div className="container-not-found">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        </div>
    )
}

export default PageNotFound;