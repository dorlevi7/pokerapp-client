import React, { useMemo } from "react";
import "../styles/FloatingDecorations.css";

function FloatingDecorations() {
  const positions = useMemo(() => {
    return {
      card1: randomPos(),
      card2: randomPos(),
      card3: randomPos(),
      card4: randomPos(),
      chipMain: randomPos(),
      chip1: randomPos(),
      chip2: randomPos(),
      chip3: randomPos(),
    };
  }, []);

  function randomPos() {
    const top = Math.random() * 80 + 5;
    const left = Math.random() * 80 + 5;
    return { top: `${top}%`, left: `${left}%` };
  }

  return (
    <>
      {/* CARD 1 */}
      <div className="card-wrapper card1-wrapper" style={positions.card1}>
        <div className="card-inner">
          <div
            className="card-face card-front"
            style={{ backgroundImage: "url('/card1.png')" }}
          ></div>
          <div
            className="card-face card-back"
            style={{ backgroundImage: "url('/card_back.png')" }}
          ></div>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="card-wrapper card2-wrapper" style={positions.card2}>
        <div className="card-inner">
          <div
            className="card-face card-front"
            style={{ backgroundImage: "url('/card2.png')" }}
          ></div>
          <div
            className="card-face card-back"
            style={{ backgroundImage: "url('/card_back.png')" }}
          ></div>
        </div>
      </div>

      {/* CARD 3 */}
      <div className="card-wrapper card3-wrapper" style={positions.card3}>
        <div className="card-inner">
          <div
            className="card-face card-front"
            style={{ backgroundImage: "url('/card.png')" }}
          ></div>
          <div
            className="card-face card-back"
            style={{ backgroundImage: "url('/card_back.png')" }}
          ></div>
        </div>
      </div>

      {/* CARD 4 */}
      <div className="card-wrapper card4-wrapper" style={positions.card4}>
        <div className="card-inner">
          <div
            className="card-face card-front"
            style={{ backgroundImage: "url('/card3.png')" }}
          ></div>
          <div
            className="card-face card-back"
            style={{ backgroundImage: "url('/card_back.png')" }}
          ></div>
        </div>
      </div>

      {/* MAIN CHIP */}
      <div className="chip-wrapper" style={positions.chipMain}>
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 1 */}
      <div className="chip-wrapper chip1" style={positions.chip1}>
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip1.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip1.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 2 */}
      <div className="chip-wrapper chip2" style={positions.chip2}>
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip2.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip2.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 3 */}
      <div className="chip-wrapper chip3" style={positions.chip3}>
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip3.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip3.png')" }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default FloatingDecorations;
