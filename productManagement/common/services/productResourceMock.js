(function () {
    "use strict";

    var app = angular
                .module("productResourceMock",
                        ["ngMockE2E"]);

    app.run(function ($httpBackend) {
        var products = [
            {
                "productId": 1,
                "productName": "Laptop",
                "productCode": "LKP-223",
                "releaseDate": "March 10, 2014",
                "description": "14inch Laptop.",
                "cost": 1500.00,
                "price": 2200,
                "category": "computers",
                "tags": ["laptop", "pc"],
                "imageUrl": "https://openclipart.org/image/300px/svg_to_png/243109/1457105843.png"
            },
            {
                "productId": 2,
                "productName": "Desktop",
                "productCode": "LKP-213",
                "releaseDate": "March 10, 2010",
                "description": "Gaming Desktop.",
                "cost": 1000.00,
                "price": 1200,
                "category": "computers",
                "tags": ["desktop", "pc"],
                "imageUrl": "https://openclipart.org/image/300px/svg_to_png/241121/Minimal-Desktop-Computer-With-Optical-Drive-and-Power-Button.png"
            }
        ];

        var productUrl = "/api/products"

        $httpBackend.whenGET(productUrl).respond(products);

        var editingRegex = new RegExp(productUrl + "/[0-9][0-9]*", '');
        $httpBackend.whenGET(editingRegex).respond(function (method, url, data) {
            var product = {"productId": 0};
            var parameters = url.split('/');
            var length = parameters.length;
            var id = parameters[length - 1];

            if (id > 0) {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].productId == id) {
                        product = products[i];
                        break;
                    }
                };
            }
            return [200, product, {}];
        });

        $httpBackend.whenPOST(productUrl).respond(function (method, url, data) {
            var product = angular.fromJson(data);

            if (!product.productId) {
                // new product Id
                product.productId = products[products.length - 1].productId + 1;
                products.push(product);
            }
            else {
                // Updated product
                for (var i = 0; i < products.length; i++) {
                    if (products[i].productId == product.productId) {
                        products[i] = product;
                        break;
                    }
                };
            }
            return [200, product, {}];
        });

        // Pass through any requests for application files
        $httpBackend.whenGET(/app/).passThrough();


    })
}());
