// components/Overview.js
import React from 'react';

function Overview({ goals }) {
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
  
  // Calculate goals with approaching deadlines (within 30 days)
  const today = new Date();
  const warningGoals = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    const timeDiff = deadline.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining <= 30 && daysRemaining >= 0 && goal.savedAmount < goal.targetAmount;
  });

  // Calculate overdue goals
  const overdueGoals = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    return deadline < today && goal.savedAmount < goal.targetAmount;
  });

  return (
    <div className="overview">
      <h2>Savings Overview</h2>
      <div className="overview-stats">
        <div className="stat">
          <h3>Total Goals</h3>
          <p>{totalGoals}</p>
        </div>
        <div className="stat">
          <h3>Total Saved</h3>
          <p>${totalSaved.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Total Target</h3>
          <p>${totalTarget.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Completed Goals</h3>
          <p>{completedGoals}</p>
        </div>
      </div>
      {warningGoals.length > 0 && (
        <div className="warning-section">
          <h3>Approaching Deadlines ({warningGoals.length})</h3>
          <ul>
            {warningGoals.map(goal => (
              <li key={goal.id}>
                {goal.name} - Due in {Math.ceil((new Date(goal.deadline) - today) / (1000 * 3600 * 24))} days
              </li>
            ))}
          </ul>
        </div>
      )}
      {overdueGoals.length > 0 && (
        <div className="overdue-section">
          <h3>Overdue Goals ({overdueGoals.length})</h3>
          <ul>
            {overdueGoals.map(goal => (
              <li key={goal.id}>
                {goal.name} - {Math.ceil((today - new Date(goal.deadline)) / (1000 * 3600 * 24))} days overdue
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Overview;