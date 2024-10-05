import React, { useEffect, useState } from 'react';

const MapWithLocations = ({ latitude, longitude }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      // Load the Google Maps script dynamically
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Append the script to the document head
      document.head.appendChild(script);

      // Set the initMap function globally so Google Maps can call it
      window.initMap = () => {
        setIsScriptLoaded(true);
      };

      // Clean up by removing the global function when the component unmounts
      return () => {
        window.initMap = undefined;
      };
    } else {
      // Google Maps is already loaded, initialize the map
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.google) {
      initializeMap();
    }
  }, [isScriptLoaded]);

  const initializeMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude },
      zoom: 12,
    });

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: 'Location',
    });
  };

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default MapWithLocations;
