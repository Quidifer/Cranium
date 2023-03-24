import Video from "../../../resources/loadingbox.gif";
import "../JobSelect/jobSelect.css";

interface Props {
  updateScreenState: () => void;
}

export default function Calculating(props: Props) {
  setTimeout(() => {
    props.updateScreenState();
  }, 1000);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#dfdfdf",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        style={{
          height: "300px",
          marginBottom: "50px",
        }}
        src={Video}
        alt="Loading..."
      />
      <p
        className="TopHeader"
        style={{
          marginLeft: "15px",
          fontSize: "30px",
        }}
      >
        Calculating...
      </p>
    </div>
  );
}
