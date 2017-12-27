$(document).ready(function() {
    class PopWindow {
        constructor($ele, opts) {
            const defaults =  {
                title: 'window',
                content: 'Please enter content!'
            };

            this.$container = $ele;
            this.options = $.extend({}, defaults, opts);
            this.init();
        }

        init() {
            this.createNode();
            this.destory();
            this.move();
            this.minWindow();
            this.maxWindow();
            this.getCurrentWindow();
            this.changeSize();
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
                    <div class="pop-window-content"><p class="content-text">${options.content}</p></div>
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
            const _this = this;
            const handler = function(e) {
                const $self = $(this);
                //控制窗口的按钮不可用来移动窗口
                if (e.target.nodeName.toLowerCase() === 'button') {
                    return false;
                } 

                //变换手型
                $self.css('cursor', 'move');

                const curX = e.pageX,   //记录鼠标点击时的位置
                      curY = e.pageY,
                      windowPosition = _this.$popWindow.position(), //窗口相对容器的偏移量
                      windowLeft = windowPosition.left,
                      windowTop = windowPosition.top,
                      windowMaxLeft = _this.$container.width() - _this.$popWindow.outerWidth(),
                      windowMaxTop = _this.$container.height() - _this.$popWindow.outerHeight();
                    
                const active = function(e) {
                    let newX = e.pageX,       //记录鼠标移动时的位置
                        newY = e.pageY,
                        newLeft = windowLeft + newX - curX,      //计算得到窗口当前的偏移量
                        newTop = windowTop + newY - curY;            

                    newLeft = Math.max(0, Math.min(newLeft, windowMaxLeft));    //限定偏移量的范围
                    newTop = Math.max(0, Math.min(newTop, windowMaxTop));

                    _this.$popWindow.css({      //设置偏移量
                        left: newLeft + 'px',
                        top: newTop + 'px'
                    });
                };
              
                $(document).mousemove(active).mouseup(function() {      //鼠标放开时解绑
                    $self.css('cursor', 'auto');
                    $(this).unbind('mousemove', active);
                });
                
            };
            this.$popWindow.find('.pop-window-header').mousedown(handler);
        }

        destory() {
            const _this = this;
            this.$popWindow.find('.pop-window-close').click(function() {
                _this.$popWindow.remove();
            });
        }

        updateContextHeight(newHeight) {
            const headerHeight = this.$popWindow.find('.pop-window-header').height(),
                  windowBorderWidth = Number.parseInt(this.$popWindow.css('borderWidth'), 10);
            this.$popWindow.find('.pop-window-content')
                           .css({
                            height: newHeight - headerHeight - windowBorderWidth * 2 + 'px'
                            });      
        }

        getCurrentWindow() {
            let _this = this;
            this.$popWindow.mousedown(function(e) {
                $(this).appendTo(_this.$container)
                // .css({

                // }).siblings().css({
                //     boxShadow: 'inset 500px 500px 0 #fff'
                // });
            });
        }

        changeSize() {
            const _this = this,
                  $document = $(document);
            this.$popWindow.mousemove(function(e) {
                    const $this = $(this),
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowOffsetLeft = $this.offset().left,
                          windowOffsetTop = $this.offset().top,
                          windowWidth = $this.outerWidth(),
                          windowHeight = $this.outerHeight();

                    let curX = e.originalEvent.layerX,
                        curY = e.originalEvent.layerY;

                    let scopeData = {
                        left: curX >= 0 && curX <= windowBorderWidth,   //左边框判断
                        right: curX >= windowWidth - windowBorderWidth && curX <= windowWidth,  //右边框判断
                        top: curY <= windowBorderWidth && curY >= 0,    //上边框判断
                        bottom: curY <= windowHeight && curY >= windowHeight - windowBorderWidth,  //下边框判断
                        column: curY <= windowHeight - windowBorderWidth && curY >= windowBorderWidth,   //竖向边框判断
                        row: curX >= windowBorderWidth && curX <= windowWidth - windowBorderWidth    //横向边框判断
                    };
                    //鼠标悬停左边框
                    if (scopeData.left && scopeData.column) {
                        $this.css('cursor', 'w-resize');
                        
                    //鼠标悬停右边框
                    } else if (scopeData.right && scopeData.column) {
                        $this.css('cursor', 'e-resize'); 
                        
                    //鼠标悬停上边框
                    } else if (scopeData.row && scopeData.top) {
                        $this.css('cursor', 'n-resize'); 
                        
                    //鼠标悬停下边框
                    } else if (scopeData.row && scopeData.bottom) {
                        $this.css('cursor', 's-resize');   
                    
                    //鼠标悬停左上边框
                    } else if (scopeData.left && scopeData.top) {
                        $this.css('cursor', 'nw-resize');     
                        
                    //鼠标悬停右上边框
                    } else if (scopeData.right && scopeData.top) {
                        $this.css('cursor', 'ne-resize');   
                    
                    //鼠标悬停右下边框
                    } else if (scopeData.right && scopeData.bottom) {
                        $this.css('cursor', 'se-resize'); 

                     //鼠标悬停左下边框
                    } else if (scopeData.left && scopeData.bottom) {
                        $this.css('cursor', 'sw-resize');               
                    } else {
                        $this.css('cursor', 'auto'); 
                    }
                });

            this.$popWindow.mousedown(function(e) {
                    const $this = $(this),
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowOffsetLeft = $this.position().left,
                          windowOffsetTop = $this.position().top,
                          windowWidth = $this.outerWidth(),
                          windowHeight = $this.outerHeight(),
                          containerWidth = _this.$container.innerWidth(),
                          containerHeight = _this.$container.innerHeight(),
                          windowMinWidth = $this.find('h2').innerWidth() + $this.find('.window-control').innerWidth() +
                                            windowBorderWidth * 2,
                          windowMinHeight = $this.find('.pop-window-header').innerHeight() + 
                                            $this.find('.pop-window-content p').innerHeight() + windowBorderWidth * 2;


                    let curX = e.originalEvent.layerX,
                        curY = e.originalEvent.layerY,
                        oldX = e.pageX,
                        oldY = e.pageY;

                    let scopeData = {
                        left: curX >= 0 && curX <= windowBorderWidth,   //左边框判断
                        right: curX >= windowWidth - windowBorderWidth && curX <= windowWidth,  //右边框判断
                        top: curY <= windowBorderWidth && curY >= 0,    //上边框判断
                        bottom: curY <= windowHeight && curY >= windowHeight - windowBorderWidth,  //下边框判断
                        column: curY <= windowHeight - windowBorderWidth && curY >= windowBorderWidth,   //竖向边框判断
                        row: curX >= windowBorderWidth && curX <= windowWidth - windowBorderWidth    //横向边框判断
                    };
                    //鼠标悬停左边框
                    if (scopeData.left && scopeData.column) {
                        // $this.css('cursor', 'w-resize');
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + oldX - nowX,
                                currentLeft = windowOffsetLeft + nowX - oldX;

                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));

                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px'
                            });
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                    //鼠标悬停右边框
                    } else if (scopeData.right && scopeData.column) {
                        // $this.css('cursor', 'e-resize');
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + nowX - oldX;
                                 
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            $this.css({
                                width: currentWidth + 'px'
                            });
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                        
                    //鼠标悬停上边框
                    } else if (scopeData.row && scopeData.top) {
                        // $this.css('cursor', 'n-resize'); 
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + oldY - nowY,
                                currentTop = windowOffsetTop + nowY - oldY;

                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            console.log(windowMinHeight);
                            $this.css({
                                height: currentHeight + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                        
                    //鼠标悬停下边框
                    } else if (scopeData.row && scopeData.bottom) {
                        // $this.css('cursor', 's-resize');  
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + nowY - oldY;
                                 
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            $this.css({
                                height: currentHeight + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        }); 
                    
                    //鼠标悬停左上边框
                    } else if (scopeData.left && scopeData.top) {
                        // $this.css('cursor', 'nw-resize');     
                        
                    //鼠标悬停右上边框
                    } else if (scopeData.right && scopeData.top) {
                        // $this.css('cursor', 'ne-resize');   
                    
                    //鼠标悬停右下边框
                    } else if (scopeData.right && scopeData.bottom) {
                        // $this.css('cursor', 'se-resize'); 

                     //鼠标悬停左下边框
                    } else if (scopeData.left && scopeData.bottom) {
                        // $this.css('cursor', 'sw-resize');               
                    } else {
                        // $this.css('cursor', 'auto'); 
                    }
                });
        
        }

        resize() {

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