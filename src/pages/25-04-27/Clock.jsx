import React, { useEffect } from "react";
import './MoneyMoney-Regular.ttf';
import coinGif from "./images/coin.gif";
import spinWebp from "./images/spin.webp";

const SpinningCoinClock = () => {
  useEffect(() => {
    const clock = document.getElementById("clock");

    // Create hour markers
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const number = document.createElement("div");
      number.className = "number";
      number.textContent = i;
      number.style.left = `calc(50% + ${Math.sin(angle) * 19}vw - 1vw)`;
      number.style.top = `calc(50% - ${Math.cos(angle) * 19}vw - 1vw)`;
      clock.appendChild(number);
    }

    // Create clock hands
    const hourHand = document.createElement("div");
    hourHand.className = "hand hour-hand";
    clock.appendChild(hourHand);

    const minuteHand = document.createElement("div");
    minuteHand.className = "hand minute-hand";
    clock.appendChild(minuteHand);

    const secondHand = document.createElement("div");
    secondHand.className = "hand second-hand";
    clock.appendChild(secondHand);

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const hourDeg = hours * 30 + minutes * 0.5;
      const minuteDeg = minutes * 6;
      const secondDeg = seconds * 6;

      hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#060606",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
        width: "100vw",
        margin: 0,
        perspective: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={coinGif}
        alt="coin background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div
        id="clock"
        style={{
          width: "80vh",
          height: "80vh",
          borderRadius: "50%",
          position: "relative",
          transformStyle: "preserve-3d",
          animation: "spin 7s linear infinite",
        }}
      >
        <div
          className="center"
          style={{
            width: "8vh",
            height: "8vh",
            backgroundImage: `url(${spinWebp})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        ></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background-color: #d3ad62;
        }

        .hour-hand {
          width: 0.6vw;
          height: 12vw;
          transform: translateX(-50%);
        }

        .minute-hand {
          width: 0.4vw;
          height: 16vw;
          transform: translateX(-50%);
        }

        .second-hand {
          width: 0.2vw;
          height: 2000vw;
          transform: translateX(-50%);
        }

        .number {
          font-family: 'MoneyMoney-Regular', sans-serif;
          position: absolute;
          font-size: 7.6vw;
          color: #d3ad62;
          text-align: center;
          width: 2vw;
        }
      `}</style>
    </div>
  );
};

export default SpinningCoinClock;