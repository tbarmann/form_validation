var ENTER = 13,
 SPACEBAR = 32,
 clearRadioErrors,
 clearTextErrors,
 enableTabbing,
 handleForm,
 makeFieldsTabbable,
 selectTab,
 submit;

clearRadioErrors = function(e) {
  return $(this).closest('fieldset').find('.tab-input').each(function() {
    return $(this).removeClass('error');
  });
};

clearTextErrors = function(e) {
  return $(this).closest('.form-field').removeClass('error');
};

makeFieldsTabbable = function() {
  $('fieldset.radio-set.clearfix .tab-input').off('focus');
  return $('fieldset.radio-set.clearfix .tab-input').on('focus',
 function(e) {
    return enableTabbing($(this));
  });
};

enableTabbing = function(element) {
  element.off('keydown.formTab');
  return element.on('keydown.formTab',
 function(e) {
    var code;
    code = e.keyCode || e.which;
    if (code === ENTER || code === SPACEBAR) {
      return $(this).find('label').trigger('click');
    }
  });
};

submit = function(ctx, e) {
  var $contactForm, $submit, data, validate;

  e.preventDefault();
  $contactForm = $('.contact-form form');
  $submit = $('.contact-form .submit-button');
  data = $contactForm.serializeArray();
  validate = new Validator($contactForm, $submit);
  $contactForm.find('.form-field').removeClass('error');
  $submit.addClass('loading');
  if (validate.run()) {
    $.support.cors = true;
    return $.post("/api/v1/contact_request",
      $.param(data.concat(
        {
          name: 'referer',
          value: document.referrer
        }
      )
      ));

      $submit.removeClass('loading');
      localStorage.setItem('email', formObject.email);
      localStorage.setItem('name', formObject.name);
      return '/contact-thanks';
  }
};

handleForm = function(ctx,
 next) {
  makeFieldsTabbable();
  $('.contact-form .tab-input').off().on('click',
 selectTab);

  $('.contact-form form .submit-button').off().on('click',
 _.partial(submit, ctx));
  $('.contact-form .close-modal').off().on('click',
 close);
  $('.contact-form .form-field label').off().on('click',
 clearRadioErrors);
  $('.contact-form .form-field input').off().on('input',
 clearTextErrors);
  $('.contact-form .form-field textarea').off().on('input',
 clearTextErrors);
};

