	var bluetheme1 = {
		// 榛樿鑹叉澘
    color: [
        '#1790cf','#1bb2d8','#99d2dd','#88b0bb',
        '#1c7099','#038cc4','#75abd0','#afd6dd'
    ],

    // 鍥捐〃鏍囬
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#1790cf'
        }
    },

    // 鍊煎煙
    dataRange: {
        color:['#1178ad','#72bbd0']
    },

    // 宸ュ叿绠�
    toolbox: {
        color : ['#1790cf','#1790cf','#1790cf','#1790cf']
    },

    // 鎻愮ず妗�
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer : {            // 鍧愭爣杞存寚绀哄櫒锛屽潗鏍囪酱瑙﹀彂鏈夋晥
            type : 'line',         // 榛樿涓虹洿绾匡紝鍙€変负锛�'line' | 'shadow'
            lineStyle : {          // 鐩寸嚎鎸囩ず鍣ㄦ牱寮忚缃�
                color: '#1790cf',
                type: 'dashed'
            },
            crossStyle: {
                color: '#1790cf'
            },
            shadowStyle : {                     // 闃村奖鎸囩ず鍣ㄦ牱寮忚缃�
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 鍖哄煙缂╂斁鎺у埗鍣�
    dataZoom: {
        dataBackgroundColor: '#eee',            // 鏁版嵁鑳屾櫙棰滆壊
        fillerColor: 'rgba(144,197,237,0.2)',   // 濉厖棰滆壊
        handleColor: '#1790cf'     // 鎵嬫焺棰滆壊
    },

    // 缃戞牸
    grid: {
        borderWidth: 0
    },

    // 绫荤洰杞�
    categoryAxis: {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#1790cf'
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: ['#eee']
            }
        }
    },

    // 鏁板€煎瀷鍧愭爣杞撮粯璁ゅ弬鏁�
    valueAxis: {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#1790cf'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: ['#eee']
            }
        }
    },

    timeline : {
        lineStyle : {
            color : '#1790cf'
        },
        controlStyle : {
            normal : { color : '#1790cf'},
            emphasis : { color : '#1790cf'}
        }
    },

    // K绾垮浘榛樿鍙傛暟
    k: {
        itemStyle: {
            normal: {
                color: '#1bb2d8',          // 闃崇嚎濉厖棰滆壊
                color0: '#99d2dd',      // 闃寸嚎濉厖棰滆壊
                lineStyle: {
                    width: 1,
                    color: '#1c7099',   // 闃崇嚎杈规棰滆壊
                    color0: '#88b0bb'   // 闃寸嚎杈规棰滆壊
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 涔熸槸閫変腑鏍峰紡
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force : {
        itemStyle: {
            normal: {
                linkStyle : {
                    color : '#1790cf'
                }
            }
        }
    },

    chord : {
        padding : 4,
        itemStyle : {
            normal : {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle : {
                    lineStyle : {
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis : {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle : {
                    lineStyle : {
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge : {
        axisLine: {            // 鍧愭爣杞寸嚎
            show: true,        // 榛樿鏄剧ず锛屽睘鎬how鎺у埗鏄剧ず涓庡惁
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: [[0.2, '#1bb2d8'],[0.8, '#1790cf'],[1, '#1c7099']],
                width: 8
            }
        },
        axisTick: {            // 鍧愭爣杞村皬鏍囪
            splitNumber: 10,   // 姣忎唤split缁嗗垎澶氬皯娈�
            length :12,        // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: 'auto'
            }
        },
        axisLabel: {           // 鍧愭爣杞存枃鏈爣绛撅紝璇﹁axis.axisLabel
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            length : 18,         // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: 'auto'
            }
        },
        pointer : {
            length : '90%',
            color : 'auto'
        },
        title : {
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: '#333'
            }
        },
        detail : {
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '寰蒋闆呴粦, Arial, Verdana, sans-serif'
    }
	};



    var redtheme = {
        // 榛樿鑹叉澘
        color: [
            '#c12e34','#e6b600','#0098d9','#2b821d',
            '#005eaa','#339ca8','#cda819','#32a487'
        ],

        // 鍥捐〃鏍囬
        title: {
            textStyle: {
                fontWeight: 'normal'
            }
        },

        // 鍊煎煙
        dataRange: {
            itemWidth: 15,             // 鍊煎煙鍥惧舰瀹藉害锛岀嚎鎬ф笎鍙樻按骞冲竷灞€瀹藉害涓鸿鍊� * 10
            color:['#1790cf','#a2d4e6']
        },

        // 宸ュ叿绠�
        toolbox: {
            color : ['#06467c','#00613c','#872d2f','#c47630']
        },

        // 鎻愮ず妗�
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.6)'
        },

        // 鍖哄煙缂╂斁鎺у埗鍣�
        dataZoom: {
            dataBackgroundColor: '#dedede',            // 鏁版嵁鑳屾櫙棰滆壊
            fillerColor: 'rgba(154,217,247,0.2)',   // 濉厖棰滆壊
            handleColor: '#005eaa'     // 鎵嬫焺棰滆壊
        },

        // 缃戞牸
        grid: {
            borderWidth: 0
        },

        // 绫荤洰杞�
        categoryAxis: {
            axisLine: {            // 鍧愭爣杞寸嚎
                show: false
            },
            axisTick: {            // 鍧愭爣杞村皬鏍囪
                show: false
            }
        },

        // 鏁板€煎瀷鍧愭爣杞撮粯璁ゅ弬鏁�
        valueAxis: {
            axisLine: {            // 鍧愭爣杞寸嚎
                show: false
            },
            axisTick: {            // 鍧愭爣杞村皬鏍囪
                show: false
            },
            splitArea: {           // 鍒嗛殧鍖哄煙
                show: true,       // 榛樿涓嶆樉绀猴紝灞炴€how鎺у埗鏄剧ず涓庡惁
                areaStyle: {       // 灞炴€reaStyle锛堣瑙乤reaStyle锛夋帶鍒跺尯鍩熸牱寮�
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#005eaa'
            },
            controlStyle : {
                normal : { color : '#005eaa'},
                emphasis : { color : '#005eaa'}
            }
        },

        // K绾垮浘榛樿鍙傛暟
        k: {
            itemStyle: {
                normal: {
                    color: '#c12e34',          // 闃崇嚎濉厖棰滆壊
                    color0: '#2b821d',      // 闃寸嚎濉厖棰滆壊
                    lineStyle: {
                        width: 1,
                        color: '#c12e34',   // 闃崇嚎杈规棰滆壊
                        color0: '#2b821d'   // 闃寸嚎杈规棰滆壊
                    }
                }
            }
        },

        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {                 // 涔熸槸閫変腑鏍峰紡
                    areaStyle: {
                        color: '#e6b600'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    linkStyle : {
                        color : '#005eaa'
                    }
                }
            }
        },

        chord : {
            itemStyle : {
                normal : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge : {
            axisLine: {            // 鍧愭爣杞寸嚎
                show: true,        // 榛樿鏄剧ず锛屽睘鎬how鎺у埗鏄剧ず涓庡惁
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: [[0.2, '#2b821d'],[0.8, '#005eaa'],[1, '#c12e34']],
                    width: 5
                }
            },
            axisTick: {            // 鍧愭爣杞村皬鏍囪
                splitNumber: 10,   // 姣忎唤split缁嗗垎澶氬皯娈�
                length :8,        // 灞炴€ength鎺у埗绾块暱
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: 'auto'
                }
            },
            axisLabel: {           // 鍧愭爣杞存枃鏈爣绛撅紝璇﹁axis.axisLabel
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {           // 鍒嗛殧绾�
                length : 12,         // 灞炴€ength鎺у埗绾块暱
                lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                    color: 'auto'
                }
            },
            pointer : {
                length : '90%',
                width : 3,
                color : 'auto'
            },
            title : {
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: '#333'
                }
            },
            detail : {
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto'
                }
            }
        },

        textStyle: {
            fontFamily: '寰蒋闆呴粦, Arial, Verdana, sans-serif'
        }
    };



    /*var bluetheme = {
        color: ['#E01F54','#b8d2c7','#f5e8c8','#001852','#c6b38e',
            '#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783',
            '#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889',
            '#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'],
            dataRange: {
        color:['#e01f54','#e7dbc3'],
            textStyle: {
            color: '#333'
        }
    },
        k: {
            itemStyle: {
                normal: {
                    color: '#e01f54',
                        color0: '#001852',
                        lineStyle: {
                        width: 1,
                            color: '#f5e8c8',
                            color0: '#b8d2c7'
                    }
                }
            }
        },
        pie: {
            itemStyle: {
                normal: {

                    borderColor: '#fff',
                        borderWidth: 1,
                        label: {
                        show: true,
                            position: 'outer',
                            textStyle: {color: '#1b1b1b'},
                        lineStyle: {color: '#1b1b1b'}

                    },
                    labelLine: {
                        show: true,
                            length: 20,
                            lineStyle: {

                            width: 1,
                                type: 'solid'
                        }
                    }
                },
                emphasis: {

                    borderColor: 'rgba(0,0,0,0)',
                        borderWidth: 1,
                        label: {
                        show: false
                    },
                    labelLine: {
                        show: false,
                            length: 20,
                            lineStyle: {
                            width: 1,
                                type: 'solid'
                        }
                    }
                }
            }
        },

        map: {
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                        borderWidth: 1,
                        areaStyle: {
                        color: '#ccc'
                    },
                    label: {
                        show: false,
                            textStyle: {
                            color: 'rgba(139,69,19,1)'
                        }
                    }
                },
                emphasis: {

                    borderColor: 'rgba(0,0,0,0)',
                        borderWidth: 1,
                        areaStyle: {
                        color: '#f3d999'
                    },
                    label: {
                        show: false,
                            textStyle: {
                            color: 'rgba(139,69,19,1)'
                        }
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    nodeStyle : {
                        brushType : 'both',
                            strokeColor : '#5182ab'
                    },
                    linkStyle : {
                        strokeColor : '#5182ab'
                    }
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    nodeStyle : {},
                    linkStyle : {}
                }
            }
        },

        gauge : {
            axisLine: {            // 鍧愭爣杞寸嚎
                show: true,        // 榛樿鏄剧ず锛屽睘鎬how鎺у埗鏄剧ず涓庡惁
                    lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: [[0.2, '#E01F54'],[0.8, '#b8d2c7'],[1, '#001852']],
                        width: 8
                }
            },
            axisTick: {            // 鍧愭爣杞村皬鏍囪
                splitNumber: 10,   // 姣忎唤split缁嗗垎澶氬皯娈�
                    length :12,        // 灞炴€ength鎺у埗绾块暱
                    lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: 'auto'
                }
            },
            axisLabel: {           // 鍧愭爣杞存枃鏈爣绛撅紝璇﹁axis.axisLabel
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {           // 鍒嗛殧绾�
                length : 18,         // 灞炴€ength鎺у埗绾块暱
                    lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                    color: 'auto'
                }
            },
            pointer : {
                length : '90%',
                    color : 'auto'
            },
            title : {
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: '#333'
                }
            },
            detail : {
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto'
                }
            }
        }
    };*/





     var newrelictheme = {
        // 全图默认背景
        // backgroundColor: 'rgba(0,0,0,0)',

        // 默认色板
        // color: [
        //     '#c12e34','#e6b600','#0098d9','#2b821d',
        //     '#005eaa','#339ca8','#cda819','#32a487'
        // ],
         color: [
             '#42B2DE','#94DB52','#9C5DAD','#9CE3F7',
             '#E77552','#339ca8','#cda819','#32a487'
         ],

        // 图表标题
        title: {
            x: 'left',                 // 水平安放位置，默认为左对齐，可选为：
                                       // 'center' ¦ 'left' ¦ 'right'
                                       // ¦ {number}（x坐标，单位px）
            y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                                       // 'top' ¦ 'bottom' ¦ 'center'
                                       // ¦ {number}（y坐标，单位px）
            //textAlign: null          // 水平对齐方式，默认根据x设置自动调整
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#ccc',       // 标题边框颜色
            borderWidth: 0,            // 标题边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 标题内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            itemGap: 10,               // 主副标题纵向间隔，单位px，默认为10，
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'          // 主标题文字颜色
            },
            subtextStyle: {
                color: '#aaa'          // 副标题文字颜色
            }
        },

        // 图例
        legend: {
            orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                       // 'horizontal' ¦ 'vertical'
            x: 'center',               // 水平安放位置，默认为全图居中，可选为：
                                       // 'center' ¦ 'left' ¦ 'right'
                                       // ¦ {number}（x坐标，单位px）
            y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                                       // 'top' ¦ 'bottom' ¦ 'center'
                                       // ¦ {number}（y坐标，单位px）
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#ccc',       // 图例边框颜色
            borderWidth: 0,            // 图例边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 图例内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
                                       // 横向布局时为水平间隔，纵向布局时为纵向间隔
            itemWidth: 20,             // 图例图形宽度
            itemHeight: 14,            // 图例图形高度
            textStyle: {
                color: '#333'          // 图例文字颜色
            }
        },

        // 值域
        dataRange: {
            orient: 'vertical',        // 布局方式，默认为垂直布局，可选为：
                                       // 'horizontal' ¦ 'vertical'
            x: 'left',                 // 水平安放位置，默认为全图左对齐，可选为：
                                       // 'center' ¦ 'left' ¦ 'right'
                                       // ¦ {number}（x坐标，单位px）
            y: 'bottom',               // 垂直安放位置，默认为全图底部，可选为：
                                       // 'top' ¦ 'bottom' ¦ 'center'
                                       // ¦ {number}（y坐标，单位px）
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#ccc',       // 值域边框颜色
            borderWidth: 0,            // 值域边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 值域内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
                                       // 横向布局时为水平间隔，纵向布局时为纵向间隔
            itemWidth: 20,             // 值域图形宽度，线性渐变水平布局宽度为该值 * 10
            itemHeight: 14,            // 值域图形高度，线性渐变垂直布局高度为该值 * 10
            splitNumber: 5,            // 分割段数，默认为5，为0时为线性渐变
            color:['#1e90ff','#f0ffff'],//颜色
            //text:['高','低'],         // 文本，默认为数值文本
            textStyle: {
                color: '#333'          // 值域文字颜色
            }
        },

        toolbox: {
            orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                       // 'horizontal' ¦ 'vertical'
            x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                                       // 'center' ¦ 'left' ¦ 'right'
                                       // ¦ {number}（x坐标，单位px）
            y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                                       // 'top' ¦ 'bottom' ¦ 'center'
                                       // ¦ {number}（y坐标，单位px）
            color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
            backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
            borderColor: '#ccc',       // 工具箱边框颜色
            borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
                                       // 横向布局时为水平间隔，纵向布局时为纵向间隔
            itemSize: 16,              // 工具箱图形宽度
            featureImageIcon : {},     // 自定义图片icon
            featureTitle : {
                mark : '辅助线开关',
                markUndo : '删除辅助线',
                markClear : '清空辅助线',
                dataZoom : '区域缩放',
                dataZoomReset : '区域缩放后退',
                dataView : '数据视图',
                lineChart : '折线图切换',
                barChart : '柱形图切换',
                restore : '还原',
                saveAsImage : '保存为图片'
            }
        },

        // 提示框
        tooltip: {
            trigger: 'item',           // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
            showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            hideDelay: 100,            // 隐藏延迟，单位ms
            transitionDuration : 0.4,  // 动画变换时间，单位s
            backgroundColor: 'rgba(0,0,0,0.7)',     // 提示背景颜色，默认为透明度为0.7的黑色
            borderColor: '#333',       // 提示边框颜色
            borderRadius: 4,           // 提示边框圆角，单位px，默认为4
            borderWidth: 0,            // 提示边框线宽，单位px，默认为0（无边框）
            padding: 5,                // 提示内边距，单位px，默认各方向内边距为5，
                                       // 接受数组分别设定上右下左边距，同css
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle : {          // 直线指示器样式设置
                    color: '#48b',
                    width: 2,
                    type: 'solid'
                },
                shadowStyle : {                       // 阴影指示器样式设置
                    width: 'auto',                   // 阴影大小
                    color: 'rgba(150,150,150,0.3)'  // 阴影颜色
                }
            },
            textStyle: {
                color: '#fff'
            }
        },

        // 区域缩放控制器
        dataZoom: {
            orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                                       // 'horizontal' ¦ 'vertical'
            // x: {number},            // 水平安放位置，默认为根据grid参数适配，可选为：
            // {number}（x坐标，单位px）
            // y: {number},            // 垂直安放位置，默认为根据grid参数适配，可选为：
            // {number}（y坐标，单位px）
            // width: {number},        // 指定宽度，横向布局时默认为根据grid参数适配
            // height: {number},       // 指定高度，纵向布局时默认为根据grid参数适配
            backgroundColor: 'rgba(0,0,0,0)',       // 背景颜色
            dataBackgroundColor: '#eee',            // 数据背景颜色
            fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
            handleColor: 'rgba(70,130,180,0.8)'     // 手柄颜色
        },

        // 网格
        grid: {
            x: 80,
            y: 60,
            x2: 80,
            y2: 60,
            // width: {totalWidth} - x - x2,
            // height: {totalHeight} - y - y2,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            borderColor: '#ccc'
        },

        // 类目轴
        categoryAxis: {
            position: 'bottom',    // 位置
            nameLocation: 'end',   // 坐标轴名字位置，支持'start' | 'end'
            boundaryGap: true,     // 类目起始和结束两端空白策略
            axisLine: {            // 坐标轴线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#48b',
                    width: 2,
                    type: 'solid'
                }
            },
            axisTick: {            // 坐标轴小标记
                show: true,       // 属性show控制显示与否，默认不显示
                interval: 'auto',
                // onGap: null,
                inside : false,    // 控制小标记是否在grid里
                length :5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#333',
                    width: 1
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: true,
                interval: 'auto',
                rotate: 0,
                margin: 8,
                // formatter: null,
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                // onGap: null,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                }
            },
            splitArea: {           // 分隔区域
                show: false,       // 默认不显示，属性show控制显示与否
                // onGap: null,
                areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                    color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                }
            }
        },

        // 数值型坐标轴默认参数
        valueAxis: {
            position: 'left',      // 位置
            nameLocation: 'end',   // 坐标轴名字位置，支持'start' | 'end'
            nameTextStyle: {},     // 坐标轴文字样式，默认取全局样式
            boundaryGap: [0, 0],   // 数值起始和结束两端空白策略
            splitNumber: 5,        // 分割段数，默认为5
            axisLine: {            // 坐标轴线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#48b',
                    width: 2,
                    type: 'solid'
                }
            },
            axisTick: {            // 坐标轴小标记
                show: false,       // 属性show控制显示与否，默认不显示
                inside : false,    // 控制小标记是否在grid里
                length :5,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#333',
                    width: 1
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: true,
                rotate: 0,
                margin: 8,
                // formatter: null,
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                }
            },
            splitArea: {           // 分隔区域
                show: false,       // 默认不显示，属性show控制显示与否
                areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                    color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                }
            }
        },

        polar : {
            center : ['50%', '50%'],    // 默认全局居中
            radius : '75%',
            startAngle : 90,
            splitNumber : 5,
            name : {
                show: true,
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            axisLine: {            // 坐标轴线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#ccc',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: false,
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                }
            },
            splitLine : {
                show : true,
                lineStyle : {
                    width : 1,
                    color : '#ccc'
                }
            }
        },

        // 柱形图默认参数
        bar: {
            barMinHeight: 0,          // 最小高度改为0
            // barWidth: null,        // 默认自适应
            barGap: '30%',            // 柱间距离，默认为柱形宽度的30%，可设固定值
            barCategoryGap : '20%',   // 类目间柱形距离，默认为类目间距的20%，可设固定值
            itemStyle: {
                normal: {
                    // color: '各异',
                    barBorderColor: '#fff',       // 柱条边线
                    barBorderRadius: 0,           // 柱条边线圆角，单位px，默认为0
                    barBorderWidth: 1,            // 柱条边线线宽，单位px，默认为1
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                },
                emphasis: {
                    // color: '各异',
                    barBorderColor: 'rgba(0,0,0,0)',   // 柱条边线
                    barBorderRadius: 0,                // 柱条边线圆角，单位px，默认为0
                    barBorderWidth: 1,                 // 柱条边线线宽，单位px，默认为1
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                }
            }
        },

        // 折线图默认参数
        line: {
            itemStyle: {
                normal: {
                    // color: 各异,
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    lineStyle: {
                        width: 2,
                        type: 'solid',
                        shadowColor : 'rgba(0,0,0,0)', //默认透明
                        shadowBlur: 5,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3
                    }
                },
                emphasis: {
                    // color: 各异,
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                }
            },
            //smooth : false,
            //symbol: null,         // 拐点图形类型
            symbolSize: 2,          // 拐点图形大小
            //symbolRotate : null,  // 拐点图形旋转控制
            showAllSymbol: false    // 标志图形默认只有主轴显示（随主轴标签间隔隐藏策略）
        },

        // K线图默认参数
        k: {
            // barWidth : null          // 默认自适应
            // barMaxWidth : null       // 默认自适应
            itemStyle: {
                normal: {
                    color: '#fff',          // 阳线填充颜色
                    color0: '#00aa11',      // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#ff3200',   // 阳线边框颜色
                        color0: '#00aa11'   // 阴线边框颜色
                    }
                },
                emphasis: {
                    // color: 各异,
                    // color0: 各异
                }
            }
        },

        // 散点图默认参数
        scatter: {
            //symbol: null,      // 图形类型
            symbolSize: 4,       // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            //symbolRotate : null,  // 图形旋转控制
            large: false,        // 大规模散点图
            largeThreshold: 2000,// 大规模阀值，large为true且数据量>largeThreshold才启用大规模模式
            itemStyle: {
                normal: {
                    // color: 各异,
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                },
                emphasis: {
                    // color: '各异'
                    label: {
                        show: false
                        // position: 默认自适应，水平布局为'top'，垂直布局为'right'，可选为
                        //           'inside'|'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                }
            }
        },

        // 雷达图默认参数
        radar : {
            itemStyle: {
                normal: {
                    // color: 各异,
                    label: {
                        show: false
                    },
                    lineStyle: {
                        width: 2,
                        type: 'solid'
                    }
                },
                emphasis: {
                    // color: 各异,
                    label: {
                        show: false
                    }
                }
            },
            //symbol: null,         // 拐点图形类型
            symbolSize: 2           // 可计算特性参数，空数据拖拽提示图形大小
            //symbolRotate : null,  // 图形旋转控制
        },

        // 饼图默认参数
        pie: {
            center : ['50%', '50%'],    // 默认全局居中
            radius : [0, '75%'],
            clockWise : false,          // 默认逆时针
            startAngle: 90,
            minAngle: 0,                // 最小角度改为0
            selectedOffset: 10,         // 选中是扇区偏移量
            itemStyle: {
                normal: {
                    // color: 各异,
                    borderColor: '#fff',
                    borderWidth: 1,
                    label: {
                        show: true,
                        position: 'outer'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    labelLine: {
                        show: true,
                        length: 20,
                        lineStyle: {
                            // color: 各异,
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                emphasis: {
                    // color: 各异,
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                    label: {
                        show: false
                        // position: 'outer'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    labelLine: {
                        show: false,
                        length: 20,
                        lineStyle: {
                            // color: 各异,
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            }
        },

        map: {
            mapType: 'china',   // 各省的mapType暂时都用中文
            mapLocation: {
                x : 'center',
                y : 'center'
                // width    // 自适应
                // height   // 自适应
            },
            showLegendSymbol : true,       // 显示图例颜色标识（系列标识的小圆点），存在legend时生效
            itemStyle: {
                normal: {
                    // color: 各异,
                    borderColor: '#fff',
                    borderWidth: 1,
                    areaStyle: {
                        color: '#ccc'//rgba(135,206,250,0.8)
                    },
                    label: {
                        show: false,
                        textStyle: {
                            color: 'rgba(139,69,19,1)'
                        }
                    }
                },
                emphasis: {                 // 也是选中样式
                    // color: 各异,
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                    areaStyle: {
                        color: 'rgba(255,215,0,0.8)'
                    },
                    label: {
                        show: false,
                        textStyle: {
                            color: 'rgba(139,69,19,1)'
                        }
                    }
                }
            }
        },

        force : {
            // 数据map到圆的半径的最小值和最大值
            minRadius : 10,
            maxRadius : 20,
            density : 1.0,
            attractiveness : 1.0,
            // 初始化的随机大小位置
            initSize : 300,
            // 向心力因子，越大向心力越大
            centripetal : 1,
            // 冷却因子
            coolDown : 0.99,
            // 分类里如果有样式会覆盖节点默认样式
            itemStyle: {
                normal: {
                    // color: 各异,
                    label: {
                        show: false
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle : {
                        brushType : 'both',
                        color : '#f08c2e',
                        strokeColor : '#5182ab'
                    },
                    linkStyle : {
                        strokeColor : '#5182ab'
                    }
                },
                emphasis: {
                    // color: 各异,
                    label: {
                        show: false
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle : {},
                    linkStyle : {}
                }
            }
        },

        chord : {
            radius : ['65%', '75%'],
            center : ['50%', '50%'],
            padding : 2,
            sort : 'none', // can be 'none', 'ascending', 'descending'
            sortSub : 'none', // can be 'none', 'ascending', 'descending'
            startAngle : 90,
            clockWise : false,
            showScale : false,
            showScaleText : false,
            itemStyle : {
                normal : {
                    label : {
                        show : true
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    lineStyle : {
                        width : 0,
                        color : '#000'
                    },
                    chordStyle : {
                        lineStyle : {
                            width : 1,
                            color : '#666'
                        }
                    }
                },
                emphasis : {
                    lineStyle : {
                        width : 0,
                        color : '#000'
                    },
                    chordStyle : {
                        lineStyle : {
                            width : 2,
                            color : '#333'
                        }
                    }
                }
            }
        },

        island: {
            r: 15,
            calculateStep: 0.1  // 滚轮可计算步长 0.1 = 10%
        },

        markPoint : {
            symbol: 'pin',         // 标注类型
            symbolSize: 10,        // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            //symbolRotate : null, // 标注旋转控制
            itemStyle: {
                normal: {
                    // color: 各异，
                    // borderColor: 各异,     // 标注边线颜色，优先于color
                    borderWidth: 2,            // 标注边线线宽，单位px，默认为1
                    label: {
                        show: true,
                        position: 'inside' // 可选为'left'|'right'|'top'|'bottom'
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                },
                emphasis: {
                    // color: 各异
                    label: {
                        show: true
                        // position: 'inside'  // 'left'|'right'|'top'|'bottom'
                        // textStyle: null     // 默认使用全局文本样式，详见TEXTSTYLE
                    }
                }
            }
        },

        markLine : {
            // 标线起始和结束的symbol介绍类型，如果都一样，可以直接传string
            symbol: ['circle', 'arrow'],
            // 标线起始和结束的symbol大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            symbolSize: [2, 4],
            // 标线起始和结束的symbol旋转控制
            //symbolRotate : null,
            itemStyle: {
                normal: {
                    // color: 各异,           // 标线主色，线色，symbol主色
                    // borderColor: 随color,     // 标线symbol边框颜色，优先于color
                    borderWidth: 2,          // 标线symbol边框线宽，单位px，默认为2
                    label: {
                        show: false,
                        // 可选为 'start'|'end'|'left'|'right'|'top'|'bottom'
                        position: 'inside',
                        textStyle: {         // 默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333'
                        }
                    },
                    lineStyle: {
                        // color: 随borderColor, // 主色，线色，优先级高于borderColor和color
                        // width: 随borderWidth, // 优先于borderWidth
                        type: 'solid',
                        shadowColor : 'rgba(0,0,0,0)', //默认透明
                        shadowBlur: 5,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3
                    }
                },
                emphasis: {
                    // color: 各异
                    label: {
                        show: false
                        // position: 'inside' // 'left'|'right'|'top'|'bottom'
                        // textStyle: null    // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    lineStyle : {}
                }
            }
        },

        textStyle: {
            decoration: 'none',
            fontFamily: 'Arial, Verdana, sans-serif',
            fontFamily2: '微软雅黑',    // IE8- 字体模糊并且不支持不同字体混排，额外指定一份
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
        },

        // 默认标志图形类型列表
        symbolList : [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'
        ],
        loadingText : 'Loading...',
        // 可计算特性配置，孤岛，提示颜色
        calculable: false,              // 默认关闭可计算特性
        calculableColor: 'rgba(255,165,0,0.6)',       // 拖拽提示边框颜色
        calculableHolderColor: '#ccc', // 可计算占位提示颜色
        nameConnector: ' & ',
        valueConnector: ' : ',
        animation: true,
        animationThreshold: 2500,       // 动画元素阀值，产生的图形原素超过2500不出动画
        addDataAnimation: true,         // 动态数据接口是否开启动画效果
        animationDuration: 2000,
        animationEasing: 'ExponentialOut'    //BounceOut
    };



    var bluetheme2 = {
        // 榛樿鑹叉澘
        color: [
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
        ],

        // 鍥捐〃鏍囬
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#27727B'          // 涓绘爣棰樻枃瀛楅鑹�
            }
        },

        // 鍊煎煙
        dataRange: {
            x:'right',
            y:'center',
            itemWidth: 5,
            itemHeight:25,
            color:['#C1232B','#FCCE10']
        },

        toolbox: {
            color : [
                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD'
            ],
            effectiveColor : '#ff4500'
        },

        // 鎻愮ず妗�
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',     // 鎻愮ず鑳屾櫙棰滆壊锛岄粯璁や负閫忔槑搴︿负0.7鐨勯粦鑹�
            axisPointer : {            // 鍧愭爣杞存寚绀哄櫒锛屽潗鏍囪酱瑙﹀彂鏈夋晥
                type : 'line',         // 榛樿涓虹洿绾匡紝鍙€変负锛�'line' | 'shadow'
                lineStyle : {          // 鐩寸嚎鎸囩ず鍣ㄦ牱寮忚缃�
                    color: '#27727B',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#27727B'
                },
                shadowStyle : {                     // 闃村奖鎸囩ず鍣ㄦ牱寮忚缃�
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        // 鍖哄煙缂╂斁鎺у埗鍣�
        dataZoom: {
            dataBackgroundColor: 'rgba(181,195,52,0.3)',            // 鏁版嵁鑳屾櫙棰滆壊
            fillerColor: 'rgba(181,195,52,0.2)',   // 濉厖棰滆壊
            handleColor: '#27727B'    // 鎵嬫焺棰滆壊
        },

        // 缃戞牸
        grid: {
            borderWidth:0
        },

        // 绫荤洰杞�
        categoryAxis: {
            axisLine: {            // 鍧愭爣杞寸嚎
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: '#27727B'
                }
            },
            splitLine: {           // 鍒嗛殧绾�
                show: false
            }
        },

        // 鏁板€煎瀷鍧愭爣杞撮粯璁ゅ弬鏁�
        valueAxis: {
            axisLine: {            // 鍧愭爣杞寸嚎
                show: false
            },
            splitArea : {
                show: false
            },
            splitLine: {           // 鍒嗛殧绾�
                lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                    color: ['#ccc'],
                    type: 'dashed'
                }
            }
        },

        polar : {
            axisLine: {            // 鍧愭爣杞寸嚎
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: '#ddd'
                }
            },
            splitArea : {
                show : true,
                areaStyle : {
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            },
            splitLine : {
                lineStyle : {
                    color : '#ddd'
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#27727B'
            },
            controlStyle : {
                normal : { color : '#27727B'},
                emphasis : { color : '#27727B'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        // 鎶樼嚎鍥鹃粯璁ゅ弬鏁�
        line: {
            itemStyle: {
                normal: {
                    borderWidth:2,
                    borderColor:'#fff',
                    lineStyle: {
                        width: 3
                    }
                },
                emphasis: {
                    borderWidth:0
                }
            },
            symbol: 'circle',  // 鎷愮偣鍥惧舰绫诲瀷
            symbolSize: 3.5           // 鎷愮偣鍥惧舰澶у皬
        },

        // K绾垮浘榛樿鍙傛暟
        k: {
            itemStyle: {
                normal: {
                    color: '#C1232B',       // 闃崇嚎濉厖棰滆壊
                    color0: '#B5C334',      // 闃寸嚎濉厖棰滆壊
                    lineStyle: {
                        width: 1,
                        color: '#C1232B',   // 闃崇嚎杈规棰滆壊
                        color0: '#B5C334'   // 闃寸嚎杈规棰滆壊
                    }
                }
            }
        },

        // 鏁ｇ偣鍥鹃粯璁ゅ弬鏁�
        scatter: {
            itemStyle: {
                normal: {
                    borderWidth:1,
                    borderColor:'rgba(200,200,200,0.5)'
                },
                emphasis: {
                    borderWidth:0
                }
            },
            symbol: 'star4',    // 鍥惧舰绫诲瀷
            symbolSize: 4        // 鍥惧舰澶у皬锛屽崐瀹斤紙鍗婂緞锛夊弬鏁帮紝褰撳浘褰负鏂瑰悜鎴栬彵褰㈠垯鎬诲搴︿负symbolSize * 2
        },

        // 闆疯揪鍥鹃粯璁ゅ弬鏁�
        radar : {
            symbol: 'emptyCircle',    // 鍥惧舰绫诲瀷
            symbolSize:3
            //symbol: null,         // 鎷愮偣鍥惧舰绫诲瀷
            //symbolRotate : null,  // 鍥惧舰鏃嬭浆鎺у埗
        },

        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#C1232B'
                        }
                    }
                },
                emphasis: {                 // 涔熸槸閫変腑鏍峰紡
                    areaStyle: {
                        color: '#fe994e'
                    },
                    label: {
                        textStyle: {
                            color: 'rgb(100,0,0)'
                        }
                    }
                }
            }
        },

        force : {
            itemStyle: {
                normal: {
                    linkStyle : {
                        color : '#27727B'
                    }
                }
            }
        },

        chord : {
            itemStyle : {
                normal : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis : {
                    borderWidth: 1,
                    borderColor: 'rgba(128, 128, 128, 0.5)',
                    chordStyle : {
                        lineStyle : {
                            color : 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },

        gauge : {
            center:['50%','80%'],
            radius:'100%',
            startAngle: 180,
            endAngle : 0,
            axisLine: {            // 鍧愭爣杞寸嚎
                show: true,        // 榛樿鏄剧ず锛屽睘鎬how鎺у埗鏄剧ず涓庡惁
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: [[0.2, '#B5C334'],[0.8, '#27727B'],[1, '#C1232B']],
                    width: '40%'
                }
            },
            axisTick: {            // 鍧愭爣杞村皬鏍囪
                splitNumber: 2,   // 姣忎唤split缁嗗垎澶氬皯娈�
                length: 5,        // 灞炴€ength鎺у埗绾块暱
                lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                    color: '#fff'
                }
            },
            axisLabel: {           // 鍧愭爣杞存枃鏈爣绛撅紝璇﹁axis.axisLabel
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: '#fff',
                    fontWeight:'bolder'
                }
            },
            splitLine: {           // 鍒嗛殧绾�
                length: '5%',         // 灞炴€ength鎺у埗绾块暱
                lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                    color: '#fff'
                }
            },
            pointer : {
                width : '40%',
                length: '80%',
                color: '#fff'
            },
            title : {
                offsetCenter: [0, -20],       // x, y锛屽崟浣峱x
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto',
                    fontSize: 20
                }
            },
            detail : {
                offsetCenter: [0, 0],       // x, y锛屽崟浣峱x
                textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                    color: 'auto',
                    fontSize: 40
                }
            }
        },

        textStyle: {
            fontFamily: '寰蒋闆呴粦, Arial, Verdana, sans-serif'
        }
    };

    var bluetheme = newrelictheme;