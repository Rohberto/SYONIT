
import "./onboarding.css";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAudio } from "@/app/Context/AudioContext";

const Onboarding = () => {
    const router = useRouter();
    const {audioRef} = useAudio();
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
                <h1>SY <div className="flip-container"><div className="flip-card"><div className="flip-card-front"><img src="/syonit_icon.png" alt="syonit logo" /></div> 
     <div class="flip-card-back">
     <img src='/dark_musketeer.png' alt='musketeeers' className="coin_musketeer"/>
    </div>
    </div></div>Nit!</h1>
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