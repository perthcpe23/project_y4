var isAdvancedUpload = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var $form = $('.box');
var $input = $('#file');
var $notSupport = $('.not-support');

if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');

    var droppedFiles = false;

    $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $form.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $form.removeClass('is-dragover');
        })
        .on('drop', function(e) {
            droppedFiles = e.originalEvent.dataTransfer.files;
            $form.trigger('submit');
        });

    $input.on('change', function(e) { // when drag & drop is NOT supported
        $form.trigger('submit');
    });

    $form.on('submit', function(e) {
        if ($form.hasClass('is-uploading')) return false;

        $form.removeClass('is-error');
        $notSupport.removeClass('show');

        if (isAdvancedUpload) {
            e.preventDefault();

            var ajaxData = new FormData($form.get(0));
            var extensionError = false;

            if (droppedFiles) {
                $.each(droppedFiles, function(i, file) {
                    extension = file.name.match(/\..*/);
                    if (extension != null) {
                        extension = extension[0].split(".");
                        extension = extension[extension.length - 1];

                        if (["pdf", "doc", "docx", "txt"].indexOf(extension.toLowerCase()) == -1) {
                            $notSupport.addClass('show');
                            extensionError = true;
                            return;
                        }

                        ajaxData.append(file.name, file);
                    }
                });
            }

            if (extensionError) {
                return;
            }

            $form.addClass('is-uploading')
            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: ajaxData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                complete: function() {
                    $form.removeClass('is-uploading');
                },
                success: function(data) {
                    $form.addClass(data.success == true ? 'is-success' : 'is-error');
                    if (!data.success) {
                        $errorMsg.text(data.error);
                    }
                },
                error: function() {
                    // Log the error, show an alert, whatever works for you
                }
            });
        } else {
            var iframeName = 'uploadiframe' + new Date().getTime();
            $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

            $('body').append($iframe);
            $form.attr('target', iframeName);

            $iframe.one('load', function() {
                var data = JSON.parse($iframe.contents().find('body').text());
                $form
                    .removeClass('is-uploading')
                    .addClass(data.success == true ? 'is-success' : 'is-error')
                    .removeAttr('target');
                if (!data.success) $errorMsg.text(data.error);
                $form.removeAttr('target');
                $iframe.remove();
            });
        }
    });
}