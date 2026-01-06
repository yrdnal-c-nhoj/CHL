import React, { useState, useEffect } from 'react';

const BoardingPass = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load Google Font - Oxanium
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Wait a bit for font to load
    setTimeout(() => {
      setFontLoaded(true);
    }, 1000);

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      // Clean up link element
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  // Show content immediately, font will load in background

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const red = '#2892F0';
  const redDark = '#57605AFF';
  const grey = '#666';
  const greyLight = '#999';
  
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: redDark,
    fontFamily: 'Helvetica, Arial, "Helvetica Neue", sans-serif',
    fontSize: '0.5625rem',
    margin: 0,
    padding: 0
  };

  const ticketStyle = {
    width: '90vw',
    maxWidth: '21.25rem',
    color: greyLight
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.15rem 2.1875rem',
    borderRadius: '0.625rem 0.625rem 0 0',
    color: 'white',
    backgroundColor: red
  };

  const logoStyle = {
    fontSize: '2.2rem',
    fontWeight: '400',
    fontStyle: 'italic',
    fontFamily: fontLoaded ? 'Oxanium, sans-serif' : 'sans-serif'
  };

  const flightStyle = {
    fontSize: '0.6875rem',
    textAlign: 'right',
    textTransform: 'uppercase'
  };

  const bodyStyle = {
    position: 'relative',
    borderBottom: '0.0625rem dashed #ccc',
    backgroundColor: 'white'
  };

  const notchStyle = {
    content: '',
    position: 'absolute',
    top: '100%',
    width: '1rem',
    height: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: redDark
  };

  const notchLeftStyle = {
    ...notchStyle,
    right: '100%',
    transform: 'translate(0.5rem, -0.5rem)'
  };

  const notchRightStyle = {
    ...notchStyle,
    left: '100%',
    transform: 'translate(-0.5rem, -0.5rem)'
  };

  const locationsStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem 2.1875rem',
    borderBottom: '0.0625rem solid #e6e6e6'
  };

  const locationStyle = {
    flexGrow: 1,
    flexShrink: 0,
    textTransform: 'uppercase',
    textAlign: 'center'
  };

  const cityCodeStyle = {
    margin: '0.3125rem 0',
    fontSize: '1.625rem',
    color: grey
  };

  const arrowContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '1.25rem',
    height: '0.125rem',
    backgroundColor: red
  };

  const arrowBeforeStyle = {
    content: '',
    position: 'absolute',
    width: '0.9375rem',
    height: '0.125rem',
    backgroundColor: red,
    transform: 'rotate(45deg)',
    transformOrigin: '0.75rem -0.3125rem'
  };

  const arrowAfterStyle = {
    content: '',
    position: 'absolute',
    width: '0.9375rem',
    height: '0.125rem',
    backgroundColor: red,
    transform: 'rotate(-45deg)',
    transformOrigin: '0.75rem 0.4375rem'
  };

  const bodyInfoStyle = {
    padding: '1.25rem 2.1875rem'
  };

  const infoStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.875rem',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  };

  const infoSeatStyle = {
    textAlign: 'right'
  };

  const h2Style = {
    margin: '0.1875rem 0 0',
    fontSize: '1rem',
    fontWeight: 'normal',
    color: grey,
    textTransform: 'none'
  };

  const flightInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  };

  const bottomStyle = {
    borderRadius: '0 0 0.625rem 0.625rem',
    backgroundColor: 'white'
  };

  const bottomInfoStyle = {
    padding: '1.25rem 2.1875rem'
  };

  const departStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    textTransform: 'uppercase'
  };

  const barcodeStyle = {
    width: '100%',
    height: '2.8125rem',
    background: `
      linear-gradient(to right, 
        #000 0%, #000 2%, #fff 2%, #fff 3%,
        #000 3%, #000 4%, #fff 4%, #fff 6%,
        #000 6%, #000 9%, #fff 9%, #fff 10%,
        #000 10%, #000 11%, #fff 11%, #fff 12%,
        #000 12%, #000 13%, #fff 13%, #fff 16%,
        #000 16%, #000 18%, #fff 18%, #fff 19%,
        #000 19%, #000 20%, #fff 20%, #fff 21%,
        #000 21%, #000 25%, #fff 25%, #fff 26%,
        #000 26%, #000 27%, #fff 27%, #fff 29%,
        #000 29%, #000 30%, #fff 30%, #fff 33%,
        #000 33%, #000 36%, #fff 36%, #fff 37%,
        #000 37%, #000 38%, #fff 38%, #fff 40%,
        #000 40%, #000 43%, #fff 43%, #fff 44%,
        #000 44%, #000 45%, #fff 45%, #fff 46%,
        #000 46%, #000 47%, #fff 47%, #fff 50%,
        #000 50%, #000 52%, #fff 52%, #fff 53%,
        #000 53%, #000 56%, #fff 56%, #fff 57%,
        #000 57%, #000 58%, #fff 58%, #fff 59%,
        #000 59%, #000 62%, #fff 62%, #fff 64%,
        #000 64%, #000 65%, #fff 65%, #fff 67%,
        #000 67%, #000 68%, #fff 68%, #fff 69%,
        #000 69%, #000 70%, #fff 70%, #fff 73%,
        #000 73%, #000 76%, #fff 76%, #fff 77%,
        #000 77%, #000 78%, #fff 78%, #fff 81%,
        #000 81%, #000 83%, #fff 83%, #fff 84%,
        #000 84%, #000 87%, #fff 87%, #fff 88%,
        #000 88%, #000 89%, #fff 89%, #fff 90%,
        #000 90%, #000 93%, #fff 93%, #fff 96%,
        #000 96%, #000 98%, #fff 98%, #fff 100%
      )
    `
  };

  return (
    <div style={containerStyle}>
      <div style={ticketStyle}>
        <div>
          <div style={headerStyle}>
            <div style={logoStyle}>BorrowedTime</div>
            <div style={flightStyle}> </div>
          </div>
          
          <div style={bodyStyle}>
            <div style={notchLeftStyle}></div>
            <div style={notchRightStyle}></div>
            
            <div style={locationsStyle}>
              <div style={locationStyle}>
                Paris
                <h1 style={cityCodeStyle}>cdg</h1>
                {formatTime(currentDate)}
              </div>
              <div style={locationStyle}>
                <div style={arrowContainerStyle}>
                  <div style={arrowBeforeStyle}></div>
                  <div style={arrowAfterStyle}></div>
                </div>
              </div>
              <div style={locationStyle}>
                Boston
                <h1 style={cityCodeStyle}>bos</h1>
                {formatTime(new Date(currentDate.getTime() + 8 * 60 * 60000))}
              </div>
            </div>
            
            <div style={bodyInfoStyle}>
              <div style={infoStyle}>
                <div>
                  Passenger
                  <h2 style={h2Style}>Cubist Heart</h2>
                </div>
                <div style={infoSeatStyle}>
                  Seat
                  <h2 style={h2Style}>13d</h2>
                </div>
              </div>
              
              <div style={flightInfoStyle}>
                <div>
                  Flight
                  <h2 style={h2Style}>DY 289</h2>
                </div>
                <div>
                Depart
                <h2 style={h2Style}>{formatDate(currentDate)}</h2>
                </div>
                <div>
                  Depart
                  <h2 style={h2Style}>{formatTime(currentDate)}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={bottomStyle}>
          <div style={bottomInfoStyle}>
            <div style={departStyle}>
              <div>
                Terminal
                <h2 style={h2Style}>1</h2>
              </div>
              <div>
                Gate
                <h2 style={h2Style}>51</h2>
              </div>
              <div>
                Boarding
                <h2 style={h2Style}>{formatTime(new Date(currentDate.getTime() - 20 * 60000))}</h2>
              </div>
            </div>
            
            <div style={barcodeStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;