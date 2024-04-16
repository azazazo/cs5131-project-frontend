// Get the current URL
const url = window.location.href;

$("#upload").on("click", function() {
    $('#file-input').trigger('click');
});

$('#file-input').onchange = e => { 
    console.log("Hon")
   var file = e.target.files[0]; 

   var reader = new FileReader();
   reader.readAsDataURL(file); 

   reader.onload = readerEvent => {
      var content = readerEvent.target.result; 
      $("#code").val(content);
   }
}

$("#submit").on("click", function() {    
    // Get all form elements
    var json = {};

    field = $("#code").serializeArray()[0];

    if (field.value.length == 0) {
        alert("Cannot have empty field");
        return false;
    }

    json['code'] = field.value;

    console.log(json);

    // Send a POST request with the JSON data
    $.ajax({
        url: '/detect',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function(data) {
            window.location.href = '/results'
            // Handle the response here
        },
        error: function(error) {
            console.log(error)
        }
    });

});
