$.validator.addMethod("regex", function(value, element, regexp) {
  return this.optional(element) || regexp.test(value);
}, "");

$.validator.setDefaults({
  errorElement: "span",
  errorClass: "help-block",
  highlight: function (element, errorClass, validClass) {

    $(element).closest('.form-group').addClass('has-error');  

  },
  unhighlight: function (element, errorClass, validClass) {

    $(element).closest('.form-group').removeClass('has-error');  
      
  },
  errorPlacement: function (error, element) {        
      if (element.parent('.input-group').length || (element.prop('type') === 'checkbox' || element.prop('type') === 'radio')) {
          error.insertAfter(element.parent());
      // }
      // else if((element.prop('type') === 'checkbox' || element.prop('type') === 'radio') && element.hasClass("iCheck")) {
      //   error.insertAfter(element.closest('label'));
      } else {
          var file_wrapper = element.parents(".fileinput")
          if (element.attr("type") == "file" && file_wrapper.length>0) {
            error.insertAfter(element.parents(".fileinput"));
          } else {
            error.insertAfter(element);
          }            
      }
  }
});

$.fn.render_form_errors = function(errors){
  $form = this;
  this.clear_previous_errors();
  model = this.data('model');

  // show error messages in input form-group help-block
  $.each(errors, function(field, messages){
    $input = $('input[name="' + model + '[' + field + ']"]');
    $input.closest('.form-group').addClass('has-error').find('.help-block').html( messages.join(' & ') );
  });
};

$.fn.clear_previous_errors = function(){
  $('.form-group.has-error', this).each(function(){
    $('.help-block', $(this)).html('');
    $(this).removeClass('has-error');
  });
}

function validateImageFiles(inputFile) {
  var maxExceededMessage = "This file exceeds the maximum allowed file size (2 MB)";
  var extErrorMessage = "Only image file with extension: .jpg, .jpeg, .gif or .png is allowed";
  var allowedExtension = ["jpg", "jpeg", "gif", "png"];
  
  var extName;
  var maxFileSize = 2097152; // 2MB
  var sizeExceeded = false;
  var extError = false;

  
  $.each(inputFile.files, function() {
    if (this.size && maxFileSize && this.size > parseInt(maxFileSize)) {sizeExceeded=true;};
    extName = this.name.split('.').pop().toLowerCase();
    if ($.inArray(extName, allowedExtension) == -1) {extError=true;};
  });
  if (sizeExceeded) {
    BSNotify.show("danger", maxExceededMessage);
    $(inputFile).val('');
  };
  
  if (extError) {
    BSNotify.show("danger", extErrorMessage);
    $(inputFile).val('');
  };
}
