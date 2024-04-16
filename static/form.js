// Get the current URL
const url = window.location.href;

$(document).ready(function() {
    console.log("Document is ready");
});

$("#upload").on("click", function() {
    alert("Upload button clicked");
});

$("#submit").on("click", function() {    
    // Get all form elements
    alert("Submit button clicked");
    var json = {};

    field = $("#code").serializeArray()[0];

    if (field.value.length != 0) {
        // Add the field to the JSON object
        json[field.name] = field.value;
    } else {
        // Alert the user and return if a field is empty
        alert("Cannot have empty field");
        return false;
    }

    console.log(json);

    // Send a POST request with the JSON data
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function(data) {
            // Handle the response here
        },
        error: function(error) {
            console.log(error)
        }
    });
});