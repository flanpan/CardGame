var httpPost = function(url, postStr, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
            return;
        if (xhr.responseText == "") {
            // 失败
            return;
        }
        if (cb)
            cb(xhr.responseText);
    };
    xhr.send(postStr);
}