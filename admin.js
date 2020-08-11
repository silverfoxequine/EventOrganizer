var eventId = param("eventId");
getEventData(function (json) {
    window.data = json;
    $("#eventName").append(` ${json.date}<i class="fa fa-pencil" onclick="editName()"></i>`);
    var divisions = $('#divisions');
    for (var division of json.divisions) {
        var container = $(`<div class="list-group-item" data-id="${division.name}">${division.name} 
                <div style="float: right">
                    <i class="fa fa-pencil" onclick="editDivision('${division.name}')"></i>
                    <button class='btn btn-default' onclick='deleteDivision("${division.name}")'>x</button>
                </div>
        </div>`).appendTo(divisions);
        for (var clazz of division.classes) {
            container.append(`[${clazz.name}: $${clazz.price}] `);
        }
    }
    var youtubeCheck = $("#youtube");
    youtubeCheck[0].checked = data.youtube;
    youtubeCheck.click(function(){
        data.youtube = this.checked;
        updateData();
    })
}, eventId);
function editName() {
    $("#eventName").empty();
    $("#eventName").append(`
        <input id="newName" value="${data.name}" />
        <input id="newDate" value="${data.date}" />
    `)
    $('<button class="btn btn-primary">Save</button>')
        .click(function () {
            data.name = $('#newName').val();
            data.date = $('#newDate').val();
            updateData();
        })
        .appendTo($("#eventName"))
}
function newDivision() {
    var divList = $('#divisions');
    var newDiv = $('<div class=""></div>').appendTo(divList);
    newDiv.append("Name: <input class='form-control col-11' id='newName'/>");
    var classContainer = $(`<div style="margin-left: 50px" class="classes">Classes
        <input class='form-control classname' value='Class A'>
        <input class='form-control classprice' value='45'>
        <hr>
    </div>`).appendTo(newDiv);
    $("<button id='addClasses' class='btn btn-primary'>+</button>")
        .click(function () {
            $('#addClasses').before(`<input class='form-control classname' value=''>
            <input class='form-control classprice' value='45'>
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
            for (var i = 0; i < classInputs.length; i += 2) {
                var clazz = {
                    name: $(classInputs[i]).val(),
                    price: parseFloat($(classInputs[i + 1]).val())
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
    var division = data.divisions.filter(d => d.name == name)[0];
    data.divisions.splice(data.divisions.indexOf(division), 1);
    updateData();
}
function editDivision(name) {
    var division = data.divisions.filter(d => d.name == name)[0];
    var divisDiv = $(`div[data-id='${name}']`);
    divisDiv.empty();
    divisDiv.append(`Name: <input class='form-control col-11' id='newName' value="${name}"/>`);
    var classContainer = $(`<div style="margin-left: 50px" class="classes">Classes</div>`).appendTo(divisDiv);
    for (var clazz of division.classes) {
        classContainer.append(`<input class='form-control classname' value='${clazz.name}'>
            <input class='form-control classprice' value='${clazz.price}'>
            <hr>`);
    }

    $("<button id='addClasses' class='btn btn-primary'>+</button>")
        .click(function () {
            $('#addClasses').before(`<input class='form-control classname' value=''>
            <input class='form-control classprice' value='45'>
            <hr>`);
        })
        .appendTo(classContainer);
    $("<button id='saveDivis' class='btn btn-primary'>Save</button>")
        .click(function () {
            division.name = $("#newName").val();
            division.classes = [];
            var classInputs = $(".classes input");
            for (var i = 0; i < classInputs.length; i += 2) {
                var clazz = {
                    name: $(classInputs[i]).val(),
                    price: parseFloat($(classInputs[i + 1]).val())
                }
                division.classes.push(clazz);
            }
            updateData();
        })
        .appendTo(divisDiv);

}
window.updateData = function () {
    data.registrations = ["https://jsonbox.io/box_368e23ee382d9f98d0d0//5edf7b972454c200177a2715"];
    var val = JSON.stringify(data);
    var eventId = param("eventId");
    updateJsonData(eventId, val, function (data) {
        location.reload();
    });
}