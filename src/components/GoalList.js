// components/GoalList.js
import React from 'react';
import GoalCard from './GoalCard';

function GoalList({ goals, onUpdateGoal, onDeleteGoal, onMakeDeposit }) {
  return (
    <div className="goal-list">
      <h2>Your Savings Goals</h2>
      {goals.length === 0 ? (
        <p>No goals yet. Add your first savings goal!</p>
      ) : (
        <div className="goals-container">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={onUpdateGoal}
              onDelete={onDeleteGoal}
              onDeposit={onMakeDeposit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GoalList;