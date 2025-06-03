import { FaBook, FaBookOpen, FaFlagCheckered, FaHandsHelping, FaLightbulb, FaRegUser, FaUser } from 'react-icons/fa';
import {BsBook} from "react-icons/bs";
import "./MainHeader.css"
const Header = () => {
    return (
        <div className="header_section">
                <div className="profile_icon"><FaRegUser/><span className='online'></span></div>
                <h1 className="headerr">SYONIT</h1>
                <div className="book_icon"><BsBook/></div>
              </div>
    )
}
export default Header;