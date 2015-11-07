$(document).ready(function(){
    $.ajaxSetup({ cache: false, timeout: 360000 });
    var url = "/script_builder/poll_for_download/";
    var i = 0;
    var task_id = $('#task-id').attr('value');
    (function worker() {
        $.getJSON(url+"?task_id="+task_id, function(data){
            console.log(data);
            if(data.filename) {
                var file_url = url+"?filename="+data.filename;
                $("#download").html("If your download doesn't start automatically, please click <a href='"+file_url+"'>here</a>.");
                window.location.href = file_url;
            } else {
                setTimeout(worker, 5000);
            }
        });
    })();
    setInterval(function() {
        i = ++i % 4;
        $("#loading").html("loading"+Array(i+1).join("."));
    }, 1000);
});
