import React, { useState, useEffect } from 'react';
import { IFullOrgUnitAvailability } from '@msdyn365-commerce-modules/retail-actions';

interface Props {
    data: { countries: { [key: string]: { [key: string]: IFullOrgUnitAvailability[] } } };
    onStateSelected: (locations: IFullOrgUnitAvailability[]) => void;
}

const StoreSelectorAccordionList: React.FC<Props> = ({ data, onStateSelected }) => {
    const firstCountry = Object.keys(data.countries)[0];
    const firstState = firstCountry ? Object.keys(data.countries[firstCountry])[0] : null;

    const [selectedCountry, setSelectedCountry] = useState<string | null>(firstCountry || null);
    const [selectedState, setSelectedState] = useState<string | null>(firstState || null);

    useEffect(() => {
        if (firstCountry && firstState) {
            onStateSelected(data.countries[firstCountry][firstState]);
        }
    }, [firstCountry, firstState]);

    const toggleCountry = (country: string) => {
        if (selectedCountry === country) {
            setSelectedCountry(null);
        } else {
            setSelectedCountry(country);
        }
    };

    const toggleState = (country: string, state: string) => {
        if (selectedState === state && selectedCountry === country) {
            setSelectedState(null);
            onStateSelected([]);
        } else {
            setSelectedState(state);
            setSelectedCountry(country);
            onStateSelected(data.countries[country][state]);
        }
    };

    return (
        <div className='msc-our-stores-dropdown'>
            {Object.keys(data.countries).map(country => {
                const countryClass = `msc-flag-${country.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                    <div key={country} className='msc-countries-dropdown'>
                        <h2
                            className={`msc-countries-title ${selectedCountry === country ? 'active' : ''}`}
                            onClick={() => toggleCountry(country)}
                        >
                            <span className={`msc-flag-icon ${countryClass}`}></span>
                            {country}
                        </h2>
                        {selectedCountry === country && (
                            <div className={`msc-states-container`} onMouseLeave={() => setSelectedCountry(null)}>
                                {Object.keys(data.countries[country]).map(state => (
                                    <div key={state} className='msc-states-dropdown'>
                                        <h3
                                            className={`msc-states-title ${selectedState === state ? 'active' : ''}`}
                                            onClick={() => toggleState(country, state)}
                                        >
                                            {state}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StoreSelectorAccordionList;
