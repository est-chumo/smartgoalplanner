// components/DepositForm.js
import React, { useState } from 'react';

function DepositForm({ goalId, onDeposit, maxAmount }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (Number(amount) > maxAmount) {
      setError(`Amount exceeds remaining goal by $${Number(amount) - maxAmount}`);
      return;
    }
    onDeposit(amount);
    setAmount('');
    setError('');
  };

  return (
    <form className="deposit-form" onSubmit={handleSubmit}>
      <label>
        Deposit Amount ($):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          max={maxAmount}
        />
      </label>
      <button type="submit">Add Deposit</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default DepositForm;