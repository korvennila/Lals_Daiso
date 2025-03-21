/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { DeliveryOption, ItemAvailability, OrgUnitLocation } from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions, IFullOrgUnitAvailability } from '@msdyn365-commerce-modules/retail-actions';
import { ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { IStoreSelectorResources } from '../store-selector.props.autogenerated';
import { IStoreSelectorLocationLineItemResources, StoreSelectorLocationLineItemComponent } from './store-selector-location-line-item';

/**
 * Store selector location lines props interface.
 */
export interface IStoreSelectorLocationLinesProps {
    locations?: IFullOrgUnitAvailability[];
    resources: IStoreSelectorResources;
    preferredDistanceUnit?: string;

    alreadySelectedLocation?: OrgUnitLocation;
    outOfStockThreshold: number;
    enableOutOfStockCheck: boolean;
    storeLocatorView?: boolean;
    selectedStoreLocationId?: string;
    isPreferredStoreEnabled?: boolean;
    displayList?: boolean;
    isLocationDisabled?: boolean;
    productPickUpDeliveryOptions?: DeliveryOption[];
    onClick: (locationId: string | undefined) => void;
    preferredStoreLocationId: string | null;
    onSetAsPreferredStore: (locationId: string | undefined) => void;
    onRemovePreferredStore: () => void;
    filteredPickupMode?: string;
    shouldShowIndex?: boolean;

    /**
     * The telemetry content.
     */
    telemetryContent?: ITelemetryContent;
    onLocationSelected(location: OrgUnitLocation | undefined): void;
}

/**
 * Displays all the location line items, or null if none exists.
 */
@observer
export class StoreSelectorLocationLines extends React.PureComponent<IStoreSelectorLocationLinesProps> {
    @observable private _stores: IFullOrgUnitAvailability[] | undefined;

    private readonly selectedLocationRef: React.RefObject<HTMLDivElement>;

    private storeCounter: number;

    public constructor(props: IStoreSelectorLocationLinesProps) {
        super(props);
        this.selectedLocationRef = React.createRef();
        this.storeCounter = 0;
    }

    public componentDidUpdate(previousProps: IStoreSelectorLocationLinesProps): void {
        if (this.props.selectedStoreLocationId !== previousProps.selectedStoreLocationId) {
            this._scrollIntoView();
        }
    }

    public componentDidMount(): void {
        if (this.props.locations) {
            this._stores = this._sortStores(this.props.locations);
        }

        reaction(
            () => this.props.locations,
            () => {
                if (this.props.locations) {
                    this._stores = this._sortStores(this.props.locations);
                }
            }
        );
    }

    public render(): JSX.Element | null {
        if (!ArrayExtensions.hasElements(this._stores)) {
            return null;
        }

        this.storeCounter = 0;

        return (
            <div className={classnames('ms-store-select__locations', { show: this.props.displayList })} role='list'>
                {this._stores.map((store, index) => {
                    return this._renderStoreLocation(store, index);
                })}
            </div>
        );
    }

    /**
     * On click Handler function.
     * @param orgUnitLocation -OrgUnit location.
     * @returns Click action on orgUnit Location.
     */
    private readonly onClickHandler = (orgUnitLocation: OrgUnitLocation | undefined) => () => {
        this.props.onClick(orgUnitLocation?.OrgUnitNumber);
    };

    private _renderStoreLocation(store: IFullOrgUnitAvailability, index: number): JSX.Element | undefined {
        const orgUnitLocation = store?.OrgUnitAvailability?.OrgUnitLocation;
        const selectedStoreLocationId = this.props.selectedStoreLocationId;
        const deliveryOptions = store?.OrgUnitPickUpDeliveryModes;
        const defaultAriaSetsize = 0;
        if (orgUnitLocation) {
            ++this.storeCounter;
            return (
                <div
                    className={classnames('ms-store-select__location', {
                        selected: selectedStoreLocationId === orgUnitLocation.OrgUnitNumber
                    })}
                    key={index}
                    role='listitem'
                    aria-setsize={ArrayExtensions.hasElements(this._stores) ? this._stores.length : defaultAriaSetsize}
                    aria-posinset={this.storeCounter}
                    onClick={this.onClickHandler(orgUnitLocation)}
                    ref={selectedStoreLocationId === orgUnitLocation.OrgUnitNumber ? this.selectedLocationRef : undefined}
                >
                    <StoreSelectorLocationLineItemComponent
                        location={orgUnitLocation}
                        storeHours={store.StoreHours}
                        resources={this._mapResources(this.props.resources)}
                        preferredDistanceUnit={this.props.preferredDistanceUnit!}
                        isCurrentLocation={this._isCurrentLocation(orgUnitLocation)}
                        isInStock={this._isProductInStock(store?.OrgUnitAvailability?.ItemAvailabilities)}
                        hideStockStatus={!this.props.enableOutOfStockCheck}
                        handlers={{
                            onSelected: this.props.onLocationSelected,
                            onSetAsPreferredStore: this.props.onSetAsPreferredStore,
                            onRemovePreferredStore: this.props.onRemovePreferredStore
                        }}
                        stockStatusLabel={this._stockInventoryLabel(store)}
                        storeLocatorView={this.props.storeLocatorView}
                        index={this.storeCounter.toString()}
                        preferredStoreLocationId={this.props.preferredStoreLocationId}
                        isPreferredStoreEnabled={this.props.isPreferredStoreEnabled}
                        telemetryContent={this.props.telemetryContent}
                        isLocationDisabled={this.props.isLocationDisabled}
                        storePickUpOptionList={deliveryOptions?.DeliveryOptions}
                        productPickUpOptionList={this.props.productPickUpDeliveryOptions}
                        filteredPickupMode={this.props.filteredPickupMode}
                        shouldShowIndex={this.props.shouldShowIndex}
                    />
                </div>
            );
        }
        return undefined;
    }

    /**
     * Sort store.
     * @param stores - Array of stores data.
     * @returns Sorted stores array.
     */
    private _sortStores(stores: IFullOrgUnitAvailability[]): IFullOrgUnitAvailability[] {
        /**
         * IsPreferredStore.
         * @param value - Array of stores data.
         * @returns IsPreferred store boolean value.
         */
        const isPreferredStore = (value: IFullOrgUnitAvailability) =>
            this.props.isPreferredStoreEnabled &&
            this.props.preferredStoreLocationId &&
            value.OrgUnitAvailability?.OrgUnitLocation?.OrgUnitNumber === this.props.preferredStoreLocationId;

        return [...stores.filter(isPreferredStore), ...stores.filter(store => !isPreferredStore(store))];
    }

    /**
     * Scroll into view.
     */
    private readonly _scrollIntoView = () => {
        const selectedLocationDiv = this.selectedLocationRef.current;
        const parent = selectedLocationDiv?.parentElement;
        if (selectedLocationDiv && parent) {
            if (parent.scrollTop > selectedLocationDiv.offsetTop) {
                parent.scrollTop = selectedLocationDiv.offsetTop;
            } else if (selectedLocationDiv.offsetTop + selectedLocationDiv.clientHeight > parent.scrollTop + parent.clientHeight) {
                parent.scrollTop = selectedLocationDiv.offsetTop + selectedLocationDiv.clientHeight - parent.clientHeight;
            }
        }
    };

    /**
     * Is current location.
     * @param location - Org unit location.
     * @returns The current location.
     */
    private readonly _isCurrentLocation = (location: OrgUnitLocation | undefined): boolean =>
        (this.props.alreadySelectedLocation && location && this.props.alreadySelectedLocation.OrgUnitNumber === location.OrgUnitNumber) ||
        false;

    /**
     * Check the product is in stock or not.
     * @param itemAvailabilities - Item availabilities.
     * @returns If the product is in stock.
     */
    private readonly _isProductInStock = (itemAvailabilities: ItemAvailability[] | undefined): boolean => {
        if (!this.props.enableOutOfStockCheck) {
            return true;
        }

        if (ArrayExtensions.hasElements(itemAvailabilities)) {
            return itemAvailabilities[0].AvailableQuantity ? itemAvailabilities[0].AvailableQuantity > 0 : false;
        }

        return false;
    };

    /**
     * Get the stock inventory label.
     * @param availabilityWithHours - Full org unit availability.
     * @returns The stock label.
     */
    private readonly _stockInventoryLabel = (availabilityWithHours: IFullOrgUnitAvailability | undefined): string | undefined => {
        if (availabilityWithHours && ArrayExtensions.hasElements(availabilityWithHours.ProductInventoryInformation)) {
            for (let i = 0; i < availabilityWithHours.ProductInventoryInformation.length; i++) {
                if (
                    availabilityWithHours.OrgUnitAvailability?.OrgUnitLocation?.InventoryLocationId ===
                    availabilityWithHours.ProductInventoryInformation[i].InventLocationId
                ) {
                    return availabilityWithHours.ProductInventoryInformation[i].StockLevelLabel;
                }
            }
        }

        return undefined;
    };

    /**
     * Map resources.
     * @param resources - Store resources.
     * @returns Resources.
     */
    private readonly _mapResources = (resources: IStoreSelectorResources): IStoreSelectorLocationLineItemResources => {
        return {
            contactInfoHeader: resources.contactText,
            storeHoursHeader: resources.timeText,
            availabilityInfoHeader: resources.availabilityText,

            closedText: resources.storeHoursClosedText,
            outOfStock: resources.outOfStockText,
            inStock: resources.inStockText,

            currentLocation: resources.selectedStoreLocationText,
            selectLocation: resources.selectStoreText,
            selectLocationAriaLabelFormat: resources.selectStoreAriaFormatText,
            setAsPreferredStoreText: resources.setAsPreferredStoreText,
            setAsPreferredStoreTextAriaLabel: resources.setAsPreferredStoreTextAriaLabel,
            preferredStoreText: resources.preferredStoreText,
            preferredStoreAriaLabel: resources.preferredStoreAriaLabel,
            pickupDeliveryOptionErrorMessage: resources.pickupDeliveryOptionErrorMessage,

            days: {
                monday: resources.storeHoursMondayText,
                tuesday: resources.storeHoursTuesdayText,
                wednesday: resources.storeHoursWednesdayText,
                thursday: resources.storeHoursThursdayText,
                friday: resources.storeHoursFridayText,
                saturday: resources.storeHoursSaturdayText,
                sunday: resources.storeHoursSundayText,
                mondayFull: resources.storeHoursMondayFullText,
                tuesdayFull: resources.storeHoursTuesdayFullText,
                wednesdayFull: resources.storeHoursWednesdayFullText,
                thursdayFull: resources.storeHoursThursdayFullText,
                fridayFull: resources.storeHoursFridayFullText,
                saturdayFull: resources.storeHoursSaturdayFullText,
                sundayFull: resources.storeHoursSundayFullText
            }
        };
    };
}
