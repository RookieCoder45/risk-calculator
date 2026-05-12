"use client";

import styles from "./page.module.css";
import { useState, useEffect, useMemo } from "react";

export default function RiskCalculator() {
  const [account, setAccount] = useState(0);
  const [percentageRisk, setPercentageRisk] = useState(1);
  const [commission, setCommission] = useState(0.5);
  const [commType, setCommType] = useState("per-100");
  
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [riskDollarsPerDay, setRiskDollarsPerDay] = useState(0);
  const [riskedToday, setRiskedToday] = useState(0);
  const [customStop, setCustomStop] = useState("");

  const presetStops = [5, 10, 20, 30, 40, 50];

  // LOAD DATA
  useEffect(() => {
    const savedData = localStorage.getItem("risk_calc_settings");
    let initialAccount = 0;
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setAccount(Number(data.account) || 0);
        initialAccount = Number(data.account) || 0;
        setPercentageRisk(Number(data.percentageRisk) || 1);
        setCommission(Number(data.commission) || 0.5);
        setCommType(data.commType === "per-share" ? "per-100" : (data.commType || "per-100"));
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }

    const savedRisk = localStorage.getItem("risk_dollars_day");
    if (savedRisk) {
      const parsedRisk = JSON.parse(savedRisk);
      if (parsedRisk.date === currentDate) {
        setRiskDollarsPerDay(parsedRisk.value || 0);
        setRiskedToday(parsedRisk.used || 0);
      } else {
        const newRisk = Math.floor(((initialAccount / 100) * 10) * 100) / 100;
        setRiskDollarsPerDay(newRisk);
        setRiskedToday(0);
        updateDailyRiskStorage(newRisk, 0);
      }
    } else {
      // First time initialization
      const newRisk = Math.floor(((initialAccount / 100) * 10) * 100) / 100;
      setRiskDollarsPerDay(newRisk);
      setRiskedToday(0);
      updateDailyRiskStorage(newRisk, 0);
    }
  }, [currentDate]);

  const updateDailyRiskStorage = (value, used) => {
    localStorage.setItem(
      "risk_dollars_day",
      JSON.stringify({ value, used, date: currentDate })
    );
  };

  const handleThresholdChange = (val) => {
    const num = Number(val);
    setRiskDollarsPerDay(num);
    updateDailyRiskStorage(num, riskedToday);
  };

  const handleRiskedTodayChange = (val) => {
    const num = Number(val);
    setRiskedToday(num);
    updateDailyRiskStorage(riskDollarsPerDay, num);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "risk_calc_settings",
      JSON.stringify({ account, percentageRisk, commission, commType })
    );
    alert("Settings saved!");
  };

  const resetDailyRisk = () => {
    const newRisk = Math.floor(((account / 100) * 10) * 100) / 100;
    setRiskDollarsPerDay(newRisk);
    setRiskedToday(0);
    updateDailyRiskStorage(newRisk, 0);
  };

  const riskPerTrade = useMemo(() => {
    return (account / 100) * percentageRisk;
  }, [account, percentageRisk]);

  const remainingRisk = useMemo(() => {
    return Math.max(0, riskDollarsPerDay - riskedToday);
  }, [riskDollarsPerDay, riskedToday]);

  const riskPercentLeft = useMemo(() => {
    if (riskDollarsPerDay <= 0) return 0;
    return (remainingRisk / riskDollarsPerDay) * 100;
  }, [remainingRisk, riskDollarsPerDay]);

  const calculatePosition = (stopCents) => {
    if (!stopCents || stopCents <= 0) return null;
    
    const stopDollars = stopCents / 100;
    const rawShares = riskPerTrade / stopDollars;
    const shares = Math.floor(rawShares);
    
    let totalComm = 0;
    if (commType === "per-100") {
      totalComm = Math.ceil(shares / 100) * commission * 2;
    } else if (commType === "flat") {
      totalComm = commission * 2;
    }

    return {
      shares,
      commission: totalComm.toFixed(2),
      targets: {
        r2: (stopCents * 2).toFixed(0),
        r3: (stopCents * 3).toFixed(0),
      }
    };
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Risk Command</h1>
        <p className={styles.subtitle}>Institutional-grade trade planning</p>
      </header>

      <section className={styles.grid}>
        {/* Settings Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account Settings</h3>
          <div className={styles.inputGroup}>
            <label>Equity ($)</label>
            <input
              type="number"
              placeholder="50,000"
              value={account || ""}
              onChange={(e) => setAccount(Number(e.target.value))}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Risk Per Trade (%)</label>
            <div className={styles.radioGroup}>
              {[0.5, 1, 2, 5].map((val) => (
                <button
                  key={val}
                  className={percentageRisk === val ? styles.activeRadio : ""}
                  onClick={() => setPercentageRisk(val)}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Commission</label>
            <div className={styles.commInputWrapper}>
              <input
                type="number"
                step="0.01"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
              />
              <select 
                value={commType} 
                onChange={(e) => setCommType(e.target.value)}
              >
                <option value="per-100">/ 100 Sh</option>
                <option value="flat">Flat Fee</option>
              </select>
            </div>
          </div>

          <button className={styles.saveButton} onClick={saveSettings}>
            Lock Settings
          </button>
        </div>

        {/* Daily Risk Card */}
        <div className={`${styles.card} ${styles.dailyRiskCard}`}>
          <h3 className={styles.cardTitle}>Daily Threshold</h3>
          
          <div className={styles.thresholdInputs}>
            <div className={styles.inputGroup}>
              <label>Daily Max Risk ($)</label>
              <input 
                type="number" 
                value={riskDollarsPerDay || ""} 
                onChange={(e) => handleThresholdChange(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Risked Today ($)</label>
              <input 
                type="number" 
                value={riskedToday || ""} 
                onChange={(e) => handleRiskedTodayChange(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.riskDisplay}>
            <span 
              className={styles.riskValue}
              style={{ color: riskPercentLeft < 20 ? "var(--accent-rose)" : "var(--accent-emerald)" }}
            >
              ${remainingRisk.toFixed(2)}
            </span>
            <span className={styles.riskLabel}>Remaining Risk Budget</span>
          </div>

          <div className={styles.riskBar}>
            <div 
              className={styles.riskProgress} 
              style={{ 
                width: `${riskPercentLeft}%`,
                backgroundColor: riskPercentLeft < 20 ? "var(--accent-rose)" : "var(--accent-emerald)"
              }}
            ></div>
          </div>

          <button className={styles.resetButton} onClick={resetDailyRisk}>
            Reset Daily Limit
          </button>
        </div>

        {/* Calculator Results */}
        <div className={`${styles.card} ${styles.calculatorCard}`}>
          <div className={styles.summaryHeader}>
            <div className={styles.stat}>
              <label>Risk Per Trade</label>
              <span className={styles.statValue}>${riskPerTrade.toFixed(2)}</span>
            </div>
            <div className={styles.customStopWrapper}>
              <label>Custom Stop (¢)</label>
              <input
                type="number"
                placeholder="25"
                value={customStop}
                onChange={(e) => setCustomStop(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Stop</th>
                  <th>Size</th>
                  <th>Comm (Rnd)</th>
                  <th>2:1 Target</th>
                  <th>3:1 Target</th>
                </tr>
              </thead>
              <tbody>
                {customStop && (
                  <tr className={styles.customRow}>
                    <td>{customStop}¢</td>
                    {(() => {
                      const data = calculatePosition(Number(customStop));
                      return (
                        <>
                          <td className={styles.shares}>{data.shares}</td>
                          <td className={styles.comm}>${data.commission}</td>
                          <td className={styles.target}>+{data.targets.r2}¢</td>
                          <td className={styles.target}>+{data.targets.r3}¢</td>
                        </>
                      );
                    })()}
                  </tr>
                )}
                
                {presetStops.map((stop) => {
                  const data = calculatePosition(stop);
                  return (
                    <tr key={stop}>
                      <td>{stop}¢</td>
                      <td className={styles.shares}>{data.shares}</td>
                      <td className={styles.comm}>${data.commission}</td>
                      <td className={styles.target}>+{data.targets.r2}¢</td>
                      <td className={styles.target}>+{data.targets.r3}¢</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}