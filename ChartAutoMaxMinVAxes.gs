// This function passes a simulated event to the onEdit trigger function,
// which allows testing of trigger using GAS.
// function test_onEdit() {
//     onEdit({
//         user: Session.getActiveUser().getEmail(),
//         source: SpreadsheetApp.getActiveSpreadsheet(),
//         range: SpreadsheetApp.getActiveSpreadsheet().getActiveCell(),
//         value: SpreadsheetApp.getActiveSpreadsheet().getActiveCell().getValue(),
//         authMode: "LIMITED"
//     });
// }

// Trigger function to automatically adjust chart vertical axes for a set of sheets.
function onEdit(e) {
    var sheet = e.source.getActiveSheet();
    var min = null;
    var max = null;
    var buffer = 0.25; // buffer for max/min values

    if (sheet.getName() == "Value By Category" || sheet.getName() == "Value By Item") {
        // max/min are max/min values from columns G and J
        var values = sheet.getRange("G:G").getValues().filter(Number);
        values = values.concat(sheet.getRange("J:J").getValues().filter(Number));
        max = Math.max(...values);
        max += max * buffer;
        min = Math.min(...values);
        min -= min * buffer;
    } else if (sheet.getName() == "Total Value") {
        // max is max value from column B
        var maxValues = sheet.getRange("B:B").getValues().filter(Number);
        max = Math.max(...maxValues);
        max += max * buffer;
        // min is min value from column D
        var minValues = sheet.getRange("D:D").getValues().filter(Number);
        min = Math.min(...minValues);
        min -= min * buffer;
    }

    if (min != null && max != null) {
        var chart = sheet.getCharts()[0];

        chart = chart.modify()
            .setOption('vAxes.0.viewWindow.max', max)
            .setOption('vAxes.0.viewWindow.min', min)
            .build();

        sheet.updateChart(chart);
    }
}
