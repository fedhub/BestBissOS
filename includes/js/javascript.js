//var base_url = 'best-biss.azurewebsites.net';
var base_url = 'localhost:3000';

function myCart(){
    this.food_items = function(new_food_item){
        this.food_items.push(new_food_item);
    };
    this.total_price = total_price;
    this.due_time = function(due_time){
        this.due_time.push(due_time);
    };
}

function foodItem(newItem){
    this.id   = newItem.id;
    this.name = newItem.name;
    this.description = newItem.description;
    this.price = newItem.price;
    this.addition_sets = function(new_addition_set){
        this.addition_sets.push(new_addition_set);
    };
}

function additionsType(){
    this.id = id;
    this.name = name;
    this.additions = function(new_addition){
        this.additions.push(new_addition);
    };
}

function additionItem(){
    this.id   = id;
    this.name = name;
    this.description = description;
    this.price = price;
}




$(document).ready(function(){

    get_logo();

    $('li').click(function(){

        $('.skin section').css('background-color', '#FFF');
        $('#' + this.id + '-skin').css('background-color', 'green');

        if(this.id == 'menu'){
            get_the_menu();
        }

    });


});

function get_logo(){

    $('.logo').css({
        'background': 'url("http://'+base_url+'/images/mobile_logo.png") no-repeat',
        'background-size': 'contain'
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

            var addition_item = $('<section>', {class: 'addition-item'})
                .click({
                    additions_type_index: i,
                    addition_item_index: j
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

    function event_handler(e){

        var i = e.data.additions_type_index;
        var j = e.data.addition_item_index;
        var uncheck = false;

        if(food_item.addition_types[i].details.selection_type == 'required_exact'){

            console.log('here');

            if(arr[i].length == 1){
                arr[i] = [];
                $('.addition-item').css('background-color', '#FFF');
            }
            if(arr[i].length == 0) {
                arr[i].push(j);
                $(this).css('background-color', 'green');
            }

        }

        if(food_item.addition_types[i].details.selection_type == 'required_min'){

        }

        if(food_item.addition_types[i].details.selection_type == 'optional_max'){

        }

/*
        // check if the addition item clicked by the user has already been chosen by him
        for(var k = 0; k < arr[i].length; k++){
            if(arr[i][k] == j){
                arr[i].splice(k,1);
                uncheck = true;
            }
        }
        if(!uncheck)
            arr[i].push(j);

        console.log('set '+i+': '+arr[i].length+' selected');*/

    }


    $('.main').empty();
    $('.main').append(menu_additions_container);


}


/*
 function myCart(){
 this.food_items = function(new_food_item){
 this.food_items.push(new_food_item);
 };
 this.total_price = total_price;
 this.due_time = function(due_time){
 this.due_time.push(due_time);
 };
 }

 function foodItem(){
 this.id   = id;
 this.name = name;
 this.description = description;
 this.price = price;
 this.addition_sets = function(new_addition_set){
 this.addition_sets.push(new_addition_set);
 };
 }

 function additionsType(){
 this.id = id;
 this.name = name;
 this.additions = function(new_additions){
 this.additions.push(new_addition);
 }_
 }

 function additionItem(){
 this.id   = id;
 this.name = name;
 this.description = description;
 this.price = price;
 }
*/






























