// from: http://stackoverflow.com/a/5303242/945521
if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
        var bytes = Array.prototype.map.call(string, function (c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
};



window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {

    canvasApp();
}

function drawImageProp(context, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = 1280;
        h = 720;
    }

    /// default offset is center
    offsetX = offsetX ? offsetX : 0.5;
    offsetY = offsetY ? offsetY : 0.5;

    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   /// new prop. width
        nh = ih * r,   /// new prop. height
        cx, cy, cw, ch, ar = 1;

    /// decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    /// make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    /// fill image in dest. rectangle
    context.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

function canvasApp() {

    var message = "İŞTE O GÜNDEM";
    var tickermessage = "Altatıcı Başlıktan Sıkıldınız mı? |  NAYN.CO kandırmayan haber kaynağınızdır.";
    var img = new Image();
    var logo = new Image();
    logo.src = 'nayn.png';

    var theCanvas = document.getElementById("canvasOne");
    var context = theCanvas.getContext("2d");

    var formElement = document.getElementById("textBox");
    formElement.addEventListener("keyup", textBoxChanged, false);

    var formElement2 = document.getElementById("tickerBox");
    formElement2.addEventListener("keyup", textBox2Changed, false);

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);



    drawScreen();

    function drawScreen() {

        //Background
        context.fillStyle = "#222222";
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);


        //Image
        if (img.src) {
            drawImageProp(context, img);
        }

        context.fillStyle = "#ffffff";
        context.fillRect(840, 50, 1100, 50);

        //Live
        context.fillStyle = "rgba(194, 21, 15, 1.000)";
        context.fillRect(80, 40, 150, 60);

        context.font = "700 36px Signika";
        context.fillStyle = "#FFFFFF";
        context.fillText('CANLI', 96, 84);

        //Box
        context.fillStyle = "rgba(255,255,255,0.85)";
        context.fillRect(0, 510, 1200, 110);

        //Clock

        context.fillStyle = "#000";
        context.fillRect(80, 620, 100, 60);

        today = new Date();
        var m = today.getMinutes();
        var h = today.getHours();

        if (m < 10) {
            m = "0" + m
        };

        context.font = "700 28px Signika";
        context.fillStyle = "#FFFFFF";
        context.fillText((h + ":" + m), 96, 660);

        //Breaking News Strap
        // Create gradient
        redgrd = context.createLinearGradient(0, 430, 0, 510);

        // Add colors
        redgrd.addColorStop(0.000, 'rgba(109, 36, 39, 1.000)');
        redgrd.addColorStop(0.015, 'rgba(224, 54, 44, 1.000)');
        redgrd.addColorStop(0.455, 'rgba(194, 21, 15, 1.000)');
        redgrd.addColorStop(0.488, 'rgba(165, 10, 1, 1.000)');
        redgrd.addColorStop(1.000, 'rgba(109, 36, 39, 1.000)');

        context.fillStyle = redgrd;
        context.fillRect(80, 430, 350, 80);

        context.font = "700 48px Signika";
        context.fillStyle = "#FFFFFF";
        context.fillText('SON DAKİKA', 100, 488);

        //Text
        context.font = "700 72px Signika";
        context.fillStyle = "#000000";
        context.fillText(message, 100, 590);

        //Ticker
        context.fillStyle = "#feeb1a";
        context.fillRect(180, 620, 1100, 60);

        context.font = "700 28px Signika";
        context.fillStyle = "#000";
        context.fillText(tickermessage, 200, 660);

        context.font = "700 18px Signika";
        context.fillText("NAYN.CO'da bu haber gibi sizi aldatan haber olmaz.", 860, 80);
        
    
        context.globalAlpha = 1;
        context.shadowBlur = 0;



    }

    function textBoxChanged(e) {
        var target = e.target;
        message = target.value;
        drawScreen();
    }


    function textBox2Changed(e) {
        var target = e.target;
        tickermessage = target.value;
        drawScreen();
    }

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            img.onload = function () {
                drawScreen();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);


    }


    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }


}