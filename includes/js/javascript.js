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
        'background': 'url("http://localhost:3000/images/mobile_logo.png") no-repeat',
        'background-size': 'contain'
    });

}

function get_the_menu(){

    var url = 'http://localhost:3000/get-menu-data';

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
        var food_category_container = $('<section>', {class: 'food-category-container', id: res[i].id}).click(function(){get_menu_items(this.id);});
        var category_name = $('<p>', {text: res[i].name});
        food_category_container.append(category_name);
        menu_container.append(food_category_container);
    }

    $('.main').html(menu_container);

}

function get_menu_items(category_id){

    var url = 'http://localhost:3000/get-food-items-data&id='+category_id;

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
        var food_item = $('<section>', {class: 'menu-items-container food-item', id: i+'-food-item'});
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

    menu_items_container.find('.food-item').click(function(){
        var index = parseInt(this.id[0]);
        render_item_additions(food_items_list[index]);
    });

    $('.main').empty();
    $('.main').append(menu_items_container);

}

function render_item_additions(food_item){

    var menu_additions_container = $('<section>', {class: 'menu-additions-container'});

    for(var i = 0 in food_item.addition_types){

        var set_container = $('<section>', {class: 'set-container'})
        var set_title = $('<section>', {class: 'set-title'});
        var items_container = $('<section>', {class: 'items-container'});

        for(var j = 0 in food_item.addition_types[i].items){

            var addition_item = $('<section>', {class: 'addition-item'});
            var item_header = $('<section>', {class: 'item-header'});
            var item_image = $('<section>', {class: 'item-image'});

            var information = $('<section>', {class: 'item-header information'});
            var title = $('<section>', {class: 'item-header title'});
            var description = $('<section>', {class: 'item-header description'});
            var price = $('<section>', {class: 'item-header price'});
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


    $('.main').empty();
    $('.main').append(menu_additions_container);


}






























