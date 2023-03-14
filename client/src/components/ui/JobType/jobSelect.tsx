import React, { useState } from "react";
import "./jobSelect.css";
import BalancePhoto from "../../../resources/BalanceLogo.png";
import LoadPhoto from "../../../resources/LoadLogo.png";
import JobSelectScreen from "../../../resources/JobSelectBackground.png";

interface Props {
    setScreenState: React.Dispatch<React.SetStateAction<string>>;
}


export default function JobSelect (props: Props) {
    const { setScreenState } = props;
    const [job, setJob] = useState<string>("");
    

    return (
        <div>
            <div className="TopHeader">
                    Choose a Job
                </div>
            <div className="Background" style={{ backgroundImage: `url(${JobSelectScreen})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            opacity: '15%'}}>
            </div>

            <div className="Buttons"> 
                <button className="Load" onClick={() => {setJob("Load")}}>Load</button>
                {/* <button className="button-89" role="button">Load</button> */}
                <button className="Balance"onClick={() => {setJob("Balance")}}>Balance</button>
                <button className="Continue"onClick={() => {
                    if (job === "Load"){
                        setScreenState("Load");
                    }
                    else if (job === "Balance"){
                        setScreenState("Balance");
                    }
                }} >Continue</button>
                
            </div>
        
       </div>

    );

}
