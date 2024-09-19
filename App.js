import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Ticket from './Ticket';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [orderBy, setOrderBy] = useState('priority');

  useEffect(() => {
    // Fetch tickets and users data from the API
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Function to map userId to user name
  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Group tickets by status, user, or priority
  const groupTickets = () => {
    if (groupBy === 'status') {
      return tickets.reduce((groups, ticket) => {
        const status = ticket.status;
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(ticket);
        return groups;
      }, {});
    } else if (groupBy === 'user') {
      return tickets.reduce((groups, ticket) => {
        const user = getUserName(ticket.userId);
        if (!groups[user]) {
          groups[user] = [];
        }
        groups[user].push(ticket);
        return groups;
      }, {});
    } else if (groupBy === 'priority') {
      return tickets.reduce((groups, ticket) => {
        const priority = ticket.priority;
        if (!groups[priority]) {
          groups[priority] = [];
        }
        groups[priority].push(ticket);
        return groups;
      }, {});
    }
    return tickets;
  };

  // Order tickets within each group based on priority or title
  const orderTickets = (groupedTickets) => {
    const ticketArrays = Object.keys(groupedTickets).map(key => groupedTickets[key]);
    const orderedArrays = ticketArrays.map(ticketArray => {
      if (orderBy === 'priority') {
        return ticketArray.sort((a, b) => b.priority - a.priority); // High priority first
      } else if (orderBy === 'title') {
        return ticketArray.sort((a, b) => a.title.localeCompare(b.title)); // Alphabetical order
      }
      return ticketArray;
    });
    return orderedArrays;
  };

  // Display grouped and ordered tickets as cards
  const displayTickets = () => {
    const groupedTickets = groupTickets();
    const orderedTickets = orderTickets(groupedTickets);

    return Object.keys(groupedTickets).map(group => (
      <div key={group} className="ticket-group">
        <h2>{group}</h2>
        {groupedTickets[group].map(ticket => (
          <Ticket key={ticket.id} data={ticket} userName={getUserName(ticket.userId)} />
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      <div>
        <label>Group By:</label>
        <select onChange={(e) => setGroupBy(e.target.value)} value={groupBy}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>

        <label>Order By:</label>
        <select onChange={(e) => setOrderBy(e.target.value)} value={orderBy}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="kanban-board">
        {displayTickets()}
      </div>
    </div>
  );
};

export default KanbanBoard;
