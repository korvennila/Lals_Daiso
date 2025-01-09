/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import {
    CacheType,
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    ICommerceApiSettings
} from '@msdyn365-commerce/core';
import { IQueryResultSettings, SalesLine } from '@msdyn365-commerce/retail-proxy';
import { getOrderShipmentsHistoryAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CustomersDataActions.g';
import { OrderShipments, SimpleProduct } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import {
    buildCacheKey,
    getOrganizationWideOrderHistory,
    GetOrganizationWideOrderHistoryInput,
    getSimpleProducts,
    ProductInput
} from '@msdyn365-commerce-modules/retail-actions';

import { OrderHistoryFilterState } from '../components/order-history-filter';

/**
 * IPaging Interface.
 */
export interface IPaging {
    top: number;
    skip: number;
}

/**
 * IOrderHistory Interface.
 */
export interface IOrderHistory {
    salesOrders: OrderShipments[];
    products: SimpleProduct[];
    nextPageToken?: string;
}

/**
 * IOrderHistoryResult Interface.
 */
export interface IOrderHistoryResult {
    salesOrders: OrderShipments[];
    nextPageToken?: string;
}

/**
 * Calls the Retail API and returns the products.
 * @param paging - Paging interface.
 * @param nextPageToken - Next Page Link.
 * @returns Collection of OrderShipments.
 */
const getOrderShipmentHistory = (paging: IPaging, nextPageToken?: string) => async (ctx: IActionContext): Promise<IOrderHistoryResult> => {
    const orderHistoryResults = getOrderShipmentsHistoryAsync(
        {
            callerContext: ctx,
            bypassCache: 'get',
            queryResultSettings: {
                Paging: {
                    Top: paging.top,
                    NextPageToken: nextPageToken
                }
            }
        },
        '',
        nextPageToken
    );

    const orderHistoryResponse = await orderHistoryResults;
    const nextLinkUrl = orderHistoryResults.metadata?.others?.nextLink;
    const nextPageLink = nextLinkUrl !== undefined ? new URL(nextLinkUrl).searchParams.get('nextPageToken') : undefined;
    const nextPage = nextPageLink !== null ? nextPageLink : undefined;
    return {
        salesOrders: orderHistoryResponse,
        nextPageToken: nextPage
    };
};

/**
 * Calls the Retail API and returns the products.
 * @param paging - Paging props.
 * @param nextPageToken - Next Page Link.
 * @returns Collections of order shipments.
 */
const getOrganizationWideOrderShipmentHistory = (paging: IPaging, nextPageToken?: string) => async (
    context: IActionContext
): Promise<IOrderHistoryResult> => {
    const queryResultSetting: IQueryResultSettings = {
        Paging: {
            Top: paging.top,
            Skip: paging.skip,
            NextPageToken: nextPageToken
        }
    };

    const orgOrderHistoryResults = getOrganizationWideOrderHistory(new GetOrganizationWideOrderHistoryInput(queryResultSetting), context);

    const orgOrderHistoryResponse = await orgOrderHistoryResults;
    const nextLinkUrl = orgOrderHistoryResults.metadata?.others?.nextLink;
    const nextPageLink = nextLinkUrl !== undefined ? new URL(nextLinkUrl).searchParams.get('nextPageToken') : undefined;
    const nextPage = nextPageLink !== null ? nextPageLink : undefined;
    return {
        salesOrders: orgOrderHistoryResponse,
        nextPageToken: nextPage
    };
};

/**
 * Calls the Retail API and returns the products.
 * @param productIds - Collection of products id.
 * @param channelId - ChannelId number.
 * @returns Collections of simple products.
 */
const getProducts = (productIds: number[] = [], channelId?: number) => (ctx: IActionContext): Promise<SimpleProduct[]> => {
    const productInputs = productIds.map(
        productId => new ProductInput(productId, ctx.requestContext.apiSettings, channelId, undefined, ctx.requestContext)
    );
    return getSimpleProducts(productInputs, ctx);
};

/**
 *  Action input.
 */
export class GetSalesOrderHistoryWithHydrationsInput implements IActionInput {
    public paging: IPaging;

    public filterState: OrderHistoryFilterState;

    public nextPageToken?: string;

    private readonly apiSettings: ICommerceApiSettings;

    constructor(paging: IPaging, apiSettings: ICommerceApiSettings, filterState?: OrderHistoryFilterState, nextPageLink?: string) {
        this.apiSettings = apiSettings;
        this.paging = paging;
        this.filterState = filterState || OrderHistoryFilterState.CurrentUser;
        this.nextPageToken = nextPageLink;
    }

    public getCacheKey = () => buildCacheKey('OrderHistory', this.apiSettings);

    /**
     * GetCacheObjectType.
     * @returns String.
     */
    public getCacheObjectType = () => 'OrderHistory';

    public dataCacheType = (): CacheType => 'none';
}

/**
 * Splits product ids from the given orders into lists by their channel id.
 * @param {OrderShipments[]} salesOrders Orders with the products.
 * @param {number} currentChannelId Channel id to use by default if no channel id is provided for a product.
 * @returns {{ [x: number]: number[] }} A dictionary where the key is a channel id,
 * and the value is a list of product ids in which all items correspond to the key channel id.
 * @remark The list of product ids is always non-empty.
 */
const splitProductsByChannelId = (salesOrders: OrderShipments[], currentChannelId: number): { [x: number]: number[] } => {
    const productIdsByChannel: { [x: number]: number[] } = {};

    salesOrders.forEach(salesOrder =>
        salesOrder?.SalesLines?.forEach(line => {
            const orderProductId = line.ProductId || 0;
            const orderChannelId = salesOrder.ChannelId || currentChannelId;
            if (!productIdsByChannel[orderChannelId]) {
                productIdsByChannel[orderChannelId] = [];
            }
            productIdsByChannel[orderChannelId].push(orderProductId);
        })
    );

    return productIdsByChannel;
};

/**
 * Get sales order with hydrations action.
 * @param input - GetOrderHistory hydration input.
 * @param context - Channel context.
 * @returns - Order History props.
 */
export async function getSalesOrderHistoryWithHydrationsAction(
    input: GetSalesOrderHistoryWithHydrationsInput,
    context: IActionContext
): Promise<IOrderHistory> {
    if (!context) {
        throw new Error('getSalesOrderWithHydrationsAction - Action context cannot be null/undefined');
    }
    const channelId = context.requestContext.apiSettings.channelId;
    let salesOrders: OrderShipments[] = [];
    let nextPage: string | undefined = '';
    let orderHistoryResponse: IOrderHistoryResult;

    switch (input.filterState) {
        case OrderHistoryFilterState.CurrentUser:
            orderHistoryResponse = await getOrderShipmentHistory(input.paging, input.nextPageToken)(context);
            salesOrders = orderHistoryResponse.salesOrders;
            nextPage = orderHistoryResponse.nextPageToken;
            break;
        case OrderHistoryFilterState.OrganizationWide:
            orderHistoryResponse = await getOrganizationWideOrderShipmentHistory(input.paging, input.nextPageToken)(context);
            salesOrders = orderHistoryResponse.salesOrders;
            nextPage = orderHistoryResponse.nextPageToken;
            break;
        default:
            throw new Error('getSalesOrderWithHydrationsAction - Invalid OrderHistoryFilterState passed');
    }

    salesOrders.map(salesOrder => {
        return (salesOrder.SalesLines = salesOrder.SalesLines?.filter((saleline: SalesLine) => !saleline.IsVoided));
    });

    if (!salesOrders || salesOrders.length === 0) {
        return {
            salesOrders: [],
            products: [],
            nextPageToken: nextPage
        };
    }

    // Splits the data by channel ids so that the products from different channels can be processed separately.
    const productIdsByChannelId = splitProductsByChannelId(salesOrders, channelId);

    // Promise that retrieves information about the products for each channel id.
    // Note, the list of product ids should not be empty
    // as it will generate an empty request which will force the promise to fail.
    const getProductsPromise = Object.entries(productIdsByChannelId).map(([entryChannelId, entryProductIdsList]) => {
        const getProductsCall = getProducts(entryProductIdsList, Number(entryChannelId));
        return getProductsCall(context);
    });

    return Promise.all(getProductsPromise)
        .then(
            (productList): IOrderHistory => {
                const products = productList.reduce((memo, list) => {
                    return [...memo, ...list];
                }, []);
                return {
                    salesOrders,
                    products,
                    nextPageToken: nextPage
                };
            }
        )
        .catch(error => {
            context.telemetry.exception(error);
            context.telemetry.debug('Failed to get products');
            throw error;
        });
}

export const getSalesOrderHistoryWithHydrationsActionDataAction = createObservableDataAction({
    id: '@msdyn365-commerce-modules/order-management/order-history/get-order-shipment-history',
    action: <IAction<IOrderHistory>>getSalesOrderHistoryWithHydrationsAction
});

export default getSalesOrderHistoryWithHydrationsActionDataAction;
