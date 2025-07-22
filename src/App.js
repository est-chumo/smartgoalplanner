// src/App.js
import React, { useState, useEffect } from 'react';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import Dashboard from './components/dashboard';
import Overview from './components/Overview';
import './index.css';

function App() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch goals from json-server
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('http://localhost:3001/goals');
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        setGoals(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = async (newGoal) => {
    try {
      const response = await fetch('http://localhost:3001/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newGoal,
          savedAmount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          id: Math.random().toString(36).substr(2, 9)
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add goal');
      }
      const createdGoal = await response.json();
      setGoals([...goals, createdGoal]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update goal
  const updateGoal = async (updatedGoal) => {
    try {
      const response = await fetch(`http://localhost:3001/goals/${updatedGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/goals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      setGoals(goals.filter(goal => goal.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Make deposit to a goal
  const makeDeposit = async (goalId, amount) => {
    try {
      const goalToUpdate = goals.find(goal => goal.id === goalId);
      const updatedGoal = {
        ...goalToUpdate,
        savedAmount: Number(goalToUpdate.savedAmount) + Number(amount),
      };

      const response = await fetch(`http://localhost:3001/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ savedAmount: updatedGoal.savedAmount }),
      });
      if (!response.ok) {
        throw new Error('Failed to make deposit');
      }
      setGoals(goals.map(goal => goal.id === goalId ? updatedGoal : goal));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header>
        <h1>Smart Goal Planner</h1>
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'goals' ? 'active' : ''}
            onClick={() => setActiveTab('goals')}
          >
            My Goals
          </button>
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'dashboard' && <Dashboard goals={goals} />}
        {activeTab === 'goals' && (
          <>
            <AddGoalForm onAddGoal={addGoal} />
            <GoalList 
              goals={goals} 
              onUpdateGoal={updateGoal} 
              onDeleteGoal={deleteGoal} 
              onMakeDeposit={makeDeposit} 
            />
          </>
        )}
        {activeTab === 'overview' && <Overview goals={goals} />}
      </main>
    </div>
  );
}

export default App;