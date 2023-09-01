import { useState, useEffect } from 'react';

function useFormattedCurrentDate() {
  const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-indexed
    const day = String(currentDate.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00Z`;
  };

  const [formattedDate, setFormattedDate] = useState(getCurrentDateFormatted());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedDate(getCurrentDateFormatted());
    }, 1000); // Update the date every second

    return () => clearInterval(intervalId);
  }, []);

  return formattedDate;
}

export default useFormattedCurrentDate;
