var server = require('http').createServer()
    , url = require('url')
    , WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server })
    , express = require('express')
    , app = express()
    , PORT = process.env.PORT || 4080;

var dblite = require('dblite'),
    db = dblite('/Users/Adnan/Desktop/ims/products.db');

app.use(express.static(__dirname + '/public'));


app.use(function (req, res) {
    res.send({ msg: "hello" });
});

wss.on('connection', function connection(ws) {
    var location = url.parse(ws.upgradeReq.url, true);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var receivedMessage = JSON.parse(message);

        switch (receivedMessage.type){
            case "query":
                dbQuery(receivedMessage.product_name);
                break;

            case "order":
                orderProducts(receivedMessage.product_id,receivedMessage.order_quantity);
                break;

            case "restock":
                restockProducts(receivedMessage.product_id,receivedMessage.restock_quantity);
                break;
        }//end switch case
    });//end onmessage

    //order function
    function orderProducts(productId,orderQuantity) {
        //check if the product is available
        db.query("select product_quantity from products where product_id=?", [productId],
            {
                product_quantity: Number
            },
            function (rows) {
                var result = rows[0];
                var availableQuantity = parseInt(result.product_quantity);
                //check if stock exists
                if (availableQuantity >= parseInt(orderQuantity)) {
                    db.query("update products SET product_quantity= product_quantity - ? where product_id=?", [orderQuantity, productId]);
                    var orderSucess = "Your Order has been processed. thank you";
                    console.log(orderSucess);
                    var successOrderResponse = {
                        response_type: "orderProducts",
                        response_status: orderSucess
                    };
                    ws.send(JSON.stringify(successOrderResponse));
                } else {
                    var outOfStock = "Sorry Order Cannot Be Processed / Out of Stock";
                    console.log(outOfStock);
                    var failedOrderResponse = {
                        response_type: "orderProducts",
                        response_status: outOfStock
                    };
                    ws.send(JSON.stringify(failedOrderResponse));
                }
            });
    }//end order

    ////restock function
    function restockProducts(productId,restockQuantity){
        db.query("update products SET product_quantity = product_quantity + ? where product_id=?",[restockQuantity,productId]);
        var restocked = "Product has been restocked by " + restockQuantity ;
        console.log(restocked);
        var restockResponse = {
            response_type: "restockProducts",
            response_status: restocked
        };
        ws.send(JSON.stringify(restockResponse));
    }//end restock

    //db query
    function dbQuery(query_product){
        db.query("select * from products where product_name=?",[query_product] ,
        {
            product_id: String,
            product_name: String,
            product_location: String,
            product_quantity: Number
        },
        function (rows) {
            var result = rows[0];
            var product_name = result.product_name;
            var product_location = result.product_location;
            var product_quantity = result.product_quantity;

            var queryMessage = {
                response_type: "queryProducts",
                product_name: product_name,
                product_location: product_location,
                product_quantity: product_quantity
            };
            var returnMessage = JSON.stringify(queryMessage);
            ws.send(returnMessage);
        });//end db query
}//end dbQuery function
});//end on connection

server.on('request', app);
server.listen(PORT, function () { console.log('Listening on ' + server.address().port) });