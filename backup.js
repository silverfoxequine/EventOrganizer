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
                registrations.append(JSON.stringify(reg));
                
            } catch (e) {
                console.log(e);
            }
        }
    });

});
function downloadInnerHtml(elId) {
    var elHtml = document.getElementById(elId).innerHTML;
    var link = document.createElement('a');
    var mimeType = 'text/plain';

    link.setAttribute('download', "backup"+param("eventId")+".txt");
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}

function getAllRegistrations(data) {
    var promises = [];
    var i = 0;
    for (var reg of event.registrations) {
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
