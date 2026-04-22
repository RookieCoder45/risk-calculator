"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [account, setAccount] = useState(100);

  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) {
      setAccount(Number(savedAccount));
    }
  }, []);

  function shareSize(risk, stopSize) {
    return risk / stopSize;
  }

  function saveAccountToLocalstorage() {
    localStorage.setItem("account", account);
  }

  return (
    <div className={styles.page}>
      <input
        type="number"
        onChange={(e) => setAccount(Number(e.target.value))}
        value={account}
      />

      <p>Your risk is {account / 100}$ per trade</p>

      <div className={styles.container}>
        <div>calculate the share size for every stop size</div>

        <div>
          for 0.10$ stop: {shareSize(account / 100, 0.1).toFixed(0)} shares
        </div>
        <div>
          for 0.20$ stop: {shareSize(account / 100, 0.2).toFixed(0)} shares
        </div>
        <div>
          for 0.30$ stop: {shareSize(account / 100, 0.3).toFixed(0)} shares
        </div>
        <div>
          for 0.40$ stop: {shareSize(account / 100, 0.4).toFixed(0)} shares
        </div>
        <div>
          for 0.50$ stop: {shareSize(account / 100, 0.5).toFixed(0)} shares
        </div>
      </div>

      <button type="button" onClick={saveAccountToLocalstorage}>
        Save Settings
      </button>
    </div>
  );
}