$(document).foundation();

$(function() {

  $('.filter').click(function(e){

      $('[data-type="'+$(this).attr('rel')+'"]').each(function(e){
        $(this).toggle();
      })
    $(this).toggleClass('toggled')

  })

});
