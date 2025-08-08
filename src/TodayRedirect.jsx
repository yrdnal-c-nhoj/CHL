import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TodayRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    // Format YYYY-MM-DD
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    navigate(`/${todayString}`, { replace: true });
  }, [navigate]);

  return null; // No UI needed, just redirect
};

export default TodayRedirect;
