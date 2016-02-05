window.onload = function () {

    var queryForm = document.getElementById('queryProducts');
    var orderForm = document.getElementById('orderProducts');
    var restockForm = document.getElementById('restockProducts');
    var ws = new WebSocket('ws://localhost:4080');

    ws.onopen = function () {
        console.log("connected to server");

    ws.onmessage = function (msg) {
        var serverResponse = JSON.parse(msg.data);
        console.log(serverResponse);
        var ul ="";
        var divid;

    };//end on message

        //update window function
        function updateWindow(id,ul){
            document.getElementById(id).innerHTML = ul;
        }

    };//end on open

    queryForm.onsubmit = function (e) {
        e.preventDefault();
        var queryProduct = document.getElementById('pquery');
        var queryProductName = queryProduct.value;
        console.log("Querying for " + queryProductName);
        var product_name = {
            type: "query",
            product_name: queryProductName
        };
        var query_product = JSON.stringify(product_name);
        ws.send(query_product);
    };

    orderForm.onsubmit = function (e) {
        e.preventDefault();
        var orderProductName = document.getElementById('pOName').value;
        var orderProductQuantity = document.getElementById('pquantity').value;
        var product_id;
        if (orderProductName === "iphone"){
            product_id = "prod1"
        }else if (orderProductName === "MacBook"){
            product_id = "prod2"
        }else{
            console.log("Please enter either iphone OR MacBook");
        }
        console.log("Order For " + orderProductName);

        var orderDetails ={
            type: "order",
            product_id: product_id,
            order_quantity: orderProductQuantity
        };
        var order = JSON.stringify(orderDetails);
        ws.send(order);
    };

    restockForm.onsubmit = function (e) {
        e.preventDefault();

        var restockProductName = document.getElementById('pRName').value;
        var restockProductQuantity = document.getElementById('prestock').value;
        var restockProductId;
        if (restockProductName === "iphone"){
            restockProductId = "prod1"
        }else if (restockProductName === "MacBook"){
            restockProductId = "prod2"
        }else{
            console.log("Please enter either iphone OR MacBook");
        }
        console.log("Restocking For " + restockProductName);

        var restockDetails ={
            type:"restock",
            product_id: restockProductId,
            restock_quantity: restockProductQuantity
        };
        var restock = JSON.stringify(restockDetails);
        ws.send(restock);
    };

    ws.onclose = function () {
        console.log('disconnected');
    };
};//end window.onload

