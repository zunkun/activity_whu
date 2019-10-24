define({ "api": [
  {
    "type": "get",
    "url": "/api/participate/myenroll?activityId=",
    "title": "我的报名",
    "name": "participate_enroll_myenroll",
    "group": "活动参与",
    "description": "<p>我的报名，查看当前活动中我的报名</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>报名列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Array[]",
            "optional": false,
            "field": "data.useritems",
            "description": "<p>报名列表，即家属信息列表，此字段为二维数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.useritems.sequence",
            "description": "<p>填写项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.useritems.id",
            "description": "<p>填写项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.title",
            "description": "<p>填写项名称</p>"
          },
          {
            "group": "Success 200",
            "type": "type",
            "optional": false,
            "field": "data.useritems.type",
            "description": "<p>填写方式 1-文本 2-选择</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.useritems.options",
            "description": "<p>选项数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.useritems.mustfill",
            "description": "<p>是否必填</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.text",
            "description": "<p>文本填写内容</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.checked",
            "description": "<p>选项为选择是选择内容</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功信息示例",
          "content": "{\n  activityId: 1000, // 活动ID\n\tuseritems: [\n\t\t[ // 填写的第一个人 index=0\n      {sequence: 1, id: 1, title: '姓名', type: 1, mustfill:true, text: '张三'},\n      {sequence: 2, id: 3, title: '电话', type: 1, mustfill: false, text: '15618871296'}, // 电话\n    ],\n    [ // 填写的第二个人 index=1\n      {sequence: 1, id: 1, title: '姓名', type: 1, mustfill:true, text: '李四'},\n      {sequence: 2, id: 3, title: '性别', type: 2, options: [\"男\", \"女\"] mustfill:false, checked: \"男\"}, // 电话，非必填\n    ]\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "post",
    "url": "/api/participate/enroll",
    "title": "报名",
    "name": "participate_enroll_post",
    "group": "活动参与",
    "description": "<p>报名，由於不知如何写api文档，具体格式请查看示例</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Array[]",
            "optional": false,
            "field": "useritems",
            "description": "<p>报名填写数组</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "useritems.index",
            "description": "<p>此处为数组中嵌套数组，index为数组的index，index=0表示第一个人 index=2表示第二个人 请查看请求示例</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "useritems.index.id",
            "description": "<p>报名表单填写项ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "useritems.index.text",
            "description": "<p>文本填写项内容，当报名填写项是必填时，必填，如需要填写姓名是，此处填写 “张三”</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "useritems.index.checked",
            "description": "<p>选项选择的项名称，如选项有 [&quot;男&quot;, &quot;女&quot;] 则此处 填写 &quot;男&quot;</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求body示例",
          "content": "{\n  activityId: 1000, // 活动ID\n  useritems:  [ // 填写的第一个人 index=0\n      {id: 1, text: '张三'},\n      {id: 3, text: '15618871296'}, // 电话\n    ],\n    [ // 填写的第二个人 index=1\n      {id: 1, text: '李四'},\n      {id: 3, checked: \"男\"}, // 电话，非必填\n    ]\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "get",
    "url": "/api/participate/enrollforms?activityId=",
    "title": "报名表单",
    "name": "participate_enrollforms",
    "group": "活动参与",
    "description": "<p>获取报名表单</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>自定义报名表单项列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>报名表单填写项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.sequence",
            "description": "<p>报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.title",
            "description": "<p>标题，比如姓名、手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.type",
            "description": "<p>类型 1-单行文本 2-选择</p>"
          },
          {
            "group": "Success 200",
            "type": "Bool",
            "optional": false,
            "field": "data.mustfill",
            "description": "<p>是否必填，true必填 false 选填</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.options",
            "description": "<p>自定义表单条目选项，例如 [&quot;男&quot;, &quot;女&quot;]</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "get",
    "url": "/api/participate/myactivities?limit=&page=&status=&type=",
    "title": "我的活动列表",
    "name": "participate_myactivities",
    "group": "活动参与",
    "description": "<p>我的活动列表，移动端 我的活动列表，即报名的活动列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>活动类型 1-常规活动 2-专项活动，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>总共活动条数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.id",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>活动标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.type",
            "description": "<p>活动类型 1-常规活动 2-专项活动</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.images",
            "description": "<p>活动图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollEndTime",
            "description": "<p>报名截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.personNum",
            "description": "<p>可参与人数</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.descImages",
            "description": "<p>活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.descText",
            "description": "<p>活动详情文字</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.address",
            "description": "<p>活动地址</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.singed",
            "description": "<p>是否需要签到 true 需要签到 false 不需要签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.signType",
            "description": "<p>签到方式 1-扫码签到 2-位置签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.distance",
            "description": "<p>位置签到距离，单位m 当signType=2位置签到时有此值</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactMobile",
            "description": "<p>联系人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactName",
            "description": "<p>联系人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.top",
            "description": "<p>是否置顶 true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.role",
            "description": "<p>发起人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserId",
            "description": "<p>审核人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserName",
            "description": "<p>审核人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerMobile",
            "description": "<p>审核人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerRole",
            "description": "<p>审核人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewStatus",
            "description": "<p>审核状态 0-审核中 1-审核通过 2-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.rejectReason",
            "description": "<p>驳回拒绝原因</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "get",
    "url": "/api/participate/persons?activityId=",
    "title": "已报名校友人员列表",
    "name": "participate_persons",
    "group": "活动参与",
    "description": "<p>移动端查看活动详情里，当前活动已报名校友人员列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>报名人员表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>钉钉userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.mobile",
            "description": "<p>电话</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.avatar",
            "description": "<p>钉钉图像</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "get",
    "url": "/api/participate/enrollpersons?activityId=&limit=&page=&keywords=",
    "title": "已报名校友人员列表",
    "name": "participate_persons",
    "group": "活动参与",
    "description": "<p>移动端查看活动详情里，当前活动已报名校友人员列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>报名人员表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>总跳数目</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>报名人员表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>钉钉userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userNmae",
            "description": "<p>姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.mobile",
            "description": "<p>电话</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.idcard",
            "description": "<p>身份证id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.enrollTime",
            "description": "<p>报名时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.signed",
            "description": "<p>是否签到</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.signTime",
            "description": "<p>签到时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.signType",
            "description": "<p>签到方式 1-扫码 2-位置</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.hasfamilies",
            "description": "<p>是否有家属</p>"
          },
          {
            "group": "Success 200",
            "type": "Array[]",
            "optional": false,
            "field": "data.useritems",
            "description": "<p>家属信息列表，此字段为二维数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.useritems.sequence",
            "description": "<p>填写项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.useritems.id",
            "description": "<p>填写项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.title",
            "description": "<p>填写项名称</p>"
          },
          {
            "group": "Success 200",
            "type": "type",
            "optional": false,
            "field": "data.useritems.type",
            "description": "<p>填写方式 1-文本 2-选择</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.useritems.options",
            "description": "<p>选项数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.useritems.mustfill",
            "description": "<p>是否必填</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.text",
            "description": "<p>文本填写内容</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.useritems.checked",
            "description": "<p>选项为选择是选择内容</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "post",
    "url": "/api/participate/sign",
    "title": "签到",
    "name": "participate_sign",
    "group": "活动参与",
    "description": "<p>签到</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "position",
            "description": "<p>位置, 位置签到必填</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "distance",
            "description": "<p>签到距离，位置签到必填</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/participate.js",
    "groupTitle": "活动参与"
  },
  {
    "type": "post",
    "url": "/api/activities/cancel",
    "title": "撤销活动",
    "name": "activities_cancel",
    "group": "活动管理",
    "description": "<p>撤销活动</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reviewStatus",
            "description": "<p>审核结果 1-审核通过 2-拒绝</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "post",
    "url": "/api/activities",
    "title": "创建活动",
    "name": "activities_create",
    "group": "活动管理",
    "description": "<p>创建活动</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>活动标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>活动类型 1-常规活动 2-专项活动</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "images",
            "description": "<p>活动图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "enrollEndTime",
            "description": "<p>报名截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "personNum",
            "description": "<p>可参与人数</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "descImages",
            "description": "<p>活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "descText",
            "description": "<p>活动详情文字</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "enrollforms",
            "description": "<p>报名自定义表单</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enrollforms.sequence",
            "description": "<p>报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "enrollforms.title",
            "description": "<p>标题，比如姓名、手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enrollforms.type",
            "description": "<p>类型 1-单行文本 2-选择</p>"
          },
          {
            "group": "Parameter",
            "type": "Bool",
            "optional": true,
            "field": "enrollforms.mustfill",
            "description": "<p>是否必填，true必填 false 选填,默认false</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "enrollforms.options",
            "description": "<p>自定义表单条目选项</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enrollforms.options.sequence",
            "description": "<p>选项条目序号，比如1,2,3</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "enrollforms.options.title",
            "description": "<p>选项标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>活动地址</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "singed",
            "description": "<p>是否需要签到 true 需要签到 false 不需要签到，默认 false 不需要签到</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "signType",
            "description": "<p>签到方式 1-扫码签到 2-位置签到，当signed = true 时需要填写当前值</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "distance",
            "description": "<p>位置签到距离，单位m 当signType=2位置签到时需要填写当前值</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactMobile",
            "description": "<p>联系人手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contactName",
            "description": "<p>联系人姓名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求body示例",
          "content": "{\n title: '上海一日游',\n type: 1, // 常规活动\n images: ['a.jpg', 'b.png', 'c.jpg'],\n startTime: '2019-10-23 08:00:00',\n startTime: '2019-10-23 18:00:00',\n enrollStartTime: '2019-10-01 08:00:00',\n enrollEndTime: '2019-10-20 18:00:00',\n personNum: 100,\n descText: '游览上海著名景点',\n descImages: ['d.jpg', 'e.png', 'f.jpg'],\n deptIds: [1,2,3],\n specialUserIds: ['userId1', 'userId2', 'userId3'],\n address: '上海市三门路复旦软件园',\n singed: true,\n signType: 2, // 签到方式 1-扫码签到 2-位置签到\n distance: 100, // signType = 2 时填写\n contactMobile: '156xxx',\n contactName: '刘遵坤',\n enrollforms: [{\n   sequence: 1,\n   title: '姓名',\n   type: 1,\n   mustfill: true,\n  }, {\n   sequence: 2,\n   title: '性别',\n   type: 2,\n   mustfill: false,\n   options: [\"男\", \"女\"]\n }]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "get",
    "url": "/api/activities/:id",
    "title": "活动详情",
    "name": "activities_detail",
    "group": "活动管理",
    "description": "<p>获取活动详情</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.title",
            "description": "<p>活动标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.type",
            "description": "<p>活动类型 1-常规活动 2-专项活动</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.images",
            "description": "<p>活动图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.enrollEndTime",
            "description": "<p>报名截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.personNum",
            "description": "<p>可参与人数</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.descImages",
            "description": "<p>活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.descText",
            "description": "<p>活动详情文字</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.enrollforms",
            "description": "<p>自定义报名表单项列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.enrollforms.id",
            "description": "<p>报名项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.enrollforms.sequence",
            "description": "<p>报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.enrollforms.title",
            "description": "<p>标题，比如姓名、手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.enrollforms.type",
            "description": "<p>类型 1-单行文本 2-选择</p>"
          },
          {
            "group": "Success 200",
            "type": "Bool",
            "optional": false,
            "field": "data.enrollforms.mustfill",
            "description": "<p>是否必填，true必填 false 选填</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.enrollforms.options",
            "description": "<p>自定义表单条目选项,比如 [&quot;男&quot;, &quot;女&quot;]</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.address",
            "description": "<p>活动地址</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.singed",
            "description": "<p>是否需要签到 true 需要签到 false 不需要签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.signType",
            "description": "<p>签到方式 1-扫码签到 2-位置签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.distance",
            "description": "<p>位置签到距离，单位m 当signType=2位置签到时有此值</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.contactMobile",
            "description": "<p>联系人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.contactName",
            "description": "<p>联系人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.top",
            "description": "<p>是否置顶 true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>发起人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.mobile",
            "description": "<p>发起人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>发起人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reviewerUserId",
            "description": "<p>审核人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reviewerUserName",
            "description": "<p>审核人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reviewerMobile",
            "description": "<p>审核人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reviewerRole",
            "description": "<p>审核人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.reviewStatus",
            "description": "<p>审核状态 0-审核中 1-审核通过 2-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rejectReason",
            "description": "<p>驳回拒绝原因</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.cancel",
            "description": "<p>是否撤销 true-撤销</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "get",
    "url": "/api/activities?limit=&page=&keywords=&status=&type=",
    "title": "活动列表",
    "name": "activities_lists",
    "group": "活动管理",
    "description": "<p>活动列表，目前是PC端管理活动列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "keywords",
            "description": "<p>关键字</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "description": "<p>活动状态，0/null-全部 10-待审核 20-审核通过  21-预热中 22-报名中 23-进行中 24-已结束 30-驳回拒绝， 默认为0 表示查询全部状态</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>活动类型 1-常规活动 2-专项活动，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>总共活动条数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.id",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>活动标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.type",
            "description": "<p>活动类型 1-常规活动 2-专项活动</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.images",
            "description": "<p>活动图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollEndTime",
            "description": "<p>报名截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.personNum",
            "description": "<p>可参与人数</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.descImages",
            "description": "<p>活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.descText",
            "description": "<p>活动详情文字</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.address",
            "description": "<p>活动地址</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.singed",
            "description": "<p>是否需要签到 true 需要签到 false 不需要签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.signType",
            "description": "<p>签到方式 1-扫码签到 2-位置签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.distance",
            "description": "<p>位置签到距离，单位m 当signType=2位置签到时有此值</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactMobile",
            "description": "<p>联系人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactName",
            "description": "<p>联系人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.top",
            "description": "<p>是否置顶 true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.role",
            "description": "<p>发起人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserId",
            "description": "<p>审核人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserName",
            "description": "<p>审核人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerMobile",
            "description": "<p>审核人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerRole",
            "description": "<p>审核人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewStatus",
            "description": "<p>审核状态 0-审核中 1-审核通过 2-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.rejectReason",
            "description": "<p>驳回拒绝原因</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "get",
    "url": "/api/activities/lists?limit=&page=&status=&type=",
    "title": "我可以参与的活动列表",
    "name": "activities_lists",
    "group": "活动管理",
    "description": "<p>活动列表，目前是PC端管理活动列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "description": "<p>活动状态， 21-预热中 22-报名中 23-进行中 24-已结束 默认为0 表示查询全部状态</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>活动类型 1-常规活动 2-专项活动，默认为1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>总共活动条数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页活动列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.id",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>活动标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.type",
            "description": "<p>活动类型 1-常规活动 2-专项活动</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.images",
            "description": "<p>活动图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.enrollEndTime",
            "description": "<p>报名截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.personNum",
            "description": "<p>可参与人数</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "data.rows.descImages",
            "description": "<p>活动详情图片名称表，比如 [a.jpg,b.png,c.jpg]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.descText",
            "description": "<p>活动详情文字</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.address",
            "description": "<p>活动地址</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.singed",
            "description": "<p>是否需要签到 true 需要签到 false 不需要签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.signType",
            "description": "<p>签到方式 1-扫码签到 2-位置签到</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.distance",
            "description": "<p>位置签到距离，单位m 当signType=2位置签到时有此值</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactMobile",
            "description": "<p>联系人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.contactName",
            "description": "<p>联系人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.top",
            "description": "<p>是否置顶 true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.role",
            "description": "<p>发起人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserId",
            "description": "<p>审核人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerUserName",
            "description": "<p>审核人userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerMobile",
            "description": "<p>审核人手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewerRole",
            "description": "<p>审核人身份</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.reviewStatus",
            "description": "<p>审核状态 0-审核中 1-审核通过 2-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.rejectReason",
            "description": "<p>驳回拒绝原因</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "post",
    "url": "/api/activities/updateforms",
    "title": "修改报名表单",
    "name": "activities_modify_enrollforms",
    "group": "活动管理",
    "description": "<p>修改报名表单</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "enrollforms",
            "description": "<p>报名自定义表单</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enrollforms.sequence",
            "description": "<p>报名填写项目排序, 1,2,3，例如报名需要填写 姓名和手机号 则姓名项为1 手机号为2 则姓名手机号按照sequence排列</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "enrollforms.title",
            "description": "<p>标题，比如姓名、手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enrollforms.type",
            "description": "<p>类型 1-单行文本 2-选择</p>"
          },
          {
            "group": "Parameter",
            "type": "Bool",
            "optional": true,
            "field": "enrollforms.mustfill",
            "description": "<p>是否必填，true必填 false 选填,默认false</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "enrollforms.options",
            "description": "<p>自定义表单条目选项,比如 [&quot;男&quot;, &quot;女&quot;]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "post",
    "url": "/api/activities/review",
    "title": "审核活动",
    "name": "activities_review",
    "group": "活动管理",
    "description": "<p>审核活动</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reviewStatus",
            "description": "<p>状态 1-审核通过 2-拒绝 3-撤销活动</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "activityId",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "rejectReason",
            "description": "<p>驳回拒绝原因</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>活动信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>活动ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "post",
    "url": "/api/activities/top",
    "title": "置顶操作",
    "name": "activities_top",
    "group": "活动管理",
    "description": "<p>置顶操作</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "activityIds",
            "description": "<p>活动id表，例如 [1,2,3]</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "top",
            "description": "<p>false-不置顶 true-置顶, 默认 false 不置顶</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/activities.js",
    "groupTitle": "活动管理"
  },
  {
    "type": "get",
    "url": "/api/auth/jsconfig",
    "title": "系统配置",
    "name": "jsconfig",
    "group": "鉴权",
    "description": "<p>系统配置</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpId",
            "description": "<p>企业corpId</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpName",
            "description": "<p>企业名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.agentId",
            "description": "<p>当前应用agentId</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  },
  {
    "type": "get",
    "url": "/api/auth/login?code=&userId=",
    "title": "用户登录",
    "name": "login",
    "group": "鉴权",
    "description": "<p>用户登录</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>钉钉免登code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>测试环境中使用，没有code,携带钉钉用户的userId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user",
            "description": "<p>钉钉获取当前用户信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.userId",
            "description": "<p>用户userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.userName",
            "description": "<p>用户userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.jobnumber",
            "description": "<p>工号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.avatar",
            "description": "<p>图像</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.mobile",
            "description": "<p>手机</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.user.depts",
            "description": "<p>部门信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.user.depts.deptId",
            "description": "<p>部门deptId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.token",
            "description": "<p>token信息,需要鉴权的api中请在header中携带此token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  },
  {
    "type": "get",
    "url": "/api/auth/signature?platform=&url=",
    "title": "签名",
    "name": "signature",
    "group": "鉴权",
    "description": "<p>签名，所有平台公用一个接口，不同的是 platform和url参数不同</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>生成签名的平台, 例如 vote_mobile-投票移动端 vote_pc 投票PC端</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>当前网页的URL，不包含#及其后面部分</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpId",
            "description": "<p>企业corpId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.agentId",
            "description": "<p>当前应用agentId</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.url",
            "description": "<p>当前页面url</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.timeStamp",
            "description": "<p>时间戳</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.signature",
            "description": "<p>签名</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.nonceStr",
            "description": "<p>随机串</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  }
] });
