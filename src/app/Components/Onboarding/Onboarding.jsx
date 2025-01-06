import Header from "../Header";
import "./onboarding.css";
import { FaPlay } from "react-icons/fa";
const Onboarding = () => {
    return (
        <div className="new_onboarding_container">
            <div className="onboarding_primary_text">
                <p>A mind game tourna-musement.</p>
                <h1>SY<span className="syonit_text_logo"><img src="/syonit_logo.png" alt="syonit logo" /></span>Nit!</h1>
            </div>

            <div className="new_onboarding_bottom_content">
                
               
                    <img src='/Musketeers_update.svg' alt='musketeeers' className="onboarding_musketeer"/>
         

            <div className="new_onboarding_bottom_text">
                <p className="think_differently">THINK DIFFERENTLY</p>
                <p className="become_a_syonaire">You Can Become A Syonaire</p>
            </div>

            <div className="play_container">
                <button><FaPlay/></button>
            </div>
            </div>
        </div>
    )
}

export default Onboarding;