$(document).ready(function () {
    //rotates the content of the carousel each 4 seconds
    $('.carousel').carousel({
        interval: 4000
    })

    $('#leftButton').on('click', function () {
        //shows the next news in the carousel
        $('.carousel').carousel('prev');
    })


    $('#rightButton').on('click', function () {
        //shows the previous news in the carousel
        $('.carousel').carousel('next');
    })
});
