import {getItems} from './js/api.js';

const API_BASE_URL = 'https://aussiefarm.local/api/v1/kangaroos';
const fetchAndDisplayKangaroos = async () => {
    try {
        const kangaroos = await getItems();
        displayKangaroo(kangaroos);
    } catch (error) {
        console.error('Error fetching kangaroos:', error);
    }
};

const displayKangaroo = (kangaroo) => {
    let direction = 'up-push';
    let position = 'bottom right';

    $("#gridContainer").dxDataGrid({
        dataSource: kangaroo,
        loadPanel: {
            enabled: true,
            shading: true,
            shadingColor: "rgba(0, 0, 0, 0.5)",
            text: "Loading...",
            showIndicator: true,
            showPane: true,
        },
        height: 'auto',
        paging: {
            pageSize: 10
        },
        remoteOperations: {
            paging: true // Enable remote paging
        },
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowAdding: true,
            popup: {
                title: 'Kangaroo Information',
                showTitle: true,
                width: 700,
                height: 525,
            },
        },
        rowAlternationEnabled: true,
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
        columns: [
            {
                dataField: "name",
                caption: "Name",
                validationRules: [{type: "required", message: "Name is required"}]
            },
            {
                dataField: "nickname",
                caption: "Nickname",
                visible: false,
            },
            {
                dataField: 'weight',
                caption: "Weight",
                dataType: 'number',
                editorOptions: {
                    min: 0
                },
                validationRules: [{type: "required", message: "Weight is required"}],
            },
            {
                dataField: 'height',
                caption: "Height",
                dataType: 'number',
                editorOptions: {
                    min: 0
                },
                validationRules: [{type: "required", message: "Height is required"}]
            },
            {
                dataField: 'gender',
                caption: "Gender",
                lookup: {
                    dataSource: [
                        {value: "male", text: "Male"},
                        {value: "female", text: "Female"}
                    ],
                    valueExpr: "value",
                    displayExpr: "text",
                    allowClearing: true
                },
            },
            {
                dataField: 'color',
                caption: "Color",
                visible: false,
            },
            {
                dataField: 'birthday',
                caption: "Birthday",
                dataType: "date",
                format: "yyyy-MM-dd",
                editorOptions: {
                    onInitialized: function (e) {
                        const currentDate = new Date();
                        e.component.option("max", currentDate);
                    }
                },
                validationRules: [{type: "required", message: "Birthday is required"}]
            },
            {
                dataField: 'friendliness',
                caption: "Friendliness",
                validationRules: [{type: "required", message: "Friendliness is required"}],
                lookup: {
                    dataSource: [
                        {value: "friendly", text: "Friendly"},
                        {value: "not friendly", text: "Not Friendly"}
                    ],
                    valueExpr: "value",
                    displayExpr: "text",
                    allowClearing: true
                },
                visible: true
            },
        ],
        onEditorPreparing: function(e) {
            if (e.parentType === "dataRow" && e.dataField === "DateColumn" && e.rowType === "data") {
                e.editorOptions.onInitialized = function(args) {
                    const currentDate = new Date();
                    const editorInstance = args.component;

                    editorInstance.option("onValueChanged", function(args) {
                        const enteredDate = args.value;

                        if (enteredDate > currentDate) {
                            // Cancel the value change
                            args.event.preventDefault();
                            args.event.stopPropagation();
                        }
                    });
                };
            }
        },
        onRowInserted: function (e) {
            // Get the inserted data from the event arguments
            const insertedData = e.data;

            // Convert the date format for the birthday property
            insertedData.birthday = formatDateToYYYYMMDD(insertedData.birthday);

            // Send an AJAX request to your API endpoint to save the data
            $.ajax({
                url: API_BASE_URL, // Replace with your API endpoint
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(insertedData),
            })
                .done(function (response) {
                    window.location.reload();
                    toastNotification(response.message, response.status);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    // Handle the error
                    toastNotification(`Error saving data:  ${xhr.responseText}`, 'error');
                });
        },
        onRowUpdated: function (e) {
            // Get the updated data from the event arguments
            const updatedData = e.data;

            // Send an AJAX request to your API endpoint to update the data
            $.ajax({
                url: API_BASE_URL + `/${updatedData.id}`, // Replace with your API endpoint
                method: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(updatedData),
                success: function (response) {
                    toastNotification(response.message, response.status);
                },
                error: function (xhr, textStatus, errorThrown) {
                    // Handle the error
                    console.error("Error updating data:", errorThrown);
                    toastNotification("Error updating data: ", "error");
                },
            });
        },
    })
};

const formatDateToYYYYMMDD = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

const toastNotification = (message, type) => {
    let direction = 'up-push';
    let position = 'bottom right';

    DevExpress.ui.notify({
            message: message,
            height: 45,
            width: 'auto',
            minWidth: 200,
            type: type,
            displayTime: 3500,
            animation: {
                show: {
                    type: 'fade', duration: 400, from: 0, to: 1,
                },
                hide: {type: 'fade', duration: 40, to: 0},
            },
        },
        {
            position,
            direction,
        });
}

// Fetch and display kangaroos on page load
await fetchAndDisplayKangaroos();