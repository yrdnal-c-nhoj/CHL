import React, { useState, useEffect } from 'react';

const DeviceInspector = () => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      
      // Basic Device Detection Logic
      let deviceType = "Desktop/Laptop";
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        deviceType = "Tablet";
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) {
        deviceType = "Mobile";
      }

      setInfo({
        "Device Category": deviceType,
        "User Agent": ua,
        "Platform": navigator.platform,
        "Vendor": navigator.vendor,
        "Language": navigator.language,
        "Screen Resolution": `${window.screen.width} x ${window.screen.height}`,
        "Available Resolution": `${window.screen.availWidth} x ${window.screen.availHeight}`,
        "Color Depth": `${window.screen.colorDepth}-bit`,
        "Pixel Ratio": window.devicePixelRatio,
        "CPU Cores": navigator.hardwareConcurrency || "Unknown",
        "Memory (RAM)": navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown/Protected",
        "Online Status": navigator.onLine ? "Online" : "Offline",
        "Cookies Enabled": navigator.cookieEnabled ? "Yes" : "No",
        "Touch Points": navigator.maxTouchPoints,
        "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    };

    getDeviceInfo();
    window.addEventListener('resize', getDeviceInfo);
    return () => window.removeEventListener('resize', getDeviceInfo);
  }, []);

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#f4f4f4', 
      minHeight: '100vh' 
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem' }}>
          Device Diagnostic Report
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <tbody>
            {Object.entries(info).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#555' }}>{key}</td>
                <td style={{ padding: '0.75rem', wordBreak: 'break-all' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceInspector;