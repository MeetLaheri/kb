import React from 'react';

const Ticket = ({ data }) => {
  return (
    <div className="ticket-card">
      <h3>{data.title}</h3>
      <p>Status: {data.status}</p>
      <p>Assigned to: {data.user}</p>
      <p>Priority: {data.priority}</p>
    </div>
  );
};

export default Ticket;