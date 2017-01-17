
var Validator = (function() {
  function Validator($form, $submit) {
    this.$form = $form;
    this.$submit = $submit;
  }

  Validator.prototype.before = function() {
    return this.checkedFieldsets = this.checkedFieldsets();
  };

  Validator.prototype.run = function() {
    var results, self;
    self = this;
    results = [];
    this.before();
    $(this.$form.find('input, textarea').not('[data-required="optional"]').get().reverse()).each(function() {
      var type;
      type = $(this).prop('type');
      if (type === 'email') {
        results.push(self.email($(this)));
      }
      if (type === 'text' || type === 'textarea') {
        results.push(self.presence($(this)));
      }
      if (type === 'radio') {
        return results.push(self.checked($(this)));
      }
    });
    return results.indexOf(false) === -1;
  };

  Validator.prototype.presence = function($field) {
    if ($field.val() !== '') {
      return true;
    } else {
      this.handleError($field);
      return false;
    }
  };

  Validator.prototype.email = function($email) {
    var regx;
    regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regx.test($email.val())) {
      return true;
    } else {
      this.handleError($email);
      return false;
    }
  };

  Validator.prototype.checked = function($field) {
    var id;
    id = $field.closest('fieldset').prop('id');
    if ($field.prop('checked') || this.checkedFieldsets.indexOf(id) !== -1) {
      return true;
    } else {
      this.handleError($field);
      return false;
    }
  };

  Validator.prototype.checkedFieldsets = function() {
    var fieldset;
    fieldset = [];
    this.$form.find('input[type="radio"]').each(function() {
      var id;
      if ($(this).prop('checked')) {
        id = $(this).closest('fieldset').prop('id');
        if (fieldset.indexOf(id) === -1) {
          return fieldset.push(id);
        }
      }
    });
    return fieldset;
  };

  Validator.prototype.handleError = function($field) {
    this.$submit.removeClass('loading');
    $field.parent().addClass('error');
    $field.focus();

    var fieldType = $field.attr('type');
    var message =  'A value is required.';

    if (fieldType === 'email') {
      message = 'A valid email address is required.'
    } 
    $field.after('<div class="error-message">' + message + '</div>');

    return window.scrollTo(0, $field.offset().top);
  };

  return Validator;

})();
