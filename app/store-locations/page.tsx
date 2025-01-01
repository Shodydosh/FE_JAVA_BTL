'use client';
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const StoreLocations: React.FC = () => {
    const locations = [
        { 
            id: 1, 
            name: 'Cửa hàng Royal City', 
            address: 'Tầng B1, TTTM Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội',
            position: { lat: 21.002506, lng: 105.815380 }
        },
        { 
            id: 2, 
            name: 'Cửa hàng Times City', 
            address: 'Tầng B1, TTTM Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',
            position: { lat: 20.995587, lng: 105.868668 }
        },
        { 
            id: 3, 
            name: 'Cửa hàng Vincom Bà Triệu', 
            address: 'Tầng 5, TTTM Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
            position: { lat: 21.011875, lng: 105.849244 }
        }
    ];

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const center = {
        lat: 21.028511,
        lng: 105.804817
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Hệ Thống Cửa Hàng</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={12}
                        >
                            {locations.map(location => (
                                <Marker
                                    key={location.id}
                                    position={location.position}
                                    title={location.name}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </div>

                <div className="space-y-4">
                    {locations.map(location => (
                        <div 
                            key={location.id}
                            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{location.name}</h2>
                            <p className="text-gray-600 mt-2">{location.address}</p>
                            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Xem chỉ đường
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreLocations;