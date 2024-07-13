import React, { useEffect, useState } from 'react';
import {
    AzureMap,
    AzureMapsProvider,
    IAzureMapOptions,
    AzureMapDataSourceProvider,
    AzureMapLayerProvider,
    AzureMapHtmlMarker
} from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

interface MapWrapperProps {
    markers: {
        markerContent: string;
        position: [number, number];
    }[];
}

const mapOptions: IAzureMapOptions = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: 'F1TZC2lSl0Y7RdoPYI6Vx342OvT8vAkR12dLpu2K2F3bhbmhFZCgJQQJ99AGACYeBjFl4DVJAAAgAZMPjJNV'
    }
};

const MapWrapper: React.FC<MapWrapperProps> = ({ markers }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(typeof window !== 'undefined');
    }, []);

    if (!isBrowser) {
        return null;
    }

    return (
        <AzureMapsProvider>
            <div className='our-stores'>
                <h1>Our Stores</h1>
                <AzureMap options={mapOptions}>
                    <AzureMapDataSourceProvider id='dataSourceProvider'>
                        <AzureMapLayerProvider
                            id='layerProvider'
                            options={{ iconOptions: { image: 'pin-round-darkblue' } }}
                            type={'SymbolLayer'}
                        />
                        {markers.map((marker, index) => (
                            <AzureMapHtmlMarker
                                key={index}
                                options={{
                                    position: marker.position,
                                    htmlContent: marker.markerContent
                                }}
                            />
                        ))}
                    </AzureMapDataSourceProvider>
                </AzureMap>
            </div>
        </AzureMapsProvider>
    );
};

export default MapWrapper;
