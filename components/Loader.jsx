import React from "react";

const Loader = () => {
  return (
    <div style={styles.loaderWrapper}>
      <div style={styles.loader}></div>
      <style>
        {`
          @keyframes l4 {
            0%     { -webkit-mask: conic-gradient(#0000 0, #000 0); }
            16.67% { -webkit-mask: conic-gradient(#0000 60deg, #000 0); }
            33.33% { -webkit-mask: conic-gradient(#0000 120deg, #000 0); }
            50%    { -webkit-mask: conic-gradient(#0000 180deg, #000 0); }
            66.67% { -webkit-mask: conic-gradient(#0000 240deg, #000 0); }
            83.33% { -webkit-mask: conic-gradient(#0000 300deg, #000 0); }
            100%   { -webkit-mask: conic-gradient(#0000 360deg, #000 0); }
          }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", 
    width: "100vw", 
    backgroundColor: "#f3f3f3", 
    position: "relative",
  },
  loader: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "12px solid #d1914b",
    boxSizing: "border-box",
    background: `
      no-repeat radial-gradient(farthest-side, #d64123 94%, #0000) 11px 15px,
      no-repeat radial-gradient(farthest-side, #000 94%, #0000) 6px 15px,
      no-repeat radial-gradient(farthest-side, #d64123 94%, #0000) 35px 23px,
      no-repeat radial-gradient(farthest-side, #000 94%, #0000) 29px 15px,
      no-repeat radial-gradient(farthest-side, #d64123 94%, #0000) 11px 46px,
      no-repeat radial-gradient(farthest-side, #000 94%, #0000) 11px 34px,
      no-repeat radial-gradient(farthest-side, #d64123 94%, #0000) 36px 0px,
      no-repeat radial-gradient(farthest-side, #000 94%, #0000) 50px 31px,
      no-repeat radial-gradient(farthest-side, #d64123 94%, #0000) 47px 43px,
      no-repeat radial-gradient(farthest-side, #000 94%, #0000) 31px 48px,
      #f6d353
    `,
    backgroundSize: "20px 20px, 8px 8px",
    animation: "l4 5s infinite, rotate 3s linear infinite",
  },
};

export default Loader;
