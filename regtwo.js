getEventData(function () {
    var divisions = $('#divisions');
    for (var division of event.divisions) {
        var price = "$" + division.price;
        var divContainer = $(`<div class="list-group-item row" style="display:flex"></div>`).appendTo(divisions);
        divContainer.append(`<h4 class='col-4'>${division.name}</h4>`);
        var classContainer = $("<div class='col-8'></div>").appendTo(divContainer);
        for (var clazz of division.classes) {
            var inputCont = $(`<div class="form-check">
                    <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" name="${division.name}${clazz.name}">
                    ${clazz.name} : $${clazz.price}</label>
                </div>`).appendTo(classContainer);
            if (event.youtube){
                inputCont.find("input").click(makeCheckClickFunction(division, clazz))
            }
        }
    }

    var eventId = param("eventId");
    var regData = localStorage.getItem("registerTwo" + eventId);
    if (regData) {
        var regDataJson = JSON.parse(regData);
        for (var item of regDataJson) {
            var input = $(`input[name="${item.name}"]`);
            if (input.attr("type") == "checkbox") {
                input[0].checked = item.value;
                if (item.value && event.youtube) {
                    var youtubeData = regDataJson.filter(d => d.name == item.name + "youtube")[0];
                    if (youtubeData) {
                        input.parent().append(`<div data-id="${item.name}youtube">
                        YouTube Link: 
                        <input type='text' name="${youtubeData.name}" value="${youtubeData.value}" />
                        </div>`);
                    }
                }
            } else {
                $(`input[name="${item.name}"]`).val(item.value);
            }
        }
    }
})
function makeCheckClickFunction(division, clazz) {
    return function () {
        var me = $(this);
        if (me[0].checked) {
            me.parent().append(`<div data-id="${division.name}${clazz.name}youtube">
                YouTube Link: <input type='text' name="${division.name}${clazz.name}youtube" />
                </div>`)
        } else {
            me.parent().find(`div[data-id='${division.name}${clazz.name}youtube']`).remove();
        }
    }
}
function submitTwo() {
    var saveData = [];
    $('input').each(function () {
        var input = $(this),
            value = input.val();
        if (input.attr("type") == "checkbox") {
            value = input.is(":checked");
        }
        saveData.push({
            name: input.attr("name"),
            value: value
        });
    })
    var eventId = param("eventId");
    var regId = localStorage.getItem("regId" + eventId);
    if (!regId) {
        alert("Couldn't find info from step one, redirecting to step one");
        location.href = "registerone.html?eventId=" + eventId;
    } else {
        updateInfo(regId, saveData);
    }
}
function updateInfo(regId, saveData) {
    var eventId = param("eventId");
    getRegData(regId, function (regJson) {
        regJson.registerTwo = saveData;
        var data = JSON.stringify(saveData);
        localStorage.removeItem('registerOne' + eventId);
        localStorage.removeItem('registerTwo' + eventId);
        localStorage.removeItem("regId" + eventId)
        localStorage.setItem("successReg" + eventId, regId);
        $.ajax({
            url: regId,
            type: "PUT",
            data: JSON.stringify(regJson),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                location.href = `registerthree.html?eventId=${eventId}`;
            }
        });
    });
}