import { Link } from "react-router-dom"
import '../../styles/sign-in-up.css'

export const SignInUp = () => {
    return (<>
        <Link to='sign-in' className="button-in-out">Đăng nhập</Link>
        <Link to='register' className="button-in-out">Đăng kí</Link>
    </>
    )
}