// components/GoalCard.js
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import DepositForm from './DepositForm';

function GoalCard({ goal, onUpdate, onDelete, onDeposit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState({ ...goal });
  const [showDepositForm, setShowDepositForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGoal({ ...editedGoal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedGoal);
    setIsEditing(false);
  };

  const handleDeposit = (amount) => {
    onDeposit(goal.id, amount);
    setShowDepositForm(false);
  };

  // Calculate days remaining
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Determine status
  let status = 'active';
  if (goal.savedAmount >= goal.targetAmount) {
    status = 'completed';
  } else if (daysRemaining < 0) {
    status = 'overdue';
  } else if (daysRemaining <= 30) {
    status = 'warning';
  }

  return (
    <div className={`goal-card ${status}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editedGoal.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Target Amount:
            <input
              type="number"
              name="targetAmount"
              value={editedGoal.targetAmount}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={editedGoal.category}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Deadline:
            <input
              type="date"
              name="deadline"
              value={editedGoal.deadline}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h3>{goal.name}</h3>
          <p>Category: {goal.category}</p>
          <ProgressBar
            savedAmount={goal.savedAmount}
            targetAmount={goal.targetAmount}
          />
          <p>
            ${goal.savedAmount} of ${goal.targetAmount} saved (
            {Math.round((goal.savedAmount / goal.targetAmount) * 100)}%)
          </p>
          <p>Remaining: ${goal.targetAmount - goal.savedAmount}</p>
          <p>
            Deadline: {new Date(goal.deadline).toLocaleDateString()} (
            {daysRemaining > 0
              ? `${daysRemaining} days remaining`
              : daysRemaining === 0
              ? 'Due today'
              : `${Math.abs(daysRemaining)} days overdue`}
            )
          </p>
          {status === 'warning' && (
            <p className="warning-text">Goal deadline approaching!</p>
          )}
          {status === 'overdue' && (
            <p className="overdue-text">Goal overdue!</p>
          )}
          {status === 'completed' && (
            <p className="completed-text">Goal completed!</p>
          )}

          <div className="goal-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(goal.id)}>Delete</button>
            <button onClick={() => setShowDepositForm(!showDepositForm)}>
              {showDepositForm ? 'Cancel Deposit' : 'Make Deposit'}
            </button>
          </div>

          {showDepositForm && (
            <DepositForm
              goalId={goal.id}
              onDeposit={handleDeposit}
              maxAmount={goal.targetAmount - goal.savedAmount}
            />
          )}
        </>
      )}
    </div>
  );
}

export default GoalCard;