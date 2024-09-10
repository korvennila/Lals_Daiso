/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as Msdyn365 from '@msdyn365-commerce/core';
import { DeliveryOption } from '@msdyn365-commerce/retail-proxy';
import {
    getPayloadObject,
    getTelemetryAttributes,
    IPayLoad,
    ITelemetryContent,
    KeyCodes,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { StorePickUpOptionList } from './store-pickup-option-list';

/**
 * Store Selector Search Form Props interface.
 */
export interface IStoreSelectorSearchFormProps {
    resources: {
        searchInputAriaLabel: string;
        searchButtonAriaLabel: string;
        searchPlaceholderText: string;
        seeAllStoresText: string;
        viewListText: string;
        viewMapText: string;
        pickupFilterByHeading?: string;
        pickupFilterMenuHeading?: string;
    };

    id: string;
    value: string;
    isMapDisabled?: boolean;
    showAllStores?: boolean;
    displayList?: boolean;
    locatorView?: boolean;
    productPickUpDeliveryOptions?: DeliveryOption[];
    hasEnabledPickupFilterToShowStore?: boolean;
    filteredPickupMode?: string;

    /**
     * The telemetry content.
     */
    telemetryContent?: ITelemetryContent;
    onShowAllStores(): void;
    onToggleListMapViewState(): void;
    performSearch(searchTerm: string): Promise<void>;
    searchTermChanged(searchTerm: string): Promise<void>;
    filterPickupModeSelected(pickupMode: string): void;
}

/**
 * Simple search form consisting of search text and a search button.
 */
export class StoreSelectorSearchForm extends React.PureComponent<IStoreSelectorSearchFormProps> {
    private readonly searchBoxRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    private readonly storeSearchAttributes: Msdyn365.IDictionary<string> | undefined;

    private readonly showAllStoreAttributes: Msdyn365.IDictionary<string> | undefined;

    private readonly toggleMapViewAttributes: Msdyn365.IDictionary<string> | undefined;

    private previousValue: string = '';

    private isSearchResultOpened: boolean = false;

    public constructor(props: IStoreSelectorSearchFormProps) {
        super(props);
        this.state = { value: '' };
        this._handleKeyPressPrev = this._handleKeyPressPrev.bind(this);
        const payLoad: IPayLoad = getPayloadObject('click', props.telemetryContent!, TelemetryConstant.SearchStore);
        this.storeSearchAttributes = getTelemetryAttributes(props.telemetryContent!, payLoad);
        payLoad.contentAction.etext = TelemetryConstant.ShowAllStore;
        this.showAllStoreAttributes = getTelemetryAttributes(props.telemetryContent!, payLoad);
        payLoad.contentAction.etext = TelemetryConstant.ToggleMapView;
        this.toggleMapViewAttributes = getTelemetryAttributes(props.telemetryContent!, payLoad);
    }

    public render(): JSX.Element {
        const {
            resources: {
                searchButtonAriaLabel,
                searchPlaceholderText,
                seeAllStoresText,
                viewListText,
                viewMapText,
                pickupFilterByHeading,
                pickupFilterMenuHeading
            },
            id,
            value,
            isMapDisabled,
            showAllStores,
            displayList,
            locatorView,
            onShowAllStores,
            productPickUpDeliveryOptions,
            hasEnabledPickupFilterToShowStore
        } = this.props;

        const toggleButtonText = displayList ? viewMapText : viewListText;

        return (
            <div className='ms-store-select__search'>
                <form
                    className='ms-store-select__search-form'
                    aria-label={searchButtonAriaLabel}
                    name='storeSelectorSearchForm'
                    autoComplete='off'
                    onSubmit={this._onSubmit}
                    id={`ms-store-select__search-box-container_${id}`}
                >
                    <input
                        type='text'
                        aria-label={this.props.resources.searchInputAriaLabel}
                        className='msc-form-control ms-store-select__search-input'
                        placeholder={searchPlaceholderText}
                        value={value}
                        onChange={this._searchTextChanged}
                        id={`ms-store-select__search-box_${id}`}
                        ref={this.searchBoxRef}
                        role='combobox'
                        aria-expanded='false'
                        aria-controls='as_containerSearch'
                        onKeyUp={this._handleInputKeyPress}
                    />
                    <button
                        className={`ms-store-select__search-button${isMapDisabled ? ' search-btn-disabled' : ''}`}
                        aria-label={searchButtonAriaLabel}
                        color='primary'
                        {...this.storeSearchAttributes}
                    />
                </form>
                {showAllStores && (
                    <div
                        className='ms-store-select__search-see-all-stores'
                        tabIndex={0}
                        role='button'
                        onKeyUp={this._handleKeyPressPrev}
                        onClick={onShowAllStores}
                        {...this.showAllStoreAttributes}
                    >
                        {seeAllStoresText}
                    </div>
                )}
                {this.renderPickupModesList(
                    this.props,
                    toggleButtonText,
                    productPickUpDeliveryOptions,
                    pickupFilterMenuHeading,
                    locatorView,
                    pickupFilterByHeading,
                    hasEnabledPickupFilterToShowStore,
                    displayList
                )}
            </div>
        );
    }

    /**
     * Handles the key press on the input box.
     * @param event - Event object.
     */
    private readonly _handleInputKeyPress = (event: React.KeyboardEvent): void => {
        // When the user navigates through the up and down arrow on the result returned by the auto suggest and press enter.
        // At that time, two requests were made to fetch the store details due to which incorrect result is shown and causes flickering.
        // In order to avoid that. Checking if the search result is open or not.
        if (event.keyCode === KeyCodes.ArrowUp || event.keyCode === KeyCodes.ArrowDown) {
            const activeDescedantValue = (event.target as HTMLInputElement).getAttribute('aria-activedescendant');
            if (activeDescedantValue) {
                if (this.previousValue === '') {
                    this.previousValue = activeDescedantValue;
                    this.isSearchResultOpened = true;
                    return;
                }

                if (activeDescedantValue !== this.previousValue) {
                    this.previousValue = activeDescedantValue;
                    this.isSearchResultOpened = true;
                } else {
                    this.isSearchResultOpened = false;
                }
            }
        }
    };

    /**
     * Calls method display result.
     * @param event - The first number.
     */
    private readonly _handleKeyPressPrev = (event: React.KeyboardEvent): void => {
        if (event.keyCode === KeyCodes.Enter || event.keyCode === KeyCodes.Space) {
            this.props.onShowAllStores();
        }
    };

    /**
     * Method called on search text changed.
     * @param event - Input value.
     */
    private readonly _searchTextChanged = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const inputValue: string = event.target.value;

        await this.props.searchTermChanged(inputValue);
    };

    /**
     * Method called on search submit.
     * @param event - Input value.
     */
    private readonly _onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
        event.preventDefault(); // Prevents form submission
        this.searchBoxRef.current?.blur();
        if (!this.isSearchResultOpened) {
            await this.props.performSearch(this.props.value);
        }
        this.isSearchResultOpened = false;
    };

    /**
     * Method called on product pickup option change.
     * @returns - Void.
     */
    private readonly _onChangeHandler = () => async (deliveryCode: string): Promise<void> => {
        this.props.filterPickupModeSelected(deliveryCode);
        return Promise.resolve();
    };

    /**
     * Method to render pickup mode list.
     * @param props - Store selector search form props.
     * @param toggleButtonText - Locator view button text.
     * @param productPickUpDeliveryOptions - Product DeliveryOption List.
     * @param pickupFilterMenuHeading - Pickup store button text.
     * @param locatorView - Locator View is on\off.
     * @param pickupFilterByHeading - Pickup list label text.
     * @param hasEnabledPickupFilterToShowStore - Flag to check header filter is enabled.
     * @param shouldDisplayList - Display List.
     * @returns Jsx component.
     */
    private readonly renderPickupModesList = (
        props: IStoreSelectorSearchFormProps,
        toggleButtonText: string,
        productPickUpDeliveryOptions: DeliveryOption[] | undefined,
        pickupFilterMenuHeading: string | undefined,
        locatorView: boolean | undefined,
        pickupFilterByHeading: string | undefined,
        hasEnabledPickupFilterToShowStore: boolean | undefined,
        shouldDisplayList?: boolean
    ): JSX.Element | null => {
        const toggleButtonClass = shouldDisplayList ? 'view-map' : 'list-view';
        if (hasEnabledPickupFilterToShowStore) {
            return (
                <div className='ms-store-select__search-header'>
                    {locatorView && (
                        <button
                            className={`ms-store-select__toggle-view ${toggleButtonClass}`}
                            onClick={props.onToggleListMapViewState}
                            {...this.toggleMapViewAttributes}
                        >
                            {toggleButtonText}
                        </button>
                    )}
                    <StorePickUpOptionList
                        productPickupListOptionMenuText={pickupFilterMenuHeading}
                        defaultOptionText={props.filteredPickupMode ? undefined : pickupFilterMenuHeading}
                        productPickupModeList={productPickUpDeliveryOptions}
                        onChange={this._onChangeHandler()}
                    />
                    <div className='ms-store-select__search-header-heading'>{pickupFilterByHeading}</div>
                </div>
            );
        }
        if (locatorView) {
            return (
                <button
                    className={`ms-store-select__toggle-view ${toggleButtonClass}`}
                    onClick={props.onToggleListMapViewState}
                    {...this.toggleMapViewAttributes}
                >
                    {toggleButtonText}
                </button>
            );
        }
        return null;
    };
}
