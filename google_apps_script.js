// This function is required to handle CORS preflight requests from the browser.
function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doPost(e) {
  var response;
  try {
    var action = e.parameter.action;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Orders");
      sheet.appendRow(["OrderID", "TableNumber", "TotalPrice", "Timestamp", "Status", "Items"]);
    }

    if (action === 'complete_order') {
      var orderId = e.parameter.order_id;
      var data = sheet.getDataRange().getValues();
      var responseMessage = { 'success': false, 'message': 'Order not found' };

      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == orderId) {
          sheet.getRange(i + 1, 5).setValue("Completed"); // Column E for Status
          responseMessage = { 'success': true };
          break;
        }
      }
      response = ContentService.createTextOutput(JSON.stringify(responseMessage))
        .setMimeType(ContentService.MimeType.JSON);

    } else { // Default action is to place an order
      var tableNumber = e.parameter.table_number;
      var cart = JSON.parse(e.parameter.cart);
      var totalPrice = 0;
      var items = [];

      for (var i = 0; i < cart.length; i++) {
        totalPrice += cart[i].price * cart[i].quantity;
        items.push(cart[i].name + " x " + cart[i].quantity);
      }

      var timestamp = new Date();
      var orderId = "ORD-" + timestamp.getTime();
      var status = "Pending";

      sheet.appendRow([orderId, tableNumber, totalPrice, timestamp, status, items.join(", ")]);

      response = ContentService.createTextOutput(JSON.stringify({
        'success': true,
        'order_id': orderId
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    response = ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  response.setHeader("Access-Control-Allow-Origin", "*");
  return response;
}

function doGet(e) {
  var response;
  try {
    var action = e.parameter.action;

    if (action === 'get_menu') {
      response = ContentService.createTextOutput(JSON.stringify(getMenu()))
        .setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'get_orders') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
      var orders = [];

      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][4] === 'Pending') {
            var itemsStr = data[i][5] || "";
            var itemsArr = itemsStr.split(', ').map(function(item) {
              var parts = item.split(' x ');
              return { name: parts[0], quantity: parts[1] || 1 };
            });
            orders.push({
              id: data[i][0],
              table_number: data[i][1],
              total_price: data[i][2],
              order_time: data[i][3],
              items: itemsArr
            });
          }
        }
      }
      response = ContentService.createTextOutput(JSON.stringify(orders))
        .setMimeType(ContentService.MimeType.JSON);

    } else {
      response = ContentService.createTextOutput(JSON.stringify({'error': 'Invalid action'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    response = ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  response.setHeader("Access-Control-Allow-Origin", "*");
  return response;
}

function getMenu() {
  // Hardcoded menu data for simplicity.
  return {
    "Tea": [
        { "id": 1, "name": "Lal chai", "price": "10.00" },
        { "id": 2, "name": "Lebu cahi", "price": "10.00" }
    ],
    "Coffee": [
        { "id": 7, "name": "Coffee (Small)", "price": "20.00" }
    ]
  };
}
