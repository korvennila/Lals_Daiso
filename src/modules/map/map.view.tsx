/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IHeader, IMapViewProps } from './map';

/**
 * Render the heading.
 * @param param0 -- Heading props.
 * @param param0.headerProps -- Heading Props.
 * @param param0.heading -- Heading Node.
 * @returns -- Returns the node.
 */
const MapHeader: React.FC<IHeader> = ({ headerProps, heading }) => <Node {...headerProps}>{heading}</Node>;

/**
 * Renders the map view props.
 * @param param0 -- Map view props.
 * @param param0.ModuleProps -- Module props.
 * @param param0.Header -- Header props.
 * @param param0.MapProps -- Map props.
 * @returns -- Returns the map module.
 */
const MapView: React.FC<IMapViewProps> = ({ ModuleProps, Header, MapProps }) => (
    <Module {...ModuleProps}>
        {Header && <MapHeader {...Header} />}
        <Node {...MapProps} />
    </Module>
);

export default MapView;
