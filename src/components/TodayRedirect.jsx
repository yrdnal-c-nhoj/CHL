import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const TodayRedirect = () => {
  const { data } = useContext(DataContext); // array of { date: "YY-MM-DD" }
  const [targetDate, setTargetDate] = useState(null);

  // Helper to format Date objects as YY-MM-DD
  const formatDate = (date) => {
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  useEffect(() => {
  if (!data || data.length === 0) return;

  console.log('Available dates from sheet:', data.map(d => d.date));

  const availableDates = new Set(data.map(item => item.date.padStart(8, '0')));

  let current = new Date();
  for (let i = 0; i < 365; i++) {
    const str = formatDate(current);
    console.log('Checking date:', str);
    if (availableDates.has(str)) {
      console.log('Found date:', str);
      setTargetDate(str);
      return;
    }
    current.setDate(current.getDate() - 1);
  }
}, [data]);


  if (!data || data.length === 0)
    return <div>Loading clocks...</div>;

  if (!targetDate)
    return <div>No clocks found in the last year.</div>;

  return <Navigate to={`/${targetDate}`} replace />;
};

export default TodayRedirect;
