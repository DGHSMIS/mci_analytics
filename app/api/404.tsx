import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <div
      style={{
        height: "98.5vh",
        width: "98.7vw",
        fontFamily: "system-ui",
        // backgroundColor: "darkslateblue",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Image src="/img/lost.jpg" alt="" width="500" height="212" />
          <h1
            style={{
              fontSize: "5rem",
            }}
          >
            Yikes! 404 Error
          </h1>
          <h2>You seem to lost...</h2>
          <Link
            href={"/"}
            style={{
              color: "green",
              textDecoration: "none",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
