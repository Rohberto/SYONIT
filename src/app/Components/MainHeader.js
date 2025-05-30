import { FaBook, FaBookOpen, FaFlagCheckered, FaHandsHelping, FaLightbulb, FaRegUser, FaUser } from 'react-icons/fa';
import {BsBook} from "react-icons/bs";
import "./MainHeader.css"
const Header = () => {
    return (
        <div className="header-section">
                <div className="profile-icon"><FaRegUser/><span className='online'></span></div>
                <h1 className="header">SYONIT</h1>
                <div className="book-icon"><BsBook/></div>
              </div>
    )
}
export default Header;