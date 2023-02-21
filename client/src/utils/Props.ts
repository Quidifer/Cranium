import React from "react";

export interface ButtonProps {
    border?: string;
    color?: string;
    children?: React.ReactNode;
    height?: string;
    onClick?: () => void;
    radius?: string;
    width?: string;
}