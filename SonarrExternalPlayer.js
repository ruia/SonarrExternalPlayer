// ==UserScript==
// @name         SonarrExternalPlayer
// @version      0.3
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
    var version = -1;

    if (version == -1) {
        version = parseFloat(jQuery(".version").text());
    }

    if (version == 2) {
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
    } else {
        var filesHeader = jQuery('[class^="EpisodeSummary/filesHeader/"]');
        var filesBody = jQuery('[class^="EpisodeSummary/fileRow/"]');

        if (filesHeader.children().first().text() == "Play") {
            hasBtn = true;
        }

        if(!hasBtn) {
            filesHeader.prepend('<div style="flex: 0 0 40px">Play</div>');
            filesBody.each(function(i, e) {
                jQuery(e).prepend('<div style="flex: 0 0 40px"><a style="color: inherit" href="#"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14 Icon/default/3C-KJ" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="font-size: 14px;"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></a></div>');
                jQuery(e).click({filename: e.children[1].innerText, }, OpenExternalPlayer);
            });
        }
    }
};

setInterval(bindClicks, 100);
bindClicks();