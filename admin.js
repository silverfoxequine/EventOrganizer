var eventId = param("eventId");
$.get(`https://api.myjson.com/bins/${eventId}`, function (json) {
    window.data = json;
    $("#eventName").html(json.name);
    var divisions = $('#divisions');
    for (var division of json.divisions) {
        var container = $(`<div class="list-group-item">${division.name}
                <button class='btn btn-default' style='float:right' onclick='deleteDivision("${division.name}")'>x</button>
        </div>`).appendTo(divisions);
        for (var clazz of division.classes) {
            container.append(`[${clazz.name}: $${clazz.price}] `);
        }
    }
});
function newDivision() {
    var divList = $('#divisions');
    var newDiv = $('<div class=""></div>').appendTo(divList);
    newDiv.append("Name: <input class='form-control col-11' id='newName'/>");
    var classContainer = $(`<div style="margin-left: 50px" class="classes">Classes
        <input class='form-control classname' value='Class A'>
        <input class='form-control classprice' value='20'>
        <hr>
    </div>`).appendTo(newDiv);
    $("<button id='addClasses' class='btn btn-primary'>+</button>")
        .click(function(){
            $('#addClasses').before(`<input class='form-control classname' value='Class A'>
            <input class='form-control classprice' value='20'>
            <hr>`)
        })
        .appendTo(classContainer);
    $("<button class='btn btn-primary col-2'>Save</button>")
        .click(function () {
            var division = {
                name: $('#newName').val(),
                classes: []
            };
            var classInputs = $(".classes input");
            for (var i=0;i<classInputs.length;i+=2) {
                var clazz = {
                    name: $(classInputs[i]).val(),
                    price: parseFloat($(classInputs[i+1]).val())
                }
                division.classes.push(clazz);
            }
            data.divisions.push(division);
            $("#newDivisionButton").show();
            updateData();
        })
        .appendTo(newDiv);
    $("#newDivisionButton").hide();
}
function deleteDivision(name) {
    var division = data.divisions.filter(d=>d.name==name)[0];
    data.divisions.splice(data.divisions.indexOf(division), 1);
    updateData();
}
window.updateData = function() {
    var val = JSON.stringify(data);
    var eventId = param("eventId");
    $.ajax({
        url:`https://api.myjson.com/bins/${eventId}`,
        type:"PUT",
        data: val,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            location.reload();
        }
    });   
}