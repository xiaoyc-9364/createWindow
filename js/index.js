class PopWindow {
    constructor($ele, opts) {
        this.options = {            //默认值
            title: 'window',
            content: 'Please enter content!',
            minWidth: 250,
            minHeight: 150,
            maxWidth: 600,
            maxHeight: 400,
            isCollapsed: false,     //是否最小化
            isMax: false            //是否最大化
        };

        this.$container = $ele;     //容器文件
        Object.assign(this.options, opts);
        this.init();
    }

    init() {                        //初始化方法
        this.createNode();          //创建节点方法
        this.addEvent();
        this.getCurrentWindow();    //获取当前窗口
        this.changeCursor();        //修改光标手势
        this.resizeWindow();              //修改窗口尺寸
        this.dragWindow();          //窗口移动方法
    }

    createNode() {
        const options = this.options;

        this.$popWindow = $(`<div class="pop-window">
                <div class="pop-window-header">
                    <h2>${options.title}</h2>
                    <div class="window-control">
                        <button class="pop-window-collapse"></button>
                        <button class="pop-window-max"></button>
                        <button class="pop-window-close"></button>
                    </div>
                </div>
                <div class="pop-window-content"><p>${options.content}</p></div>
            </div>`).css({
                    left: options.left + 'px',
                    top: options.top + 'px',
                    width: options.width + 'px',
                    height: options.height + 'px',
                    }).appendTo(this.$container);
        
        this.$windowHeader = this.$popWindow.find('.pop-window-header');
        this.$collapseWindowBtn = this.$popWindow.find('.pop-window-collapse');
        this.$maxWindowBtn = this.$popWindow.find('.pop-window-max');
        this.$closeWindowBtn = this.$popWindow.find('.pop-window-close');           
    }

    getWindowData() {
        const $window = this.$popWindow,
              windowPosition = $window.position(),
              windowOffset = $window.offset(),
              $parent = this.$container;

        return this.windowData = {
            width: $window.outerWidth(),
            height: $window.outerHeight(),
            left: windowPosition.left,
            top: windowPosition.top,
            offsetLeft: windowOffset.left,
            offsetTop: windowOffset.top,
            headerHeight: this.$windowHeader.height(),
            borderWidth: Number.parseInt($window.css('borderWidth'), 10),
            parentWidth: $parent.width(),
            parentHeight: $parent.height(),
        };
    }

    addEvent() {
        this.$closeWindowBtn.click(() => {
            this.destoryWindow();
        });
        
        this.$collapseWindowBtn.click(() => {
            this.$popWindow.addClass('transition');
            this.collapseWindow(this.options.isCollapsed);
            this.options.isCollapsed = !this.options.isCollapsed;
        }).dblclick((e) => {
            e.stopPropagation();
        });

        const maxWindowHandler = (e) => {
            // e.stopPropagation();
            this.$popWindow.removeClass('transition');
            this.makeMaxWindow(this.options.isMax)
            this.options.isMax = !this.options.isMax;
        };

        this.$maxWindowBtn.click(maxWindowHandler);

        this.$windowHeader.dblclick(maxWindowHandler);
    }

    collapseWindow(isCollapsed) {
        if (isCollapsed) {
            this.$popWindow.css({
                height: this.oldHeight + 'px'
            });

        } else {
            const winData = this.getWindowData();
            this.oldHeight = winData.height;        //记录折叠前窗口高度

            this.$popWindow.css({
                height: winData.headerHeight + winData.borderWidth * 2 + 'px'
            }); 
        } 
    }

    makeMaxWindow(isMax) {
        if (isMax) {
            this.$popWindow.css({
                width: this.prevWindowData.width + 'px',
                height: this.prevWindowData.height + 'px',
                left: this.prevWindowData.left + 'px',
                top: this.prevWindowData.top + 'px'
            });
            this.$maxWindowBtn.removeClass('pop-window-small'); 
            this.oldHeight = this.prevWindowData.height;
        } else {
            const winData = this.getWindowData();
            this.prevWindowData = winData;          //记录窗口最大化前的状态
            this.oldHeight = winData.height;
            this.$popWindow.css({
                width: winData.parentWidth + 'px',
                height: winData.parentHeight + 'px',
                left: 0,
                top: 0
            });
            this.$maxWindowBtn.addClass('pop-window-small');   
        }
    }

    dragWindow() {
        const handler = (e) => {
            const targetName = e.target.nodeName.toLowerCase(),
                  $document = $(document);
            //控制窗口的按钮不可用来移动窗口
            if (targetName === 'button') {
                return false;
            } 

            //变换手型
            this.$windowHeader.addClass('moving');
            $('body').addClass('unselect');

            const preX = e.pageX,   //记录鼠标点击时的位置
                preY = e.pageY,
                winData = this.getWindowData(),
                windowMaxLeft = winData.parentWidth - winData.width,     //窗口最大偏移量
                windowMaxTop = winData.parentHeight - winData.height;
                
            const active = (e) => {
                    let currentX = e.pageX,       //记录鼠标移动时的位置
                        currentY = e.pageY,
                        currentLeft = winData.left + currentX - preX,      //计算得到窗口当前的偏移量
                        currentTop = winData.top + currentY - preY;            

                    currentLeft = Math.max(0, Math.min(currentLeft, windowMaxLeft));    //限定偏移量的范围
                    currentTop = Math.max(0, Math.min(currentTop, windowMaxTop));

                    this.$popWindow.css({          //设置偏移量
                        left: currentLeft + 'px',
                        top: currentTop + 'px'
                    });
                },
                offActive = () => {                     //鼠标放开时解绑
                    this.$windowHeader.removeClass('moving');
                    $('body').removeClass('unselect');
                    $document.off('mousemove', active);  
                };
          
            $document.mousemove(active).mouseup(offActive);
        };

        this.$windowHeader.mousedown(handler);  //窗口头部绑定事件
    }

    destoryWindow() {   //关闭窗口
        this.$popWindow.remove();
    }

    getCurrentWindow() {    //获取当前元素
        const hanlder = () => {
            this.$popWindow.appendTo(this.$container);
        };
        this.$popWindow.mousedown(hanlder);
    }

    changeCursor() {        //变换手型方法
        this.mousePosition = '';      //记录当前光标位置
        
        const handler = (e) => {
            const $window = this.$popWindow,
                winData = this.getWindowData(),
                currentX = e.pageX,
                currentY = e.pageY;

            let scopeData = {
                    onLeft: currentX >= winData.offsetLeft && 
                            currentX <= winData.offsetLeft + winData.borderWidth,   //左边框判断

                    onRight: currentX >= winData.offsetLeft + winData.width - winData.borderWidth && 
                            currentX <= winData.offsetLeft + winData.width,        //右边框判断

                    onTop: currentY <= winData.offsetTop + winData.borderWidth && 
                            currentY >= winData.offsetTop,                        //上边框判断

                    onBottom: currentY <= winData.offsetTop+ winData.height && 
                            currentY >= winData.offsetTop + winData.height - winData.borderWidth,  //下边框判断

                    onColumn: currentY <= winData.offsetTop + winData.height - winData.borderWidth && 
                            currentY >= winData.offsetTop + winData.borderWidth,   //竖向边框判断

                    onRow: currentX >= winData.offsetLeft + winData.borderWidth && 
                            currentX <= winData.offsetLeft + winData.width - winData.borderWidth    //横向边框判断
                };

            if (scopeData.onLeft && scopeData.onColumn) {           //鼠标悬停左边框
                $window.css('cursor', 'w-resize');
                this.mousePosition = 'left';
           
            } else if (scopeData.onRight && scopeData.onColumn) {   //鼠标悬停右边框
                $window.css('cursor', 'e-resize'); 
                this.mousePosition = 'right';
            
            } else if (scopeData.onRow && scopeData.onTop) {        //鼠标悬停上边框
                $window.css('cursor', 'n-resize'); 
                this.mousePosition = 'top';
            
            } else if (scopeData.onRow && scopeData.onBottom) {     //鼠标悬停下边框
                $window.css('cursor', 's-resize');   
                this.mousePosition = 'bottom';
            
            } else if (scopeData.onLeft && scopeData.onTop) {       //鼠标悬停左上边框
                $window.css('cursor', 'nw-resize');     
                this.mousePosition = 'left-top';
                
            } else if (scopeData.onRight && scopeData.onTop) {      //鼠标悬停右上边框
                $window.css('cursor', 'ne-resize');   
                this.mousePosition = 'right-top';
           
            } else if (scopeData.onRight && scopeData.onBottom) {   //鼠标悬停右下边框
                $window.css('cursor', 'se-resize'); 
                this.mousePosition = 'right-bottom';

            } else if (scopeData.onLeft && scopeData.onBottom) {    //鼠标悬停左下边框
                $window.css('cursor', 'sw-resize');
                this.mousePosition = 'left-bottom';
                               
            } else {                                            //鼠标不在边框上
                $window.css('cursor', 'auto'); 
                this.mousePosition = '';
            }
        };

        this.$popWindow.mousemove(handler);
    }

    resizeWindow() {              //窗口缩放方法
        const $document = $(document),
            handler = (e) => {
                const $this = this.$popWindow,
                    windowData = this.getWindowData(),
                    options = this.options;

                let prevX = e.pageX,    //记录当前光标位置
                    prevY = e.pageY,
                    active1 = null,
                    active2 = null;      

                this.$popWindow.removeClass('transition');

                const scaleLeft = () => {   //左缩放函数
                        return (e) => {
                            let currentX = e.pageX,     //缩放时当前e的X轴偏移量
                                currentLeft = windowData.left + currentX - prevX,  //计算窗口缩放后的左偏移量
                                windowMaxLeft = windowData.left + windowData.width - options.minWidth,    //窗口可变的最大左偏移量
                                windowMinLeft = Math.max(0, windowData.left + windowData.width - options.maxWidth);
                                
                            //限定宽度及左偏移量的范围
                            currentLeft = Math.max(windowMinLeft, Math.min(currentLeft, windowMaxLeft));
                            //宽度的改变量为left的改变量
                            const currentWidth = windowData.width + windowData.left - currentLeft;

                            $this.css({     //设置窗口样式
                                width: currentWidth + 'px',
                                left: currentLeft + 'px'
                            });
                        };
                    },

                    scaleTop = () => {      //上缩放函数
                        return (e) => {
                            let currentY = e.pageY,
                                currentTop = windowData.top + currentY - prevY,
                                windowMaxTop = windowData.top + windowData.height - options.minHeight,    //窗口可变最大上偏移量
                                windowMinTop = Math.max(0, windowData.top + windowData.height - options.maxHeight);
                            
                            //限定窗口高度和上偏移量的范围
                            currentTop = Math.max(windowMinTop, Math.min(currentTop, windowMaxTop));

                            const currentHeight = windowData.height + windowData.top - currentTop;
                            
                            $this.css({
                                height: currentHeight + 'px',
                                top: currentTop + 'px'
                            });
                        };
                    },

                    scaleRight = () => {    //右缩放函数
                        return (e) => {
                            let currentX = e.pageX,
                                currentWidth = windowData.width + currentX - prevX,
                                windowMaxWidth = Math.min(windowData.parentWidth - windowData.left, options.maxWidth);
                                
                            currentWidth = Math.max(options.minWidth, Math.min(currentWidth, windowMaxWidth));
                            
                            $this.css({
                                width: currentWidth + 'px'
                            });
                        };
                    },

                    scaleBottom = () => {   //下缩放函数
                        return (e) => {
                            let currentY = e.pageY,
                                currentHeight = windowData.height + currentY - prevY,
                                windowMaxHeight = Math.min(windowData.parentHeight - windowData.top, options.maxHeight);

                            currentHeight = Math.max(options.minHeight, Math.min(currentHeight, windowMaxHeight));

                            $this.css({
                                height: currentHeight + 'px'
                            });
                        };
                    };

                switch (this.mousePosition) {       //获取鼠标所在位置的关键词
                    case 'left':
                        active1 = scaleLeft();
                        active2 = null;
                        break;

                    case 'right':
                        active1 = scaleRight();
                        active2 = null;
                        break;

                    case 'top':
                        active1 = scaleTop();
                        active2 = null;
                        break;

                    case 'bottom':
                        active1 = scaleBottom();
                        active2 = null;
                        break;
                    
                    case 'left-top':
                        active1 = scaleLeft();
                        active2 = scaleTop();
                        break;

                    case 'right-top':
                        active1 = scaleRight();
                        active2 = scaleTop();
                        break;

                    case 'right-bottom':
                        active1 = scaleRight();
                        active2 = scaleBottom();
                        break;

                    case 'left-bottom':
                        active1 = scaleLeft();
                        active2 = scaleBottom();
                        break;

                    default:
                        active1 = null;
                        active2 = null;
                }
                
                const offActive = () => {
                    $document.off('mousemove', active1).off('mousemove', active2);
                    };

                $document.mousemove(active1).mousemove(active2).mouseup(offActive);
            };

        this.$popWindow.mousedown(handler);
    }
};


$(document).ready(function() {
   

    $('.create-btn').click(function() {
        const opt = {
            left: $('.position-x').val(),
            top: $('.position-y').val(),
            width: $('.size-width').val(),
            height: $('.size-height').val(),
            title: $('.header-text').val(),
            content: $('.content-text').val()
        };

        new PopWindow($('.container'), opt);

    });
 
});