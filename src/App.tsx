import React, { useState, useEffect, useRef } from 'react';
import { MOCK_AI_DATABASE } from './questions';

const CATEGORY_ICONS: { [key: string]: string } = {
  "Capital Cities in Europe": "🏰",
  "Capital Cities in the World": "🌐",
  "Highest Mountains in Each Continent": "🏔️",
  "Key Historic Buildings in Europe": "🏛️",
  "Anatomy": "🧬",
  "Maths": "🔢"
};

// --- GAME SETTINGS ---
const MIXED_MODE_MAX_QUESTIONS = 10;
const SPACED_REPETITION_INTERVAL = 7;

const KUDOS_WORDS = [
  "Incredible!", 
  "Phenomenal!", 
  "Absolute Genius!", 
  "Magnificent!", 
  "Sensational!", 
  "Outstanding!", 
  "You're Unstoppable!", 
  "Spot On!",
  "You got it!",
  "You're amazing!",
  "You're a rockstar!",
  "Brilliant move!",
  "Pure perfection!",
  "Absolute Legend!"
];

const KUDOS_GRAPHICS = ["⭐", "🎉", "✨", "🏆", "🚀", "🔥", "⚡", "💥", "🌟", "🏅", "🎈"];
// --------------------

const playSoundEffect = (type: 'correct' | 'wrong', isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.05);
        osc.connect(gain);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.05 + 0.25);
        
        osc.start(ctx.currentTime + index * 0.05);
        osc.stop(ctx.currentTime + index * 0.05 + 0.25);
      });
    } else {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130.81, ctx.currentTime);
      osc.frequency.setValueAtTime(110.00, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.error("Audio restriction:", e);
  }
};

export default function App() {
  const [screen, setScreen] = useState<'START' | 'HOME' | 'LOADING' | 'QUIZ' | 'SCORE'>('START');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  
  // FIXED: Removed totalQuestionsAnswered line that was causing the build error
  
  const [points, setPoints] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [streakMilestoneReached, setStreakMilestoneReached] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentKudos, setCurrentKudos] = useState<string>("✓ Correct!");

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [fadeTrigger, setFadeTrigger] = useState<boolean>(true);
  const [wrongQueue, setWrongQueue] = useState<{ targetIndex: number; questionObj: any }[]>([]);

  const [missedQuestionsRegistry, setMissedQuestionsRegistry] = useState<any[]>([]);
  const [showReviewMistakesPanel, setShowReviewMistakesPanel] = useState<boolean>(false);
  const [isNewHighScoreAchieved, setIsNewHighScoreAchieved] = useState<boolean>(false);

  const [countdownValue, setCountdownValue] = useState<string | number>('');
  const countdownIntervalRef = useRef<any>(null);

  const [isTimerMode, setIsTimerMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const timerIntervalRef = useRef<any>(null);

  const changeScreenWithFade = (newScreen: 'START' | 'HOME' | 'LOADING' | 'QUIZ' | 'SCORE') => {
    setFadeTrigger(false);
    setTimeout(() => {
      setScreen(newScreen);
      setFadeTrigger(true);
    }, 150);
  };

  const getMilestoneTrophyDetails = (totalPoints: number) => {
    if (totalPoints >= 80) {
      return { badge: "🥇", rank: "Gold Champion Badge", labelColor: "#eab308" };
    } else if (totalPoints >= 40) {
      return { badge: "🥈", rank: "Silver Badge", labelColor: "#94a3b8" };
    } else {
      return { badge: "🥉", rank: "Bronze Badge", labelColor: "#b45309" };
    }
  };

  const runPreGameCountdown = (onComplete: () => void) => {
    changeScreenWithFade('LOADING');
    let count = 3;
    setCountdownValue(count);
    
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count === 0) {
        setCountdownValue('GO!');
      } else if (count < 0) {
        clearInterval(countdownIntervalRef.current);
        onComplete();
      } else {
        setCountdownValue(count);
      }
    }, 850);
  };

  useEffect(() => {
    const savedHighScore = localStorage.getItem('quiz_high_score');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes backgroundMoveGradientEffect {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes quizScreenFadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes crownCelebrationAnimation {
        0% { transform: scale(0.3) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.3) rotate(15deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes countdownBeat {
        0% { transform: scale(0.5); opacity: 0; }
        30% { transform: scale(1.2); opacity: 1; }
        80% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.4); opacity: 0; }
      }
      .fade-animated-content {
        animation: quizScreenFadeIn 0.25s ease-out forwards;
      }
      .crown-animation {
        display: inline-block;
        animation: crownCelebrationAnimation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        font-size: 42px;
        margin-bottom: 5px;
      }
      .countdown-pulser {
        font-size: 72px;
        font-weight: 800;
        color: #6366f1;
        animation: countdownBeat 0.85s linear infinite;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => { if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current); };
  }, []);

  useEffect(() => {
    if (screen === 'QUIZ' && isTimerMode && selectedAnswer === null) {
      setTimeLeft(10);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setSelectedAnswer("TIMEOUT_EXPIRED");
            setWrongCount(prev => prev + 1);
            playSoundEffect('wrong', isMuted);
            
            const currentQ = questions[currentIndex];
            if (currentQ) {
              setMissedQuestionsRegistry(prev => [...prev, { ...currentQ, userPicked: "TIMEOUT" }]);
              setWrongQueue(prevQueue => [
                ...prevQueue,
                { targetIndex: currentIndex + SPACED_REPETITION_INTERVAL + 1, questionObj: currentQ }
              ]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [screen, currentIndex, selectedAnswer, isTimerMode, questions, isMuted]);

  const startQuizCampaign = (chosenCategory?: string) => {
    setWrongQueue([]);
    setCorrectCount(0);
    setWrongCount(0);
    setMissedQuestionsRegistry([]);
    setShowReviewMistakesPanel(false);
    setIsNewHighScoreAchieved(false);

    const allCategories = Object.keys(MOCK_AI_DATABASE);
    let targetCategory = chosenCategory;
    if (!targetCategory) {
      const available = allCategories.filter(cat => !completedCategories.includes(cat));
      if (available.length === 0) {
        targetCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        setCompletedCategories([targetCategory]);
      } else {
        targetCategory = available[Math.floor(Math.random() * available.length)];
        setCompletedCategories([...completedCategories, targetCategory]);
      }
    } else {
      setCompletedCategories([targetCategory]);
    }
    const shuffledQuestions = [...MOCK_AI_DATABASE[targetCategory]].sort(() => 0.5 - Math.random());
    setCurrentCategory(targetCategory);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);

    runPreGameCountdown(() => {
      changeScreenWithFade('QUIZ');
    });
  };

  const startMixedQuiz = () => {
    setWrongQueue([]);
    setCorrectCount(0);
    setWrongCount(0);
    setMissedQuestionsRegistry([]);
    setShowReviewMistakesPanel(false);
    setIsNewHighScoreAchieved(false);

    let pool: any[] = [];
    Object.keys(MOCK_AI_DATABASE).forEach((cat) => {
      pool = [...pool, ...MOCK_AI_DATABASE[cat]];
    });
    const mixedQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, MIXED_MODE_MAX_QUESTIONS);
    setCurrentCategory('Mixed Categories');
    setQuestions(mixedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);

    runPreGameCountdown(() => {
      changeScreenWithFade('QUIZ');
    });
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setSelectedAnswer(option);

    const currentQ = questions[currentIndex];

    if (option === currentQ.correct_answer) {
      setScore(score + 1);
      setCorrectCount(prev => prev + 1);
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      let roundPoints = 10;
      if (nextStreak === 3) {
        roundPoints += 15;
        setStreakMilestoneReached(true);
      }
      setPoints(p => p + roundPoints);
      
      const randomKudos = KUDOS_WORDS[Math.floor(Math.random() * KUDOS_WORDS.length)];
      const randomGraphic = KUDOS_GRAPHICS[Math.floor(Math.random() * KUDOS_GRAPHICS.length)];
      setCurrentKudos(`${randomGraphic} ${randomKudos} +10 Points`);
      
      playSoundEffect('correct', isMuted);
    } else {
      setCurrentStreak(0);
      setWrongCount(prev => prev + 1);
      setMissedQuestionsRegistry(prev => [...prev, { ...currentQ, userPicked: option }]);
      
      playSoundEffect('wrong', isMuted);
      
      setWrongQueue(prevQueue => [
        ...prevQueue,
        { targetIndex: currentIndex + SPACED_REPETITION_INTERVAL + 1, questionObj: currentQ }
      ]);
    }
  };

  const handleNext = () => {
    setStreakMilestoneReached(false);
    const nextVirtualIndex = currentIndex + 1;

    const recurringItem = wrongQueue.find(item => item.targetIndex === nextVirtualIndex);

    if (recurringItem) {
      setWrongQueue(prev => prev.filter(item => item.targetIndex !== nextVirtualIndex));
      
      const updatedQuestions = [...questions];
      updatedQuestions.splice(nextVirtualIndex, 0, recurringItem.questionObj);
      
      setQuestions(updatedQuestions);
      setCurrentIndex(nextVirtualIndex);
      setSelectedAnswer(null);
    } else if (currentIndex < questions.length - 1) {
      setCurrentIndex(nextVirtualIndex);
      setSelectedAnswer(null);
    } else {
      if (points > highScore) {
        setIsNewHighScoreAchieved(true);
        setHighScore(points);
        localStorage.setItem('quiz_high_score', points.toString());
      }
      changeScreenWithFade('LOADING');
      setTimeout(() => {
        if (currentCategory === 'Mixed Categories') {
          changeScreenWithFade('SCORE');
          return;
        }

        const allCategories = Object.keys(MOCK_AI_DATABASE);
        const available = allCategories.filter(cat => !completedCategories.includes(cat));
        let nextCategory = available.length === 0 ? allCategories[Math.floor(Math.random() * allCategories.length)] : available[Math.floor(Math.random() * available.length)];
        setCompletedCategories([...completedCategories, nextCategory]);
        setQuestions([...MOCK_AI_DATABASE[nextCategory]].sort(() => 0.5 - Math.random()));
        setCurrentCategory(nextCategory);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        changeScreenWithFade('QUIZ');
      }, 1000);
    }
  };

  const triggerQuitAndSave = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (points > highScore) {
      setIsNewHighScoreAchieved(true);
      setHighScore(points);
      localStorage.setItem('quiz_high_score', points.toString());
    }
    changeScreenWithFade('SCORE');
  };

  const resetToMainMenuGlobal = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setScore(0);
    setPoints(0);
    setCurrentStreak(0);
    setCompletedCategories([]);
    setWrongQueue([]);
    setMissedQuestionsRegistry([]);
    setShowReviewMistakesPanel(false);
    setIsNewHighScoreAchieved(false);
    setSelectedAnswer(null);
    setStreakMilestoneReached(false);
    changeScreenWithFade('START');
  };

  const currentStyles = isDarkMode ? darkStyles : lightStyles;
  const progressPercentage = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const trophy = getMilestoneTrophyDetails(points);

  const dynamicBackgroundLayout = isDarkMode
    ? { backgroundImage: 'linear-gradient(-45deg, #0f172a, #1e1b4b, #311042, #020617)', backgroundSize: '400% 400%', animation: 'backgroundMoveGradientEffect 18s ease infinite' }
    : { backgroundImage: 'linear-gradient(-45deg, #f1f5f9, #e0e7ff, #fae8ff, #f8fafc)', backgroundSize: '400% 400%', animation: 'backgroundMoveGradientEffect 18s ease infinite' };

  return (
    <div style={{ ...styles.pageContainer, ...dynamicBackgroundLayout }}>
      <div style={styles.topControlActionRow}>
        {screen !== 'START' && (
          <button style={{ ...styles.globalHomeButton, backgroundColor: currentStyles.cardBg, color: currentStyles.textMain, borderColor: currentStyles.border }} onClick={resetToMainMenuGlobal}>
            Home
          </button>
        )}
        <button style={{ ...styles.themeToggleBtn, backgroundColor: currentStyles.cardBg, color: currentStyles.textMain, borderColor: currentStyles.border }} onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
        <button style={{ ...styles.themeToggleBtn, backgroundColor: currentStyles.cardBg, color: currentStyles.textMain, borderColor: currentStyles.border }} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
      
      <div style={{ ...styles.card, backgroundColor: currentStyles.cardBg, borderColor: currentStyles.border }}>
        {screen === 'QUIZ' && (
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
          </div>
        )}

        <div className={fadeTrigger ? 'fade-animated-content' : ''} style={{ opacity: fadeTrigger ? 1 : 0, transition: 'opacity 0.15s ease-out' }}>
          
          {screen === 'START' && (
            <div style={styles.centerBox}>
              <h1 style={{ color: currentStyles.textMain, lineHeight: '1.4', padding: '10px 0', margin: '0 0 10px 0' }}>
                💥 Mind Sparks Quiz 💥
              </h1>
              {highScore > 0 && <p style={{ color: '#6366f1', fontWeight: 'bold' }}> Personal Best: {highScore} pts</p>}
              
              <div style={{ margin: '20px 0', padding: '10px', background: currentStyles.nestedBox, borderRadius: '8px' }}>
                <label style={{ color: currentStyles.textMain, display: 'flex', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isTimerMode} onChange={(e) => setIsTimerMode(e.target.checked)} />
                  Activate 10-Second Speed Timer
                </label>
              </div>
              
              <button style={{ ...styles.primaryButton, backgroundColor: '#d97706' }} onClick={() => startQuizCampaign()}>Play All</button>
              <button style={{ ...styles.primaryButton, backgroundColor: '#22c55e', marginTop: '10px' }} onClick={startMixedQuiz}>Play 10 Mixed Qs</button>
              <button style={{ ...styles.primaryButton, backgroundColor: '#8b5cf6', marginTop: '10px' }} onClick={() => changeScreenWithFade('HOME')}>Choose Category</button>
            </div>
          )}

          {screen === 'HOME' && (
            <div>
              <h2 style={{ textAlign: 'center', color: currentStyles.textMain }}>Select Category</h2>
              <div style={styles.categoryGrid}>
                {Object.keys(MOCK_AI_DATABASE).map(cat => (
                  <button key={cat} style={{ ...styles.categoryCard, backgroundColor: currentStyles.nestedBox, color: currentStyles.textMain, borderColor: currentStyles.border }} onClick={() => startQuizCampaign(cat)}>
                    <span style={{ marginRight: '8px' }}>{CATEGORY_ICONS[cat]}</span> {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === 'LOADING' && (
            <div style={{ ...styles.centerBox, padding: '40px 0' }}>
              <div key={countdownValue} className="countdown-pulser">
                {countdownValue}
              </div>
            </div>
          )}
          {/* --- QUIZ SCREEN INTERFACE BLOCK --- */}
          {screen === 'QUIZ' && questions.length > 0 && (
            <div>
              <div style={styles.header}>
                <span style={{ color: currentStyles.textMain, fontWeight: 'bold' }}>
                  {currentCategory} ({currentIndex + 1}/{questions.length})
                </span>
                
                {/* Live Flame Streak Tracker Widget Panel */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {currentStreak > 0 && (
                    <span style={{ 
                      backgroundColor: currentStreak >= 5 ? '#ef4444' : '#f97316', 
                      color: '#fff', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 'bold' 
                    }}>
                      🔥 {currentStreak} Streak
                    </span>
                  )}
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Score: {points} pts</span>
                </div>
              </div>
              
              {isTimerMode && (
                <div style={styles.timerBarTrack}>
                  <div style={{ ...styles.timerBarFill, width: `${(timeLeft / 10) * 100}%`, backgroundColor: timeLeft <= 3 ? '#ef4444' : '#6366f1' }}></div>
                </div>
              )}

              {/* ANCHORED INTERFACE LAYOUT WRAPPER PANEL BOX CONTAINER */}
              <div style={styles.anchoredQuizMainWrapperFrameBox}>
                
                {/* Anchored question title height row box */}
                <div style={styles.questionFixedContainer}>
                  <h3 style={{ color: currentStyles.textMain, margin: 0 }}>{questions[currentIndex].question}</h3>
                </div>
                
                <div style={styles.optionsGrid}>
                  {questions[currentIndex].options.map((option: string) => {
                    const isCorrect = option === questions[currentIndex].correct_answer;
                    let btnStyle = { ...styles.optionButton, backgroundColor: currentStyles.optionBtnBg, color: currentStyles.textMain, borderColor: currentStyles.border };
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnStyle = { ...btnStyle, backgroundColor: '#bbf7d0', borderColor: '#22c55e', color: '#166534' };
                      else if (selectedAnswer === option) btnStyle = { ...btnStyle, backgroundColor: '#fecaca', borderColor: '#ef4444', color: '#991b1b' };
                    }
                    return (
                      <button key={option} style={btnStyle} onClick={() => handleAnswerSelect(option)} disabled={selectedAnswer !== null}>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Static Space Allocator Box Container for Explanation Overlay */}
                <div style={styles.explanationFixedWrapperContainer}>
                  {selectedAnswer !== null && (
                    <div style={{ padding: '15px', background: currentStyles.nestedBox, borderRadius: '8px', border: '1px solid', borderColor: currentStyles.border }}>
                      <h4 style={{ margin: '0 0 5px 0', color: selectedAnswer === questions[currentIndex].correct_answer ? '#22c55e' : '#ef4444' }}>
                        {selectedAnswer === "TIMEOUT_EXPIRED" ? "⏰ Time Expired!" : (selectedAnswer === questions[currentIndex].correct_answer ? currentKudos : "❌ Incorrect")}
                        {streakMilestoneReached && " 🔥 + Streak Bonus!"}
                      </h4>
                      <p style={{ color: currentStyles.textMain, margin: '0 0 15px 0', fontSize: '14px', lineHeight: '1.4' }}>{questions[currentIndex].explanation}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={triggerQuitAndSave}>Quit Game</button>
                        <button style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleNext}>Next Q ➔</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* --- SCORE SUMMARY SCREEN INTERFACE BLOCK --- */}
          {screen === 'SCORE' && (
            <div style={styles.centerBox}>
              {isNewHighScoreAchieved && (
                <div>
                  <span className="crown-animation">👑</span>
                  <h3 style={{ color: '#eab308', margin: '0 0 10px 0', fontWeight: 'bold' }}>NEW PERSONAL BEST!</h3>
                </div>
              )}
              
              <h2 style={{ color: currentStyles.textMain, marginBottom: '5px' }}>Game Over</h2>
              
              {/* Custom Trophy Milestone Panel Badge Display */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '2px' }}>{trophy.badge}</span>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px', color: trophy.labelColor }}>Rank Unlocked: {trophy.rank}</p>
              </div>

              <p style={{ color: currentStyles.textMuted, fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Yield Total: {points} Points</p>
              
              <div style={{ ...styles.breakdownBox, backgroundColor: currentStyles.nestedBox, borderColor: currentStyles.border }}>
                <h4 style={{ margin: '0 0 12px 0', color: currentStyles.textMain, fontSize: '15px' }}>Session Performance Breakdown</h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '16px' }}>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>✅ Correct: {correctCount}</span>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>❌ Incorrect: {wrongCount}</span>
                </div>
              </div>

              {/* Scrollable Mistake Review Tool Summary Panel */}
              {missedQuestionsRegistry.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button 
                    style={{ ...styles.primaryButton, backgroundColor: '#6366f1', marginBottom: '10px' }} 
                    onClick={() => setShowReviewMistakesPanel(!showReviewMistakesPanel)}
                  >
                    {showReviewMistakesPanel ? "Hide Wrong Answers ⬆️" : "Review Mistakes 🔍"}
                  </button>
                  
                  {showReviewMistakesPanel && (
                    <div style={{ ...styles.reviewContainer, backgroundColor: currentStyles.nestedBox, borderColor: currentStyles.border }}>
                      {missedQuestionsRegistry.map((item, idx) => (
                        <div key={idx} style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: idx < missedQuestionsRegistry.length - 1 ? `1px solid ${currentStyles.border}` : 'none', textAlign: 'left' }}>
                          <p style={{ fontWeight: 'bold', color: currentStyles.textMain, fontSize: '14px', marginBottom: '4px' }}>Q: {item.question}</p>
                          <p style={{ color: '#ef4444', fontSize: '13px', margin: '2px 0' }}>Your pick: {item.userPicked}</p>
                          <p style={{ color: '#22c55e', fontSize: '13px', margin: '2px 0', fontWeight: '500' }}>Correct: {item.correct_answer}</p>
                          <p style={{ color: currentStyles.textMuted, fontSize: '12px', fontStyle: 'italic', marginTop: '4px' }}>💡 {item.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button style={{ ...styles.primaryButton, backgroundColor: '#64748b' }} onClick={resetToMainMenuGlobal}>Main Menu</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Solid Contrast Palette Themes 
const lightStyles = { bodyBg: '#f1f5f9', cardBg: '#ffffff', border: '#cbd5e1', nestedBox: '#f1f5f9', optionBtnBg: '#ffffff', textMain: '#0f172a', textMuted: '#475569' };
const darkStyles = { bodyBg: '#0f172a', cardBg: '#090d16', border: '#6366f1', nestedBox: '#131a2a', optionBtnBg: '#0f172a', textMain: '#f8fafc', textMuted: '#94a3b8' };

// Global inline structural CSS stylesheets styles
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', boxSizing: 'border-box', position: 'relative', fontFamily: 'system-ui, sans-serif' },
  topControlActionRow: { position: 'absolute', top: '12px', right: '15px', display: 'flex', gap: '8px', zIndex: 10 },
  globalHomeButton: { border: '1px solid', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  themeToggleBtn: { border: '1px solid', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  card: { width: '100%', maxWidth: '500px', borderRadius: '12px', padding: '30px', boxSizing: 'border-box', borderWidth: '2px', borderStyle: 'solid', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' },
  progressBarContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#e2e8f0' },
  progressBarFill: { height: '100%', backgroundColor: '#6366f1', transition: 'width 0.2s' },
  centerBox: { textAlign: 'center' as const, padding: '20px 0' },
  primaryButton: { width: '100%', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' },
  
  // FIX CONTROLS: Standard flow layout framework utilizing static spacer blocks 
  anchoredQuizMainWrapperFrameBox: { display: 'flex', flexDirection: 'column' },
  questionFixedContainer: { minHeight: '56px', display: 'flex', alignItems: 'center', marginBottom: '10px', textAlign: 'left' as const },
  explanationFixedWrapperContainer: { minHeight: '165px', marginTop: '20px' },
  
  timerBarTrack: { width: '100%', height: '6px', background: '#cbd5e1', borderRadius: '3px', overflow: 'hidden', marginBottom: '15px' },
  timerBarFill: { height: '100%', transition: 'width 1s linear' },
  categoryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' },
  categoryCard: { display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', textAlign: 'left' as const },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionButton: { width: '100%', textAlign: 'left' as const, border: '1px solid', padding: '14px', borderRadius: '6px', fontSize: '15px', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' },
  breakdownBox: { padding: '15px', borderRadius: '8px', border: '1px solid', marginBottom: '24px', textAlign: 'center' as const },
  reviewContainer: { maxHeight: '220px', overflowY: 'auto' as const, padding: '12px', border: '1px solid', borderRadius: '8px', textAlign: 'left' as const, marginTop: '5px' }
};
