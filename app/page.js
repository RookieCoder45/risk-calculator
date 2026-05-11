"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function RiskCalculator() {
  const [account, setAccount] = useState(0);
  const [percentageRisk, setPercentageRisk] = useState(1);
  const [commission, setCommission] = useState(0);

  const [currentDate] = useState(new Date().toLocaleDateString());

  const [riskDollarsPerDay, setRiskDollarsPerDay] = useState(0);

  const stopCents = [5, 10, 20, 30, 40, 50];

  // LOAD DATA
  useEffect(() => {
    const savedData = localStorage.getItem("account");

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        setAccount(Number(data.account) || 0);
        setPercentageRisk(Number(data.percentageRisk) || 1);
        setCommission(Number(data.commission) || 0);
      } catch (e) {
        console.error("Bad localStorage data");
      }
    }

    const savedRisk = localStorage.getItem("riskDollarsPerDay");

    if (!savedRisk) {
      const newRisk = 0;

      localStorage.setItem(
        "riskDollarsPerDay",
        JSON.stringify({
          riskDollarsPerDay: newRisk,
          date: currentDate,
        })
      );

      setRiskDollarsPerDay(newRisk);
    } else {
      const parsedRisk = JSON.parse(savedRisk);

      // same day
      if (parsedRisk.date === currentDate) {
        setRiskDollarsPerDay(parsedRisk.riskDollarsPerDay);
      }

      // new day
      else {
        const newRisk = (account / 100) * 10;

        setRiskDollarsPerDay(newRisk);

        localStorage.setItem(
          "riskDollarsPerDay",
          JSON.stringify({
            riskDollarsPerDay: newRisk,
            date: currentDate,
          })
        );
      }
    }
  }, [account, currentDate]);

  // SAVE SETTINGS
  function saveChanges() {
    localStorage.setItem(
      "account",
      JSON.stringify({
        account,
        percentageRisk,
        commission,
      })
    );
  }

  // RESET DAILY RISK
  function resetDailyRisk() {
    const newRisk = (account / 100) * 10;

    setRiskDollarsPerDay(newRisk);

    localStorage.setItem(
      "riskDollarsPerDay",
      JSON.stringify({
        riskDollarsPerDay: newRisk,
        date: currentDate,
      })
    );
  }

  function calculateSharesAfterCommission(stp) {
    let finalAmountOfShares = 0;

    // risk dollars
    finalAmountOfShares = (account / 100) * percentageRisk;

    // shares
    finalAmountOfShares = Math.floor(
      finalAmountOfShares / (stp / 100)
    );

    if (finalAmountOfShares < 100) {
      return (
        <div>
          <p>
            {finalAmountOfShares} shares, consider{" "}
            {commission * 2}$ commission
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>
          {finalAmountOfShares} shares, consider{" "}
          {Math.ceil(
            (finalAmountOfShares / 100) * (commission * 2)
          )}
          $ commission
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Risk Calculator</h1>

      <div>
        <label>Account:</label>

        <input
          type="number"
          value={account}
          onChange={(e) =>
            setAccount(Number(e.target.value))
          }
        />
      </div>

      <div>
        <h3>Select risk size</h3>

        <div style={{ display: "flex", gap: "1rem" }}>
          <label>
            1%
            <input
              type="radio"
              name="risk"
              checked={percentageRisk === 1}
              onChange={() => setPercentageRisk(1)}
            />
          </label>

          <label>
            2%
            <input
              type="radio"
              name="risk"
              checked={percentageRisk === 2}
              onChange={() => setPercentageRisk(2)}
            />
          </label>

          <label>
            5%
            <input
              type="radio"
              name="risk"
              checked={percentageRisk === 5}
              onChange={() => setPercentageRisk(5)}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            Daily Risk: {riskDollarsPerDay}$

            <button
              type="button"
              onClick={resetDailyRisk}
            >
              reset
            </button>
          </div>
        </div>
      </div>

      <hr />

      <h2>
        At selected level of risk, you should be risking:
        {" "}
        {((account / 100) * percentageRisk).toFixed(2)}$
        {" "}
        per trade
      </h2>

      <div>
        <label>Commission ($ per 100 shares):</label>

        <input
          type="number"
          value={commission}
          onChange={(e) =>
            setCommission(Number(e.target.value))
          }
        />
      </div>

      <div>
        <p>
          Position Size based on the risk per trade
        </p>

        {stopCents.map((stp) => (
          <div key={stp}>
            <span>{stp}¢ stop:</span>
            {" "}
            {calculateSharesAfterCommission(stp)}
          </div>
        ))}
      </div>

      <button onClick={saveChanges}>
        Save changes
      </button>
    </div>
  );
}