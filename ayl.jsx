import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Utility helpers ---
const cls = (...c) => c.filter(Boolean).join(" ");
const STORAGE_KEY = "sm_game_progress_v1";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}

// --- Game Content ---
const LEVELS = [
  {
    id: 1,
    title: "Level 1 · The Need to Invest",
    minStudySeconds: 30,
    learn: `**Why invest?**\n\n• Inflation quietly reduces your money's purchasing power over time.\n• Investing helps your savings grow faster than inflation.\n\n**Where to put savings?**\nCash (safest but lowest growth), Bank deposits, Bonds, Stocks/Equity, Mutual Funds/ETFs, Gold, Real Estate.\n\n**Expectations**\n• Higher potential returns usually come with higher risk and volatility.\n• Time in the market > timing the market.\n\n**Key terms**\n• *Principal*: your invested amount.\n• *Return*: gain/loss on principal.\n• *Compounding*: earnings generate their own earnings.`,
    quiz: {
      passPct: 70,
      questions: [
        {
          q: "What does inflation do to your cash over time?",
          options: [
            "Increases its purchasing power",
            "Reduces its purchasing power",
            "Has no effect",
            "Doubles it every decade"
          ],
          correct: 1,
          explain: "Prices rise over time, so the same cash buys fewer goods — purchasing power falls.",
        },
        {
          q: "Which statement is most accurate?",
          options: [
            "Higher return assets are always safe",
            "Higher potential return usually means higher risk",
            "Risk and return are unrelated",
            "Cash always beats inflation"
          ],
          correct: 1,
          explain: "Risk–return tradeoff: to seek higher returns, you accept higher volatility and risk.",
        },
        {
          q: "Compounding means…",
          options: [
            "Only principal grows",
            "Earnings generate additional earnings",
            "Returns are fixed each year",
            "Taxes reduce to zero"
          ],
          correct: 1,
          explain: "With compounding, gains are reinvested so future gains accrue on a larger base.",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Level 2 · Regulators & Market Participants",
    minStudySeconds: 30,
    learn: `**Who keeps markets fair?**\n• *SEBI* (India) protects investors and regulates securities markets.\n\n**Key Participants**\n• Retail investors, Institutional investors (MFs, FIIs), Brokers, Exchanges (NSE/BSE), Depositories (NSDL/CDSL).\n\n**Why regulation?**\n• Transparency, disclosure, fair play, reduced manipulation, and orderly functioning.`,
    quiz: {
      passPct: 70,
      questions: [
        {
          q: "SEBI's core role is to…",
          options: [
            "Set interest rates",
            "Regulate and protect investors in securities markets",
            "Print currency",
            "Insure bank deposits"
          ],
          correct: 1,
          explain: "SEBI regulates securities markets and safeguards investor interests.",
        },
        {
          q: "NSDL and CDSL are examples of…",
          options: ["Exchanges", "Depositories", "Brokers", "Clearing banks"],
          correct: 1,
          explain: "They hold securities in demat form for investors — depositories.",
        },
      ],
    },
  },
  {
    id: 3,
    title: "Level 3 · Risk, Return & Diversification",
    minStudySeconds: 30,
    learn: `**Risk types**\n• Market risk, Sector/stock-specific risk, Liquidity risk.\n\n**Diversification**\n• Spreading across assets/sectors reduces unsystematic (stock-specific) risk.\n\n**Volatility ≠ Loss**\n• Prices move up/down day to day. Long-term horizon smooths volatility.`,
    quiz: {
      passPct: 70,
      questions: [
        {
          q: "Diversification primarily reduces…",
          options: [
            "Systematic (market) risk",
            "Unsystematic (stock-specific) risk",
            "Tax liability",
            "Inflation"
          ],
          correct: 1,
          explain: "Diversification can't remove market-wide risk but reduces idiosyncratic risk.",
        },
        {
          q: "A sharp 1-day price drop is always a permanent loss.",
          options: ["True", "False"],
          correct: 1,
          explain: "Volatility is normal; permanent loss depends on fundamentals and exit decisions.",
        },
      ],
    },
  },
  {
    id: 4,
    title: "Level 4 · Instruments: Equity, Debt, MF & ETF",
    minStudySeconds: 30,
    learn: `**Equity (Stocks)**\n• Ownership in a company; higher risk/return.\n\n**Debt (Bonds)**\n• Lending to issuers; fixed income; generally lower risk than equity.\n\n**Mutual Funds (MFs)**\n• Pooled investments managed by professionals. Active or passive.\n\n**ETFs**\n• Funds that trade on exchanges like a stock, usually tracking an index. Often low-cost.`,
    quiz: {
      passPct: 70,
      questions: [
        {
          q: "Which instrument typically tracks an index and trades like a stock?",
          options: ["Bond", "ETF", "Savings account", "Fixed deposit"],
          correct: 1,
          explain: "ETFs are exchange-traded funds, commonly index trackers.",
        },
        {
          q: "Owning a share means…",
          options: [
            "You lent money to the company",
            "You own a small part of the company",
            "You are guaranteed fixed returns",
            "You pay the company's taxes"
          ],
          correct: 1,
          explain: "Equity represents fractional ownership and uncertain returns.",
        },
      ],
    },
  },
  {
    id: 5,
    title: "Level 5 · Orders & Market Mechanics",
    minStudySeconds: 30,
    learn: `**Order Types**\n• *Market*: execute immediately at best price.\n• *Limit*: set your price; may not execute.\n• *Stop/SL*: trigger at stop price to limit loss.\n\n**Bid–Ask Spread**\n• Difference between highest buyer bid and lowest seller ask; a cost to trade.\n\n**Liquidity**\n• How easily you can buy/sell without moving price; higher liquidity usually tighter spreads.`,
    quiz: {
      passPct: 70,
      questions: [
        {
          q: "A limit order…",
          options: [
            "Always executes immediately",
            "Executes only at your price or better",
            "Guarantees execution at any price",
            "Is the same as a market order"
          ],
          correct: 1,
          explain: "Limit orders control price, not execution certainty.",
        },
        {
          q: "The bid–ask spread is best described as…",
          options: [
            "Brokerage fee",
            "Difference between highest bid and lowest ask",
            "Daily price range",
            "Tax on securities"
          ],
          correct: 1,
          explain: "Spread is an implicit trading cost and narrows with higher liquidity.",
        },
      ],
    },
  },
];

// --- Components ---
function TimerBar({ total, remaining }) {
  const pct = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" aria-label="study-timer">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ProgressDots({ levelIndex, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cls(
            "w-2.5 h-2.5 rounded-full",
            i <= levelIndex ? "bg-blue-600" : "bg-gray-300"
          )}
          aria-label={`level-${i + 1}`}
        />
      ))}
    </div>
  );
}

function Quiz({ level, onResult }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const q = level.quiz.questions[step];

  const choose = (idx) => {
    const newAns = [...answers];
    newAns[step] = idx;
    setAnswers(newAns);
  };

  const next = () => {
    if (step < level.quiz.questions.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    const correctCt = level.quiz.questions.reduce((acc, cur, i) => acc + (answers[i] === cur.correct ? 1 : 0), 0);
    const pct = Math.round((correctCt / level.quiz.questions.length) * 100);
    onResult({ scorePct: pct, answers });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">Question {step + 1} / {level.quiz.questions.length}</div>
      <div className="text-lg font-semibold">{q.q}</div>
      <div className="grid gap-3">
        {q.options.map((opt, idx) => {
          const chosen = answers[step] === idx;
          const showExplain = chosen;
          const isCorrect = idx === q.correct;
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              className={cls(
                "text-left p-3 rounded-2xl border transition",
                chosen ? (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-gray-200 hover:border-gray-300"
              )}
              aria-pressed={chosen}
            >
              <div className="font-medium">{opt}</div>
              {showExplain && (
                <div className="text-sm text-gray-600 mt-1">{q.explain}</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Select an option to proceed.</div>
        <button
          onClick={next}
          disabled={typeof answers[step] === "undefined"}
          className={cls(
            "px-4 py-2 rounded-xl font-semibold",
            typeof answers[step] === "undefined" ? "bg-gray-200 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {step < level.quiz.questions.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}

export default function StockMarketLearningGame() {
  const [progress, setProgress] = useLocalStorage(STORAGE_KEY, {
    unlockedLevel: 1, // 1-indexed id
    completedLevels: {}, // { [id]: {scorePct} }
  });

  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];

  // Modes: "learn" | "quiz" | "result"
  const [mode, setMode] = useState("learn");

  // Study timer enforcement
  const total = level.minStudySeconds;
  const [remaining, setRemaining] = useState(total);
  const timerRef = useRef(null);

  useEffect(() => {
    // reset timer when level or mode changes to learn
    if (mode === "learn") {
      setRemaining(level.minStudySeconds);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [levelIndex, mode, level.minStudySeconds]);

  // Ensure current level is unlocked; if not, jump to last unlocked
  useEffect(() => {
    const maxUnlockedIdx = Math.max(0, LEVELS.findIndex((l) => l.id === progress.unlockedLevel));
    if (levelIndex > maxUnlockedIdx) setLevelIndex(maxUnlockedIdx);
  }, []); // run once

  const canStartQuiz = remaining === 0;
  const totalLevels = LEVELS.length;

  const startQuiz = () => setMode("quiz");
  const backToLearn = () => setMode("learn");

  const onQuizResult = ({ scorePct }) => {
    setMode("result");
    // save progress
    setProgress((p) => {
      const newCompleted = { ...p.completedLevels, [level.id]: { scorePct, ts: Date.now() } };
      const passed = scorePct >= level.quiz.passPct;
      let unlockedLevel = p.unlockedLevel;
      if (passed && levelIndex < LEVELS.length - 1) {
        unlockedLevel = Math.max(unlockedLevel, LEVELS[levelIndex + 1].id);
      }
      return { ...p, completedLevels: newCompleted, unlockedLevel };
    });
  };

  const resetProgress = () => {
    setProgress({ unlockedLevel: 1, completedLevels: {} });
    setLevelIndex(0);
    setMode("learn");
  };

  const goNextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(levelIndex + 1);
      setMode("learn");
    }
  };

  const goPrevLevel = () => {
    if (levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
      setMode("learn");
    }
  };

  const completedInfo = progress.completedLevels[level.id];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock Market Learning Game</h1>
            <div className="text-sm text-gray-600">Learn → pass assignment → unlock next level</div>
          </div>
          <button
            onClick={resetProgress}
            className="text-sm px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300"
            title="Reset all progress"
          >Reset</button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-3">
          <ProgressDots levelIndex={LEVELS.findIndex(l => l.id === progress.unlockedLevel) } total={totalLevels} />
          <div className="text-sm text-gray-600">Unlocked: Level {progress.unlockedLevel} / {totalLevels}</div>
        </div>

        {/* Level Navigator */}
        <div className="flex items-center gap-2 mb-4">
          {LEVELS.map((l, idx) => {
            const locked = l.id > progress.unlockedLevel;
            return (
              <button
                key={l.id}
                onClick={() => !locked && (setLevelIndex(idx), setMode("learn"))}
                className={cls(
                  "px-3 py-1.5 rounded-xl border text-sm",
                  locked ? "border-gray-200 text-gray-400 cursor-not-allowed" : idx === levelIndex ? "border-blue-600 text-blue-700 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
                )}
                aria-disabled={locked}
                title={locked ? "Complete previous levels to unlock" : l.title}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-lg">{level.title}</div>
            <div className="text-sm text-gray-500">Mode: {mode === "learn" ? "Learning" : mode === "quiz" ? "Assignment" : "Result"}</div>
          </div>

          {mode === "learn" && (
            <div className="space-y-4">
              <TimerBar total={total} remaining={remaining} />
              <div className="prose prose-sm max-w-none">
                {level.learn.split("\n\n").map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: mdToHtml(p) }} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Study time remaining: <span className="font-semibold">{remaining}s</span></div>
                <button
                  onClick={startQuiz}
                  disabled={!canStartQuiz}
                  className={cls(
                    "px-4 py-2 rounded-xl font-semibold",
                    canStartQuiz ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500"
                  )}
                >
                  Start Assignment
                </button>
              </div>
            </div>
          )}

          {mode === "quiz" && (
            <Quiz level={level} onResult={onQuizResult} />
          )}

          {mode === "result" && (
            <ResultView level={level} info={progress.completedLevels[level.id]} onRetry={() => setMode("quiz")} onNext={goNextLevel} onLearn={backToLearn} isLast={levelIndex === LEVELS.length - 1} />
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-3">
          Tip: You must read for at least 30 seconds before each assignment unlocks. Passing score is 70%.
        </div>
      </div>
    </div>
  );
}

function ResultView({ level, info, onRetry, onNext, onLearn, isLast }) {
  const passed = info?.scorePct >= level.quiz.passPct;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Assignment Result</div>
          <div className="text-sm text-gray-600">Required to pass: {level.quiz.passPct}%</div>
        </div>
        <div className={cls("text-lg font-bold", passed ? "text-emerald-700" : "text-rose-700")}>{info?.scorePct ?? 0}%</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onLearn} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Review Learning</button>
        <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Retake Assignment</button>
        {passed && (
          <button onClick={onNext} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">{isLast ? "Finish" : "Unlock Next Level"}</button>
        )}
      </div>
      {!passed && (
        <div className="text-sm text-gray-600">You didn\'t meet the threshold. Review the concepts and try again.</div>
      )}
    </div>
  );
}

// Minimal Markdown to HTML (bold/italic and bullets only) to avoid extra deps
function mdToHtml(md) {
  let html = md
    .replace(/^\s*•\s/gm, "• ")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^• (.*)$/gm, '<li class="ml-4">$1</li>');
  // Wrap bullet groups in <ul>
  html = html.replace(/(<li[^>]*>[^<]*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  return html;
}
