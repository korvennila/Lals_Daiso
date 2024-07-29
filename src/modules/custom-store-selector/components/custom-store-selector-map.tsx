import React, { Component } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import { maptiler } from 'pigeon-maps/providers';
import { IFullOrgUnitAvailability, ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import { OrgUnitLocation } from '@msdyn365-commerce/retail-proxy';

interface IStoreSelectorMapProps {
    locations?: IFullOrgUnitAvailability[];
    preferredStoreLocationId: string | null;
    isPreferredStoreEnabled?: boolean;
    selectedStoreLocationId?: string;
    onClick: (locationId: string | undefined) => void;
    defaultZoom: number;
    pigeonApiKey: string;
}

interface IStoreSelectorMapState {
    center: [number, number];
    zoom: number; // Add zoom state
}

@observer
export class StoreSelectorMap extends Component<IStoreSelectorMapProps, IStoreSelectorMapState> {
    @observable private _stores: IFullOrgUnitAvailability[] | undefined;

    public constructor(props: IStoreSelectorMapProps) {
        super(props);
        this.state = {
            center: [50.879, 4.6997], // Default center
            zoom: this.props.defaultZoom // Default zoom level
        };
    }

    public componentDidMount(): void {
        this._updateStores(this.props.locations);

        reaction(
            () => this.props.locations,
            locations => this._updateStores(locations)
        );
    }

    public componentDidUpdate(prevProps: IStoreSelectorMapProps): void {
        if (this.props.locations !== prevProps.locations && this.props.locations?.length) {
            const firstStoreLocation = this.props.locations[0].OrgUnitAvailability?.OrgUnitLocation;
            if (firstStoreLocation) {
                this.setState({
                    center: [firstStoreLocation.Latitude!, firstStoreLocation.Longitude!]
                });
            }
        }

        if (this.props.selectedStoreLocationId !== prevProps.selectedStoreLocationId && this.props.selectedStoreLocationId) {
            const selectedStore = this.props.locations?.find(
                store => store.OrgUnitAvailability?.OrgUnitLocation?.OrgUnitNumber === this.props.selectedStoreLocationId
            );

            if (selectedStore?.OrgUnitAvailability?.OrgUnitLocation) {
                const { Latitude, Longitude } = selectedStore.OrgUnitAvailability.OrgUnitLocation;
                this.setState({
                    center: [Latitude!, Longitude!],
                    zoom: this.props.defaultZoom // Increase zoom level when a store is selected
                });
            }
        }
    }

    public render(): JSX.Element | null {
        if (!ArrayExtensions.hasElements(this._stores)) {
            return null;
        }

        return (
            <div className='msc-store-selector-mapContainer'>
                {this.props.pigeonApiKey ? (
                    <Map
                        height={300}
                        center={this.state.center}
                        defaultZoom={this.state.zoom}
                        onBoundsChanged={({ center, zoom }) => this.setState({ center, zoom })}
                        provider={maptiler(this.props.pigeonApiKey, 'streets')}
                    >
                        <ZoomControl />
                        {this._stores.map((store, index) => this._renderLocationPin(store, index))}
                    </Map>
                ) : (
                    <Map
                        height={300}
                        center={this.state.center}
                        defaultZoom={this.state.zoom}
                        onBoundsChanged={({ center, zoom }) => this.setState({ center, zoom })}
                    >
                        <ZoomControl />
                        {this._stores.map((store, index) => this._renderLocationPin(store, index))}
                    </Map>
                )}
            </div>
        );
    }

    private _renderLocationPin(store: IFullOrgUnitAvailability, index: number): JSX.Element | undefined {
        const orgUnitLocation = store?.OrgUnitAvailability?.OrgUnitLocation;
        const selectedStoreLocationId = this.props.selectedStoreLocationId;

        if (orgUnitLocation) {
            const isSelected = selectedStoreLocationId === orgUnitLocation.OrgUnitNumber;
            const color = isSelected ? '#ec008c' : '#807D7E';
            return (
                <Marker
                    key={index}
                    width={50}
                    anchor={[orgUnitLocation.Latitude!, orgUnitLocation.Longitude!]}
                    color={color}
                    onClick={() => this._handleMarkerClick(index, orgUnitLocation)}
                />
            );
        }
        return undefined;
    }

    private _sortStores(stores: IFullOrgUnitAvailability[]): IFullOrgUnitAvailability[] {
        const isPreferredStore = (value: IFullOrgUnitAvailability) =>
            this.props.isPreferredStoreEnabled &&
            this.props.preferredStoreLocationId &&
            value.OrgUnitAvailability?.OrgUnitLocation?.OrgUnitNumber === this.props.preferredStoreLocationId;

        return [...stores.filter(isPreferredStore), ...stores.filter(store => !isPreferredStore(store))];
    }

    private _updateStores(locations?: IFullOrgUnitAvailability[]): void {
        if (locations) {
            this._stores = this._sortStores(locations);
        }
    }

    private _handleMarkerClick(index: number, orgUnitLocation: OrgUnitLocation | undefined): void {
        this.setState({
            center: [orgUnitLocation?.Latitude!, orgUnitLocation?.Longitude!],
            zoom: this.props.defaultZoom // Increase zoom level when a marker is clicked
        });
        this.props.onClick(orgUnitLocation?.OrgUnitNumber);
    }
}
