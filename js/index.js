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
            // this.addHandler();
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
                    <div class="pop-window-content"><p>${options.content}</p></div>
                </div>`).css({
                        left: options.left + 'px',
                        top: options.top + 'px',
                        width: options.width + 'px',
                        // height:options.height + 'px'
                        })
                        .appendTo(this.$container);
            const headerHeight = this.$popWindow.find('.pop-window-header').height();
            this.$popWindow.find('.pop-window-content').height(options.height - headerHeight);
                       
        }

        minWindow() {
            const _this = this;
            this.$popWindow.find('.contents-min').click(function() {
                _this.$popWindow.find('.pop-window-content').slideToggle();
            });
        }

        maxWindow() {
            const _this = this;



            
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

                const $document = $(document);
                $document.mousemove(active);        //document绑定鼠标移动事件
                $document.mouseup(function() {      //鼠标放开时解绑
                    $self.css('cursor', 'auto');
                    $(this).unbind('mousemove', active);
                });
                
            }
            this.$popWindow.find('.pop-window-header').mousedown(handler);
        }

        destory() {
            const _this = this;
            this.$popWindow.find('.pop-window-close').click(function() {
                _this.$popWindow.remove();
            });
        }

        getCurrentWindow() {
            let _this = this;
            this.$popWindow.mousedown(function(e) {
                $(this).appendTo(_this.$container).siblings().css();
            });
        }

        changeSize() {
            this.$popWindow.each(function() {
                const $this = $(this);
                $(this).mousemove(function(e) {
                    const $self = $(this),
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowOffsetLeft = $this.offset().left,
                          windowOffsetTop = $this.offset().top,
                          windowWidth = $this.outerWidth(),
                          windowHeight = $this.outerHeight();

                    let diffX = e.pageX,
                        diffY = e.pageY;

                    let scopeData = {
                        left: diffX >= windowOffsetLeft && 
                                diffX <= windowOffsetLeft + windowBorderWidth,   //左边框判断
                        right: diffX >= windowOffsetLeft + windowWidth - windowBorderWidth && 
                                diffX <= windowOffsetLeft + windowWidth,        //右边框判断
                        top: diffY <= windowOffsetTop + windowBorderWidth && 
                                diffY >= windowOffsetTop,                        //上边框判断
                        bottom: diffY <= windowOffsetTop+ windowHeight && 
                                diffY >= windowOffsetTop + windowHeight - windowBorderWidth,  //下边框判断
                        vertical: diffY <= windowOffsetTop + windowHeight - windowBorderWidth && 
                                diffY >= windowOffsetTop + windowBorderWidth,   //竖向边框判断
                        cross: diffX >= windowOffsetLeft + windowBorderWidth && 
                                diffX <= windowOffsetLeft + windowWidth - windowBorderWidth    //横向边框判断
                    }
                    //鼠标悬停左边框
                    if (scopeData.left && scopeData.vertical) {
                        $this.css('cursor', 'w-resize');
                        
                    //鼠标悬停右边框
                    } else if (scopeData.right && scopeData.vertical) {
                        $this.css('cursor', 'e-resize'); 
                        
                    //鼠标悬停上边框
                    } else if (scopeData.cross && scopeData.top) {
                        $this.css('cursor', 'n-resize'); 
                        
                    //鼠标悬停下边框
                    } else if (scopeData.cross && scopeData.bottom) {
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

                $(this).mousedown(function(e) {
                    const $self = $(this),
                          windowBorderWidth = Number.parseInt($this.css('borderWidth'), 10),
                          windowOffsetLeft = $this.offset().left,
                          windowOffsetTop = $this.offset().top,
                          windowWidth = $this.outerWidth(),
                          windowHeight = $this.outerHeight();

                    let diffX = e.pageX,
                        diffY = e.pageY;

                    let scopeData = {
                        left: diffX >= windowOffsetLeft && 
                                diffX <= windowOffsetLeft + windowBorderWidth,   //左边框判断
                        right: diffX >= windowOffsetLeft + windowWidth - windowBorderWidth && 
                                diffX <= windowOffsetLeft + windowWidth,        //右边框判断
                        top: diffY <= windowOffsetTop + windowBorderWidth && 
                                diffY >= windowOffsetTop,                        //上边框判断
                        bottom: diffY <= windowOffsetTop+ windowHeight && 
                                diffY >= windowOffsetTop + windowHeight - windowBorderWidth,  //下边框判断
                        vertical: diffY <= windowOffsetTop + windowHeight - windowBorderWidth && 
                                diffY >= windowOffsetTop + windowBorderWidth,   //竖向边框判断
                        cross: diffX >= windowOffsetLeft + windowBorderWidth && 
                                diffX <= windowOffsetLeft + windowWidth - windowBorderWidth    //横向边框判断
                    }
                    //鼠标悬停左边框
                    if (scopeData.left && scopeData.vertical) {
                        $this.css('cursor', 'w-resize');

                    //鼠标悬停右边框
                    } else if (scopeData.right && scopeData.vertical) {
                        $this.css('cursor', 'e-resize'); 
                        
                    //鼠标悬停上边框
                    } else if (scopeData.cross && scopeData.top) {
                        $this.css('cursor', 'n-resize'); 
                        
                    //鼠标悬停下边框
                    } else if (scopeData.cross && scopeData.bottom) {
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
            })
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