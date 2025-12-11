// GeoClock.jsx - Minimal Geological Time Clock
import React, { useEffect, useState } from 'react'

const GEO_EARTH_AGE = 4_540_000_000
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25

const GEO_HIERARCHY = [
  { name: 'Hadean', type: 'Eon', start: 4_540_000_000, end: 4_000_000_000 },
  { name: 'Archean', type: 'Eon', start: 4_000_000_000, end: 2_500_000_000 },
  { name: 'Proterozoic', type: 'Eon', start: 2_500_000_000, end: 541_000_000 },
  {
    name: 'Phanerozoic',
    type: 'Eon',
    start: 541_000_000,
    end: 0,
    children: [
      { name: 'Paleozoic', type: 'Era', start: 541_000_000, end: 252_170_000 },
      { name: 'Mesozoic', type: 'Era', start: 252_170_000, end: 66_000_000 },
      {
        name: 'Cenozoic',
        type: 'Era',
        start: 66_000_000,
        end: 0,
        children: [
          {
            name: 'Paleogene',
            type: 'Period',
            start: 66_000_000,
            end: 23_030_000
          },
          {
            name: 'Neogene',
            type: 'Period',
            start: 23_030_000,
            end: 2_580_000
          },
          {
            name: 'Quaternary',
            type: 'Period',
            start: 2_580_000,
            end: 0,
            children: [
              {
                name: 'Pleistocene',
                type: 'Epoch',
                start: 2_580_000,
                end: 11_700
              },
              {
                name: 'Holocene',
                type: 'Epoch',
                start: 11_700,
                end: 0,
                children: [
                  {
                    name: 'Greenlandian',
                    type: 'Age',
                    start: 11_700,
                    end: 8_200
                  },
                  {
                    name: 'Northgrippian',
                    type: 'Age',
                    start: 8_200,
                    end: 4_200
                  },
                  { name: 'Meghalayan', type: 'Age', start: 4_200, end: 0 }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

const findCurrentPath = (hierarchy, yearsAgo) => {
  for (const item of hierarchy) {
    if (yearsAgo <= item.start && yearsAgo > item.end) {
      if (item.children) {
        const childPath = findCurrentPath(item.children, yearsAgo)
        return [item, ...childPath]
      }
      return [item]
    }
  }
  return []
}

const formatYears = years => {
  if (years >= 1_000_000_000)
    return `${(years / 1_000_000_000).toFixed(2)} billion`
  if (years >= 1_000_000) return `${(years / 1_000_000).toFixed(1)} million`
  return years.toLocaleString()
}

const GeoItem = ({ item }) => (
  <div>
    {item.type}: {item.name} ({formatYears(item.start)} –{' '}
    {item.end === 0 ? 'Present' : formatYears(item.end)} ya)
    {item.children &&
      item.children.map(child => <GeoItem key={child.name} item={child} />)}
  </div>
)

export default function GeoClock () {
  const [currentPath, setCurrentPath] = useState([])
  const [geologicalDate, setGeologicalDate] = useState({
    year: 0,
    month: 'January',
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })

  useEffect(() => {
    const startTime = new Date('0000-01-01T00:00:00Z').getTime()
    const cycleLengthMS = GEO_EARTH_AGE * MS_PER_YEAR

    const updateClock = () => {
      const now = Date.now()
      const elapsedMS = now - startTime
      const progress = (elapsedMS / cycleLengthMS) % 1
      const yearsAgo = GEO_EARTH_AGE * progress

      const msInThisYear = elapsedMS % MS_PER_YEAR
      const date = new Date(msInThisYear)
      const yearAgo = Math.floor(GEO_EARTH_AGE - yearsAgo)

      setGeologicalDate({
        year: yearAgo,
        month: date.toLocaleString('en-US', { month: 'long' }),
        day: date.getDate(),
        hour: date.getHours().toString().padStart(2, '0'),
        minute: date.getMinutes().toString().padStart(2, '0'),
        second: date.getSeconds().toString().padStart(2, '0'),
        millisecond: date.getMilliseconds().toString().padStart(3, '0')
      })

      setCurrentPath(findCurrentPath(GEO_HIERARCHY, yearsAgo))
    }

    updateClock()
    const interval = setInterval(updateClock, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>Geological Clock</h1>
      <div>
        <div>{geologicalDate.year.toLocaleString()} years ago</div>
        <div>
          {geologicalDate.month} {geologicalDate.day} {geologicalDate.hour}:
          {geologicalDate.minute}:{geologicalDate.second}.
          {geologicalDate.millisecond}
        </div>
      </div>

      <div>
        <h2>Current Geological Period:</h2>
        {currentPath.length > 0 ? (
          currentPath.map((item, i) => (
            <div key={i}>
              {item.type}: {item.name}
            </div>
          ))
        ) : (
          <div>Calculating deep time...</div>
        )}
      </div>

      <details>
        <summary>Full Geological Timeline</summary>
        {GEO_HIERARCHY.map(item => (
          <GeoItem key={item.name} item={item} />
        ))}
      </details>
    </div>
  )
}
