import React from 'react';

const BoardingPass = () => {
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
    margin: 0,
    padding: 0
  };

  const cardStyle = {
    width: '90%',
    maxWidth: '24rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: '1rem', color: '#1a202c' }}>Boarding Pass</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          textAlign: 'left',
          marginTop: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>From</div>
            <div style={{ fontWeight: '600' }}>JFK</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>To</div>
            <div style={{ fontWeight: '600' }}>LAX</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>Passenger</div>
            <div>John Doe</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>Seat</div>
            <div>14B</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;
