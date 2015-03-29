//13331227 suyongjian

//window onload
window.onload = function() {
    var info_bar = document.getElementById('info-bar');
    var buttons = document.getElementsByClassName('button');
    document.getElementById("apb").onclick = order;
    xmlhttp = new XMLHttpRequest();
    getRandomNumbers(buttons, info_bar);
}


//get random number one by one when click at_plus icon
function order() {
    resetCalculator();
    var buttons = document.getElementsByClassName('button');
    var apb = document.getElementById("apb");
    getRandomNumber(buttons, buttons[0], function() {
        getRandomNumber(buttons, buttons[1], function() {
            getRandomNumber(buttons, buttons[2], function() {
                getRandomNumber(buttons, buttons[3], function() {
                    getRandomNumber(buttons, buttons[4], function() {
                        Sum();
                    });
                });
            });
        });
    });
}

//get random number for a button
function getRandomNumber(buttons, button, func) {
    button.childNodes[1].classList.add('opacity');
    button.childNodes[1].innerHTML = "...";
    disableOtherButtons(buttons, button);
    getRNumFromServer(function(rNum) {
        button.childNodes[1].innerHTML = rNum;
        button.classList.add('grey');
        button.disabled = 1;
        enableOtherButtons(buttons, button);
        isInfo_barActive(buttons);
        if (typeof func === "function") {
            func();
        }
    })
}

//get random number for each button
function getRandomNumbers(buttons, info_bar) {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(i) {
            return function() {
                this.childNodes[1].classList.add('opacity');
                this.childNodes[1].innerHTML = '...';
                disableOtherButtons(buttons, buttons[i]);
                getRNumFromServer(function(rNum) {
                    buttons[i].childNodes[1].innerHTML = rNum;
                    buttons[i].classList.add('grey');
                    buttons[i].disabled = 1;
                    enableOtherButtons(buttons, buttons[i]);
                    isInfo_barActive(buttons);
                });
            }
        }(i)
    }
}

//get random number from server.js
function getRNumFromServer(func) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (typeof func === 'function') {
                func(xmlhttp.responseText);
            }
        }
    }
    xmlhttp.open('get', '../server', true);
    xmlhttp.send();
}

//let other buttons able to click if they have not got a number
function enableOtherButtons(buttons, disable_button) {
    for (var i = 0; i < buttons.length; i++) {
        if (disable_button != buttons[i] && !(buttons[i].childNodes[1].classList.contains('opacity'))) {
            buttons[i].classList.remove('grey');
            buttons[i].disabled = 0;
        }
    }
}

//let other buttons unable to click when wating for a number returning
function disableOtherButtons(buttons, able_button) {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] != able_button ) {
            buttons[i].disabled = 1;
            buttons[i].classList.add('grey');
        }
    }
}

//if all buttons have got random numbers, let the info_bar able to click and caculator
function isInfo_barActive(buttons) {
    var flag = true;
    var info_bar = document.getElementById('info-bar');
    for (var i = 0; i < buttons.length; i++) {
        if (!buttons[i].childNodes[1].classList.contains('opacity')) {
            flag = false;
        }
    }
    if(flag == true) {
        info_bar.disabled = 0;
        info_bar.classList.remove('grey');
        info_bar.onclick = Sum;
    }
}

//add all numbers in the buttons and return the sum
function Sum() {
    var sum = 0;
    var info_bar = document.getElementById('info-bar');
    var buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; i++) {
        sum += parseInt(buttons[i].childNodes[1].innerHTML);
    }
    info_bar.innerHTML = sum;
    info_bar.disabled = 1;
    info_bar.classList.add('grey');
    document.getElementById("button").onmouseout = resetCalculator;
}

//remove all numbers and reset background color
function resetCalculator() {
    xmlhttp.abort();
    var apb = document.getElementById("apb");
    var info_bar = document.getElementById('info-bar');
    info_bar.innerHTML = '';
    info_bar.disabled = 1;
    info_bar.classList.toggle('grey', true);
    apb.disabled = 0;
    var buttons = document.getElementsByClassName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('grey', false);
        buttons[i].childNodes[1].classList.toggle('opacity', false);
        buttons[i].disabled = 0;
    }
}
