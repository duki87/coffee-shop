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

/*     $(document).on('click', '.addToCart', function(e) {
        e.preventDefault();
        let id = $(this).attr('data-coffeeId');
        console.log(id)
        var data = new FormData();
        //var cartId = sessionStorage.getItem('cart');        
        data.append('productId', id);
        //data.append('cartId', cartId);
        $.ajax({           
            url: '/cart/add-to-cart',
            method: 'POST',
            data: data,
            processData: false,
            //contentType: false,
            success: function(res) {
                console.log(res);
            },
            error: function(err) {
                console.log(err);
            }
        }); 
    }); */

    /* $(document).on('submit', '#', function(e) {
        e.preventDefault();
        var data = new FormData();   
        let email = $('#email').val();
        let password = $('#password').val();
        data.append('email', email);
        data.append('password', password);
        $.ajax({           
            url: '/user/login',
            method: 'POST',
            data: data,
            processData: false,
            contentType: false,
            success: function(res) {
                if(res.token) {
                    localStorage.setItem('token', res.token);
                    //window.location.href = "http://localhost:3000/user"; 
                    redirectToProtectedRoutes('user');                
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }); */

});