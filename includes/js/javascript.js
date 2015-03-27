var base_url = 'best-biss.azurewebsites.net';
//var base_url = 'localhost:3000';

$(document).ready(function(){

    get_logo();

    $('li').click(function(){

        $('.skin section').css('background-color', '#FFF');
        $('#' + this.id + '-skin').css('background-color', 'green');

        if(this.id == 'menu'){
            get_the_menu();
        }

        if(this.id == 'cart'){
            render_cart();
        }

    });

    var check = 0;
    $('.hamburger').click(function(){
        check++;
        if(check % 2 == 0) {
            $('.mobile-menu-container').animate({left: '-75%'},{
                easing: 'swing',
                duration: 500,
                complete: function(){
                    $(this).css('display', 'none');
                }
            });
            $('body').animate({left: '0'},{
                easing: 'swing',
                duration: 500
            });
            check = 0;
            $('.hamburger').animate({rotation: 90},{
                step: function () {
                    $(this).css({'transform': 'rotate(0deg)', 'transition-duration': '0.5s'});
                }
            });
        }
        else {
            $('.mobile-menu-container').show().animate({left: '0'},{
                easing: 'swing',
                duration: 500,
                queue: false
            });
            $('body').animate({left: '75%'},{
                easing: 'swing',
                duration: 500,
                queue: false
            });
            $('.hamburger').animate({rotation: 0},{
                step: function () {
                    $(this).css({'transform': 'rotate(90deg)', 'transition-duration': '0.5s'});
                }
            });

        }



        /*$('.mobile-menu-container').slideToggle(function(){
            if($(this).is(":visible"))
                $(this).animate({left : '0'},500);
            else
                $(this).animate({left : '-75%'},500);
        });*/
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
    else
        cart(food_item, arr);

}


var my_cart = {
    cart_items: [],
    total_price: 0
};

function foodItem(food_item, addition_types){
    this.item = food_item;
    this.addition_types = addition_types;
}

function additionsType(additions_type, addition_items){
    this.type = additions_type;
    this.items = addition_items;
}

function cart(food_item, arr){

    var cart_addition_items = [];
    var cart_addition_types = [];

    my_cart.total_price += food_item.details.price;

    for(var i = 0; i < arr.length; i++){

        for(var j = 0; j < arr[i].length; j++){
            cart_addition_items.push(food_item.addition_types[i].items[arr[i][j]].details);
            my_cart.total_price += food_item.addition_types[i].items[arr[i][j]].details.price;
        }

        var additions_type = new additionsType(food_item.addition_types[i].details, cart_addition_items);
        cart_addition_items = [];
        if(arr[i].length > 0)
            cart_addition_types.push(additions_type);

    }

    var cart_item = new foodItem(food_item.details, cart_addition_types);
    my_cart.cart_items.push(cart_item);
    render_cart();

}

function render_cart(){

    var cart_container = $('<section>', {class: 'cart-container'});

    // for each item in cart
    for(var i = 0; i < my_cart.cart_items.length; i++){
        var cart_item = $('<section>', {class: 'cart-item'});
        cart_item.append(my_cart.cart_items[i].item.name).append(' ' + my_cart.cart_items[i].item.price).append($('<br>'));

        // for each item in addition types
        for(var j = 0; j < my_cart.cart_items[i].addition_types.length; j++){
            cart_item.append(my_cart.cart_items[i].addition_types[j].type.name).append($('<br>'));

            // for each item in addition items
            for(var k = 0; k < my_cart.cart_items[i].addition_types[j].items.length; k++){
                cart_item.append(my_cart.cart_items[i].addition_types[j].items[k].name + ' ' + my_cart.cart_items[i].addition_types[j].items[k].price).append($('<br>'));

            }
        }
        cart_container.append(cart_item);
    }

    cart_container.append(my_cart.total_price);

    $('.main').empty();
    $('.skin section').css('background-color', '#FFF');
    $('#cart-skin').css('background-color', 'green');
    $('.main').append(cart_container);

}







































