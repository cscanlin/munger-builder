Sortable.create(fieldBank, {
  sort: false,
  group: {
    name: 'fieldBank',
    pull: 'clone',
  },

  onMove: function (evt) {
    var drg = $(evt.dragged)
    console.log(drg);
    var fieldText = $(drg.find("span.name-text"))
    var fieldType = $(evt.to).attr('type')
    if (fieldType == 'agg') {
      fieldType = 'count'
    }
    fieldText.removeAttr('id');
    fieldText.removeClass('source-text');
    fieldText.addClass('clone-text');

    drg.removeAttr('id');
    drg.removeClass();
    drg.attr('type',fieldType)
    drg.addClass(drg.attr('type') + '-field');
    drg.addClass('draggable-clone');
    drg.addClass('list-group-item');
    drg.addClass('sortable-ghost');
    updateType(drg)
  },
  // onStart:
  // old js move goes here
})

Sortable.create(indexList, {
  group: {
    name: 'indexList',
    put: ['fieldBank', 'columnList', 'aggList'],
  },
});

Sortable.create(columnList, {
  group: {
    name: 'columnList',
    put: ['fieldBank', 'aggList', 'indexList'],
  },
});

Sortable.create(aggList, {
  group: {
    name: 'agg',
    put: ['fieldBank', 'indexList', 'columnList'],
  },
});

var csrftoken = $.cookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$('#save-pivot-fields').click(function() {
  savePivotFields().then(function(){
    $("#messages-container").load(location.href+" #messages-container > *","");
  });
});

function savePivotFields() {
  var active_fields = new Array();
  $('.draggable').each(function() {
    if ($(this).attr('type') != 'None') {
      var fieldText = $(this).find('span.name-text').text().trim()
      active_fields.push({field_id: $(this).attr('field-id'), type: $(this).attr('type'), new_name: fieldText});
    }
  });

  var mb_id = $('#mb-id').attr('value');

  return $.ajax({
      method: 'POST',
      url: '/script_builder/save_pivot_fields/' + mb_id,
      data: {'active_fields': JSON.stringify(active_fields)},
      // success: function (data) {
      //     $("#messages-container").load(location.href+" #messages-container > *","");
      // },
      // error: function (data) {
      //      alert("it didnt work");
      // }
  });
}

$('body').on('click', '#add-pivot-field', function() {

    var mb_id = $('#mb-id').attr('value');

    savePivotFields().then(function(){
      $.ajax({
          method: 'POST',
          url: '/script_builder/add_pivot_field/' + mb_id,
          success: function () {
              $("#field-source-container").load(location.href+" #field-source-container > *","");
              $("#messages-container").load(location.href+" #messages-container > *","");
              console.log('success');

          },
          failure: function() {
            console.log('fail');
          }
      });
    })
});

$('body').on('click', '.delete-field-button', function() {

    var mb_id = $('#mb-id').attr('value');
    var field_id = this.id.split('-')[2]

    savePivotFields().then(function(){
      $.ajax({
          method: 'POST',
          url: '/script_builder/field_parser/' + field_id + '/delete',
          success: function () {
              $("#field-source-container").load(location.href+" #field-source-container > *","");
              $("#messages-container").load(location.href+" #messages-container > *","");
          },
      });
    })
});

function add_edit_buttons() {
  $('.draggable').each(function() {
    id_number = this.id.split('-')[1]
    var option = {trigger : $("input.edit-btn-"+id_number), action : "click"};
    $('#source-text-'+id_number).editable(option, function(s){
      field_id = s.target.attr('field-id')
      new_text = s.value
      // updateClones(field_id,new_text);
    });
  });
}

function updateClones(field_id,new_text) {
  $('.clone-text.editable-'+field_id).each(function() {
    $(this).text(new_text)
  });
}

function updateType(cloneField) {
  var aggText = $(cloneField.find("span.agg-text"))
  var sep = ' of '
  if (cloneField.attr('type') == 'index') {
    sep = ': '
  };
  aggText.text(cloneField.attr('type')+sep);
}




$( document ).ready(function() {
  add_edit_buttons()
  $('.draggable-clone').each(function() {
    updateType($(this));
  });
});
