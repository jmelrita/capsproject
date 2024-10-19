'use client';
import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const GoogleMap = ({ apiKey, onAddressChange, spaId, onETAChange, currentUser }) => {
    const [location, setLocation] = useState({ lat: 10.3157, lng: 123.8854 });
    const [address, setAddress] = useState('');
    const [showSatelliteView, setShowSatelliteView] = useState(false);
    const [spaCoordinates, setSpaCoordinates] = useState({});
    const [spaAddress, setSpaAddress] = useState('');
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/spa/${spaId}?currentUser=${currentUser?.id}`);
                const spaData = await response.json();
                setSpaAddress(spaData?.spa?.address);
            } catch (error) {
                console.error('Error fetching spa data:', error);
            }
        };

        fetchData();
    }, [spaId]);

    useEffect(() => {
        const getAddressLatLng = async () => {
            try {
                const encodedAddress = encodeURIComponent(spaAddress);
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`);
                const data = await response.json();

                if (data.status === 'OK') {
                    const location = data.results[0].geometry.location;
                    const latLng = { lat: location.lat, lng: location.lng };
                    setSpaCoordinates(latLng);
                    setLocation(latLng);
                } else {
                    console.error('Error converting address to latlng:', data.error_message);
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };

        if (spaAddress) {
            getAddressLatLng();
        }
    }, [spaAddress, apiKey]);
    useEffect(() => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const formattedAddress = data.results[0].formatted_address;
                    setAddress(formattedAddress);
                    onAddressChange(formattedAddress);
                } else {
                    setAddress('Address not found');
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
    }, [location, apiKey, onAddressChange]);

    useEffect(() => {
        const fetchETA = async () => {
            try {
                const latlng = {
                    lat: location.lat,
                    lng: location.lng,
                    originLat: spaCoordinates.lat,
                    originLng: spaCoordinates.lng,
                };

                const response = await fetch(`/api/directions/${JSON.stringify(latlng)}`);
                const data = await response.json();

                if (response.ok) {
                    onETAChange(data);
                } else {
                    console.error('Error fetching ETA:', data.error_message);
                    setEstimatedTime('ETA failed');
                }
            } catch (error) {
                console.error('Error fetching ETA:', error);
                setEstimatedTime('ETA failed');
            }
        };

        if (spaCoordinates.lat && spaCoordinates.lng) {
            fetchETA();
        }
    }, [location, spaCoordinates]);

    const handleApiLoaded = (map, maps) => {
        const marker = new maps.Marker({
            position: location,
            map,
            title: 'Selected Location',
            draggable: true,
        });

        maps.event.addListener(marker, 'dragend', function (event) {
            setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        });
    };

    const mapOptions = {
        mapTypeId: showSatelliteView ? 'satellite' : 'roadmap',
    };



    return (
        <div style={{ height: '400px', width: '100%' }}>
            <div style={{ marginBottom: '0px' }}>
                <label>
                    <input type="checkbox" checked={showSatelliteView} onChange={() => setShowSatelliteView(!showSatelliteView)} />
                    Show Satellite View
                </label>
            </div>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apiKey }}
                center={location}
                defaultZoom={15}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                options={mapOptions}
            />
        </div>
    );
};

export default GoogleMap;
