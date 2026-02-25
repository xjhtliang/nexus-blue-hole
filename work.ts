
export default {
  "dashboard": {
    "title": "工作台概览",
    "kpi": {
      "goals": "目标达成率",
      "revenue": "净收入",
      "leads": "活跃线索"
    }
  },
  "crm": {
    "title": "客户关系管理",
    "description": "管理您的销售渠道和客户关系。",
    "newLead": "新建线索",
    "tabs": {
      "leads": "我的线索",
      "pipeline": "销售管道",
      "public": "公海池"
    },
    "leads": {
      "filterPlaceholder": "筛选线索...",
      "archiveConfirm": "确定要归档线索 \"{{name}}\" 吗？",
      "table": {
        "nameCompany": "名称 / 公司",
        "status": "状态",
        "score": "评分",
        "contact": "联系方式",
        "lastContact": "最后联系",
        "tags": "标签",
        "actions": "操作",
        "empty": "未找到线索。"
      }
    },
    "detail": {
      "back": "返回列表",
      "archive": "归档",
      "logInteraction": "记录跟进",
      "details": "详细信息",
      "source": "来源",
      "owner": "负责人",
      "created": "创建时间",
      "lastContact": "最后联系",
      "tags": "标签",
      "addTag": "添加",
      "activityTimeline": "活动时间轴 (360° 视图)",
      "logPlaceholder": "输入 {{type}} 详情...",
      "saveLog": "保存记录",
      "cancel": "取消",
      "interactionLogged": "已记录 {{type}}"
    },
    "publicPool": {
      "title": "公海池 (Gonghai)",
      "description": "这些线索可供认领。如果线索在30天内无活动或被放弃，将被移至此处。",
      "claim": "认领",
      "empty": "公海池为空。"
    },
    "scoreCard": {
      "healthScore": "线索健康分",
      "keyFactors": "关键因素",
      "noFactors": "暂无评分记录。",
      "stagnationAlert": "停滞提醒",
      "stagnationMessage": "线索处于 {{status}} 状态已 {{days}} 天。建议跟进。",
      "cold": "冷",
      "hot": "热"
    },
    "timeline": {
      "empty": "暂无互动记录。",
      "emptyHint": "记录电话、邮件或笔记以开启时间轴。",
      "by": "记录人",
      "outcome": "结果"
    },
    "status": {
      "NEW": "新建",
      "CONTACTED": "已联系",
      "QUALIFIED": "合格",
      "LOST": "丢失",
      "PUBLIC": "公海",
      "CUSTOMER": "成交"
    }
  },
  "goals": {
    "title": "目标追踪",
    "description": "将您的日常行动与年度抱负保持一致。",
    "setGoal": "设定目标",
    "filters": {
      "overview": "概览",
      "yearly": "年度",
      "quarterly": "季度",
      "monthly": "月度"
    },
    "loading": "加载目标中...",
    "empty": "当前视图下暂无目标。",
    "status": {
      "ON_TRACK": "进行中",
      "AT_RISK": "有风险",
      "BEHIND": "滞后",
      "COMPLETED": "已完成"
    },
    "card": {
      "current": "当前",
      "target": "目标",
      "insight": {
        "good": "趋势良好，预计提前完成。",
        "bad": "需提高 20% 效率才能按时完成。"
      }
    }
  },
  "finance": {
    "title": "财务中心",
    "description": "追踪收入，估算薪资，赢取激励奖金。",
    "calculator": {
      "title": "薪资估算器",
      "projectedRevenue": "预估月度业绩",
      "fixedBase": "固定底薪",
      "commission": "提成",
      "tax": "预估个税",
      "netIncome": "预估净收入"
    },
    "kpi": {
      "currentMonth": "本月数据",
      "revenueGenerated": "产生业绩",
      "commissionEst": "预估佣金",
      "pendingPayout": "待发金额",
      "activeContests": "活跃竞赛",
      "joinToWin": "参与赢取"
    },
    "charts": {
      "revenueCommission": "业绩与佣金趋势"
    },
    "incentives": {
      "title": "激励竞赛"
    }
  }
};
