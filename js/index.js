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
            this.addHandler();
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
                    <div class="pop-window-content">${options.content}</div>
                </div>`).css({
                        left: options.left + 'px',
                        top: options.top + 'px',
                        width: options.width + 'px',
                        })
                        .appendTo(this.$container);
            
            this.$popWindow.find('.pop-window-content').height(options.height - $('.pop-window-header').height());


        }

        addHandler() {
            const _this = this;
            $('.pop-window-close').each(function() { //关闭窗口
                $(this).mouseover(function(e) {
                    e.stopPropagation();

                });
                $(this).click(function(e) {
                    e.stopPropagation();
                    // e.preventDefluat();
                    $(this).parents('.pop-window').remove();
                });
            });
            
            $('.contents-min').each(function() { //切换内容显示
                $(this).mouseover(function(e) {
                    e.stopPropagation();
                });
                $(this).click(function(e) {
                    console.log(e.target);
                    e.stopPropagation();
                    // e.preventDefluat();
                    $(this).parents('.pop-window').find('.pop-window-content').slideToggle();
                });
            });
            const handler = function(e) {
                const $self = $(this);

                if (e.target.nodeName.toLowerCase() === 'button') {
                    return false;
                } 

                $self.css('cursor', 'move');

                const diffX = e.pageX,
                      diffY = e.pageY,
                      winowLeft = _this.$popWindow.position().left,
                      windowTop = _this.$popWindow.position().top,
                      windowWidth = _this.$popWindow.outerWidth(),
                      windowHeight = _this.$popWindow.outerHeight(),
                      parentWidth = _this.$container.width(),
                      parentHeight = _this.$container.height();

                const active = function(e) {
                    const curX = e.pageX,
                          curY = e.pageY;
                    let curLeft = winowLeft + curX - diffX,
                        curTop = windowTop + curY - diffY;            

                    curLeft = Math.max(0, Math.min(curLeft, parentWidth - windowWidth));
                    curTop = Math.max(0, Math.min(curTop, parentHeight - windowHeight));

                    _this.$popWindow.css({
                        left: curLeft + 'px',
                        top: curTop + 'px'
                    });
                };

                $(document).mousemove(active);
                $(document).mouseup(function() {
                    $self.css('cursor', 'auto');
                    $(this).unbind('mousemove', active);
                    
                });
                
            }
            this.$popWindow.find('.pop-window-header').mousedown(handler);
        }

        getCurrentWindow() {
            this.$popWindow.each(function(){
                $(this).mousedown(function(e) {
                    $(e.currentTarget).css('zIndex', '999').siblings().css('zIndex', '1');
                });
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

    })
    
   
});