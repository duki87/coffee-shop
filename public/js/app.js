$(document).ready(function() {
    
    $(document).on('change', '#image', function(e) {
        e.preventDefault();
        $('#removeImg').toggleClass('d-none');
        var url = URL.createObjectURL(e.target.files[0]);  
        $('#preview').attr('src', url);
    });

    $(document).on('click', '#removeImg', function(e) {
        e.preventDefault();
        $('#removeImg').toggleClass('d-none');  
        $('#preview').attr('src', '');
        $('#image').val('');
    });

    $(document).on('click', '.removeFromCart', function(e) {
        e.preventDefault();
        let orderId = $(this).attr('data-orderId');
        let elem = $(this);
        var data = new FormData();
        data.append('orderId', orderId);
        $.ajax({           
            url: '/cart/remove-order/'+orderId,
            method: 'GET',
            processData: false,
            success: function(res) {
                console.log(res.message);
                if(res.message == 'EMPTY') {
                    window.location.href = '/';
                } else {
                    let subtotal = parseFloat('-'+elem.closest('td').parent().find('.subtotal').text());
                    updateTotal(subtotal);
                    $('#'+orderId).remove();
                }              
            },
            error: function(err) {
                console.log(err);
            }
        }); 
    });

    $(document).on('click', '.plus', function(e) {
        e.preventDefault();
        let orderId = $(this).attr('data-orderId');
        let elem = $(this).closest('td').find('.quantity');
        let quantity = parseInt(elem.html());
        quantity++;
        let update = updateQuantity(orderId, quantity, elem);
    });

    $(document).on('click', '.minus', function(e) {
        e.preventDefault();
        let elem = $(this).closest('td').find('.quantity');
        let quantity = parseInt(elem.html());
        quantity--; 
        let orderId = $(this).attr('data-orderId');
        $(this).closest('td').find('.quantity').html(quantity);
        updateQuantity(orderId, quantity, elem);      
    });

    $(document).on('change', '.currentQty', function(e) {
        e.preventDefault();
        console.log($(this).val());
    });

    function updateQuantity(orderId, quantity, elem) {
        $.ajax({           
            url: '/cart/updateQuantity/'+orderId,
            type: 'PUT',
            data: JSON.stringify({quantity: quantity}),
            contentType: 'application/json',
            processData: false,
            success: function(res) {
                elem.html(quantity);  
                elem.closest('td').find('.currentQty').val(quantity);  
                updateSubtotal(elem, quantity);       
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    function updateSubtotal(elem, quantity) {
        let price = parseFloat(elem.closest('td').parent().find('.price').text());
        let subtotal = elem.closest('td').parent().find('.subtotal');
        let newSubtotal = parseFloat(quantity * price).toFixed(2);
        let dif = newSubtotal - parseFloat(subtotal.text());
        subtotal.text(newSubtotal);
        updateTotal(dif);
    }

    function updateTotal(dif) {
        let total = parseFloat($('#total').text());
        let newTotal = parseFloat(total + dif).toFixed(2);
        $('#total').text(newTotal);
    }
});