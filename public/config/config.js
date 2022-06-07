// eslint-disable-next-line
const config = {
	APP_VERSION: 'V1.0.0.8',
	APP_PROJECT_NAME: "湖南省教育基金会",
	APP_PROJECT_SYSTEM_NAME: "湖南省教育基金会",
	APP_PROJECT_SYSTEM_SIMPLE_NAME: "湘",
	APP_NAME: "shengjiao",                              //缓存前缀
	WS_URL: (document.location.protocol === 'http:' ? "ws://" : "wss://") + window.location.host + "/socket",
	ICON_PREFIX: 'icon-hn-',                            //icon前缀
	WEB_URL: {                                          //前端地址
		NEWS_DETAIL: "/newsDetail",               //前端地址-新闻详情
		PROJECT_DETAIL: "/projectDetail",         //前端地址-项目详情
		PROGRESS_DETAIL: "/progress"              //前端地址-项目进展详情
	},
	PREVIEW_URL: {
		NEWS_DETAIL: "/moduleNewsDetail",          //前端地址-新闻预览
		PROJECT_DETAIL: "/moduleProjectDetail",    //前端地址-项目预览
		PROGRESS_DETAIL: "/moduleProgressDetail"   //前端地址-项目进展预览
	},
	DMS_LOVEWORD: [                              //爱心留言
		"爱心成就梦想，真情点燃希望。",
		"爱心点燃希望，奉献成就未来。",
		"爱心接力棒，传递暖大家。",
		"爱心凝聚力量，希望成就未来。",
		"爱心万人行，万人献爱心。",
		"播种爱心希望，成就未来梦想。",
		"倡导无私奉献新风尚，谱写文明城市新篇章。",
		"传递爱的真心，延续爱的希望。",
		"慈善公益人人参与，奉献爱心从我做起。",
		"从今天的爱心看明天的希望，从明天的希望看未来的中国。",
		"大爱善举，牵手你我他；慈心为民，同奔现代化。",
		"大手牵小手，爱心伴着行。",
		"滴水之恩万心暖，寸草之心三春晖。",
		"点亮一盏灯，温暖一颗心。",
		"多一份爱心，多一份希望。",
		"奉献您的爱心，延续爱的希望。",
		"奉献一份爱心，点燃一片希望。",
		"奉献一份关爱，收获一份惊喜。",
		"公益献爱心，真情暖人心。",
		"光大慈善心，共建文明城。",
		"精彩关爱情，爱心永相伴。",
		"捐出一份爱心，奉献一片真情。",
		"你“小”的捐助，他“大”的惊喜。",
		"让爱的接力棒，永远传递；让爱的圣火，永不熄灭。",
		"让爱同筑一颗心，全世界拥有一颗心。",
		"让爱心汇成海洋，让真情放飞希望。",
		"让爱心在希望中绽放，让希望在教育中成长。",
		"伸出温暖手，打开爱心门。",
		"希望——源自您的爱心。",
		"幸福源于关爱，和谐来自希望。",
		"一点一滴汇成大海，一分一角凝聚希望。",
		"用你的爱心，点亮他的生活。",
		"致力公益事业，爱心成就未来。",
		"做慈善事业的行动者，当爱心奉献的传播者。",
		"这个世界的改变不是你做了很多，而是我们都做了一点。"
	],
	TINYMCE_CRAWLER_IGNORE: [                    //富文本图片忽略地址
		window.location.host,
		"hnedu.obs.cn-south-1.myhuaweicloud.com/"
	],
	CMS: {                                       //内容管理部分配置
		CHANNEL: {                                 //导航相关配置
		MAX_CHANNEL: 6,                              //一级导航最大数
		PIC_ABLE: 1,                                 //是否有Banner图片
		PIC_SIZE: '1920px*210px',                    //Banner图大小
		MAX_LEVEL: 2,                                //最大层级数    
		LINK: [                                  //固定单页
			{
			label: "捐赠公示",
			value: "/donation"
			},
			{
			label: "证书查询",
			value: "/certificateSearch"
			},
			{
			label: "联系我们",
			value: "/contact"
			}
		]
		},
		NEWS: {                                     //新闻资讯
		PIC_SIZE: '720px*400px'
		},
		LINKS: {                                    //友情链接
		PIC_SIZE: '227px*80px',
		LINKS_STYLE: 2,
		},
	},
	PMS: {                                        //项目管理
		PROJECT: {
		PIC_SIZE: "760px*475px",
		}
	},
	UPLOAD: {
		PART: {                                     // 分片上传配置
		SIZE: 5242880,                            // 单片的大小
		LIMIT: 524288000                          // 最大上传
		}
	}
}
