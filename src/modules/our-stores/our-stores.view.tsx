import React from 'react';
import { AzureMap, AzureMapsProvider, IAzureMapOptions } from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

const option: IAzureMapOptions = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: 'F1TZC2lSl0Y7RdoPYI6Vx342OvT8vAkR12dLpu2K2F3bhbmhFZCgJQQJ99AGACYeBjFl4DVJAAAgAZMPjJNV'
    }
};

const OurStoresView: React.FC = () => {
    return (
        <div style={{ height: '300px' }}>
            <AzureMapsProvider>
                <AzureMap options={option}></AzureMap>
            </AzureMapsProvider>
        </div>
    );
};

export default OurStoresView;
