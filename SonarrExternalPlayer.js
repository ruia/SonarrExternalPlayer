// ==UserScript==
// @name         SonarrExternalPlayer
// @version      0.2
// @author       ruia
// @include     /^https?://.*:8989.*
// @include     http://*:8989*
// @include     https://*:8989l*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @connect     http://localhost:7251/
// @connect     localhost
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var OpenExternalPlayer = function(e) {
    var filename = e.data.filename
    var url = 'http://localhost:7251/?protocol=2&item=' + encodeURIComponent(filename);
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(state){
                if (state.status === 200) {
                    logMessage('Called sucessfully to ' + url);
                    resolve(state);
                }
            },
            onreadystatechange: function(state) {
                if (state.readyState === 4) {

                    if(state.status === 401)
                    {
                        logMessage('Not Authorised ' + url);
                        onError();
                    } else if (state.status !== 200) {
                        logMessage('Request returned ' + state.status);
                        showToast('Error calling: ' + url + '. Response: ' + state.responseText + ' Code:' + state.status + ' Message: ' + state.statusText, 1);
                    }
                }
            },
        });
    });
}

var logMessage = function(msg){
    console.log('[Plex External] ' + msg);
};

var bindClicks = function() {
    var hasBtn = false;
    var table = jQuery(".episode-file-info");
    var tableHeader = table.find("thead tr");
    var tableBody = table.find("tbody");

    if (tableHeader.children().first().text() == "Play") {
        hasBtn = true;
    }

    if(!hasBtn) {
        tableHeader.prepend("<th>Play</th>");

        tableBody.children('tr').each(function(i, e) {
            jQuery(e).prepend('<td><button><i class="icon-sonarr-active"><i></button></td>');
            jQuery(e).click({filename: e.children[1].innerText, }, OpenExternalPlayer);
        });
    }
};

setInterval(bindClicks, 100);
bindClicks();
