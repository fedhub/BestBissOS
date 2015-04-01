//var base_url = 'best-biss.azurewebsites.net';
var base_url = 'localhost:3001';

var socket = io.connect('http://'+base_url,{
    'reconnect': true,
    'reconnection delay': 2000,
    'max reconnection attempts': 10
});

$(document).ready(function(){

    socket.emit('communicate');

    get_logo();

    $('li').click(function(){

        $('.skin section').css('background-color', '#FFA500');
        $('#' + this.id + '-skin').css('background-color', 'green');

        if(this.id == 'menu'){
            get_the_menu();
        }

        if(this.id == 'cart'){
            render_cart();
        }

    });


    var counter = 1;
    $('.hamburger').click(function(e) {
        e.preventDefault();
        var $body = $('.body');
        var $mobile_menu_container = $('.mobile-menu-container');
        var $hamburger = $('.hamburger');
        var transitionEnd = 'transitionend webkitTransitionEnd otransitionend MSTransitionEnd';

        if(counter % 2 == 1) {
            if($hamburger.hasClass('rotate-left'))
                $hamburger.removeClass('rotate-left');
            $hamburger.toggleClass('rotate-right');
            counter = 0;
        }
        else {
            if(counter % 2 == 0) {
                if($hamburger.hasClass('rotate-right'))
                    $hamburger.removeClass('rotate-right');
                $hamburger.toggleClass('rotate-left');
                counter = 1;
            }
        }

        $mobile_menu_container.toggleClass('right');

        $hamburger.on(transitionEnd, function() {
            $hamburger.off(transitionEnd);
        });

        $mobile_menu_container.on(transitionEnd, function(){
            $body.removeClass('right');
            $mobile_menu_container.off(transitionEnd);
        });

    });

});

function get_logo(){

    $('.logo').css({
        'background': 'url("http://'+base_url+'/images/mobile_logo.png") no-repeat',
        'background-size': 'contain',
        'background-position': 'center center'
    });

}

function get_the_menu(){

    var url = 'http://'+base_url+'/get-menu-data';

    $.ajax({

        type: 'POST',
        url: url

    }).done(function(res){
        render_the_menu(res);
    });

}


function render_the_menu(res){

    var menu_container = $('<section>', {class: 'menu-container'});

    for(var i = 0 in res) {
        var food_category_container = $('<section>', {class: 'food-category-container'}).click(res[i], event_handler);
        var category_name = $('<p>', {text: res[i].name});
        food_category_container.append(category_name);
        menu_container.append(food_category_container);

    }

    function event_handler(e){
        get_menu_items(e.data.id);
    }

    $('.main').html(menu_container);

}

function get_menu_items(category_id){

    var url = 'http://'+base_url+'/get-food-items-data&id='+category_id;

    $.ajax({

        type: 'POST',
        url: url

    }).done(function(res){
        render_menu_items(res);
    });

}

function render_menu_items(food_items_list){

    var menu_items_container = $('<section>',{class: 'menu-items-container'});

    for(var i = 0 in food_items_list) {

        //console.log(food_items_list[i].details.name + ' ' + food_items_list[i].addition_types.length);

        var hr = $('<div>', {class: 'hr'});
        var food_item = $('<section>', {class: 'menu-items-container food-item'}).click(food_items_list[i], render_item_additions);
        var image = $('<section>', {class: 'menu-items-container image'});
        var information = $('<section>', {class: 'menu-items-container information'});
        var title = $('<section>', {class: 'menu-items-container title'});
        var title_p = $('<p>', {text: food_items_list[i].details.name});
        var description = $('<section>', {class: 'menu-items-container description'});
        var description_p = $('<p>', {text: food_items_list[i].details.description});
        var price = $('<section>', {class: 'menu-items-container price'});
        var price_p = $('<p>', {text: food_items_list[i].details.price+' ₪'});

        title.append(title_p);
        description.append(description_p);
        price.append(price_p);
        information.append(title);
        information.append(description);
        food_item.append(image);
        food_item.append(information);
        food_item.append(price);
        menu_items_container.append(food_item);
        menu_items_container.append(hr);
    }

    $('.main').empty();
    $('.main').append(menu_items_container);

}

function render_item_additions(e){

    var food_item = e.data;
    var counter = 0;
    var menu_additions_container = $('<section>', {class: 'menu-additions-container'});

    for(var i = 0 in food_item.addition_types){

        counter++;
        var set_container = $('<section>', {class: 'set-container'})
        var set_title = $('<section>', {class: 'set-title'});
        //var selection_type = get_selection_type(food_item.addition_types[i].details.id);
        var set_title_p = $('<p>', {text: food_item.addition_types[i].details.name});
        var items_container = $('<section>', {class: 'items-container'});
        set_title.append(set_title_p);

        for(var j = 0 in food_item.addition_types[i].items){

            var addition_item = $('<section>', {class: 'addition-item', id: food_item.details.id+i+j})
                .click({
                    additions_type_index: i,
                    addition_item_index: j,
                    food_item: food_item
                }, event_handler);


            var item_header = $('<section>', {class: 'item-header'});
            var item_image = $('<section>', {class: 'item-image'});
            var information = $('<section>', {class: 'item-header information'});
            var title = $('<section>', {class: 'item-header title'});
            var description = $('<section>', {class: 'item-header description'});
            var price = $('<section>', {class: 'item-header price'});
            var title_p = $('<p>', {text: food_item.addition_types[i].items[j].details.name});
            var price_p = $('<p>', {text: food_item.addition_types[i].items[j].details.price+' ₪'});
            var description_p = $('<p>', {text: food_item.addition_types[i].items[j].details.description});

            title.append(title_p);
            description.append(description_p);
            price.append(price_p);
            information.append(title);
            information.append(description);
            item_header.append(information);
            item_header.append(price);
            addition_item.append(item_header);
            addition_item.append(item_image);
            items_container.append(addition_item);

        }

        set_container.append(set_title);
        set_container.append(items_container);
        menu_additions_container.append(set_container);

    }

    // because new Array(..) is ambigues
    var arr = [];
    for(var i = 0; i < counter; i++){
        arr[i] = [];
    }

    function event_handler(e) {

        var i = e.data.additions_type_index;
        var j = e.data.addition_item_index;
        var selection_type = food_item.addition_types[i].details.selection_type;
        var selections_amount = food_item.addition_types[i].details.selections_amount;
        var uncheck = false;

        if (selection_type == 'required_exact') {

            if (arr[i].length == 1) {
                arr[i] = [];
                $('.set-container:eq(' + i + ') .item-header').css('background-color', '#FFF');
            }
            if (arr[i].length == 0) {
                arr[i].push(j);
                $(this).find('.item-header').css('background-color', '#97A778');
            }

        }

        if (selection_type == 'required_min' || (selection_type == 'optional_max' && arr[i].length <= selections_amount)) {

            var k = 0;
            if (arr[i].length > 0) {
                for (k = 0; k < arr[i].length; k++) {
                    if (arr[i][k] == j) {
                        arr[i].splice(k, 1);
                        uncheck = true;
                        break;
                    }
                }
            }
            if (uncheck)
                $(this).find('.item-header').css('background-color', '#FFF');
            else {
                if (!(selection_type == 'optional_max' && arr[i].length == selections_amount)) {
                    arr[i].push(j);
                    $(this).find('.item-header').css('background-color', '#97A778');
                }
                else
                    alert('באפשרותך לבחור עד ' + selections_amount + ' פריטים מ- ' + food_item.addition_types[i].details.name);
            }

        }

    }

    var approve_button = $('<section>', {class: 'approve-button', id: 'approve-meal'})
        .click({
            arr: arr,
            food_item: food_item
        }, approve_meal);

    var approve_button_p = $('<p>', {text: 'המשך >>'});
    approve_button.append(approve_button_p);
    menu_additions_container.append(approve_button);
    $('.main').empty();
    $('.main').append(menu_additions_container);


}

function approve_meal(e){

    var arr = e.data.arr;
    var food_item = e.data.food_item;
    var msg = '';
    var err = false;

    for(var i = 0; i < food_item.addition_types.length; i++){
        var selection_type = food_item.addition_types[i].details.selection_type;
        var selections_amount = food_item.addition_types[i].details.selections_amount;
        if(selection_type == 'required_min' && arr[i].length < selections_amount){
            msg += '\n';
            msg += 'עליך לבחור בדיוק ';
            msg += selections_amount;
            msg += ' פריטים מ- ';
            msg += food_item.addition_types[i].details.name;
            msg += ' על מנת להמשיך';
            err = true;
        }
        if(selection_type == 'required_exact' && arr[i].length < selections_amount){
            msg += '\n';
            msg += 'עליך לבחור לפחות ';
            msg += selections_amount;
            msg += ' פריטים מ- ';
            msg += food_item.addition_types[i].details.name;
            msg += ' על מנת להמשיך';
            err = true;
        }
    }
    if(err)
        alert(msg);
    else {
        if(!private_customer_logged && !business_customer_logged)
            login_lightbox(food_item, arr);
        else
            cart(food_item, arr);
    }

}

// GLOBALS

var order_type = '';
var due_time = '';
var payment_method = '';
var private_customer_logged = false;
var business_customer_logged = false;
var customer_details = {};

var my_cart = {
    cart_items: [],
    total_price: 0
};

function foodItem(food_item, addition_types, food_item_price){
    this.item = food_item;
    this.addition_types = addition_types;
    this.food_item_price = food_item_price;
}

function additionsType(additions_type, addition_items){
    this.type = additions_type;
    this.items = addition_items;
}

function cart(food_item, arr){

    var cart_addition_items = [];
    var cart_addition_types = [];
    var item_price = 0;

    item_price += food_item.details.price;
    my_cart.total_price += food_item.details.price;

    for(var i = 0; i < arr.length; i++){

        for(var j = 0; j < arr[i].length; j++){
            cart_addition_items.push(food_item.addition_types[i].items[arr[i][j]].details);
            item_price += food_item.addition_types[i].items[arr[i][j]].details.price;
            my_cart.total_price += food_item.addition_types[i].items[arr[i][j]].details.price;
        }

        var additions_type = new additionsType(food_item.addition_types[i].details, cart_addition_items);
        cart_addition_items = [];
        if(arr[i].length > 0)
            cart_addition_types.push(additions_type);

    }

    var cart_item = new foodItem(food_item.details, cart_addition_types, item_price);
    my_cart.cart_items.push(cart_item);
    render_cart();

}

function render_cart(){

    var cart_container = $('<section>', {class: 'cart-container'});

    // for each item in cart
    for(var i = 0; i < my_cart.cart_items.length; i++){

        var cart_item = $('<section>', {class: 'cart-item'});
        var delete_item = $('<section>', {class: 'delete-item', id: i+'-cart', text: '✖'});
        var item_title = $('<section>', {class: 'cart-item item-title'});
        var item_title_p = $('<p>', {text: my_cart.cart_items[i].item.name+' - '+my_cart.cart_items[i].item.price+' ₪'});

        item_title.append(delete_item);
        item_title.append(item_title_p);
        cart_item.append(item_title);

        // for each item in addition types
        for(var j = 0; j < my_cart.cart_items[i].addition_types.length; j++){

            var additions_type_container = $('<section>', {class: 'cart-item additions-type-container'});
            var additions_type_title = $('<section>', {class: 'cart-item additions-type-title'});
            var additions_type_title_p = $('<p>', {text: my_cart.cart_items[i].addition_types[j].type.name});

            additions_type_title.append(additions_type_title_p);
            additions_type_container.append(additions_type_title);

            // for each item in addition items
            for(var k = 0; k < my_cart.cart_items[i].addition_types[j].items.length; k++){

                var addition_item = $('<section>', {class: 'cart-item addition-item'});
                var addition_item_p = $('<p>', {text: my_cart.cart_items[i].addition_types[j].items[k].name+' - '+my_cart.cart_items[i].addition_types[j].items[k].price+' ₪'});

                addition_item.append(addition_item_p);
                additions_type_container.append(addition_item);

            }

            cart_item.append(additions_type_container);

        }

        cart_container.append(cart_item);
    }

    $('.main').empty();
    $('.skin section').css('background-color', '#FFA500');
    $('#cart-skin').css('background-color', 'green');
    $('.main').append(cart_container);

    var cart_options = $('<section>', {class: 'cart-options'});
    var cart_approve = $('<section>', {class: 'cart-approve'});
    var approve_button = $('<section>', {class: 'approve-button', id: 'approve-cart'}).click(function(){make_the_order()});
    var approve_button_p = $('<p>', {text: 'המשך >>'});
    var footer = $('<section>', {class: 'cart-footer'});
    var total_price = $('<p>', {class: 'total-price', text: my_cart.total_price+' ₪'});
    var order_type_option = $('<section>', {class: 'cart-option', id: 'order-type'}).click(function(){lightbox(this.id)});
    var due_time_option = $('<section>', {class: 'cart-option', id: 'due-time'}).click(function(){lightbox(this.id)});


    $('.delete-item').click(function(){
        var index = this.id[0];
        my_cart.total_price -= my_cart.cart_items[index].food_item_price;
        my_cart.cart_items.splice(index,1);
        render_cart();
    });

    order_type_option.append($('<p>', {text: 'סוג הזמנה'}));
    due_time_option.append($('<p>', {text: 'שעת הזמנה'}));
    cart_options.append(order_type_option);
    cart_options.append(due_time_option);
    if(private_customer_logged){
        var payment_method_option = $('<section>', {class: 'cart-option', id: 'payment-method'}).click(function(){lightbox(this.id)});
        payment_method_option.append($('<p>', {text: 'אמצעי תשלום'}));
        cart_options.append(payment_method_option);
    }
    if(business_customer_logged){
        var budget_option = $('<section>', {class: 'cart-option', id: 'budget'}).click(function(){business_budget_lightbox()});
        budget_option.append($('<p>', {text: 'בדיקת יתרה'}));
        cart_options.append(budget_option);
    }
    cart_options.append(total_price);
    approve_button.append(approve_button_p);
    cart_approve.append(approve_button);

    footer.append(cart_options);
    footer.append(cart_approve);
    $('.main').append(footer);

}

function lightbox(id){

    if(id == 'order-type')
        order_type_lightbox();
    if(id == 'due-time')
        due_time_lightbox();
    if(id == 'payment-method')
        payment_method_lightbox();

}

function business_budget_lightbox(){

    var $lightbox = $('#lightbox');
    var $lightbox_content = $('.lightbox-content');

    $lightbox_content.empty();

    var budget_box = $('<section>', {class: 'budget-option-box'});
    var msg = 'שלום ';
    msg += customer_details.first_name + ' ' + customer_details.last_name + ',\n';
    msg += 'יתרתך בחשבון נכון לעכשיו ולפני ביצוע ההזמנה הנוכחית היא: ';
    msg += customer_details.budget+' ₪';

    //var budget_box_p = $('<p>', {text: msg});

    $('.lightbox-title p').text('בדיקת יתרה עבור לקוח עסקי');

    //budget_box.append(budget_box_p);
    budget_box.append(msg);
    $lightbox_content.append(budget_box);
    $lightbox_content.append($('<section>', {class: 'approve-button', id: 'approve-budget'}).append($('<p>',{text: 'המשך >>'})).click(function(){$lightbox.fadeOut()}));

    $lightbox.fadeIn();

}

function order_type_lightbox(){

    var $lightbox = $('#lightbox');
    var $lightbox_content = $('.lightbox-content');

    $lightbox_content.empty();

    var delivery = $('<section>', {class: 'order-type-box', id: 'delivery'}).append($('<p>', {text: 'משלוח'}))
        .click(function(){

            set_order_type(this.id);
            $lightbox.fadeOut(function(){
                delivery_details();
            });

        });


    var take_away = $('<section>', {class: 'order-type-box', id: 'take-away'}).append($('<p>', {text: 'T.A.'})).click(function(){set_order_type(this.id);});
    var sit = $('<section>', {class: 'order-type-box', id: 'sit'}).append($('<p>', {text: 'ישיבה במקום'})).click(function(){set_order_type(this.id);});

    $('.lightbox-title p').text('בחר סוג הזמנה');

    $lightbox_content.append(delivery);
    $lightbox_content.append(take_away);
    $lightbox_content.append(sit);

    $lightbox.fadeIn();
}

function delivery_details(){

    var $lightbox = $('<section>', {class: 'lightbox-delivery-details'});
    $lightbox.empty();
    var lightbox_content = $('<section>', {class: 'delivery-box'});

    var street = customer_details.street.replace(/"/g, '&quot;');

    var html = '<form class="delivery-form">'+
                    '<p>שם פרטי:</p>'+
                    '<input type="text" id="first-name" value="'+customer_details.first_name+'">'+
                    '<p>שם משפחה:</p>'+
                    '<input type="text" id="last-name" value="'+customer_details.last_name+'">'+
                    '<p>מספר טלפון:</p>'+
                    '<input type="text" id="phone-number" value="'+customer_details.phone_number+'">'+
                    '<p>רחוב:</p>'+
                    '<input type="text" id="street" value="'+street+'">'+
                    '<p>מספר בית:</p>'+
                    '<input type="text" id="house-number" value="'+customer_details.house_number+'">'+
                    '<p>קומה:</p>'+
                    '<input type="text" id="floor" value="'+customer_details.floor+'">'+
                    '<p>כניסה:</p>'+
                    '<input type="text" id="enter" value="'+customer_details.enter+'">'+
                    '<p>הערות:</p>'+
                    '<textarea id="comments">'+customer_details.comments+'</textarea>'+
                '</form>';

    lightbox_content.html(html);

    lightbox_content.append($('<section>', {class: 'approve-button', id: 'approve-delivery-details'}).append($('<p>',{text: 'אישור'}))
        .click(function(){
            var msg = delivery_input_checks();
            if(msg.length != 0)
                alert(msg);
            else
                $lightbox.fadeOut();
        }));

    $lightbox.append(lightbox_content);
    $('body').append($lightbox);
    $lightbox.fadeIn();

}

function delivery_input_checks(){

    var msg = '';
    if($('#first-name').val().length == 0)
        msg += 'הזן שם פרטי\n';
    if($('#last-name').val().length == 0)
        msg += 'הזן שם משפחה\n';
    if($('#phone-number').val().length == 0)
        msg += 'הזן מספר טלפון\n';
    if($('#street').val().length == 0)
        msg += 'הזן שם הרחוב\n';
    if($('#house-number').val().length == 0)
        msg += 'הזן מספר בית\n';
    if($('#floor').val().length == 0)
        msg += 'הזן קומה';

    return msg;

}

function due_time_lightbox(){

    var $lightbox = $('#lightbox');
    var $lightbox_content = $('.lightbox-content');

    $lightbox_content.empty();

    var due_time_box = $('<section>', {class: 'due-time-box'}).append($('<input>'));

    $('.lightbox-title p').text('בחר שעת הזמנה');

    $lightbox_content.append(due_time_box);
    $lightbox_content.append($('<section>', {class: 'approve-button', id: 'approve-due-time'}).append($('<p>',{text: 'המשך >>'})).click(function(){set_due_time()}));

    $lightbox.fadeIn();
}

function payment_method_lightbox(){

    var $lightbox = $('#lightbox');
    var $lightbox_content = $('.lightbox-content');

    $lightbox_content.empty();

    var cash = $('<section>', {class: 'payment-method-box', id: 'cash'}).append($('<p>', {text: 'מזומן'})).click(function(){set_payment_method(this.id);});
    var credit = $('<section>', {class: 'payment-method-box', id: 'credit'}).append($('<p>', {text: 'כרטיס אשראי'})).click(function(){set_payment_method(this.id);});

    $('.lightbox-title p').text('בחר סוג הזמנה');

    $lightbox_content.append(cash);
    $lightbox_content.append(credit);

    $lightbox.fadeIn();

}

function login_lightbox(food_item, arr){

    var $lightbox = $('#lightbox');
    var $lightbox_content = $('.lightbox-content');

    $lightbox_content.empty();

    $('.lightbox-title p').text('התחברות');

    var login_container = $('<section>', {class: 'login-container'});
    var customer_type_label = $('<p>', {text: 'בחר סוג לקוח:'});

    var private_type_option = $('<section>', {class: 'customer-type-option', id: 'private-customer'});
    var business_type_option = $('<section>', {class: 'customer-type-option', id: 'business-customer'});

    private_type_option.append($('<p>', {text: 'לקוח פרטי'}));
    business_type_option.append($('<p>', {text: 'לקוח עסקי'}));

    login_container.append(customer_type_label).append($('<br>')).append(private_type_option).append(business_type_option).append($('<div>', {class: 'clear'}));
    $lightbox_content.append(login_container);
    $lightbox_content.append($('<section>', {class: 'approve-button', id: 'approve-login'}).append($('<p>',{text: 'המשך >>'})));
    $lightbox.fadeIn();

    $('.customer-type-option').click(function(){

        var $private_customer = $('#private-customer');
        var $business_customer = $('#business-customer');

        var phone_label = $('<p>', {id: 'phone-label', text: 'מספר טלפון:'});
        var login_phone = $('<input>', {id: 'login-phone', type:'text', name: 'phone-number'});

        var company_label = $('<p>', {id: 'company-label', text: 'קוד חברה:'});
        var company_code = $('<input>', {id: 'company-code', type:'text', name: 'company-code'});

        $('#phone-label').remove();
        $('#login-phone').remove();
        $('#company-label').remove();
        $('#company-code').remove();
        login_container.append(phone_label).append(login_phone);

        if(this.id == 'private-customer'){
            $private_customer.toggleClass('selected');
            if($business_customer.hasClass('selected')){
                $business_customer.toggleClass('selected');
            }
        }
        if(this.id == 'business-customer'){
            $business_customer.toggleClass('selected');
            if($private_customer.hasClass('selected')){
                $private_customer.toggleClass('selected');
            }
            login_container.append(company_label).append(company_code);
        }
    });

    $('#approve-login').click(function(){

        var private_cust = false;
        var business_cust = false;

        var $private_customer = $('#private-customer');
        var $business_customer = $('#business-customer');
        var $login_phone = $('#login-phone').val();
        var $company_code = $('#company-code').val();

        if($private_customer.hasClass('selected'))
            private_cust = true;
        if($business_customer.hasClass('selected'))
            business_cust = true;

        if(!private_cust && !business_cust)
            alert('אנא בחר סוג לקוח');
        else{
            var msg = '';
            console.log('private -'+private_cust);
            console.log('business -'+business_cust);

            if($login_phone.length == 0)
                msg += 'אנא הזן מספר טלפון'+'\n';
            if(business_cust && $company_code.length == 0)
                msg += ' אנא הזן קוד חברה';

            if(msg.length != 0) {
                alert(msg);
            }
            else {
                if(private_cust)
                    private_login(food_item, arr, $login_phone);
                if(business_cust)
                    business_login(food_item, arr, $login_phone, $company_code)
            }
        }

    });

}

function set_due_time(){
    var $lightbox = $('#lightbox');

    $lightbox.fadeOut(function(){
        due_time = $('.due-time-box input').val();
        console.log(due_time);
    });
}

function set_payment_method(pay_with){
    console.log(pay_with);
    var $lightbox = $('#lightbox');

    $lightbox.fadeOut(function(){
        payment_method = pay_with;
    });
}

function set_order_type(type){
    console.log(type);
    var $lightbox = $('#lightbox');

    $lightbox.fadeOut(function(){
        order_type = type;
    });
}

function private_login(food_item, arr, login_phone){

    var url = 'http://'+base_url+'/private-user-login&phone_number='+login_phone;

    $.ajax({

        type: 'POST',
        url: url

    }).done(function(user_details){
        if(user_details != 'user-created')
            console.log(user_details.first_name);
        else
            console.log('user created');

        private_customer_logged = true;
        $('#lightbox').fadeOut(function(){
            customer_details = user_details;
            cart(food_item, arr);
        });
    });

}

function business_login(food_item, arr, login_phone, company_code){

    var url = 'http://'+base_url+'/business-user-login&phone_number='+login_phone+'&company_code='+company_code;

    $.ajax({

        type: 'POST',
        url: url

    }).done(function(user_details){
        if(user_details == 'phone-not-exist')
            alert('מספר הטלפון לא קיים במערכת');
        else {
            if (user_details == 'incorrect-company-code')
                alert('קוד חברה לא נכון אנא נסה שנית');
            else {
                business_customer_logged = true;
                $('#lightbox').fadeOut(function () {
                    customer_details = user_details;
                    cart(food_item, arr);
                });
            }
        }

    });

}


function make_the_order(){

    var msg = '';
    if(due_time == '')
        msg += 'בחר שעת הזמנה\n';
    if(private_customer_logged) {
        if (payment_method == '')
            msg += 'בחר אמצעי תשלום\n';
    }
    if(order_type == '')
        msg += 'בחר סוג הזמנה\n';
    if(my_cart.cart_items.length == 0)
        msg += 'עליך לבחור לפחות פריט אחד להזמנה';
    if(msg != '')
        alert(msg);
    else {
        if(private_customer_logged && payment_method == 'cash'){
            private_order();
        }
        /*if(private_customer_logged && payment_method == 'credit'){

        }
        if(business_customer_logged){

        }*/
    }
}

function private_order(){

    var info = {
        my_cart: my_cart,
        customer_details: updated_customer_details(),
        due_time: due_time,
        order_type: order_type,
        payment_method: payment_method
    }
    alert('here');

    var url = 'http://'+base_url+'/make-order';

    $.ajax({

        type: 'POST',
        url: url,
        data : {data : JSON.stringify(info)}

    }).done(function(res){
        alert(res);
    });

}

function updated_customer_details(){

    var updated_details = {
        first_name: $('#first-name').val(),
        last_name: $('#last-name').val(),
        street: $('#street').val(),
        house_number: $('#house-number').val(),
        floor: $('#floor').val(),
        enter: $('#enter').val()
    }

    return updated_details;

}


// GLOBALS

/*var order_type = '';
var due_time = '';
var payment_method = '';
var private_customer_logged = false;
var business_customer_logged = false;

var my_cart = {
    cart_items: [],
    total_price: 0
};*/












































