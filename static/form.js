const url = window.location.href

function submit() {
    console.log("submitting");
    var json = {};

    if ($("#code")[0].value.length != 0) json["code"] = $("#code")[0].value;
    else {
        alert("Cannot have empty field");
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
}

$(document).ready(function() {
    $("#code").on("keydown", function(e) {
        if (e.key === "Tab") {
            e.preventDefault();

            var start = this.selectionStart;
            var end = this.selectionEnd;

            $(this).val($(this).val().substring(0, start) + "    " + $(this).val().substring(end));

            this.selectionStart = this.selectionEnd = start + 4;

            return false;
        }
    });

    $("#submit").on("click", submit);

    $("#upload").on("click", function() {
        console.log("upload button clicked");

        $("#fileinput").trigger('click');
    });

    $("#fileinput").change(function() {
        var file = $(this).prop("files")[0];

        var reader = new FileReader();
        reader.addEventListener('load', function() {
            var contents = reader.result;
            if ([...contents].some(char => char.charCodeAt(0) > 127)) {
                alert("Are you sure you uploaded the correct file?");
                return;
            }
            $("#code").val(reader.result);
        });
        reader.readAsText(file);
    });
});