this.$popWindow.mousedown(function(e) {
                    const $this = $(this),
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
                    };
                    
                    if (scopeData.left && scopeData.column) {           //鼠标悬停左边框
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
                    
                    } else if (scopeData.right && scopeData.column) {   //鼠标悬停右边框
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
                        // _this.updateContextHeight(currentHeight);
                    
                    } else if (scopeData.row && scopeData.top) {        //鼠标悬停上边框
                        // $this.css('cursor', 'n-resize'); 
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + oldY - nowY,
                                currentTop = windowOffsetTop + nowY - oldY;

                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            $this.css({
                                height: currentHeight + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                        
                    
                    } else if (scopeData.row && scopeData.bottom) {     //鼠标悬停下边框
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
                    
                    
                    } else if (scopeData.left && scopeData.top) {       //鼠标悬停左上边框
                        // $this.css('cursor', 'nw-resize');     
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + oldX - nowX,
                                currentLeft = windowOffsetLeft + nowX - oldX,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + oldY - nowY,
                                currentTop = windowOffsetTop + nowY - oldY;

                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));

                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px',
                                height: currentHeight + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                   
                    } else if (scopeData.right && scopeData.top) {      //鼠标悬停右上边框
                        // $this.css('cursor', 'ne-resize');   
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + nowX - oldX,
                                windowMaxHeight = windowHeight + windowOffsetTop,
                                currentHeight = windowHeight + oldY - nowY,
                                currentTop = windowOffsetTop + nowY - oldY;

                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            currentTop = Math.max(0, Math.min(currentTop, windowOffsetTop + windowHeight - windowMinHeight));
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            $this.css({
                                width: currentWidth + 'px',
                                height: currentHeight + 'px',
                                top: currentTop + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                   
                    } else if (scopeData.right && scopeData.bottom) {   //鼠标悬停右下边框
                        // $this.css('cursor', 'se-resize'); 
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = containerWidth - windowOffsetLeft,
                                currentWidth = windowWidth + nowX - oldX,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + nowY - oldY;
                                 
                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
                            
                            $this.css({
                                width: currentWidth + 'px',
                                height: currentHeight + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });
                     
                    } else if (scopeData.left && scopeData.bottom) {    //鼠标悬停左下边框
                        // $this.css('cursor', 'sw-resize');
                        const active = function(e) {
                            let nowX = e.pageX,
                                nowY = e.pageY,
                                windowMaxWidth = windowWidth + windowOffsetLeft,
                                currentWidth = windowWidth + oldX - nowX,
                                currentLeft = windowOffsetLeft + nowX - oldX,
                                windowMaxHeight = containerHeight - windowOffsetTop,
                                currentHeight = windowHeight + nowY - oldY;
                                 
                            currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));

                            currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
                            currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));

                            $this.css({
                                width: currentWidth + 'px',
                                left: currentLeft + 'px',
                                height: currentHeight + 'px'
                            });
                            _this.updateContextHeight(currentHeight);
                            
                        };

                        $document.mousemove(active).mouseup(function() {
                            $(this).off('mousemove', active);
                        });               
                    } else {
                        // $this.css('cursor', 'auto'); 
                    }
                });

action = function(e) {
    let nowX = e.pageX,
        nowY = e.pageY,

        windowMaxWidth = windowWidth + windowOffsetLeft,
        currentWidth = windowWidth + oldX - nowX,
        currentLeft = windowOffsetLeft + nowX - oldX;

        windowMaxWidth = containerWidth - windowOffsetLeft,
        currentWidth = windowWidth + nowX - oldX;
            
    currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
    $this.css({
        width: currentWidth + 'px'
    });

    currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
    currentLeft = Math.max(0, Math.min(currentLeft, windowOffsetLeft + windowWidth - windowMinWidth));

    $this.css({
        width: currentWidth + 'px',
        left: currentLeft + 'px'
    });
}

const active = function(e) {
    let nowX = e.pageX,
        nowY = e.pageY,
        windowMaxWidth = containerWidth - windowOffsetLeft,
        currentWidth = windowWidth + nowX - oldX,
    
        windowMaxHeight = containerHeight - windowOffsetTop,
        currentHeight = windowHeight + nowY - oldY;     

    currentWidth = Math.max(windowMinWidth, Math.min(currentWidth, windowMaxWidth));
    $this.css({
        width: currentWidth + 'px'
    });

            
    currentHeight = Math.max(windowMinHeight, Math.min(currentHeight, windowMaxHeight));
    $this.css({
        height: currentHeight + 'px'
    });
    _this.updateContextHeight(currentHeight);
};

function handler({top, right, buttom, left}) {

    let active = function(e) {

    }

}




