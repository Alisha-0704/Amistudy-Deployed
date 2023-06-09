//

// import TinderCard from "react-tinder-card";
// import { useState } from "react";
// // import { animated, config, interpolate, useSpring } from "@react-spring/web";
// import "./Dashboard.css";
// import shreimg from "../images/shreya_mishra.png";
// import alishaimg from "../images/Alisha.jpg";
// import palakimg from "../images/palak.jpg";
// import riyaimg from "../images/Riya.jpg";

// const Dashboard = () => {
//   const characters = [
//     {
//       name: "Shreya",
//       image: shreimg,
//       About:"eregjrtkrejorjtlrfle",

//     },
//     {
//       name: "Palak",
//       image: palakimg,
//       About:"eregjrtkrejorjtlrfle",
//     },
//     {
//       name: "Riya",
//       image: riyaimg,
//       About:"eregjrtkrejorjtlrfle",
//     },
//     {
//       name: "Alisha",
//       image: alishaimg,
//       About:"eregjrtkrejorjtlrfle",
//     },
//     {
//       name: "Ayushi",
//       image: alishaimg,
//       About:"eregjrtkrejorjtlrfle",
//     },
//   ];

//   const [lastDirection, setLastDirection] = useState();

//   const swiped = (direction, nameToDelete) => {
//     console.log("removing: " + nameToDelete);
//     setLastDirection(direction);
//   };

//   const outOfFrame = (name) => {
//     console.log(name + " left the screen!");
//   };
//   const handleStudy = () => {
//     console.log("Let's study!");
//   };

//   const handleNo = () => {
//     console.log("No");
//   };

//   return (
// //     <div className="dashboard">
// //       <div className="swiper-container">
// //         <div className="card-container">
// //           {characters.map(({ name, image }) => (
// //             <div key={name}>
// //               <TinderCard
// //                 className="swipe"
// //                 onSwipe={(dir) => swiped(dir, name)}
// //                 onCardLeftScreen={() => outOfFrame(name)}
// //               >
// //                 <div
// //                   style={{ backgroundImage: `image(${image})` }}
// //                   className="card"
// //                 >
// //                   <h3>{name}</h3>
// //                 </div>
// //               </TinderCard>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="swipe-info">
// //           {lastDirection && <p>You swiped {lastDirection}</p>}
// //         </div>
// //         <div className="button-container">
// //           <button className="study-button" onClick={handleStudy}>
// //             Let's Study
// //           </button>
// //           <button className="no-button" onClick={handleNo}>
// //             No
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// export default Dashboard;

import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import "./Dashboard.css";

const db = [
  {
    name: "Richard Hendricks",
    url: "./img/richard.jpg",
  },
  {
    name: "Erlich Bachman",
    url: "./img/erlich.jpg",
  },
  {
    name: "Monica Hall",
    url: "./img/monica.jpg",
  },
  {
    name: "Jared Dunn",
    url: "./img/jared.jpg",
  },
  {
    name: "Dinesh Chugtai",
    url: "./img/dinesh.jpg",
  },
];

function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div className="Dashboard_Main">
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <div className="cardContainer_outer">
        <h1>React Tinder Card</h1>
        <div className="cardContainer">
          {db.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name, index)}
              onCardLeftScreen={() => outOfFrame(character.name, index)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        <div className="buttons">
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("left")}
          >
            Maybe next time
          </button>
          <button
            style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
            onClick={() => goBack()}
          >
            Reconsider the profile
          </button>
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("right")}
          >
            Let's study
          </button>
        </div>

        {lastDirection ? (
          <h2 key={lastDirection} className="infoText">
            You swiped {lastDirection}
          </h2>
        ) : (
          <h2 className="infoText">
            Swipe a card or press a button to get Restore Card button visible!
          </h2>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
