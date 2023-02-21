import React from 'react';
import ColorPallet from '../../../utils/ColorPallet';
import CraniumButton from '../CraniumButton/CraniumButton';
import "./CraniumToolbar.css";
import CraniumLogo from "../../../resources/CraniumLogo.png";

export default function CraniumToolbar () {
    const height = "50px";
    const width = "100px";

    return (
        <div className='CraniumToolbar'>
            <CraniumButton height={height} width={width} color={ColorPallet.LightGreen}>Finish</CraniumButton>
            <CraniumButton height={height} width={width} color={ColorPallet.Red}>Sign In</CraniumButton>
        </div>
    );
}