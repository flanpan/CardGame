/**
 * @author lwj Admin Console
 */
var centerPanel = '';
httpPost("http://" + location.host + '/getJson', 'jsonPath=./design/main.json', function(data) {
    var config = JSON.parse(data);
    Ext.onReady(function() {
        Ext.BLANK_IMAGE_URL = '../ext-4.0.7-gpl/resources/themes/images/default/tree/s.gif';
        var treeStore = Ext.create('Ext.data.TreeStore', {
            root: config['菜单管理']
        });

        // admin consle menu----------------------------------------------------
        var westpanel = Ext.create('Ext.tree.Panel', {
            title: '菜单',
            region: 'west',
            width: 150,
            store: treeStore,
            enableDD: true,
            rootVisible: false,
            split: true,
            listeners: {
                'itemclick': function(view, re) {
                    var title = re.data.text;
                    var id = re.data.id;
                    var leaf = re.data.leaf;
                    if (!leaf) {
                        return;
                    }
                    if (id === 'profiler') {
                        var url = '/front/inspector.html?host=' + window.location.hostname + ':2337&page=0';
                    } /*else if (id.search('jsoneditor_') !== -1) {
                        var url = '/module/jsoneditor.html?json=' + id.substr('jsoneditor_'.length)
                    } */else {
                        var url = '/module/' + id + '.html';
                    }
                    var jsonPath = re.raw.jsonPath;
                    if(jsonPath) {
                        var url = '/module/jsoneditor.html?jsonPath='+jsonPath;
                        if(re.raw.isBearcat) {
                            url += '&isBearcat=true';
                        }
                    }
                    addIframe(title, url, id);

                }
            }
        });

        // center Panel----------------------------------------------------
        centerPanel = new Ext.create('Ext.tab.Panel', {
            region: 'center',
            deferredRender: false,
            border: false,
            activeTab: 0
        });
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [{
                    region: 'north',
                    height: 40,
                    html: '<body><div style="position:relative;height:40px;line-height:40px;font-size:24px;color:#fff;background:#f8851f url(/ext-4.0.7-gpl/resources/themes/images/custom/icon.png) no-repeat 0 0;border-bottom:1px solid #c66a19;zoom:1;padding-left:48px;">后台管理</div></body>'
                },
                westpanel, centerPanel
            ]
        });

    });


});

/**
 * auto addPanel
 */

function addIframe(title, url, id) {
    tabPanel = centerPanel;

    if (tabPanel.getComponent(id) != null) {
        var arr = url.split('?');
        if (arr.length >= 2) {
            tabPanel.remove(tabPanel.getComponent(id));

            var iframe = Ext.DomHelper.append(document.body, {
                tag: 'iframe',
                frameBorder: 0,
                src: url,
                width: '100%',
                height: '100%'
            });

            var tab = new Ext.Panel({
                id: id,
                title: title,
                titleCollapse: true,
                iconCls: id,
                tabTip: title,
                closable: true,
                autoScroll: true,
                border: true,
                fitToFrame: true,
                contentEl: iframe
            });

            tabPanel.add(tab);
            tabPanel.setActiveTab(tab);
            return (tab);
        }
        tabPanel.setActiveTab(tabPanel.getComponent(id));
        return;
    }

    var iframe = Ext.DomHelper.append(document.body, {
        tag: 'iframe',
        frameBorder: 0,
        src: url,
        width: '100%',
        height: '100%'
    });

    var tab = new Ext.Panel({
        id: id,
        title: title,
        titleCollapse: true,
        iconCls: id,
        tabTip: title,
        closable: true,
        autoScroll: true,
        border: true,
        fitToFrame: true,
        contentEl: iframe
    });
    tabPanel.add(tab);
    tabPanel.setActiveTab(tab);
    return (tab);
};