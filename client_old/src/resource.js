var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    aaa:"Resources/logo.json",
    ccc:"Resources/CloseNormal.png"
};

var g_resources = [
    'Resources/ui.msgTest.json',
    'Resources/msgTests.json',
    'Resources/GUI/button.png'
];
for (var i in res) {
    g_resources.push(res[i]);
}