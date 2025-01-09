import {useRef} from "react";
import "./onboarding.css";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Onboarding = () => {
    const router = useRouter();
    const audioRef = useRef(null);

    const playAudio = () => {
      if (!audioRef.current) {
        // Create the Audio object if it doesn't exist
        audioRef.current = new Audio("/Sounds/SYON.mp3");
      }
      audioRef.current.play();
    };
    return (
        <div className="new_onboarding_container">
            <div className="onboarding_primary_text">
                <p>A mind game tourna-musement </p>
                <h1>SY<span className="syonit_text_logo"><img src="/syonit_icon.png" alt="syonit logo" /></span>Nit!</h1>
            </div>

            <div className="new_onboarding_bottom_content">
                
             <img src='/main_musketeer.svg' alt='musketeeers' className="onboarding_musketeer"/>
             
             <div className="new_onboarding_bottom_text">
                <p className="think_differently">THINK <span className="flipped">D</span>IFFERENTLY</p>
                <p className="become_a_syonaire">You Can Become A Syonaire</p>
            </div>

            <div className="play_container">
                <button onClick={() => {
                    router.push("/Home");
                    playAudio();
                }}><FaPlay/></button>
            </div>
            </div>
        </div>
    )
}

export default Onboarding;