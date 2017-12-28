$(document).ready(function() {
    class PopWindow {
        constructor($ele, opts) {
            const defaults =  { //默认值
                    title: 'window',
                    content: 'Please enter content!',
                };

            this.$container = $ele;     //容器文件
            this.options = $.extend({}, defaults, opts);
            this.init();
        }

        init() {                        //初始化方法
            this.createNode();          //创建节点方法
            this.changeCursor();        //修改光标手势
            this.resize();              //修改窗口尺寸
            this.moveWindow();          //窗口移动方法
            this.destory();             //关闭窗口方法
            this.minWindow();           //最小化窗口
            this.maxWindow();           //最大化窗口
            this.getCurrentWindow();    //获取当前窗口
        }

        createNode() {
            const options = this.options;

            this.$popWindow = $(`<div class="pop-window">
                    <div class="pop-window-header">
                        <h2>${options.title}</h2>
                        <div class="window-control">
                            <button class="contents-min"></button>
                            <button class="pop-window-max"></button>
                            <button class="pop-window-close"></button>
                        </div>
                    </div>
                    <div class="pop-window-content"><p>${options.content}</p></div>
                    <div class="pop-window-mask"></div>
                </div>`).css({
                        left: options.left + 'px',
                        top: options.top + 'px',
                        width: options.width + 'px',
                        }).appendTo(this.$container);
            
            this.setContentHeight(options.height);
                       
        }

        minWindow() {
            this.$popWindow.find('.contents-min').click(() => {
                this.$popWindow.find('.pop-window-content').stop().slideToggle();
            });
        }

        maxWindow() {
            const $window = this.$popWindow;
            let isMax = true;                  
            
            $window.find('.pop-window-max').on('click',{
                width: $window.outerWidth(),
                height: $window.outerHeight(),
            }, (e) => {
                const newWindowWidth = $window.outerWidth(),
                      newWindowHeight = $window.outerHeight(),
                      containerWindth = this.$container.width(),
                      containerHeight = this.$container.height();
                
                if (isMax) {
                    $window.css({
                            width: containerWindth + 'px',
                            left: 0,
                            top: 0,
                        });
                    this.setContentHeight(containerHeight);
                    $window.find('.pop-window-max').css('backgroundImage', 'url(./images/max.png)');
                    isMax = !isMax;
                } else {
                    $window.css({
                            width: e.data.width + 'px',
                        });
                    this.setContentHeight(e.data.height);
                    $window.find('.pop-window-max').css('backgroundImage', 'url(./images/max2.png)');
                    isMax = !isMax;
                }

            });




        }

        moveWindow() {
            const handler = (e) => {
                e.stopPropagation();
                const $parent = this.$popWindow,
                      $this = $parent.find('.pop-window-header'),
                      $container = this.$container,
                      targetName = e.target.nodeName.toLowerCase(),
                      $document = $(document);
                //控制窗口的按钮不可用来移动窗口
                if (targetName === 'button') {
                    return false;
                } 

                //变换手型
                $this.css('cursor', 'move');
                $parent.find('.pop-window-content p').addClass('unselect');

                const preX = e.pageX,   //记录鼠标点击时的位置
                      preY = e.pageY,
                      windowPosition = $parent.position(), //窗口相对容器的偏移量
                      windowLeft = windowPosition.left,
                      windowTop = windowPosition.top,
                      windowMaxLeft = $container.width() - $parent.outerWidth(),     //窗口最大偏移量
                      windowMaxTop = $container.height() - $parent.outerHeight();
                    
                const active = (e) => {
                        let currentX = e.pageX,       //记录鼠标移动时的位置
                            currentY = e.pageY,
                            currentLeft = windowLeft + currentX - preX,      //计算得到窗口当前的偏移量
                            currentTop = windowTop + currentY - preY;            

                        currentLeft = Math.max(0, Math.min(currentLeft, windowMaxLeft));    //限定偏移量的范围
                        currentTop = Math.max(0, Math.min(currentTop, windowMaxTop));

                        $parent.css({          //设置偏移量
                            left: currentLeft + 'px',
                            top: currentTop + 'px'
                        });
                    },
                    offActive = () => {                     //鼠标放开时解绑
                        $this.css('cursor', 'auto');        //恢复手势
                        $parent.find('.pop-window-content p').removeClass('unselect');
                        $document.off('mousemove', active);     
                    };
              
                $document.mousemove(active).mouseup(offActive);
            };

            this.$popWindow.find('.pop-window-header').mousedown(handler).mouseup();  //窗口头部绑定事件
        }

        destory() {
            this.$popWindow.find('.pop-window-close').on('click', () => {    //关闭窗口
                //打开当前关闭窗口的上一个窗口的遮罩
                this.$popWindow.prev().find('.pop-window-mask').hide().end().end().remove();
            });
        }

        setContentHeight(newHeight) {        //更新内容尺寸
            const $window = this.$popWindow,
                  headerHeight = $window.find('.pop-window-header').height(),           //窗口头部高度
                  windowBorderWidth = Number.parseInt($window.css('borderWidth'), 10),  //窗口边框宽度
                  containerHeight = this.$container.height(),   //容器高度
                  windowTop = $window.position().top;

            let contentHeight = Math.min(newHeight, containerHeight - windowTop);
                contentHeight = contentHeight - headerHeight - windowBorderWidth * 2;

            $window.find('.pop-window-content')
                            .css({
                                height: contentHeight + 'px'
                            });      
        }

        getCurrentWindow() {    //获取当前元素
            const hanlder = (e) => {
                //讲选中的元素置于容器的最顶层，并关闭遮罩层，兄弟元素打开遮罩层
                this.$popWindow.appendTo(this.$container).find('.pop-window-mask').hide().end()
                        .siblings().find('.pop-window-mask').show();
            };
            this.$popWindow.on('mousedown', hanlder).trigger('mousedown', hanlder);    //创建窗口是模拟一次mousedown事件
        }

        changeCursor() {        //变换手型方法
            this.mousePosition = '';      //记录当前光标位置
            
            const handler = (e) => {
                const $this = this.$popWindow,
                    windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                    windowOffset = $this.offset(),
                    windowOffsetLeft = windowOffset.left,
                    windowOffsetTop = windowOffset.top,
                    windowWidth = $this.outerWidth(),
                    windowHeight = $this.outerHeight();

                let currentX = e.pageX,
                    currentY = e.pageY;

                let scopeData = {
                        left: currentX >= windowOffsetLeft && 
                                currentX <= windowOffsetLeft + windowBorderWidth,   //左边框判断
                        right: currentX >= windowOffsetLeft + windowWidth - windowBorderWidth && 
                                currentX <= windowOffsetLeft + windowWidth,        //右边框判断
                        top: currentY <= windowOffsetTop + windowBorderWidth && 
                                currentY >= windowOffsetTop,                        //上边框判断
                        bottom: currentY <= windowOffsetTop+ windowHeight && 
                                currentY >= windowOffsetTop + windowHeight - windowBorderWidth,  //下边框判断
                        column: currentY <= windowOffsetTop + windowHeight - windowBorderWidth && 
                                currentY >= windowOffsetTop + windowBorderWidth,   //竖向边框判断
                        row: currentX >= windowOffsetLeft + windowBorderWidth && 
                                currentX <= windowOffsetLeft + windowWidth - windowBorderWidth    //横向边框判断
                    };

                if (scopeData.left && scopeData.column) {           //鼠标悬停左边框
                    $this.css('cursor', 'w-resize');
                    this.mousePosition = 'left';
               
                } else if (scopeData.right && scopeData.column) {   //鼠标悬停右边框
                    $this.css('cursor', 'e-resize'); 
                    this.mousePosition = 'right';
                
                } else if (scopeData.row && scopeData.top) {        //鼠标悬停上边框
                    $this.css('cursor', 'n-resize'); 
                    this.mousePosition = 'top';
                
                } else if (scopeData.row && scopeData.bottom) {     //鼠标悬停下边框
                    $this.css('cursor', 's-resize');   
                    this.mousePosition = 'bottom';
                
                } else if (scopeData.left && scopeData.top) {       //鼠标悬停左上边框
                    $this.css('cursor', 'nw-resize');     
                    this.mousePosition = 'left-top';
                    
                } else if (scopeData.right && scopeData.top) {      //鼠标悬停右上边框
                    $this.css('cursor', 'ne-resize');   
                    this.mousePosition = 'right-top';
               
                } else if (scopeData.right && scopeData.bottom) {   //鼠标悬停右下边框
                    $this.css('cursor', 'se-resize'); 
                    this.mousePosition = 'right-bottom';

                } else if (scopeData.left && scopeData.bottom) {    //鼠标悬停左下边框
                    $this.css('cursor', 'sw-resize');
                    this.mousePosition = 'left-bottom';
                                   
                } else {                                            //鼠标不在边框上
                    $this.css('cursor', 'auto'); 
                    this.mousePosition = '';
                }
            };

            this.$popWindow.mousemove(handler);
        }

        resize() {              //窗口缩放方法
            const $document = $(document),
                handler = (e) => {
                    const $this = this.$popWindow,
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowPosition = $this.position(),        //记录窗口当前相对容器的便宜量
                          windowOffsetLeft = windowPosition.left,
                          windowOffsetTop = windowPosition.top,
                          windowWidth = $this.outerWidth(),         //窗口含边框尺寸
                          windowHeight = $this.outerHeight(),
                          containerWidth = this.$container.innerWidth(),   //容器内框尺寸
                          containerHeight = this.$container.innerHeight(),
                          //窗口的最小宽度=标题宽度+控制器宽度+两边的外边框宽度
                          windowMinWidth = $this.find('h2').innerWidth() + $this.find('.window-control').innerWidth() +
                                                windowBorderWidth * 2,
                          //窗口的最小高度=窗口头部高度的3倍+上下边框宽度
                          windowMinHeight = $this.find('.pop-window-header').innerHeight() * 3 + windowBorderWidth * 2;
    
                    let prevX = e.pageX,    //记录当前光标位置
                        prevY = e.pageY,
                        active1 = null,
                        active2 = null;      

                    const scaleLeft = () => {   //左缩放函数
                            return (e) => {
                                let currentX = e.pageX,     //缩放时当前e的X轴偏移量
                                    windowMaxWidth = windowWidth + windowOffsetLeft,    //窗口可变最大宽度
                                    windowMaxLeft = windowOffsetLeft + windowWidth - windowMinWidth,    //窗口可变的最大左偏移量
                                    currentWidth = windowWidth + prevX - currentX,      //计算得到窗口缩放后的值
                                    currentLeft = windowOffsetLeft + currentX - prevX;  //计算窗口缩放后的左偏移量
                                
                                //限定宽度及左偏移量的范围
                                currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                                currentLeft = Math.max(0, Math.min(currentLeft, windowMaxLeft));
        
                                $this.css({     //设置窗口样式
                                    width: currentWidth + 'px',
                                    left: currentLeft + 'px'
                                });
                            };
                        },

                        scaleTop = () => {      //上缩放函数
                            return (e) => {
                                let currentY = e.pageY,
                                    windowMaxHeight = windowHeight + windowOffsetTop,       //窗口可变最大高度
                                    windowMaxTop = windowOffsetTop + windowHeight - windowMinHeight,    //窗口可变最大上偏移量
                                    currentHeight = windowHeight + prevY - currentY,
                                    currentTop = windowOffsetTop + currentY - prevY;
                                
                                //限定窗口高度和上偏移量的范围
                                currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                                currentTop = Math.max(0, Math.min(currentTop, windowMaxTop));
                                
                                $this.css({
                                    top: currentTop + 'px'
                                });

                                this.setContentHeight(currentHeight);    //更新内容区高度
                            };
                        },

                        scaleRight = () => {    //右缩放函数
                            return (e) => {
                                let currentX = e.pageX,
                                    windowMaxWidth = containerWidth - windowOffsetLeft,
                                    currentWidth = windowWidth + currentX - prevX;
                                    
                                currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                                $this.css({
                                    width: currentWidth + 'px'
                                });
                            };
                        },

                        scaleBottom = () => {   //下缩放函数
                            return (e) => {
                                let currentY = e.pageY,
                                    windowMaxHeight = containerHeight - windowOffsetTop,
                                    currentHeight = windowHeight + currentY - prevY;
                                    
                                currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                                
                                this.setContentHeight(currentHeight);
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
                        this.setMask();
                        };

                    $document.mousemove(active1).mousemove(active2).mouseup(offActive);
                };

            this.$popWindow.mousedown(handler);
        }

        setMask() {             //设置遮罩层
            let windowWidth = this.$popWindow.outerWidth(),
                windowHeight = this.$popWindow.outerHeight(),
                windowBorderWidth = Number.parseInt(this.$popWindow.css('borderWidth'), 10);
            
            this.$popWindow.find('.pop-window-mask').css({
                width: windowWidth + 'px',
                height: windowHeight +'px',
                left: -windowBorderWidth + 'px',
                top: -windowBorderWidth + 'px'
            });
        }
    };

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