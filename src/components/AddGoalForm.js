// components/AddGoalForm.js
import React, { useState } from 'react';

function AddGoalForm({ onAddGoal }) {
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    savedAmount: 0,
    category: '',
    deadline: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalToAdd = {
      ...newGoal,
      targetAmount: Number(newGoal.targetAmount),
    };
    onAddGoal(goalToAdd);
    setNewGoal({
      name: '',
      targetAmount: '',
      savedAmount: 0,
      category: '',
      deadline: '',
      createdAt: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="add-goal-form">
      <h2>Add New Goal</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Goal Name:
          <input
            type="text"
            name="name"
            value={newGoal.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Target Amount ($):
          <input
            type="number"
            name="targetAmount"
            value={newGoal.targetAmount}
            onChange={handleInputChange}
            min="1"
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={newGoal.category}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Deadline:
          <input
            type="date"
            name="deadline"
            value={newGoal.deadline}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Add Goal</button>
      </form>
    </div>
  );
}

export default AddGoalForm;