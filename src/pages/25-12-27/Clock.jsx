import React from 'react';

const FlightTicket = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(90deg, #008abf, #005d85)',
    fontFamily: 'system-ui',
    padding: '5vh 5vw',
    margin: 0,
  };

  const ticketStyle = {
    background: '#fff',
    borderRadius: '2rem',
    width: '90vw',
    maxWidth: '40rem',
    margin: '0 auto',
    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8rem), calc(100% - 3rem) calc(100% - 8rem), calc(100% - 3rem) 100%, 0 100%)'
  };

  const ticketBodyStyle = {
    padding: '3rem 2.5rem 4rem',
  };

  const flyStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '2rem',
    fontWeight: 300,
    margin: '0 0 2rem 0',
  };

  const infoContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    textAlign: 'center',
  };

  const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: '0.5rem',
  };

  const valueStyle = {
    fontSize: '1.1rem',
    fontWeight: 500,
  };

  const tearOffStyle = {
    borderTop: '2px dashed #ddd',
    padding: '2rem 3rem',
    textAlign: 'center',
  };

  const barcodeStyle = {
    height: '3rem',
    background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 5px)',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      <div style={ticketStyle}>
        <div style={ticketBodyStyle}>
          <div style={flyStyle}>
            <span>ZRH <span style={{ margin: '0 0.5rem' }}>✈</span> OSL</span>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={labelStyle}>Passenger</div>
            <div style={{ ...valueStyle, fontSize: '1.25rem' }}>MEGAFRY MR</div>
          </div>

          <div style={infoContainerStyle}>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Gate</span>
              <span style={valueStyle}>B24</span>
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Departure</span>
              <span style={valueStyle}>14:35</span>
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Speedy</span>
              <span style={valueStyle}>Yes</span>
            </div>
            <div style={infoItemStyle}>
              <span style={labelStyle}>Boarding</span>
              <span style={valueStyle}>14:05</span>
            </div>
          </div>
        </div>

        <div style={tearOffStyle}>
          <div style={barcodeStyle}></div>
          <div style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>43596885365490358</div>
        </div>
      </div>
    </div>
  );
};

export default FlightTicket;