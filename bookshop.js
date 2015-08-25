(function($) {


    $.Shop = function(element)
    {
        this.$element = $(element);
    };
    $.Shop.prototype =
            {
              init: function() {
                    this.cartPrefix = "classic books-"; // Prefix string to be prepended to the cart's name in the session storage
                   
                    this.localstorage = sessionStorage; // shortcut to the sessionStorage object
                   
                    this.requiredFields = {
                        expression: {
                            value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/
                        },
                        str: {
                            value: ""
                        }

                    };

                },
                loadInitData: function(filename) {
                    var promise = $.ajax(filename);
                    //var promise = $.ajax("data.json");

                    promise.then(function(initialJsonData) {

                        var array = initialJsonData;
                        //console.log(array);
                        array.forEach(function(object) {
                            //console.log(" project id "+object.product_id);
                            var divhtml = '<li>';
                            divhtml += '<div class="product-image"><img src="' + object.product_image + '" alt=""  /></div>';
                            divhtml += '<div class="product-description" data-name="' + object.product_name + '">';
                            divhtml += '<h3 class="product-name">' + object.product_name + '</h3>';
                            //divhtml += '<form class="add-to-cart" action="cart.html" method="post">';
                            divhtml += '<div>';
                            //divhtml += '<label for="qty-' + object.product_id + '">Quantity</label>';
                            //divhtml += '<input type="text" name="qty-' + object.product_id + '" id="qty-' + object.product_id + '" class="qty" value="' + object.default_qty + '" />';
                            divhtml += '<input type="hidden" name="product_id" value="' + object.product_id + '">';
                            divhtml += '</div>';
                            //divhtml += '<p><input type="submit" value="Add to cart" class="btn" /></p>';
                            divhtml += '</form>';
                            divhtml += '</div>';
                            divhtml += '</li>';
                            $("#products ul").append(divhtml);

                        });


                    }).done(function() {
                        var shop = new $.Shop("#site");
                        shop.init();
                    });
                },
                // Public methods

                // Creates the cart keys in the session storage

                createCart: function() {
                    if (this.localstorage.getItem(this.cartName) == null) {
                        var cart = {};
                        cart.items = [];

                        this.localstorage.setItem(this.cartName, this._toJSONString(cart));
                        this.localstorage.setItem(this.shippingRates, "0");
                        this.localstorage.setItem(this.total, "0");
                    }
                },
                // Appends the required hidden values to the PayPal's form before submitting

                generatePayPalForm: function() {
                    var self = this;
                    if (self.$paypalForm.length) {
                        var $form = self.$paypalForm;
                        var cart = self._toJSONObject(self.localstorage.getItem(self.cartName));
                        var shipping = self.localstorage.getItem(self.shippingRates);
                        var numShipping = self._convertString(shipping);
                        var cartItems = cart.items;
                        var singShipping = Math.floor(numShipping / cartItems.length);

                        $form.attr("action", self.paypalURL);
                        $form.find("input[name='business']").val(self.paypalBusinessEmail);
                        $form.find("input[name='currency_code']").val(self.paypalCurrency);

                        for (var i = 0; i < cartItems.length; ++i) {
                            var cartItem = cartItems[i];
                            var n = i + 1;
                            var name = cartItem.product;
                            var qty = cartItem.qty;

                            $("<div/>").html("<input type='hidden' name='quantity_" + n + "' value='" + qty + "'/>").
                                    insertBefore("#paypal-btn");
                            $("<div/>").html("<input type='hidden' name='item_name_" + n + "' value='" + name + "'/>").
                                    insertBefore("#paypal-btn");
                            $("<div/>").html("<input type='hidden' name='item_number_" + n + "' value='SKU " + name + "'/>").
                                    insertBefore("#paypal-btn");
                                                                
                            $("<div/>").html("<input type='hidden' name='shipping_" + n + "' value='" + self._formatNumber(singShipping, 2) + "'/>").
                                    insertBefore("#paypal-btn");

                        }



                    }
                },
                // show the user's information

                showUserDetails: function() {
                    if (this.$userDetails.length) {
                        if (this.localstorage.getItem("shipping-name") == null) {
                            var name = this.localstorage.getItem("billing-name");
                            var email = this.localstorage.getItem("billing-email");
                            var city = this.localstorage.getItem("billing-city");
                            var address = this.localstorage.getItem("billing-address");
                            var zip = this.localstorage.getItem("billing-zip");
                            var country = this.localstorage.getItem("billing-country");

                            var html = "<div class='detail'>";
                            html += "<h2>Billing and Shipping</h2>";
                            html += "<ul>";
                            html += "<li>" + name + "</li>";
                            html += "<li>" + email + "</li>";
                            html += "<li>" + city + "</li>";
                            html += "<li>" + address + "</li>";
                            html += "<li>" + zip + "</li>";
                            html += "<li>" + country + "</li>";
                            html += "</ul></div>";

                            this.$userDetails[0].innerHTML = html;
                        } else {
                            var name = this.localstorage.getItem("billing-name");
                            var email = this.localstorage.getItem("billing-email");
                            var city = this.localstorage.getItem("billing-city");
                            var address = this.localstorage.getItem("billing-address");
                            var zip = this.localstorage.getItem("billing-zip");
                            var country = this.localstorage.getItem("billing-country");

                            var sName = this.localstorage.getItem("shipping-name");
                            var sEmail = this.localstorage.getItem("shipping-email");
                            var sCity = this.localstorage.getItem("shipping-city");
                            var sAddress = this.localstorage.getItem("shipping-address");
                            var sZip = this.localstorage.getItem("shipping-zip");
                            var sCountry = this.localstorage.getItem("shipping-country");

                            var html = "<div class='detail'>";
                            html += "<h2>Billing</h2>";
                            html += "<ul>";
                            html += "<li>" + name + "</li>";
                            html += "<li>" + email + "</li>";
                            html += "<li>" + city + "</li>";
                            html += "<li>" + address + "</li>";
                            html += "<li>" + zip + "</li>";
                            html += "<li>" + country + "</li>";
                            html += "</ul></div>";

                            html += "<div class='detail right'>";
                            html += "<h2>Shipping</h2>";
                            html += "<ul>";
                            html += "<li>" + sName + "</li>";
                            html += "<li>" + sEmail + "</li>";
                            html += "<li>" + sCity + "</li>";
                            html += "<li>" + sAddress + "</li>";
                            html += "<li>" + sZip + "</li>";
                            html += "<li>" + sCountry + "</li>";
                            html += "</ul></div>";

                            this.$userDetails[0].innerHTML = html;

                        }
                    }
                },
                // Displays the items

                displayCartdata: function() {
                    if (this.$formCart.length) {
                        var cart = this._toJSONObject(this.localstorage.getItem(this.cartName));
                        var items = cart.items;
                        var $tableCart = this.$formCart.find(".shopping-cart");
                        var $tableCartBody = $tableCart.find("tbody");


                        for (var i = 0; i < items.length; ++i) {
                            var item = items[i];
                            var product = item.product;
                            var qty = item.qty;
                            

                            $tableCartBody.html($tableCartBody.html() + html);
                        }

                        var total = this.localstorage.getItem(this.total);
                        this.$subTotal[0].innerHTML = this.currency + " " + total;
                    } else if (this.$checkoutCart.length) {
                        var checkoutCart = this._toJSONObject(this.localstorage.getItem(this.cartName));
                        var cartItems = checkoutCart.items;
                        var $cartBody = this.$checkoutCart.find("tbody");

                        for (var j = 0; j < cartItems.length; ++j) {
                            var cartItem = cartItems[j];
                            var cartProduct = cartItem.product;
                            //var cartPrice = this.currency + " " + cartItem.price;
                            var cartQty = cartItem.qty;
                            //var cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";

                            $cartBody.html($cartBody.html() + cartHTML);
                        }

                        var cartTotal = this.localstorage.getItem(this.total);
                        var cartShipping = this.localstorage.getItem(this.shippingRates);
                        var subTot = this._convertString(cartTotal) + this._convertString(cartShipping);

                        this.$subTotal[0].innerHTML = this.currency + " " + this._convertNumber(subTot);
                        this.$shipping[0].innerHTML = this.currency + " " + cartShipping;

                    }
                },
                // Empties the cart by calling the _emptyCart() method
                // @see $.Shop._emptyCart()

                emptyCartdata: function() {
                    var self = this;
                    if (self.$emptyCartBtn.length) {
                        self.$emptyCartBtn.on("click", function() {
                            self._emptyCart();
                        });
                    }
                },
                // Updates the cart

                updateCartdata: function() {
                    var self = this;
                    if (self.$updateCartBtn.length) {
                        self.$updateCartBtn.on("click", function() {
                            var $rows = self.$formCart.find("tbody tr");
                            var cart = self.localstorage.getItem(self.cartName);
                            var shippingRates = self.localstorage.getItem(self.shippingRates);
                            var total = self.localstorage.getItem(self.total);

                            var updatedTotal = 0;
                            var totalQty = 0;
                            var updatedCart = {};
                            updatedCart.items = [];

                            $rows.each(function() {
                                var $row = $(this);
                                var pname = $.trim($row.find(".pname").text());
                                var pqty = self._convertString($row.find(".pqty > .qty").val());
                               // var pprice = self._convertString(self._extractPrice($row.find(".pprice")));

                                var cartObj = {
                                    product: pname,
                                    //price: pprice,
                                    qty: pqty
                                };

                                updatedCart.items.push(cartObj);

                                //var subTotal = pqty * pprice;
                                updatedTotal += subTotal;
                                totalQty += pqty;
                            });

                            self.localstorage.setItem(self.total, self._convertNumber(updatedTotal));
                            self.localstorage.setItem(self.shippingRates, self._convertNumber(self._calculateShipping(totalQty)));
                            self.localstorage.setItem(self.cartName, self._toJSONString(updatedCart));

                        });
                    }
                },
                // Adds items to the shopping cart

                manageAddToCartForm: function() {

//			debugger;
                    var self = this;
                    self.$formAddToCart.each(function() {
                        var $form = $(this);
                        var $product = $form.parent();
                        //var price = self._convertString($product.data("price"));
                        var name = $product.data("name");

                        $form.on("submit", function() {
                            var qty = self._convertString($form.find(".qty").val());
                            //var subTotal = qty * price;
                            var total = self._convertString(self.localstorage.getItem(self.total));
                            //var sTotal = total + subTotal;
                            self.localstorage.setItem(self.total, sTotal);
                            self._addToCart({
                                product: name,
                                price: price,
                                qty: qty
                            });
                            var shipping = self._convertString(self.localstorage.getItem(self.shippingRates));
                            var shippingRates = self._calculateShipping(qty);
                            var totalShipping = shipping + shippingRates;

                            self.localstorage.setItem(self.shippingRates, totalShipping);
                        });
                    });
                },
                // Handles the checkout form by adding a validation routine and saving user's info into the session storage

                handleCheckoutOrderForm: function() {
                    var self = this;
                    if (self.$checkoutOrderForm.length) {
                        var $sameAsBilling = $("#same-as-billing");
                        $sameAsBilling.on("change", function() {
                            var $check = $(this);
                            if ($check.prop("checked")) {
                                $("#fieldset-shipping").slideUp("normal");
                            } else {
                                $("#fieldset-shipping").slideDown("normal");
                            }
                        });

                        self.$checkoutOrderForm.on("submit", function() {
                            var $form = $(this);
                            var valid = self._validateForm($form);

                            if (!valid) {
                                return valid;
                            } else {
                                self._saveFormData($form);
                            }
                        });
                    }
                },
                // Private methods


                // Empties the session storage

                _emptyCart: function() {
                    this.localstorage.clear();
                },
                /* Format a number by decimal places
                 * @param num Number the number to be formatted
                 * @param places Number the decimal places
                 * @returns n Number the formatted number
                 */



                _formatNumber: function(num, places) {
                    var n = num.toFixed(places);
                    return n;
                },
                /* Extract the numeric portion from a string
                 * @param element Object the jQuery element that contains the relevant string
                 * @returns price String the numeric string
                 */


                _extractPrice: function(element) {
                    var self = this;
                    var text = element.text();
                    
                },
                /* Converts a numeric string into a number
                 * @param numStr String the numeric string to be converted
                 * @returns num Number the number
                 */

                _convertString: function(numStr) {
                    var num;
                    if (/^[-+]?[0-9]+\.[0-9]+$/.test(numStr)) {
                        num = parseFloat(numStr);
                    } else if (/^\d+$/.test(numStr)) {
                        num = parseInt(numStr, 10);
                    } else {
                        num = Number(numStr);
                    }

                    if (!isNaN(num)) {
                        return num;
                    } else {
                        console.warn(numStr + " cannot be converted into a number");
                        return false;
                    }
                },
                /* Converts a number to a string
                 * @param n Number the number to be converted
                 * @returns str String the string returned
                 */

                _convertNumber: function(n) {
                    var str = n.toString();
                    return str;
                },
                /* Converts a JSON string to a JavaScript object
                 * @param str String the JSON string
                 * @returns obj Object the JavaScript object
                 */

                _toJSONObject: function(str) {
                    var obj = JSON.parse(str);
                    return obj;
                },
                /* Converts a JavaScript object to a JSON string
                 * @param obj Object the JavaScript object
                 * @returns str String the JSON string
                 */


                _toJSONString: function(obj) {
                    var str = JSON.stringify(obj);
                    return str;
              },
                /* Add an object to the cart as a JSON string
                 * @param values Object the object to be added to the cart
                 * @returns void
                 */


                _addToCart: function(values) {
                    var cart = this.localstorage.getItem(this.cartName);

                    var cartObject = this._toJSONObject(cart);
                    var cartCopy = cartObject;
                    var items = cartCopy.items;
                    items.push(values);

                    this.localstorage.setItem(this.cartName, this._toJSONString(cartCopy));
                },
                /* Custom shipping rates calculation based on the total quantity of items in the cart
                 * @param qty Number the total quantity of items
                 * @returns shipping Number the shipping rates
                 */

                _calculateShipping: function(qty) {
                    var shipping = 0;
                    if (qty >= 6) {
                        shipping = 10;
                    }
                    if (qty >= 12 && qty <= 30) {
                        shipping = 20;
                    }

                    if (qty >= 30 && qty <= 60) {
                        shipping = 30;
                    }

                    if (qty > 60) {
                        shipping = 0;
                    }

                    return shipping;

                },
                /* Validates the checkout form
                 * @param form Object the jQuery element of the checkout form
                 * @returns valid Boolean true for success, false for failure
                 */



                _validateForm: function(form) {
                    var self = this;
                    var fields = self.requiredFields;
                    var $visibleSet = form.find("fieldset:visible");
                    var valid = true;

                    form.find(".message").remove();

                    $visibleSet.each(function() {

                        $(this).find(":input").each(function() {
                            var $input = $(this);
                            var type = $input.data("type");
                            var msg = $input.data("message");

                            if (type == "string") {
                                if ($input.val() == fields.str.value) {
                                    $("<span class='message'/>").text(msg).
                                            insertBefore($input);

                                    valid = false;
                                }
                            } else {
                                if (!fields.expression.value.test($input.val())) {
                                    $("<span class='message'/>").text(msg).
                                            insertBefore($input);

                                    valid = false;
                                }
                            }

                        });
                    });

                    return valid;

                },
                /* 
                 * This load data from json string which can be loaded from file or api
                 * 
                 */

                /* Save the data entered by the user in the ckeckout form
                 * @param form Object the jQuery element of the checkout form
                 * @returns void
                 */


                _saveFormData: function(form) {
                    var self = this;
                    var $visibleSet = form.find("fieldset:visible");

                    $visibleSet.each(function() {
                        var $set = $(this);
                        if ($set.is("#fieldset-billing")) {
                            var name = $("#name", $set).val();
                            var email = $("#email", $set).val();
                            var city = $("#city", $set).val();
                            var address = $("#address", $set).val();
                            var zip = $("#zip", $set).val();
                            var country = $("#country", $set).val();

                            self.localstorage.setItem("billing-name", name);
                            self.localstorage.setItem("billing-email", email);
                            self.localstorage.setItem("billing-city", city);
                            self.localstorage.setItem("billing-address", address);
                            self.localstorage.setItem("billing-zip", zip);
                            self.localstorage.setItem("billing-country", country);
                        } else {
                            var sName = $("#sname", $set).val();
                            var sEmail = $("#semail", $set).val();
                            var sCity = $("#scity", $set).val();
                            var sAddress = $("#saddress", $set).val();
                            var sZip = $("#szip", $set).val();
                            var sCountry = $("#scountry", $set).val();

                            self.localstorage.setItem("shipping-name", sName);
                            self.localstorage.setItem("shipping-email", sEmail);
                            self.localstorage.setItem("shipping-city", sCity);
                            self.localstorage.setItem("shipping-address", sAddress);
                            self.localstorage.setItem("shipping-zip", sZip);
                            self.localstorage.setItem("shipping-country", sCountry);

                        }
                    });
                }
            };

    $(function() {
        var url = window.location.href.slice(window.location.href.indexOf('#') + 1);
        //var base2url = window.location.href.split('#')[1]
        loadPageContent(url);

        var base1url = window.location.href.split('#')[0];
        var filename = base1url.substring(url.lastIndexOf('/')+1);
        
        $('a[href="#home"]').click(function(){
            url="home";            
            window.location.href=filename+"#"+url;
            location.reload(); 
        });
        $('a[href="#William_Shakespare"]').click(function(){
            url="William_Shakespare";
            window.location.href=filename+"#"+url;
            location.reload(); 
			
			
			
			var ViewModel = function() {
    var self = this;
    self.clickMe = function(data,event) {
      url;
        
      if (event.url) url = event.url;
      else if (event.srcElement) url = event.srcElement;
        
      if (url.nodeType == 3) // defeat Safari bug
        url = url.parentNode;
        
      url.parentNode.innerHTML = "something";
    }
}
					
        });
        $('a[href="#Ernest_Hemingway"]').click(function(){
            url="Ernest_Hemingway";
            window.location.href=filename+"#"+url;
            location.reload(); 
        });
		$('a[href="#Charles_Dickens"]').click(function(){
            url="Charles_Dickens";
            window.location.href=filename+"#"+url;
            location.reload(); 
        });
		$('a[href="#menprfume"]').click(function(){
            url="menprfume";
            window.location.href=filename+"#"+url;
            location.reload(); 
        });
    });

})(jQuery);

//------------json

//setting default page template
$(document).ready(function() {
    //loadData();
    $("#masthead").html("<h1>The famous books collection <span class='tagline'></span></h1>");
	
    $(".tagline").html("search ");
    var currentYear = (new Date).getFullYear();
    $("#site-info").html("Copyright &copy; " + currentYear + " Conroy White ");

});


function loadPageContent(url) {
    var shop = new $.Shop("#site");
    switch (url) {
        case 'home':
            shop.loadInitData("data.json");
            break;
        case 'William_Shakespare':
           var parameters=shop.loadInitData("json/shakespear.json");
			parameters = {top: "-100"}; // <--- actual object ?
			$("#test-element").animate(parameters,1000);
			
            break;
			
        case 'Charles_Dickens':
            shop.loadInitData("./json/dickens.json");
            break;
		case 'Ernest_Hemingway':
            shop.loadInitData("./json/Ernest_Hemingway.json");
            break;				
        default:
            shop.loadInitData("./json/data.json");
            break;
			
			
    }
}



