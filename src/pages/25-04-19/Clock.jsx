import React, { useEffect, useRef } from "react";
import permanentMarkerFont from "./sph.ttf"; 

const BALL_SIZES = {
  hours: 18,
  minutes: 10,
  seconds: 5,
};

const GRAVITIES = {
  hours: 6,
  minutes: 7,
  seconds: 8,
};

const BALL_PROPERTIES = {
  hours: { bounce: 0.7, friction: 0.1 },
  minutes: { bounce: 0.6, friction: 0.8 },
  seconds: { bounce: 0.4, friction: 0.999 },
};

const roomTypes = [
  {
    name: "hours",
    colorClass: "hour-ball",
    countFn: () => {
      const h = new Date().getHours();
      return h % 12 === 0 ? 12 : h % 12;
    },
    max: 12,
    size: BALL_SIZES.hours,
    gravity: GRAVITIES.hours,
    properties: BALL_PROPERTIES.hours,
    width: 100,
    height: 20,
  },
  {
    name: "minutes",
    colorClass: "minute-ball",
    countFn: () => new Date().getMinutes(),
    max: 60,
    size: BALL_SIZES.minutes,
    gravity: GRAVITIES.minutes,
    properties: BALL_PROPERTIES.minutes,
    width: 100,
    height: 35,
  },
  {
    name: "seconds",
    colorClass: "second-ball",
    countFn: () => new Date().getSeconds(),
    max: 60,
    size: BALL_SIZES.seconds,
    gravity: GRAVITIES.seconds,
    properties: BALL_PROPERTIES.seconds,
    width: 100,
    height: 35,
  },
];

const SphereDropClock = () => {
  const towerRef = useRef(null);
  const latestBalls = useRef({ hours: null, minutes: null });
  const state = useRef({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tower = towerRef.current;

    // Create rooms
    roomTypes.forEach((type, i) => {
      let room = document.createElement("div");
      room.className = "room";
      room.id = `${type.name}-room`;
      room.style.width = `${type.width}vw`;
      room.style.height = `${type.height}vh`;
      const yTranslate = roomTypes.slice(0, i).reduce((sum, r) => sum + r.height, 0);
      room.style.transform = `translateY(${yTranslate}vh)`;
      tower.appendChild(room);
    });

    function getNextNumber(room) {
      return room.childElementCount + 1;
    }

    function dropBall(room, colorClass, size, gravity, bounce, friction, roomHeight, roomWidth, typeName) {
      const ball = document.createElement("div");
      ball.className = `ball ${colorClass}`;
      ball.innerText = getNextNumber(room);
      ball.style.width = `${size}vh`;
      ball.style.height = `${size}vh`;
      ball.style.fontSize = `${size / 2.5}vh`;

      let posX = Math.random() * (roomWidth - size);
      let posY = -30;
      let posZ = Math.random() * (roomWidth - size);
      let velocityY = 0;
      let velocityX = (Math.random() - 0.5) * 100;
      let velocityZ = (Math.random() - 0.5) * 100;
      const bounceFactor = bounce;
      const frictionFactor = friction;
      let bouncing = true;

      if (typeName === "hours" || typeName === "minutes") {
        latestBalls.current[typeName] = ball;
      }

      room.appendChild(ball);

      function animate() {
        if (bouncing) {
          velocityY += gravity * 0.016;
          posX += velocityX * 0.016;
          posY += velocityY * 0.016;
          posZ += velocityZ * 0.016;

          if (posX <= 0 || posX >= roomWidth - size) {
            posX = Math.max(0, Math.min(posX, roomWidth - size));
            velocityX = -velocityX * bounceFactor;
          }

          if (posZ <= 0 || posZ >= roomWidth - size) {
            posZ = Math.max(0, Math.min(posZ, roomWidth - size));
            velocityZ = -velocityZ * bounceFactor;
          }

          if (posY >= roomHeight - size) {
            posY = roomHeight - size;
            velocityY = -velocityY * bounceFactor;
            velocityX *= frictionFactor;
            velocityZ *= frictionFactor;

            if (
              Math.abs(velocityY) < 2 &&
              Math.abs(velocityX) < 2 &&
              Math.abs(velocityZ) < 2
            ) {
              bouncing = false;

              if (
                (typeName === "hours" || typeName === "minutes") &&
                latestBalls.current[typeName] === ball
              ) {
                velocityX = (Math.random() - 0.5) * 10;
                velocityZ = (Math.random() - 0.5) * 10;
              }
            }
          }
        } else if (
          (typeName === "hours" || typeName === "minutes") &&
          latestBalls.current[typeName] === ball
        ) {
          posX += velocityX * 0.016;
          posZ += velocityZ * 0.016;

          if (posX <= 0 || posX >= roomWidth - size) {
            posX = Math.max(0, Math.min(posX, roomWidth - size));
            velocityX = -velocityX;
          }
          if (posZ <= 0 || posZ >= roomWidth - size) {
            posZ = Math.max(0, Math.min(posZ, roomWidth - size));
            velocityZ = -velocityZ;
          }

          if (Math.random() < 0.01) {
            velocityX = (Math.random() - 0.5) * 10;
            velocityZ = (Math.random() - 0.5) * 10;
          }
        }

        ball.style.transform = `translateX(${posX}vw) translateY(${posY}vh) translateZ(${posZ - 50}vh)`;
        requestAnimationFrame(animate);
      }

      animate();
    }

    function resetRoom(roomId, typeName) {
      const room = document.getElementById(roomId);
      while (room.firstChild) {
        room.removeChild(room.firstChild);
      }
      if (typeName === "hours" || typeName === "minutes") {
        latestBalls.current[typeName] = null;
      }
    }

    function syncBalls() {
      roomTypes.forEach((type) => {
        const current = type.countFn();
        const prev = state.current[type.name] || 0;

        if (current < prev || prev > type.max) {
          resetRoom(`${type.name}-room`, type.name);
          state.current[type.name] = 0;
        }

        for (let i = state.current[type.name] || 0; i < current; i++) {
          const room = document.getElementById(`${type.name}-room`);
          dropBall(
            room,
            type.colorClass,
            type.size,
            type.gravity,
            type.properties.bounce,
            type.properties.friction,
            type.height,
            type.width,
            type.name
          );
        }

        state.current[type.name] = current;
      });
    }

    syncBalls();
    const intervalId = setInterval(syncBalls, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'SphFont';
          src: url(${permanentMarkerFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body,html {
          width: 100%;
          height: 100%;
          background: #a10d0d;
          overflow: hidden;
          margin: 0;
        }

        #tower {
          position: absolute;
          top: 20vh;
          right: 15vw;
          transform-origin: top right;
          transform-style: preserve-3d;
          transform: scale(0.8) rotateX(20deg) rotateY(20deg);
          perspective: 1500px;
          width: 100vw;
          height: 100vh;
          overflow: visible;
        }

        .room {
          position: absolute;
          transform-style: preserve-3d;
          width: 100vw;
          overflow: visible;
          height: auto;
        }

        .ball {
          font-family: 'SphFont', sans-serif;
          border-radius: 50%;
          position: absolute;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(7, 21, 112);
          user-select: none;
          box-shadow: 0 0 1vh rgba(0,0,0,0.3);
        }

        .hour-ball {
          background: radial-gradient(circle at 30%, #0dcaec, #056d7b);
        }

        .minute-ball {
          background: radial-gradient(circle at 30%, #dce30b, #c2b30c);
        }

        .second-ball {
          background: radial-gradient(circle at 30%, #f80, #c50);
        }
      `}</style>

      <div id="tower" ref={towerRef}></div>
    </>
  );
};

export default SphereDropClock;
