import { createItem, getItems } from './api.js';

$(() => {
    const dataGrid = $('#gridContainer').dxDataGrid({
        dataSource: orders,
        keyExpr: 'ID',
        columnsAutoWidth: true,
        showBorders: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: 'Search...',
        },
        headerFilter: {
            visible: true,
        },
        columns: [{
            dataField: 'OrderNumber',
            caption: 'Name',
            width: 140,
            headerFilter: {
                groupInterval: 10000,
            },
        }, {
            dataField: 'OrderDate',
            alignment: 'right',
            dataType: 'date',
            width: 120,
            calculateFilterExpression(value, selectedFilterOperations, target) {
                if (target === 'headerFilter' && value === 'weekends') {
                    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
                }
                return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
            },
            headerFilter: {
                dataSource(data) {
                    data.dataSource.postProcess = function (results) {
                        results.push({
                            text: 'Weekends',
                            value: 'weekends',
                        });
                        return results;
                    };
                },
            },
        }, {
            dataField: 'DeliveryDate',
            alignment: 'right',
            dataType: 'datetime',
            width: 180,
            format: 'M/d/yyyy, HH:mm',
        }, {
            dataField: 'SaleAmount',
            alignment: 'right',
            format: 'currency',
            editorOptions: {
                format: 'currency',
                showClearButton: true,
            },
            headerFilter: {
                dataSource: [{
                    text: 'Less than $3000',
                    value: ['SaleAmount', '<', 3000],
                }, {

                    text: '$3000 - $5000',
                    value: [['SaleAmount', '>=', 3000], ['SaleAmount', '<', 5000]],
                }, {

                    text: '$5000 - $10000',
                    value: [['SaleAmount', '>=', 5000], ['SaleAmount', '<', 10000]],
                }, {

                    text: '$10000 - $20000',
                    value: [['SaleAmount', '>=', 10000], ['SaleAmount', '<', 20000]],
                }, {
                    text: 'Greater than $20000',
                    value: ['SaleAmount', '>=', 20000],
                }],
            },
        }, 'Employee', {
            caption: 'City',
            dataField: 'CustomerStoreCity',
            headerFilter: {
                search: {
                    enabled: true,
                },
            },
        }],
    }).dxDataGrid('instance');

    // const applyFilterTypes = [{
    //     key: 'auto',
    //     name: 'Immediately',
    // }, {
    //     key: 'onClick',
    //     name: 'On Button Click',
    // }];
    //
    // const applyFilterModeEditor = $('#useFilterApplyButton').dxSelectBox({
    //     items: applyFilterTypes,
    //     value: applyFilterTypes[0].key,
    //     valueExpr: 'key',
    //     inputAttr: { 'aria-label': 'Apply Filter' },
    //     displayExpr: 'name',
    //     onValueChanged(data) {
    //         dataGrid.option('filterRow.applyFilter', data.value);
    //     },
    // }).dxSelectBox('instance');

    // $('#filterRow').dxCheckBox({
    //     text: 'Filter Row',
    //     value: true,
    //     onValueChanged(data) {
    //         dataGrid.clearFilter();
    //         dataGrid.option('filterRow.visible', data.value);
    //         applyFilterModeEditor.option('disabled', !data.value);
    //     },
    // });

    // $('#headerFilter').dxCheckBox({
    //     text: 'Header Filter',
    //     value: true,
    //     onValueChanged(data) {
    //         dataGrid.clearFilter();
    //         dataGrid.option('headerFilter.visible', data.value);
    //     },
    // });
    //
    // function getOrderDay(rowData) {
    //     return (new Date(rowData.OrderDate)).getDay();
    // }
});


const orders = [{
    ID: 1,
    OrderNumber: 35703,
    OrderDate: '2017/04/10',
    DeliveryDate: '2017/04/13 9:00',
    SaleAmount: 11800,
    Terms: '15 Days',
    CustomerStoreCity: 'Los Angeles, CA',
    Employee: 'Harv Mudd',
}, {
    ID: 4,
    OrderNumber: 35711,
    OrderDate: '2017/01/12',
    DeliveryDate: '2017/01/13 9:00',
    SaleAmount: 16050,
    Terms: '15 Days',
    CustomerStoreCity: 'San Jose, CA',
    Employee: 'Jim Packard',
}, {
    ID: 5,
    OrderNumber: 35714,
    OrderDate: '2017/01/22',
    DeliveryDate: '2017/01/27 9:00',
    SaleAmount: 14750,
    Terms: '15 Days',
    CustomerStoreCity: 'Las Vegas, NV',
    Employee: 'Harv Mudd',
}, {
    ID: 7,
    OrderNumber: 35983,
    OrderDate: '2017/02/07',
    DeliveryDate: '2017/02/10 13:00',
    SaleAmount: 3725,
    Terms: '15 Days',
    CustomerStoreCity: 'Denver, CO',
    Employee: 'Todd Hoffman',
}, {
    ID: 11,
    OrderNumber: 38466,
    OrderDate: '2017/03/01',
    DeliveryDate: '2017/03/03 17:45',
    SaleAmount: 7800,
    Terms: '15 Days',
    CustomerStoreCity: 'Los Angeles, CA',
    Employee: 'Harv Mudd',
}, {
    ID: 14,
    OrderNumber: 39420,
    OrderDate: '2017/02/15',
    DeliveryDate: '2017/02/17 11:45',
    SaleAmount: 20500,
    Terms: '15 Days',
    CustomerStoreCity: 'San Jose, CA',
    Employee: 'Jim Packard',
}, {
    ID: 15,
    OrderNumber: 39874,
    OrderDate: '2017/02/04',
    DeliveryDate: '2017/02/10 15:00',
    SaleAmount: 9050,
    Terms: '30 Days',
    CustomerStoreCity: 'Las Vegas, NV',
    Employee: 'Harv Mudd',
}, {
    ID: 18,
    OrderNumber: 42847,
    OrderDate: '2017/02/15',
    DeliveryDate: '2017/02/17 8:30',
    SaleAmount: 20400,
    Terms: '30 Days',
    CustomerStoreCity: 'Casper, WY',
    Employee: 'Todd Hoffman',
}];

