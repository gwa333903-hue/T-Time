// This function is required to handle CORS preflight requests from the browser.
function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doPost(e) {
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
      var response = ContentService.createTextOutput(JSON.stringify(responseMessage))
        .setMimeType(ContentService.MimeType.JSON);
      response.setHeader("Access-Control-Allow-Origin", "*");
      return response;

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

      var response = ContentService.createTextOutput(JSON.stringify({
        'success': true,
        'order_id': orderId
      })).setMimeType(ContentService.MimeType.JSON);
      response.setHeader("Access-Control-Allow-Origin", "*");
      return response;
    }

  } catch (err) {
    var errorResponse = ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': err.message
    })).setMimeType(ContentService.MimeType.JSON);
    errorResponse.setHeader("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}

function doGet(e) {
  var action = e.parameter.action;
  var response; // Define response variable at the top of the function scope

  try {
    if (action === 'get_menu') {
      response = ContentService.createTextOutput(JSON.stringify(getMenu()))
        .setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'get_orders') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
      var orders = [];

      // If the sheet exists, read data from it. Otherwise, return the empty array.
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        // Start from 1 to skip header row
        for (var i = 1; i < data.length; i++) {
          var status = data[i][4]; // Column E for Status
          if (status === 'Pending') {
              var itemsStr = data[i][5]; // Column F for Items
              var itemsArr = itemsStr.split(', ').map(function(item) {
                  var parts = item.split(' x ');
                  return { name: parts[0], quantity: parts[1] || 1 }; // Default quantity to 1 if missing
              });

              orders.push({
                  id: data[i][0], // OrderID
                  table_number: data[i][1], // TableNumber
                  total_price: data[i][2], // TotalPrice
                  order_time: data[i][3], // Timestamp
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
    
    response.setHeader("Access-Control-Allow-Origin", "*");
    return response;

  } catch (err) {
    var errorResponse = ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': err.message
    })).setMimeType(ContentService.MimeType.JSON);
    errorResponse.setHeader("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}

function getMenu() {
  // In a real application, this data would be fetched from a "Menu" sheet.
  // For simplicity, we are returning the hardcoded menu from the original main.js.
  return {
    "Tea": [
        { "id": 1, "name": "Lal chai", "price": "10.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
        { "id": 2, "name": "Lebu cahi", "price": "10.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
        { "id": 3, "name": "Green tea", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
        { "id": 4, "name": "Milk tea (Small)", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
        { "id": 5, "name": "Milk tea (Large)", "price": "30.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
        { "id": 6, "name": "Special Tea", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" }
    ],
    "Coffee": [
        { "id": 7, "name": "Coffee (Small)", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
        { "id": 8, "name": "Coffee (Large)", "price": "30.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
        { "id": 9, "name": "Special Coffee", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
        { "id": 10, "name": "Black Coffee", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" }
    ],
    "Snacks": [
        { "id": 11, "name": "Chicken Pakora", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 12, "name": "Chicken Lollipop", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 13, "name": "Chicken Cutlet", "price": "35.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 14, "name": "Chicken Sate", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 15, "name": "Panir Tikka", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 16, "name": "Lachha Porota", "price": "15.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
        { "id": 17, "name": "Chicken Fry", "price": "140.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" }
    ],
    "Momo": [
        { "id": 18, "name": "Steam Momo", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
        { "id": 19, "name": "Fry Momo", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
        { "id": 20, "name": "Pan Fry Momo", "price": "90.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
        { "id": 21, "name": "Chili Momo", "price": "110.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
        { "id": 22, "name": "Cheese Momo", "price": "99.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" }
    ],
    "Chowmein": [
        { "id": 23, "name": "Egg Chowmein (Full)", "price": "70.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 24, "name": "Egg Chowmein (Half)", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 25, "name": "Chicken Chowmein (Full)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 26, "name": "Chicken Chowmein (Half)", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 27, "name": "Paneer Chowmein (Full)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 28, "name": "Paneer Chowmein (Half)", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 29, "name": "Veg Chowmein", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
        { "id": 30, "name": "Supie Nuduls", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" }
    ],
    "Rolls": [
        { "id": 31, "name": "Egg Laccha Roll", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" },
        { "id": 32, "name": "Egg Chicken Laccha Roll", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" },
        { "id": 33, "name": "Paneer Laccha Roll", "price": "90.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" }
    ],
    "Pizza": [
        { "id": 34, "name": "Chicken Pizza (Large)", "price": "150.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
        { "id": 35, "name": "Chicken Pizza (Small)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
        { "id": 36, "name": "Paneer Pizza (Large)", "price": "170.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
        { "id": 37, "name": "Paneer Pizza (Small)", "price": "120.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
        { "id": 38, "name": "Veg Pizza (Large)", "price": "120.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
        { "id": 39, "name": "Veg Pizza (Small)", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" }
    ],
    "Burger": [
        { "id": 40, "name": "Chicken Burger", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Burger" }
    ]
  };
}
