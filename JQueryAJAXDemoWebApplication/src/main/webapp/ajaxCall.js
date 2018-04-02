/**
 * 
 */

$(function() {

  var $orders = $('#orders');
  var $name = $('#name');
  var $drink = $('#drink');

  // For removal of the messy HTML code like $order.append('<li>name: '+order.name+' ,drink: '+order.drink+'</li>')
  // we will you Mustache templating engine, where in HTML there will be variables in {{}} and names of these variables should be same as object properties
  // and in the JS code we need to pass just the Object
  var orderTemplate = $('#order-template').html();
  
  var $order = $('#orders');

  function addOrder(order) {
	  // This is how we pass the values, Here we have to pass two things the template Object and the data object, it  
    $orders.append(Mustache.render(orderTemplate, order));
  };

  // This is how we write the JQuery AJAX method (this is unsynchronous, i.e no page refresh is needed to invoke it)
  // we can define properties to an ajax call similar to the XMLHttpRequest.open("GET", "myList.json", true)
  // but here we give properties instead of parameters 
  // the REST type: GET/POST/DELETE/PUT
  // url is the url that is needed to make the call, in case the data is needed in the URL the URL must be made accordingly
  // the success and error are methods to be executed in case of success and error.
  // data will be the data field
  
  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/learncode/friends',
    success: function(orders) {
    	// This is the for each function of JQuery, the process of execution is:
    	// On success this function is called and the return data is passed to the orders object
    	// for each of the orders, it will call the function wil one instance of orders and it's index
      $.each(orders, function(i, order) {
        if (order.id && typeof order.name != "undefined" && typeof order.drink != "undefined") {
          addOrder(order);
          //$order.append('<li>name: '+order.name+' ,drink: '+order.drink+'</li>');
          //console.log('success',order);	
        }
      });
    },
    error: function() {
      alert('error loading orders');
    }
  });

  // This method is when we click the add order button
  
  $('#add-order').on('click', function() {
	  
	  var order = {
			  name: $name.val(),
	  		  drink: $drink.val()
	  };
	  
	  $.ajax({
		    type: 'POST',
		    url: 'http://rest.learncode.academy/api/learncode/friends',
		    data: order,
		    success: function(orders) {
		    	addOrder(order);
		    },
		    error: function() {
		      alert('error saving orders');
		    }
		  });
	  
  });

  // Here we could have written $('.remove').on('click', function(){})
  // But the problem with it is, that the page doesn't yet have loaded with any li objects yet,  bcuz as this is Async both get method and this method will be fired simulatenously
  // but when it tries looking for any class '.remove' it doesn't find any as it has note yet been loaded.
  // Hence we must make sure the orders has been loaded before it gets to look for .remove items. Thus we use delegate.
  	// we use an class selection so that we don't have to code on indiv buttons
  // data-id attribute name we have given to each html li to differentiate b/w them, this data-d is getting populated by id
  $orders.delegate('.remove', 'click', function() {

	  // find the list item closest to the click
	  var $li = $(this).closest('li');

    $.ajax({
      type: 'DELETE',
      url: 'http://rest.learncode.academy/api/learncode/friends/' + $(this).attr('data-id'),
      success: function() {
    	// fade this list and remove it.  
        $li.fadeOut(300, function() {
          $(this).remove();
        });
      }
    });
  });
  
  /*$orders.delegate('.editOrder', 'click', function() {
    var $li = $(this).closest('li');

    $li.find('input.name').val( $li.find('span.name').html() );
    $li.find('input.drink').val( $li.find('span.drink').html() );
    $li.addClass('edit');
  });

  $orders.delegate('.cancelEdit', 'click', function() {
    $(this).closest('li').removeClass('edit');
  });

  $orders.delegate('.saveEdit', 'click', function() {
    var $li = $(this).closest('li');

    var order = {
      name: $li.find('input.name').val(),
      drink: $li.find('input.drink').val()
    };

    
    $.ajax({
      type: 'PUT',
      url: 'http://rest.learncode.academy/api/learncode/friends/' + $li.attr('data-id'),
      data: order,
      success: function(newOrder) {
        $li.find('span.name').html(order.name);
        $li.find('span.drink').html(order.drink);
        $li.removeClass('edit');
      },
      error: function() {
        alert('error updating order');
     }
    });

  });*/


});