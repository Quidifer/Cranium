import React, { useState } from "react";
import FirstComponent from "./firstComponent";
import InputField from "./InputField";
import "./jobType.css";
let Logo = "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/streams/2013/August/130808/6C8558749-130808-walter-white-tease.jpg"

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
}

const JobType: React.FC = () => {
  const [todo, setTodo] = useState<string>("");

  console.log(todo);
  
  return (
    <div className= "App">
      <span className="heading">Taskify</span>
      <InputField todo={todo} setTodo={setTodo} />
    </div>
  );
}

export default JobType;
