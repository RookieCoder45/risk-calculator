"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [account, setAccount] = useState(100);
  const [commission, setCommission] = useState(0.5);
  const [riskPercent, setRiskPercent] = useState(1);

  // Load saved account
 useEffect(() => {
  const saved = localStorage.getItem("account");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      setAccount(parsed.account ?? 100);
      setCommission(parsed.commission ?? 0.5);
      setRiskPercent(parsed.riskPercent ?? 1);
    } catch (e) {
      console.error("Failed to parse localStorage", e);
    }
  }
}, []);

  // Save account
      function saveAccountToLocalstorage() {
  const data = {
    account,
    commission,
    riskPercent,
  };

  localStorage.setItem("account", JSON.stringify(data));
}
  // ✅ always a NUMBER (no toFixed here)
const riskAfterCommission =
  account * (riskPercent / 100) - commission * 2;

  function calculateShareSize(stopSize) {
    if (stopSize <= 0 || riskAfterCommission <= 0) return 0;

    const shareSize = riskAfterCommission / stopSize;

    // ✅ floor to whole shares
    return Math.floor(shareSize);
  }

  return (
    <div className={styles.page}>
      <div style={{ gap: "10px", display: "flex" }}>
        <label htmlFor="balance">Enter your balance</label>
        <input
          name="balance"
          type="number"
          onChange={(e) => setAccount(Number(e.target.value))}
          value={account}
        />
      </div>

      <div style={{ gap: "10px", display: "flex" }}>
        <label htmlFor="commission">
          Enter commission per 100 shares:
        </label>
        <input
          name="commission"
          type="number"
          onChange={(e) => setCommission(Number(e.target.value))}
          value={commission}
        />
      </div>

     <div className={styles.riskSize}>
  <div>
    <label>
      1 %
      <input
        type="radio"
        name="risk"                 // ✅ SAME NAME
        value={1}
        checked={riskPercent === 1}
        onChange={() => setRiskPercent(1)}
      />
    </label>
  </div>

  <div>
    <label>
      2 %
      <input
        type="radio"
        name="risk"                 // ✅ SAME NAME
        value={2}
        checked={riskPercent === 2}
        onChange={() => setRiskPercent(2)}
      />
    </label>
  </div>
</div>

      <p> At {riskPercent} % your risk is: {account * (riskPercent / 100)}$ before commission</p>
      <hr />
      <p>
        Your risk after commission is:{" "}
        {riskAfterCommission > 0
          ? riskAfterCommission.toFixed(2)
          : "0.00"}
      </p>
      <hr />

      <div className={styles.messageBox}>
        <h3>Position size based on stop size:</h3>
      </div>

      <div className={styles.container}>
        <div>Calculate the share size for each stop:</div>

        <div>0.10$ stop: {calculateShareSize(0.1)} shares</div>
        <div>0.20$ stop: {calculateShareSize(0.2)} shares</div>
        <div>0.30$ stop: {calculateShareSize(0.3)} shares</div>
        <div>0.40$ stop: {calculateShareSize(0.4)} shares</div>
        <div>0.50$ stop: {calculateShareSize(0.5)} shares</div>
      </div>

      <button type="button" onClick={saveAccountToLocalstorage}>
        Save Settings
      </button>
    </div>
  );
}