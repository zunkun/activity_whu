define({ "api": [
  {
    "type": "post",
    "url": "/api/forms",
    "title": "保存表单",
    "name": "forms_create",
    "group": "报名表单",
    "description": "<p>保存报名表单</p>",
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
            "field": "forms",
            "description": "<p>表单</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "forms.componentName",
            "description": "<p>组件名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "forms.componentType",
            "description": "<p>组件类型</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "forms.componentSet",
            "description": "<p>组件属性设置类型</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "forms.attribute",
            "description": "<p>组件属性</p>"
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
    "filename": "routes/forms.js",
    "groupTitle": "报名表单"
  },
  {
    "type": "get",
    "url": "/api/forms/info?activityId=",
    "title": "获取表单",
    "name": "forms_info",
    "group": "报名表单",
    "description": "<p>获取表单</p>",
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
            "field": "data",
            "description": "<p>表单数据</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.activityId",
            "description": "<p>活动ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.sequence",
            "description": "<p>组件排序</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.id",
            "description": "<p>组件ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentName",
            "description": "<p>组件名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentType",
            "description": "<p>组件类型</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentSet",
            "description": "<p>组件属性设置类型</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.attribute",
            "description": "<p>组件属性</p>"
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
    "filename": "routes/forms.js",
    "groupTitle": "报名表单"
  },
  {
    "type": "get",
    "url": "/api/participate/myenroll?activityId=",
    "title": "我的报名信息",
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
            "type": "Array[]",
            "optional": false,
            "field": "data",
            "description": "<p>报名列表，即家属信息列表，此字段为二维数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.sequence",
            "description": "<p>填写项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>填写项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentName",
            "description": "<p>组件名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentType",
            "description": "<p>组件类型</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.componentSet",
            "description": "<p>组件属性设置类型</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.attribute",
            "description": "<p>组件属性</p>"
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
    "url": "/api/participate/enroll",
    "title": "报名",
    "name": "participate_enroll_post",
    "group": "活动参与",
    "description": "<p>报名</p>",
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
            "field": "formlists",
            "description": "<p>表单</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "formlists.componentName",
            "description": "<p>组件名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "formlists.componentType",
            "description": "<p>组件类型</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "formlists.componentSet",
            "description": "<p>组件属性设置类型</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "formlists.attribute",
            "description": "<p>组件属性</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求body示例",
          "content": "{\n  activityId: 1000, // 活动ID\n\tformlists: [\n\t\t[ // 第一组，表示第一个人\n\t\t\t{\n\t\t\t\tcomponentName: '单行输入框', //组件名称\n\t\t\t\tcomponentType: 'signleLineText', //组件类型\n\t\t\t\tcomponentSet: 'textType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValue: '', //字段填写的值\n\t\t\t\t\tfieldCode: '', //字段编码\n\t\t\t\t\ttitle: '单行输入框', //标题\n\t\t\t\t\tplaceholder: '请输入', //提示\n\t\t\t\t\tmaxLength: 666, //输入的最大值\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t},\n\t\t\t},\n\t\t\t{\n\t\t\t\tcomponentName: '多行输入框', //组件名称\n\t\t\t\tcomponentType: 'multilineText', //组件类型\n\t\t\t\tcomponentSet: 'textType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValue: '', //字段填写的值\n\t\t\t\t\tfieldCode: '', //字段编码\n\t\t\t\t\ttitle: '多行输入框', //标题\n\t\t\t\t\tplaceholder: '请输入', //提示\n\t\t\t\t\tmaxLength: 666, //输入的最大值\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t},\n\t\t\t},\n\t\t\t{\n\t\t\t\tcomponentName: '数字输入框', //组件名称\n\t\t\t\tcomponentType: 'numericType', //组件类型\n\t\t\t\tcomponentSet: 'textType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValue: '', //字段填写的值\n\t\t\t\t\tfieldCode: '', //字段编码\n\t\t\t\t\ttitle: '数字输入框', //标题\n\t\t\t\t\tplaceholder: '请输入', //提示\n\t\t\t\t\tmaxLength: 666, //输入的最大值\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t},\n\t\t\t},\n\t\t\t{\n\t\t\t\tcomponentName: '日期', //组件名称\n\t\t\t\tcomponentType: 'datePicker', //组件类型\n\t\t\t\tcomponentSet: 'datePickerType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValue: '', //字段填写的值\n\t\t\t\t\tfieldCode: '', //字段编码\n\t\t\t\t\ttitle: '日期', //标题\n\t\t\t\t\tplaceholder: '请选择', //提示\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t\tdateType: \"YYYY-MM-DD\", //日期类型 YYYY-MM-DD HH:mm\n\t\t\t\t}\n\t\t\t}, {\n\t\t\t\tcomponentName: '日期区间', //组件名称\n\t\t\t\tcomponentType: 'datePickerSection', //组件类型\n\t\t\t\tcomponentSet: 'datePickerSectionType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValueStart: '', //字段填写的值\n\t\t\t\t\tfieldCodeStart: '', //字段编码\n\t\t\t\t\ttitleStart: '开始日期', //标题\n\t\t\t\t\tplaceholderStart: '请选择', //提示\n\t\t\t\t\tfieldValueEnd: '', //字段填写的值\n\t\t\t\t\tfieldCodeEnd: '', //字段编码\n\t\t\t\t\ttitleEnd: '结束日期', //标题\n\t\t\t\t\tplaceholderEnd: '请选择', //提示\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t\tdateType: \"YYYY-MM-DD\", //日期类型 YYYY-MM-DD HH:mm\n\t\t\t\t}\n\t\t\t},\n\t\t\t{\n\t\t\t\tcomponentName: '多选框', //组件名称\n\t\t\t\tcomponentType: 'multipleSelection', //组件类型\n\t\t\t\tcomponentSet: 'multipleSelectionType', //组件属性设置类型\n\t\t\t\tattribute: {\n\t\t\t\t\t//   组件属性\n\t\t\t\t\tfieldValue: \"\", //字段填写的值\n\t\t\t\t\tfieldCode: '', //字段编码\n\t\t\t\t\ttitle: '多选框', //标题\n\t\t\t\t\tplaceholder: '请选择', //提示\n\t\t\t\t\trequired: true, //是否必填\n\t\t\t\t\tmaxLength: 2,\n\t\t\t\t\toptions: [{\n\t\t\t\t\t\tlabel: '选项1',\n\t\t\t\t\t\tvalue: '选项1',\n\t\t\t\t\t\tisSelect: false,\n\t\t\t\t\t}, {\n\t\t\t\t\t\tlabel: '选项2',\n\t\t\t\t\t\tvalue: '选项2',\n\t\t\t\t\t\tisSelect: false\n\t\t\t\t\t}],\n\t\t\t\t}\n\t\t\t}\n\t\t],\n\t\t[ // 第二组，表示第二个人\n\t\t\t{...},\n\t\t\t{...}\n\t\t]\n\t]\n}",
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
    "url": "/api/participate/enrollpersons?activityId=&limit=&page=&keywords=",
    "title": "PC端已报名人员列表",
    "name": "participate_enrollpersons",
    "group": "活动参与",
    "description": "<p>PC端已报名人员列表</p>",
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
            "field": "data.enrollpersons",
            "description": "<p>报名列表，即家属信息列表，此字段为二维数组</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.enrollpersons.sequence",
            "description": "<p>填写项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.enrollpersons.id",
            "description": "<p>填写项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.enrollpersons.componentName",
            "description": "<p>组件名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.enrollpersons.componentType",
            "description": "<p>组件类型</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.enrollpersons.componentSet",
            "description": "<p>组件属性设置类型</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.enrollpersons.attribute",
            "description": "<p>组件属性</p>"
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
            "field": "data.rows.signed",
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.status",
            "description": "<p>活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝</p>"
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
            "field": "data.userName",
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
            "type": "Number",
            "optional": true,
            "field": "latitude",
            "description": "<p>签到坐标经度</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "longitude",
            "description": "<p>签到坐标纬度</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>签到地址</p>"
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
            "optional": true,
            "field": "type",
            "description": "<p>活动类型 1-常规活动 2-专项活动 默认1 常规活动 分会可以不用传此字段</p>"
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
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>地址经度</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>地址纬度</p>"
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
            "field": "signed",
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
          "content": "{\n title: '上海一日游',\n type: 1, // 常规活动\n images: ['a.jpg', 'b.png', 'c.jpg'],\n startTime: '2019-10-23 08:00:00',\n startTime: '2019-10-23 18:00:00',\n enrollStartTime: '2019-10-01 08:00:00',\n enrollEndTime: '2019-10-20 18:00:00',\n personNum: 100,\n descText: '游览上海著名景点',\n descImages: ['d.jpg', 'e.png', 'f.jpg'],\n deptIds: [1,2,3],\n specialUserIds: ['userId1', 'userId2', 'userId3'],\n latitude: 223.234,\n longitude: 113.234,\n address: '上海市三门路复旦软件园',\n signed: true,\n signType: 2, // 签到方式 1-扫码签到 2-位置签到\n distance: 100, // signType = 2 时填写\n contactMobile: '156xxx',\n contactName: '刘遵坤',\n}",
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
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.needReview",
            "description": "<p>是否需要提交审核</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.latitude",
            "description": "<p>活动经度</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.longitude",
            "description": "<p>活动纬度</p>"
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
            "field": "data.signed",
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
            "description": "<p>审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.status",
            "description": "<p>活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝</p>"
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
            "type": "Boolean",
            "optional": false,
            "field": "data.highAuthority",
            "description": "<p>是否能够审批该活动</p>"
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
    "url": "/api/activities/lists?limit=&page=&status=&type=",
    "title": "我可以参与的活动列表",
    "name": "activities_lists",
    "group": "活动管理",
    "description": "<p>活动列表，目前是移动端管理活动列表</p>",
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
            "description": "<p>活动状态， 31-预热中 32-报名中 33-进行中 34-已结束 默认为0 表示查询全部状态</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.enrollNum",
            "description": "<p>已报名人数</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.latitude",
            "description": "<p>活动经度</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.longitude",
            "description": "<p>活动纬度</p>"
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
            "field": "data.rows.signed",
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
            "description": "<p>审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.status",
            "description": "<p>活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝</p>"
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
    "url": "/api/activities/messages?limit=&page=",
    "title": "我的消息",
    "name": "activities_message_lists",
    "group": "活动管理",
    "description": "<p>我的消息列表</p>",
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
            "description": "<p>总共消息条数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页消息列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.id",
            "description": "<p>消息ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.isRead",
            "description": "<p>当前消息是否已读</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>活动创建人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>活动创建人</p>"
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
            "type": "Date",
            "optional": false,
            "field": "data.rows.createTime",
            "description": "<p>活动发起时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.type",
            "description": "<p>消息类型 1-审核提示消-息给管理者  2-审核结束消息-给发起者</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.text",
            "description": "<p>消息内容</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.finish",
            "description": "<p>审批否处理完毕，如果审核操作结束或者撤销活动，则当前字段为true</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.reviewStatus",
            "description": "<p>活动审核状态 20-审核中 30-审核通过 40-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.rejectReason",
            "description": "<p>拒绝原因</p>"
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
    "url": "/api/activities/msgnoread",
    "title": "获取未读消息条数",
    "name": "activities_message_no_read",
    "group": "活动管理",
    "description": "<p>获取未读消息条数</p>",
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
            "description": "<p>返回结果</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>当前未读消息条数</p>"
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
    "url": "/api/activities/readmsg",
    "title": "设置消息已读【废弃】",
    "name": "activities_message_read",
    "group": "活动管理",
    "description": "<p>设置消息已读</p>",
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
            "field": "messageId",
            "description": "<p>消息ID</p>"
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
    "url": "/api/activities?limit=&page=&keywords=&status=&type=",
    "title": "活动列表",
    "name": "activities_pc_lists",
    "group": "活动管理",
    "description": "<p>活动列表，目前是PC端管理活动列表,分会管理员只能看到自己创建的活动列表以及其管辖分会的活动列表，而总会管理员能够看到所有的活动列表</p>",
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
            "description": "<p>活动状态，0/null-全部 10-编辑中 20-待审核 30-审核通过  31-预热中 32-报名中 33-进行中 34-已结束 40-驳回拒绝， 默认为0 表示查询全部状态</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.enrollNum",
            "description": "<p>已报名人数</p>"
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.latitude",
            "description": "<p>活动经度</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.longitude",
            "description": "<p>活动纬度</p>"
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
            "field": "data.rows.signed",
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
            "type": "Number",
            "optional": false,
            "field": "data.rows.reviewStatus",
            "description": "<p>审核状态 10-编辑中 20-审核中 30-审核通过 40-拒绝</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.status",
            "description": "<p>活动状态 10-编辑中 20-审核中 30-审核通过 31-预热中 32-报名中 35-未开始 33-进行中 34-已结束 40-活动拒绝</p>"
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
            "description": "<p>审核状态 30-审核通过 40-拒绝</p>"
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
    "url": "/api/activities/sendreview",
    "title": "提交审核",
    "name": "activities_send_review",
    "group": "活动管理",
    "description": "<p>提交审核活动</p>",
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
    "type": "post",
    "url": "/api/activities/update",
    "title": "修改活动",
    "name": "activities_update",
    "group": "活动管理",
    "description": "<p>修改活动,活動开始之后，不可再修改活动时间和报名时间</p>",
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
          },
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
            "optional": true,
            "field": "startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "endTime",
            "description": "<p>结束时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "enrollStartTime",
            "description": "<p>报名开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
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
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>地址经度</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>地址纬度</p>"
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
            "field": "signed",
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
          "content": "{\n id: 1,\n title: '上海一日游',\n type: 1, // 常规活动\n images: ['a.jpg', 'b.png', 'c.jpg'],\n startTime: '2019-10-23 08:00:00',\n startTime: '2019-10-23 18:00:00',\n enrollStartTime: '2019-10-01 08:00:00',\n enrollEndTime: '2019-10-20 18:00:00',\n personNum: 100,\n descText: '游览上海著名景点',\n descImages: ['d.jpg', 'e.png', 'f.jpg'],\n deptIds: [1,2,3],\n specialUserIds: ['userId1', 'userId2', 'userId3'],\n latitude: 223.234,\n longitude: 113.234,\n address: '上海市三门路复旦软件园',\n signed: true,\n signType: 2, // 签到方式 1-扫码签到 2-位置签到\n distance: 100, // signType = 2 时填写\n contactMobile: '156xxx',\n contactName: '刘遵坤',\n}",
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
    "url": "/api/cfgs",
    "title": "保存设置",
    "name": "cfgs_create",
    "group": "设置管理",
    "description": "<p>保存导出设置</p>",
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
            "field": "catalog",
            "description": "<p>设置分类，比如 activity-活动列表导出设置 enroll-报名信息列表导出设置</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "config",
            "description": "<p>设置对象</p>"
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
    "filename": "routes/cfgs.js",
    "groupTitle": "设置管理"
  },
  {
    "type": "get",
    "url": "/api/cfgs/info?catalog=",
    "title": "获取设置",
    "name": "cfgs_info",
    "group": "设置管理",
    "description": "<p>获取设置信息</p>",
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
            "field": "catalog",
            "description": "<p>设置分类，比如 activity-活动列表导出设置 enroll-报名信息列表导出设置</p>"
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
            "description": "<p>表单数据</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.catalog",
            "description": "<p>设置分类</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.config",
            "description": "<p>设置</p>"
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
    "filename": "routes/cfgs.js",
    "groupTitle": "设置管理"
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
            "field": "data.user.roles",
            "description": "<p>用户角色表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.user.roles.role",
            "description": "<p>角色 1-总会管理员 2-分会管理员 3-普通校友</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.user.roles.deptId",
            "description": "<p>当前角色所管理的部门ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.roles.deptName",
            "description": "<p>当前角色所管理部门名称</p>"
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
