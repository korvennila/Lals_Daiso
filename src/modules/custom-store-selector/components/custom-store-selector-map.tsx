import React from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

export function MyMap() {
    return (
        <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11}>
            <ZoomControl />
            <Marker width={50} anchor={[50.879, 4.6997]} />
        </Map>
    );
}
