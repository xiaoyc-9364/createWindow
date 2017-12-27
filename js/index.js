$(document).ready(function() {
    class PopWindow {
        constructor($ele, opts) {
            const defaults =  { //默认值
                title: 'window',
                content: 'Please enter content!'
            };

            this.$container = $ele;     //容器文件
            this.options = $.extend({}, defaults, opts);
            this.init();
            this.getCurrentWindow();    //获取当前窗口
        }

        init() {                        //初始化方法
            this.createNode();          //创建节点方法
            
            this.changeCursor();        //修改光标手势
            this.resize();              //修改窗口尺寸
            this.move();                //窗口移动方法
            this.destory();             //关闭窗口方法
            this.minWindow();           //最小化窗口
            this.maxWindow();           //最大化窗口
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
            
            this.updateContextHeight(options.height);
                       
        }

        minWindow() {
            const _this = this;
            this.$popWindow.find('.contents-min').click(function() {
                _this.$popWindow.find('.pop-window-content').stop().slideToggle();
            });
        }

        maxWindow() {
            const _this = this,
                  $window = this.$popWindow,
                  curWindowWidth = $window.width(),
                  curWindowHeight = $window.height();
                  

            this.$popWindow.find('.pop-window-max').click(function() {
                const newWindowWidth = $window.width(),
                      newWindowHeight = $window.height(),
                      containerWindth = _this.$container.width(),
                      containerHeight = _this.$container.height();
                
                var isMax = true;

                if (isMax) {
                    $window.css({
                            width: containerWindth + 'px',
                            left: 0,
                            top: 0,
                        });
                    _this.updateContextHeight(containerHeight);
                    $(this).css('backgroundImage', 'url(./images/max.png)');
                    isMax = false;
                } else {
                    $window.css({
                            width: _this.options.width + 'px',
                        });
                    _this.updateContextHeight(_this.options.height);
                    $(this).css('backgroundImage', 'url(./images/max2.png)');
                    isMax = true;
                }

            });




        }

        move() {
            const handler = function(e) {
                const $this = $(this),
                      $parent = $this.parent(),
                      $container = $parent.parent(),
                      targetName = e.target.nodeName.toLowerCase();
                //控制窗口的按钮不可用来移动窗口
                if (targetName === 'button') {
                    return false;
                } 

                //变换手型
                $this.css('cursor', 'move');

                const preX = e.pageX,   //记录鼠标点击时的位置
                      preY = e.pageY,
                      windowPosition = $parent.position(), //窗口相对容器的偏移量
                      windowLeft = windowPosition.left,
                      windowTop = windowPosition.top,
                      windowMaxLeft = $container.width() - $parent.outerWidth(),     //窗口最大偏移量
                      windowMaxTop = $container.height() - $parent.outerHeight();
                    
                const active = function(e) {
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
                };
              
                $(document).mousemove(active).mouseup(function() {      //鼠标放开时解绑
                    $this.css('cursor', 'auto');                        //恢复手势
                    $(this).off('mousemove', active);                   
                });
                
            };
            this.$popWindow.find('.pop-window-header').mousedown(handler);  //窗口头部绑定事件
        }

        destory() {
            const _this = this;
            this.$popWindow.find('.pop-window-close').click(function() {    //关闭窗口
                _this.$popWindow.remove();
            });
        }

        updateContextHeight(newHeight) {        //更新内容尺寸
            const $window = this.$popWindow,
                  headerHeight = $window.find('.pop-window-header').height(),      //窗口头部高度
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
            let _this = this;
            this.$popWindow.on('mousedown', function(e) {
                //讲选中的元素置于容器的最顶层，并关闭遮罩层，兄弟元素打开遮罩层
                $(this).appendTo(_this.$container).find('.pop-window-mask').hide().end()
                        .siblings().find('.pop-window-mask').show();
            }).trigger('mousedown');    //创建窗口是模拟一次mousedown事件
        }

        changeCursor() {        //变换手型方法
            const _this = this;
                  this.mousePosition = '';      //记录当前光标位置
            
            const handler = function(e) {
                const $this = $(this),
                      windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                      windowWidth = $this.outerWidth(),
                      windowHeight = $this.outerHeight();

                let curX = e.originalEvent.layerX,      //记录光标与窗口外边的相对距离
                    curY = e.originalEvent.layerY;

                let scopeData = {   
                    left: curX >= 0 && curX <= windowBorderWidth,   //左边框判断
                    right: curX >= windowWidth - windowBorderWidth && curX <= windowWidth,  //右边框判断
                    top: curY <= windowBorderWidth && curY >= 0,    //上边框判断
                    bottom: curY <= windowHeight && curY >= windowHeight - windowBorderWidth,  //下边框判断
                    column: curY <= windowHeight - windowBorderWidth && curY >= windowBorderWidth,   //竖向边框判断
                    row: curX >= windowBorderWidth && curX <= windowWidth - windowBorderWidth    //横向边框判断
                };
                
                if (scopeData.left && scopeData.column) {           //鼠标悬停左边框
                    $this.css('cursor', 'w-resize');
                    _this.mousePosition = 'left';
               
                } else if (scopeData.right && scopeData.column) {   //鼠标悬停右边框
                    $this.css('cursor', 'e-resize'); 
                    _this.mousePosition = 'right';
                
                } else if (scopeData.row && scopeData.top) {        //鼠标悬停上边框
                    $this.css('cursor', 'n-resize'); 
                    _this.mousePosition = 'top';
                
                } else if (scopeData.row && scopeData.bottom) {     //鼠标悬停下边框
                    $this.css('cursor', 's-resize');   
                    _this.mousePosition = 'bottom';
                
                } else if (scopeData.left && scopeData.top) {       //鼠标悬停左上边框
                    $this.css('cursor', 'nw-resize');     
                    _this.mousePosition = 'left-top';
                    
                } else if (scopeData.right && scopeData.top) {      //鼠标悬停右上边框
                    $this.css('cursor', 'ne-resize');   
                    _this.mousePosition = 'right-top';
               
                } else if (scopeData.right && scopeData.bottom) {   //鼠标悬停右下边框
                    $this.css('cursor', 'se-resize'); 
                    _this.mousePosition = 'right-bottom';

                 
                } else if (scopeData.left && scopeData.bottom) {    //鼠标悬停左下边框
                    $this.css('cursor', 'sw-resize');
                    _this.mousePosition = 'left-bottom';
                                   
                } else {                                            //鼠标不在边框上
                    $this.css('cursor', 'auto'); 
                    _this.mousePosition = '';
                }
            };

            this.$popWindow.mousemove(handler);
        }

        resize() {              //窗口缩放方法
            const _this = this,
                  handler = function(e) {
                    const $this = $(this),
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowPosition = $this.position(),        //记录窗口当前相对容器的便宜量
                          windowOffsetLeft = windowPosition.left,
                          windowOffsetTop = windowPosition.top,
                          windowWidth = $this.outerWidth(),         //窗口含边框尺寸
                          windowHeight = $this.outerHeight(),
                          containerWidth = _this.$container.innerWidth(),   //容器内框尺寸
                          containerHeight = _this.$container.innerHeight(),
                          //窗口的最小宽度=标题宽度+控制器宽度+两边的外边框宽度
                          windowMinWidth = $this.find('h2').innerWidth() + $this.find('.window-control').innerWidth() +
                                                windowBorderWidth * 2,
                          //窗口的最小高度=窗口头部高度的3倍+上下边框宽度
                          windowMinHeight = $this.find('.pop-window-header').innerHeight() * 3 + windowBorderWidth * 2;
    
                    let prevX = e.pageX,
                        prevY = e.pageY,
                        active = null;
    
                    if (_this.mousePosition === 'left') {   //左边缩放
                        active = function(e) {
                            let currentX = e.pageX,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + prevX - currentX,
                                currentLeft = windowOffsetLeft + currentX - prevX;
    
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));
    
                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px'
                            });
                        };
    
                    } else if (_this.mousePosition === 'right') {   
                        active = function(e) {
                            let currentX = e.pageX,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + currentX - prevX;
                                 
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            $this.css({
                                width: currentWidth + 'px'
                            });
                        };
    
                    } else if (_this.mousePosition === 'top') {
                        active = function(e) {
                            let currentY = e.pageY,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + prevY - currentY,
                                currentTop = windowOffsetTop + currentY - prevY;
    
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            $this.css({
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                        };
    
                    } else if (_this.mousePosition === 'bottom') {
                        active = function(e) {
                            let currentY = e.pageY,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + currentY - prevY;
                                 
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            
                            _this.updateContextHeight(currentHeight);
                        };
    
                    } else if (_this.mousePosition === 'left-top') {
                        active = function(e) {
                            let currentX = e.pageX,
                                currentY = e.pageY,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + prevX - currentX,
                                currentLeft = windowOffsetLeft + currentX - prevX,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + prevY - currentY,
                                currentTop = windowOffsetTop + currentY - prevY;
    
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));
    
                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };
    
                    } else if (_this.mousePosition === 'right-top') {
                        active = function(e) {
                            let currentX = e.pageX,
                                currentY = e.pageY,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + currentX - prevX,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + prevY - currentY,
                                currentTop = windowOffsetTop + currentY - prevY;
    
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
    
                            $this.css({
                                width: currentWidth + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                        };
    
                    } else if (_this.mousePosition === 'right-bottom') {
                        active = function(e) {
                            let currentX = e.pageX,
                                currentY = e.pageY,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + currentX - prevX,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + currentY - prevY;
                                 
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            
                            $this.css({
                                width: currentWidth + 'px',
                            });
                            _this.updateContextHeight(currentHeight);
                        };
    
                    } else if (_this.mousePosition === 'left-bottom') {
                        active = function(e) {
                            let currentX = e.pageX,
                                currentY = e.pageY,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + prevX - currentX,
                                currentLeft = windowOffsetLeft + currentX - prevX,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + currentY - prevY;
                                 
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));
    
                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px',
                            });
                            _this.updateContextHeight(currentHeight);
                        };               
                    } else {
                        active = null;
                    }
    
                    $(document).mousemove(active).mouseup(function() {
                        $(this).off('mousemove', active);
                        _this.setMask();
                    });
    
                    
                };
            this.$popWindow.mousedown(handler);
        }

        setMask() {
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