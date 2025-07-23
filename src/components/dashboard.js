// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ProgressBar from './ProgressBar';
import '../index.css';

const Dashboard = ({ goals }) => {
  const [timeframe, setTimeframe] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate dashboard metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Filter goals based on timeframe and category
  const filteredGoals = goals.filter(goal => {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const timeDiff = deadline.getTime() - now.getTime();
    const daysRemaining = timeDiff / (1000 * 3600 * 24);
    
    const timeframeMatch = 
      timeframe === 'all' ||
      (timeframe === 'month' && daysRemaining <= 30) ||
      (timeframe === 'year' && daysRemaining <= 365);
    
    const categoryMatch = 
      categoryFilter === 'all' || 
      goal.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return timeframeMatch && categoryMatch;
  });

  // Prepare data for charts
  const categoryData = goals.reduce((acc, goal) => {
    const existingCategory = acc.find(item => item.name === goal.category);
    if (existingCategory) {
      existingCategory.value += goal.savedAmount;
    } else {
      acc.push({ name: goal.category, value: goal.savedAmount });
    }
    return acc;
  }, []);

  const progressData = filteredGoals.map(goal => ({
    name: goal.name,
    saved: goal.savedAmount,
    remaining: Math.max(0, goal.targetAmount - goal.savedAmount),
    progress: (goal.savedAmount / goal.targetAmount) * 100
  }));

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="dashboard">
      <h2>Savings Dashboard</h2>
      
      {/* Filters */}
      <div className="dashboard-filters">
        <div>
          <label>Timeframe:</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="all">All Goals</option>
            <option value="month">Next 30 Days</option>
            <option value="year">Next Year</option>
          </select>
        </div>
        <div>
          <label>Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {[...new Set(goals.map(goal => goal.category))].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Goals</h3>
          <p>{totalGoals}</p>
        </div>
        <div className="summary-card">
          <h3>Completed</h3>
          <p>{completedGoals}</p>
        </div>
        <div className="summary-card">
          <h3>Total Saved</h3>
          <p>${totalSaved.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Overall Progress</h3>
          <ProgressBar progress={overallProgress} />
          <p>{overallProgress.toFixed(1)}%</p>
        </div>
      </div>

      

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {filteredGoals
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(goal => (
              <li key={goal.id}>
                <span className="activity-name">{goal.name}</span>
                <span className="activity-amount">${goal.savedAmount.toLocaleString()}</span>
                <ProgressBar progress={(goal.savedAmount / goal.targetAmount) * 100} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;