import React from "react";
import ColorPallet from "../../utils/ColorPallet";
import { ButtonProps } from "../../utils/Props";
import './CraniumButton.css'

const DEFAULTS: ButtonProps = {
    border: '1px',
    color: ColorPallet.LightGreen,
    onClick: () => console.log('Click Detected!'),
    radius: '50px',
    height: '100px',
    width: '300px'
}

export default function CraniumButton (props?: ButtonProps) {
    const { border, color, onClick, children, radius, height, width } = Object.assign(DEFAULTS, props);
    return (
        <button className="CraniumButton"
            onClick={onClick}
            style={{
                backgroundColor: color,
                border,
                borderRadius: radius,
                height,
                width
            }}
        >
        {children}
        </button>
    )
}