import React, { useState } from "react";
import "./password.css";
// import '../SignIn/signIn.css'
import { IconButton, InputAdornment, Input } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import cranium from "../../../resources/cranium.svg";

interface Props {
  updateScreenState: () => void;
}
const websitePassword = "pw";

export default function Password(props: Props) {
  const { updateScreenState } = props;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const [isCorrectPassword, setIsCorrectPassword] = useState(false);

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
      updateScreenState();
      setIsIncorrectPassword(false);
      setIsCorrectPassword(true);
    } else {
      setIsCorrectPassword(false);
      setIsIncorrectPassword(true);
    }
  };

  return (
    <div className="CraniumDiv"> 
      <img src={cranium} alt="Cranium" className="Cranium"></img>
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
        <div style={{ fontSize: "17px", paddingTop: "10px", color: "#f24f4b" }}>
          Incorrect password. Please try again.{" "}
        </div>
      ) : (
        ""
      )}
      {isCorrectPassword ? (
        <div style={{ fontSize: "17px", paddingTop: "10px", color: "#7acc64" }}>
          Correct password!{" "}
        </div>
      ) : (
        ""
      )}
      </div>
      
  );
}
