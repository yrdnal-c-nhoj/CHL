import React from 'react';

const StickyNote = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-2deg)',
      zIndex: 1000,
      width: '200px',
      height: '200px',
      backgroundColor: '#ffff99',
      boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3), -3px -3px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid #e0e0e0',
      padding: '15px',
      overflow: 'hidden',
      backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
      backgroundSize: '20px 20px',
    }}>
      <div style={{
        content: '',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, #e0e0e0, #ffff99)',
        transform: 'rotate(-45deg)',
        transformOrigin: 'bottom right',
        boxShadow: '-2px 2px 5px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
      }} />
      <div
        contentEditable
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          color: '#333',
          resize: 'none',
          zIndex: 2,
          position: 'relative',
          overflowY: 'auto',
          lineHeight: 1.4,
        }}
        suppressContentEditableWarning={true}
      >
        Can we please get this offline and up o the racks before somebody sees it!!!
      </div>
    </div>
  );
};

export default StickyNote;