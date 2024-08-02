import React from 'react';
import ItineraryDisplay from './components/ItineraryDisplay';
import itineraryData from './data/itineraryData.json';

function App() {
  return (
    <div className="App">
      <ItineraryDisplay itinerary={itineraryData} />
    </div>
  );
}

export default App;
