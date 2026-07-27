import { useEffect } from 'react';
import './App.css';
import { JOBS } from './data/jobs';
import { initGame } from './gameLogic';

function App() {
  useEffect(() => {
    initGame(JOBS);
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{position:'absolute', overflow:'hidden'}}>
        <filter id="sharpenFilter">
          <feConvolveMatrix order="3" preserveAlpha="true"
            kernelMatrix="0 -0.5 0 -0.5 3 -0.5 0 -0.5 0"/>
        </filter>
      </svg>


      <div id="stars"></div>

      <div className="console">
        <div className="screen crt-boot" id="screen">
          <div className="scanlines"></div>
          <div className="fx-layer" id="fx-layer"></div>

          {/* ===================== START SCREEN ===================== */}
          <section id="screen-start" className="scene active">
            <div className="badge-card">
              <div className="top-row">
                <span>HI-SCORE<span className="hi-score">123000</span></span>
                <span className="hearts">♥ ♥ ♥ ♥ ♥</span>
              </div>

              <div className="logo"><span className="star-ico">★</span> DONGLELAND <span className="star-ico">★</span></div>
              <div className="sub-tag">- PIXEL CAREER ADVENTURE -</div>

              <div className="diamond-row">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>

              <div className="start-word">START</div>

              <div className="ready-text">ARE YOU READY?</div>

              <div className="yn-row" id="yn-row">
                <div className="yn-option selected" id="opt-yes" tabIndex={0} role="button">YES <span className="tri">◀</span></div>
                <div className="yn-option" id="opt-no" tabIndex={0} role="button">NO</div>
              </div>
              <div className="no-toast" id="no-toast"></div>
            </div>
          </section>

          {/* ===================== SELECT SCREEN ===================== */}
          <section id="screen-select" className="scene">
            <div className="select-title">
              <span className="deco l">🚀</span>직업을 선택하세요<span className="deco r">🚀</span>
            </div>

            <div className="job-panel">
              <div className="panel-top">
                <span className="lv">◆ STEP 1 <span className="nickname-badge" id="nickname-badge"></span></span>
                <span>👾 👾 👾</span>
              </div>

              <div className="job-stage">
                <button className="nav-btn" id="btn-prev" aria-label="이전 직업">◀</button>
                <div className="row3" id="row3">
                  <div className="slot side" id="slot-prev"><div className="frame"><img alt="" /></div></div>
                  <div className="slot center" id="slot-current">
                    <div className="frame"><img alt="" /></div>
                    <div className="name-tag" id="name-tag"></div>
                  </div>
                  <div className="slot side" id="slot-next"><div className="frame"><img alt="" /></div></div>
                </div>
                <button className="nav-btn" id="btn-next" aria-label="다음 직업">▶</button>
              </div>

              <div className="pointer">▲</div>
              <div className="dots" id="dots"></div>
            </div>

            <div className="select-btn-row">
              <button className="pixel-btn select-btn" id="btn-select">선택</button>
            </div>
          </section>

          <div className="modal-overlay" id="modal">
            <div className="modal-box">
              <button className="modal-x" id="modal-x" aria-label="닫기">✕</button>

              {/* STEP 1: 차수 선택 */}
              <div className="modal-step active" id="step-tier">
                <div className="m-frame" id="tier-frame"><img id="tier-job-img" alt="" /></div>
                <p className="modal-title">현재 차수를 선택하세요</p>
                <div className="tier-row" id="tier-row"></div>
                <div className="modal-actions">
                  <button className="pixel-btn select-btn" id="tier-next" disabled>다음</button>
                </div>
              </div>

              {/* STEP 2: 닉네임 설정 */}
              <div className="modal-step" id="step-nickname">
                <p className="modal-title" style={{marginBottom:'18px'}}>닉네임을 설정하세요</p>
                <input className="nickname-input" id="nickname-input" maxLength={12} placeholder="닉네임 입력" />
                <div className="modal-actions">
                  <button className="pixel-btn" id="nickname-back">이전</button>
                  <button className="pixel-btn select-btn" id="nickname-next">완료</button>
                </div>
              </div>

              {/* STEP 3: 확인 */}
              <div className="modal-step" id="step-confirm">
                <div className="m-frame" id="confirm-frame"><img id="confirm-job-img" alt="" /></div>
                <p><b id="confirm-name"></b>님, <b id="confirm-job"></b> <b id="confirm-tier"></b>로<br />모험을 시작합니다!</p>
                <div className="modal-actions">
                  <button className="pixel-btn select-btn" id="modal-close">확인</button>
                </div>
              </div>

            </div>
          </div>

          {/* ===================== ROOM SCREEN (placeholder) ===================== */}
          <section id="screen-room" className="scene room-scene">
            <div className="room-placeholder">
              <div className="room-title">내 방</div>
              <div className="room-sub" id="room-sub"></div>
              <div className="room-hint">( 방 화면은 추후 채워질 예정입니다 )</div>
            </div>
          </section>

          <div className="cutscene-dialogue" id="cutscene-dialogue"></div>
          <div className="cutscene-blackout" id="cutscene-blackout"></div>
        </div>
      </div>


    </>
  );
}

export default App;
