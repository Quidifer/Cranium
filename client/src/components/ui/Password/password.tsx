import React, { useEffect, useState } from "react";
import "./password.css";
// import '../SignIn/signIn.css'
import { IconButton, InputAdornment, Input } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../../../utils/API";
import cranium from "../../../resources/cranium.svg";
import { height, positions } from "@mui/system";

interface Props {
  updateScreenState: () => void;
  restoreSession: () => void;
}
const websitePassword = "pw";

export default function Password(props: Props) {
  const { updateScreenState, restoreSession } = props;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onMouseDownShowPassword = (event: any) => {
    event.preventDefault();
  };

  const onChange = (event: any) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === websitePassword) {
      setIsIncorrectPassword(false);
      API.checkForSession().then((result) => {
        if (result) {
          restoreSession();
        } else {
          updateScreenState();
        }
      });
    } else {
      setIsIncorrectPassword(true);
    }
  };

  return (
    <div className="PasswordScreen"> 
      <div className="CraniumDiv"> 
        
        <img src={cranium} alt="Cranium" className="CraniumLogoPassword" style={{ position: "relative" }}></img>
          <div className="screen">
      <form onSubmit={onSubmit}>
        <div>
          <label style={{ fontSize: "17px", color: "#9b9b9b" }}>
            Please enter website password
          </label>
        </div>
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            style={{ fontFamily: "Monaco", fontSize: "25px" }}
            onChange={onChange}
            value={password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={onShowPassword}
                  onMouseDown={onMouseDownShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <input type="submit" value="Enter" className="passwordbutton" />
      </form>
      </div>

      {/* <div>
            Password entered: {password}
        </div> */}
      {isIncorrectPassword ? (
        <div className="IncorrectPassword" style={{ fontSize: "17px", paddingTop: "10px", color: "#f24f4b", left: "10%" }}>
          Incorrect password. Please try again.{" "}
        </div>
      ) : (
        ""
      )}
      </div>
      </div>
      
  );
}
