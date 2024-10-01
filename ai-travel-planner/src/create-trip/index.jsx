import React, { useEffect, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-services';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '../constants/options.jsx';
import { Button } from '../components/ui/button.jsx';
import { chatSession } from '../services/AIModal.jsx'; // Import your chat session

function CreateTrip() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [days, setDays] = useState(1); // Default trip length to 1 day
  const [formData, setFormData] = useState({});

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() !== '') {
      tt.services
        .fuzzySearch({
          key: import.meta.env.VITE_TOMTOM_API_KEY,
          query: searchQuery,
        })
        .then((response) => {
          setResults(response.results);
        })
        .catch((err) => console.error(err));
    } else {
      setResults([]);
    }
  };

  const handleSelectPlace = (place) => {
    const selectedPlace = {
      label: place.address.freeformAddress,
      value: {
        description: place.address.freeformAddress,
        match: place.matchQuality,
        position: place.position,
      },
    };
    handleInputChange('location', selectedPlace);
    setQuery(place.address.freeformAddress);
    setResults([]);
  };

  const handleDaysChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    handleInputChange('noOfDays', value);
    setDays(value);
  };

  const OnGenerateTrip = async () => {
    // Validate number of days
    if (formData?.noOfDays > 5) {
      alert("Please enter less than 5 days");
      return;
    }

    // Validate required fields
    if (!formData?.location?.label || !formData?.budget || !formData?.people) {
      alert("Please fill all the details.");
      return;
    }

    // Prompt generation
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{travelers}', formData?.people) // Ensure this is correct
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);

    try {
      // Use Google Gemini AI to generate trip details
      const response = await chatSession.sendMessage(FINAL_PROMPT);
      const tripDetails = response.response.text();

      // Log the generated JSON travel plan
      console.log("Generated Travel Plan:", tripDetails);
      
      // Optionally, you can set the response to state to display it on the UI
      // setGeneratedTrip(tripDetails);
    } catch (error) {
      console.error('Error generating trip:', error);
      console.log(FINAL_PROMPT)


      const result = await chatSession.sendMessage(FINAL_PROMPT);

      console.log(result.response.text());
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl text-center'>Tell us your travel preferences🏕️</h2>
      <p className='mt-3 text-gray-500 text-xl text-center'>
        Provide basic information to generate a customized itinerary.
      </p>

      <div className='mt-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <input
            type='text'
            value={query}
            onChange={handleSearch}
            className='w-full p-3 border border-gray-300 rounded'
            placeholder='Enter a location'
          />

          {results.length > 0 && (
            <ul className='mt-3 border border-gray-300 rounded max-h-60 overflow-auto'>
              {results.map((result, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectPlace(result)}
                  className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200'
                >
                  {result.address.freeformAddress}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Input for number of days */}
      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
        <input
          type='number'
          value={days}
          onChange={handleDaysChange}
          className='w-full p-3 border border-gray-300 rounded'
          min={1}
        />
        <p className='mt-2 text-gray-600'>You have planned {days} day(s) for your trip.</p>
      </div>

      {/* Budget options */}
      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`p-4 border cursor-pointer 
            rounded-lg hover:shadow ${formData?.budget === item.title && 'shadow-lg border-black'}`}
              onClick={() => handleInputChange('budget', item.title)}
            >
              <span className='mr-2 text-4xl'>{item.icon}</span>
              <div>
                <h3 className='font-bold text-lg'>{item.title}</h3>
                <p className='text-gray-600 text-sm'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel companions options */}
      <div className='mt-10'>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with?</h2>
        <div className='grid grid-cols-4 gap-5 mt-5'>
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              className={`p-4 border cursor-pointer 
            rounded-lg hover:shadow ${formData?.people === item.people && 'shadow-lg border-black'}`}
              onClick={() => handleInputChange('people', item.people)}
            >
              <span className='mr-2 text-4xl'>{item.icon}</span>
              <div>
                <h3 className='font-bold text-lg'>{item.title}</h3>
                <p className='text-gray-600 text-sm'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button for generating trip */}
      <div className='mt-10 justify-end flex'>
        <Button onClick={OnGenerateTrip}>Generate Trip</Button>
      </div>
    </div>
  );
}

export default CreateTrip;
