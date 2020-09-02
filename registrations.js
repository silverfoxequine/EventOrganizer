getEventData(function () {
    var registrations = $("#registrations");
    var registerLink = $("#registerLink");
    registerLink.html("registerone.html?eventId=" + param("eventId"));
    registerLink.attr("href", "registerone.html?eventId=" + param("eventId"));
    var data = [];
    getAllRegistrations(data).then(function () {
        data.sort((a, b) => a.index > b.index ? 1 : -1);
        window.data = data;
        for (var i in data) {
            try {
                var reg = data[i];
                var totalCost = 0;
                if (reg.registerTwo) {
                    for (var division of event.divisions) {
                        for (var clazz of division.classes) {
                            var regClass = reg.registerTwo.filter(c => c.name == division.name + clazz.name)[0]
                            if (regClass && regClass.value) {
                                totalCost += clazz.price;
                            }
                        }
                    }
                }
                divContainer = $(`<div class='list-group-item' onclick="toggleDetails(${i})">
                    <h4>${reg.registerOne[0].value} ${reg.registerOne[1].value} : $${totalCost}
                    <i class="fa fa-trash" style="float:right" onclick="del('${reg.url}')"></i>
                    </h4>
                    <div class="row" data-id="regrow${i}" style="display: none">
                    </div>
                </a>`).appendTo(registrations);
                var additionalContainer = $(`div[data-id='regrow${i}']`);
                var leftContainer = $("<div class='col-6'></div>").appendTo(additionalContainer);
                var rightContainer = $("<div class='col-6'></div>").appendTo(additionalContainer);
                for (var dataItem of reg.registerOne) {
                    leftContainer.append(`<div><strong>${dataItem.name}</strong>: ${dataItem.value}</div>`);
                }
                if (reg.registerTwo) {
                    for (var division of event.divisions) {
                        for (var clazz of division.classes) {
                            var regClass = reg.registerTwo.filter(c => c.name == division.name + clazz.name)[0]
                            if (regClass && regClass.value) {
                                var youtube = reg.registerTwo.filter(c => c.name == division.name + clazz.name + "youtube")[0];
                                rightContainer.append(`<div>${division.name} ${clazz.name}</div>`);
                                if (youtube) {
                                    rightContainer.append(`<div>${youtube.value}</div>`);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

});
function del(url) {

    getEventData(function () {
        var eventId = param("eventId");
        event.registrations.splice(event.registrations.indexOf(url), 1);
        updateJsonData(eventId, JSON.stringify(event), function (data) {
                location.reload();
        });
    });
    return false;
}
function toggleDetails(index) {
    var selectingText = getSelection().toString().length > 0;
    if (selectingText)
        return;
    var reg = data[index];
    $(`div[data-id='regrow${index}']`).toggle();
}
function getAllRegistrations(data) {
    var promises = [];
    var i = 0;
    for (var reg of event.registrations) {
        if (~reg.indexOf("5edf7b972454c200177a2715")) {
            continue;
        }
        promises.push(getReg(data, reg, i));
        i++;
    }
    return Promise.all(promises);
}
function getReg(data, reg, index) {
    return $.get(reg, function (json) {
        json.url = reg;
        json.index = index;
        data.push(json);
    })
}
