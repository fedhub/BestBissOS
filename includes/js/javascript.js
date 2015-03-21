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

    console.log(food_items_list[0].details.name);

}






























