// ==UserScript==
// @name         SonarrExternalPlayer
// @version      0.1
// @author       ruia
// @include     /^https?://.*:8989.*
// @include     http://*:8989*
// @include     https://*:8989l*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==
var AbreExterno = function(e) {
    //alert('teste');
    var ficheiro = jQuery(".EpisodeSummary-fileRow-3brC7").children().first().text();
    var url = 'http://localhost:7251/?protocol=2&item=' + encodeURIComponent(ficheiro);
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

var bindClicks = function() {
    var hasBtn = false;
    var toolBar= jQuery(".ModalFooter-modalFooter-3izCM");
    toolBar.children('a').each(function(i, e) {
        if(jQuery(e).hasClass('EpisodeDetailsModalContent-openSeriesButton-3PQ7c Button-button-3GUER Link-link-VNquX Button-default-1X0nf Button-medium-1tLpg Link-link-VNquX Link-to-1jNxQ externo'))
            hasBtn = true;
    });

    if(!hasBtn)
    {
        var template = jQuery('<a class="EpisodeDetailsModalContent-openSeriesButton-3PQ7c Button-button-3GUER Link-link-VNquX Button-default-1X0nf Button-medium-1tLpg Link-link-VNquX Link-to-1jNxQ externo" href="#">Abrir Extertno</a>');
        toolBar.prepend(template);
        template.click(AbreExterno);
    }
};

setInterval(bindClicks, 100);
bindClicks();