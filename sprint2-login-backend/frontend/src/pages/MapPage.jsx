/**
 * MapPage.js
 * 
 * React component for the main page of the temperature map application.
 * Provides a date selector and a button to fetch temperature data from the backend API.
 * Displays a loading indicator while data is being fetched.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import DateSelector from '../components/DateSelector';
import { ClipLoader } from 'react-spinners';


/**
 * MapPage component that displays the map and handles temperature data fetching.
 * 
 * @component
 * @returns {JSX.Element} The rendered map page with temperature markers, a logout button, and a loading indicator.
 */
function MapPage({ setAuthenticated }) {
  const [date, setDate] = useState('');
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  /**
   * Handles the selected date change from DateSelector component.
   * 
   * @param {string} selectedDate - The selected date string in YYYY-MM format.
   */
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);  // Update date state
  };

  /**
   * fetchTemperatureData (stub)
   * 
   * Stubbed version of the temperature fetch function.
   * This placeholder simulates the interface but performs no actual API call.
   * 
   * @async
   * @function
   */
  const fetchTemperatureData = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    setIsLoading(true);
    console.log(`Stub: would fetch temperature data for date: ${date}`);

    // Simulate short delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // No data is actually set in this stub
    console.log("Stub: No temperature data fetched.");

    setIsLoading(false);
  };
  
  /**
   * handleLogout
   * 
   * Logs out the user by clearing authentication state and local storage,
   * then navigating to the login page.
   */
  const handleLogout = () => {
    setAuthenticated(false);  
    localStorage.removeItem('authenticated');  
    navigate('/');  
  };

return (
    <div>
      <h1>ExPostForecast: Historical Monthly Average Temperatures</h1>
      
      {/* DateSelector component allows user to select a date and trigger data fetch */}
      <DateSelector onDateChange={handleDateChange} fetchTemperatureData={fetchTemperatureData} />

      {/* Loading Indicator */}
      {isLoading && <ClipLoader color="#123abc" loading={isLoading} size={50} />}

      {/* MapComponent displays the temperature data as markers on the map */}
      {!isLoading && <MapComponent temperatures={temperatureData} />}

      {/* Logout button triggers the handleLogout function */}
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
}

export default MapPage;
