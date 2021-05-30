function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * 完成该区域的轮播功能
 * 该函数需要实现手指滑动切换、自动切换
 * @param {HTMLElement} container 轮播容器
 * @param {Number} duration 自动切换的间隔时间，0表示不进行自动切换
 * @param {Function} callback 完成切换后需要调用的函数
 * @return {Function} 返回一个函数，调用函数，可以随意的切换显示的子项
 */
function createSlider(container, duration, callback) {
    var firstItem = container.querySelector('.slider-item'); // 容器中的第一个子元素
    var cw = container.clientWidth; // 容器宽度
    var count = container.children.length; // 轮播的数量
    var curIndex = 0; // 记录当前显示的是第几个
    console.log(cw);
    /**
     * 切换到指定的子项
     * @param {Number} index 指定下标
     */
    function switchTo(index) {
        // 判断index的取值范围
        if (index < 0) {
            index = 0;
        } else if (index > count - 1) {
            index = count - 1;
        }
        curIndex = index; // 改变当前显示的索引
        firstItem.style.transition = "0.3s" // css3 过度属性 
        // 设置它的marginLift位 -xx个容器宽度
        firstItem.style.marginLeft = -index * cw + 'px'
        // 切换完之后调用
        callback && callback(index);
    }

    /* 实现自动切换 */
    var timer;
    // 开始自动切换
    function startAuto() {
        if (timer || duration === 0) {
            // 已经有定时器了，说明在切换了
            // 或者 不能自动切换
            return
        }
        timer = setInterval(function () {
            // if(curIndex === count - 1){
            //     curIndex = -1;
            // }
            // switchTo(curIndex + 1);

            // 另一种写法
            switchTo((curIndex + 1) % count)
        }, duration);
    }
    // 停止自动切换
    function stopAuto() {
        clearInterval(timer);
        timer = null; // setInterval返回值是一个数字，不设置为null就会一直存在
    }
    startAuto(); // 开始自动切换

    /* 实现手指滑动切换 */
    container.ontouchstart = function (e) {
        var x = e.touches[0].clientX; // 获取第一个手指当前在屏幕上的x坐标
        var mL = parseFloat(firstItem.style.marginLeft) || 0; // 获取当前元素的marginLeft 
        // 当手指按下之后就要停止自动切换
        stopAuto();
        // 停止过渡效果
        container.style.transition = 'none';
        // 手指移动
        container.ontouchmove = function (e) {
            var disX = e.touches[0].clientX - x; // 手指移动的距离
            var newML = mL + disX; // 计算新的marginLeft
            var minML = -(count - 1) * cw; // 最小的容器宽度
            if (newML < minML) {
                newML = minML;
            }
            if (newML > 0) {
                newML = 0;
            }
            // 去掉浏览器默认行为
            e.preventDefault();
            firstItem.style.marginLeft = newML + 'px';
        }

        /* 手指放开 */
        container.ontouchend = function (e) {
            var disX = e.changedTouches[0].clientX - x; // 手指移动的距离
            if (disX < 0) { // 想左滑动
                switchTo(curIndex + 1);
            } else if (disX > 0) { // 想右滑动
                switchTo(curIndex - 1);
            }
            // 启动自动切换
            startAuto();
        }
    }

    return switchTo;
}



/* 假设函数已经写完，三种用法 */
// // 创建轮播区域1，自动切换，间隔1秒，完成切换后调用指定的函数
var dom1 = $('.banner .slider-container');
var goto = createSlider(dom1, 1000, function (index) {
    // 将第index个原点变为激活状态
    console.log('切换完成', index);
})



// // 创建轮播区域2，不自动切换，完成切换后调用指定的函数
// createSlider(dom2, 0, function (index) {
//     // 将第index个标题变为激活状态
// })

// // 创建轮播区域3，不自动切换，完成切换后调用指定的函数
// var goto = createSlider(dom3, 0, function (index) {
//     // 将第index个标题变为激活状态
// })
// // 当第3个标题被点击时，切换到第3个子项
// title3.onclick = function () {
//     goto(3);
// }


// // 根据选择器获取dom元素 H5的API
// // 匹配第一个
// var dom1 = $('.banner .slider-container');
// // 匹配所有
// var dom2 = $$('slider-item');

// createSlider(dom1);