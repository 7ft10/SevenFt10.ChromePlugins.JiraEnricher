'use strict'

document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll("button.tablinks");
    if (tabs.length > 0) {
        tabs.forEach(function(tabButton) {
            tabButton.addEventListener('click', function(evt) {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }
                tablinks = document.getElementsByClassName("tablinks");
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }
                document.getElementById(evt.currentTarget.dataset.tabid).style.display = "block";
                evt.currentTarget.className += " active";
            }, false);
        });
        tabs[0].click();
    }
});