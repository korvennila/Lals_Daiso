import React, { createContext, useState, useContext } from 'react';

interface LocationContextType {
    selectedCountry: string | null;
    setSelectedCountry: (country: string | null) => void;
    selectedState: string | null;
    setSelectedState: (state: string | null) => void;
    activeCountry: string | null;
    setActiveCountry: (state: string | null) => void;
    selectedFromDropdown: boolean;
    setSelectedFromDropdown: (value: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC = ({ children }) => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [activeCountry, setActiveCountry] = useState<string | null>(null);
    const [selectedFromDropdown, setSelectedFromDropdown] = useState<boolean>(false);

    return (
        <LocationContext.Provider
            value={{
                selectedCountry,
                setSelectedCountry,
                selectedState,
                setSelectedState,
                activeCountry,
                setActiveCountry,
                selectedFromDropdown,
                setSelectedFromDropdown
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};
