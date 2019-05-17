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
});