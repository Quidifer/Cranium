import "./Tile.css";

export function Tile(props: any) {
  const { color, id, name, scale, tileHeight, widthScale } = props;
  console.log(scale);
  return (
    <>
      {id !== "1,1" ? (
        <div
          style={{
            height: `${scale * tileHeight}px`,
            width: `${scale * tileHeight * widthScale}px`,
            background: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ccc",
          }}
        >
          <div
            id={id}
            className={"Tile"}
            style={{
              height: `${scale * tileHeight - 2}px`,
              width: `${scale * tileHeight * widthScale - 2}px`,
              background: color,
            }}
          >
            <p style={{ fontSize: `${scale * 0.5}rem` }}>{name}</p>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: `${scale * tileHeight}px`,
            width: `${scale * tileHeight * widthScale}px`,
            background: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ccc",
          }}
        >
          <div
            id={id}
            className={"Tile"}
            style={{
              height: `${scale * tileHeight - 2}px`,
              width: `${scale * tileHeight * widthScale - 2}px`,
              background: color,
            }}
          >
            <p style={{ fontSize: `${scale * 0.5}rem` }}>{name}</p>
          </div>
          <div
            style={{
              position: "absolute",
              height: `${scale * tileHeight}px`,
              width: `${scale * tileHeight * widthScale}px`,
              border: "4px dashed green",
              borderRadius: `${scale * 5}px`,
            }}
          ></div>
        </div>
      )}
    </>
  );
}
