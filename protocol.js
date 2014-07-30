var protocol = {
    '注册': {
        '请求': {
            id: '账号',
            pwd: '密码'
        },
        '响应': {
            result: 'true成功 false失败',
            msg: '信息'
        }
    },

    'getID' = {
        '请求': '随便字符串',
        res: {
            id: '时间戳'
        }
    },

    '登录' = {
        '请求': {
            id: '帐号',
            pwd: '密码'
        },
        res: {
            result: 'true成功 false失败',
            msg: '信息'
        }
    },

    '更新资源' = {
        '请求': {},
        res: {}
    },

    '进入网关' = {
        '请求': {
            id: '帐号'
        },
        res: {
            ip: 'ip地址',
            port: '端口'
        }
    },

    '进入连接服务器' = {
        '请求': {},
        res: {}
    },

    '创建角色' = {
        req: {},
        res: {}
    }
}