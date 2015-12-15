var field_types = $('#field-types').attr('value').replace(/\W+/g, " ").split(" ").slice(1, -1);

// target elements with the "draggable" class
interact('.draggable')

  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    // restrict: {
    //   restriction: "parent",
    //   endOnly: true,
    //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    // },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var draggable = $(event.target)
      var textEl = event.target.querySelector('p');

      if (draggable.attr('type') == 'None') {
        draggable.remove()
      }

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  }).on('move', function (event) {

    var interaction = event.interaction;

    // if the pointer was moved while being held down
    // and an interaction hasn't started yet
    if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.classList.contains('draggable-source')) {

      var original = $(event.currentTarget);

      // create a clone of the currentTarget element
      var clone = event.currentTarget.cloneNode(true);
      $(clone).attr('data-x', original.position().left - 10)
      // var top_offset = original.position().top - 156
      var top_offset = original.position().top - $('#active-fields').position().top
      $(clone).attr('data-y', top_offset)
      $(clone).removeAttr('id');
      $(clone).find('.field-text').find('input').remove()

      // Remove CSS class using JS only (not jQuery or jQLite) - http://stackoverflow.com/a/2155786/4972844
      clone.className = clone.className.replace(/\bdraggable-source\b/,'');

      // TODO: position the clone appropriately
      document.getElementById('active-fields').appendChild(clone);

      // start a drag interaction targeting the clone
      interaction.start({ name: 'drag' }, event.interactable, clone);

    }

  });

  function dragMoveListener (event) {
    var target = event.target,

    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.draggable',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    $(event.target).addClass('drop-active');
  },
  ondragenter: function (event) {
    var dropzone = $(event.target);
    var draggable = $(event.relatedTarget);
    var sep = ' of '

    // feedback the possibility of a drop
    draggable.attr('type',dropzone.attr('type'))

    if (draggable.attr('type') == 'index') {
      sep = ': '
    };

    $(draggable.find("span.agg-text")).text(draggable.attr('type')+sep);

    dropzone.addClass('drop-target');
    draggable.addClass('can-drop');
    draggable.addClass('tap-target');
    draggable.addClass('agg-text');
    draggable.addClass('tap-' + draggable.attr('type'));

  },
  ondragleave: function (event) {
    // remove the drop feedback style
    var dropzone = $(event.target)
    var draggable = $(event.relatedTarget)

    $(draggable.find("span.agg-text")).text('');

    dropzone.removeClass('drop-target');
    draggable.removeClass('can-drop');
    draggable.removeClass('tap-target');
    draggable.removeClass('tap-' + draggable.attr('type'));

    draggable.attr('type','None')
  },

  ondrop: function (event) {
    var dropzone = $(event.target)
    var draggable = $(event.relatedTarget)

    setRowIndex()
    // draggable.css("position", "absolute");
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    var target = $(event.target)
    target.removeClass('drop-active');
    target.removeClass('drop-target');
  }
});

// interact('.tap-target')
//   .on('doubletap', function (event) {
//       var target = $(event.currentTarget)
//       switch (target.attr('agg'))
//        {
//           case 'median':
//             target.attr('agg','sum');
//             target.addClass('tap-sum').removeClass('tap-median');
//           break;
//
//           case 'sum':
//             target.attr('agg','count');
//             target.addClass('tap-count').removeClass('tap-sum');
//           break;
//
//           case 'count':
//             target.attr('agg','mean');
//             target.addClass('tap-mean').removeClass('tap-count');
//           break;
//
//           case 'mean':
//             target.attr('agg','median');
//             target.addClass('tap-median').removeClass('tap-mean');
//           break;
//
//           default:
//             target.attr('agg','sum');
//             target.addClass('tap-sum');
//        }
//     event.preventDefault();
//   })
//
//   .on('hold', function (event) {
//     event.currentTarget.classList.toggle('rotate');
//     event.currentTarget.classList.remove('large');
//   });

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
    var active_fields = new Array();
    $('.draggable').each(function() {
      if ($(this).attr('type') != 'None') {
        var field_text = $(this).find('span.name-text').text().trim()
        active_fields.push({field_id: $(this).attr('field-id'), type: $(this).attr('type'), new_name: field_text});
      }
    });

    var mb_id = $('#mb-id').attr('value');


    $.ajax({
        method: 'POST',
        url: '/script_builder/save_pivot_fields/' + mb_id,
        data: {'active_fields': JSON.stringify(active_fields)},
        success: function (data) {
            window.location='/script_builder/pivot_builder/' + mb_id
        },
        // error: function (data) {
        //      alert("it didnt work");
        // }
    });
});

function add_edit_buttons() {
  $('.draggable').each(function() {
    id_number = this.id.split('-')[1]
    var option = {trigger : $("input.btn-"+id_number), action : "click"};
    $('.editable-'+id_number).editable(option, function(e){
        console.log(option);
        console.log(e);
    });
  });
}

function setRowIndex() {

  var count_array = new Array();
  var iter_count = field_types.length;

  $('.draggable').each(function() {
    for(var i = 0; i < iter_count; i++) {
      var field_type = field_types[i]
      var dropzone = $('#'+field_type+'-dropzone')

      if (!(field_type in count_array)) {
        count_array[field_types[i]] = 0
      }

      if ($(this).attr('type') == field_type) {
        $(this).attr('row_index', count_array[field_type])
        count_array[field_types[i]] ++

        moveDraggable($(this), dropzone)

      };
    }
  });
}

function moveDraggable(draggable, dropzone) {
  var y_offset = dropzone.position().top - $('#active-fields').position().top + 45
  draggable.attr('data-x', dropzone.position().left);
  console.log(dropzone.position().top);
  draggable.attr('data-y', y_offset + (draggable.attr('row_index'))*40)
  var translate_string = 'translate(' + draggable.attr('data-x') + 'px, ' + draggable.attr('data-y') + 'px)'
  draggable.css('webkitTransform',"")
  draggable.css('transform', translate_string);
}

function toggleInteractClasses(draggable, dropzone) {
  dropzone.toggleClass('drop-target');
  draggable.toggleClass('can-drop');
  draggable.toggleClass('tap-target');
  draggable.toggleClass('tap-' + draggable.attr('type'));
}

$( document ).ready(function() {
  add_edit_buttons()
  setRowIndex()
  var none_offset = -200
  $('.draggable').each(function() {
    var draggable = $(this)
    var dropzone = $('#'+draggable.attr('type')+'-dropzone')
    var sep = ' of '
    var agg_span = $(draggable.find("span.agg-text"))

    if (draggable.attr('type') == 'index') {
      sep = ': '
    };

    if (draggable.attr('type') == 'None') {
      agg_span.text('');
      // none_offset += 210
      // draggable.attr('data-x', none_offset);
      // draggable.css('transform', 'translate(' + none_offset + 'px)');
    } else {
      agg_span.text(draggable.attr('type')+sep);
      dropzone.addClass('drop-target');
      draggable.addClass('can-drop');
      draggable.addClass('tap-target');
      draggable.addClass('tap-' + draggable.attr('type'));
      // draggable.css("position", "absolute");

    };
  });
  setTimeout(function(){
    $('.drag-drop').css("visibility", "visible");
  }, 80);
});

$( window ).resize(function() {
  setRowIndex();
});
