import React from 'react'

const GEOLOGICAL_HIERARCHY = {
  supereon: 'Precambrian',
  eon: 'Phanerozoic',
  era: 'Cenozoic',
  period: 'Quaternary',
  epoch: 'Holocene',
  age: 'Meghalayan',
  stage: 'Lower Meghalayan' // example most granular stage
}

export default function GeoClock () {
  const items = [
    ['Geological Supereon', GEOLOGICAL_HIERARCHY.supereon],
    ['Geological Eon', GEOLOGICAL_HIERARCHY.eon],
    ['Geological Era', GEOLOGICAL_HIERARCHY.era],
    ['Geological Period', GEOLOGICAL_HIERARCHY.period],
    ['Geological Epoch', GEOLOGICAL_HIERARCHY.epoch],
    ['Geological Age', GEOLOGICAL_HIERARCHY.age],
    ['Geological Stage', GEOLOGICAL_HIERARCHY.stage]
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #0f2027, #203a43, #2c5364)',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '2vh'
      }}
    >
      <h1 style={{ fontSize: '4vh', marginBottom: '2vh' }}>Geological Time</h1>

      <div style={{ fontSize: '2.5vh', lineHeight: '3.5vh' }}>
        {items.map(([label, value], i) => (
          <div key={i} style={{ margin: '0.5vh 0' }}>
            <strong>{label}:</strong> {value}
          </div>
        ))}
      </div>
    </div>
  )
}
