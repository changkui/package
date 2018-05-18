/**
 * Created by CK on 2017/12/12.
 */

function pager(element, o) {
    var count = o.count || 0;           //总页数
    var index = o.index || 1;           //当前页
    var countsize = o.countsize || 0;   //总记录条数

    var leftCount = 3;//控制当前页左边(除最后一页)最多显示的数字个数
    var rightCount = 3;//控制当前页右边(除第一页)最多显示的数字个数

    if (count <= 1) {
        element.html("");
        return;
    }
    if (index < 1 || countsize <= 1) return;

    var recordCount = $("<span>").text("共" + countsize + "条记录");

    var prevPage = $("<a href='javascript:;'>").text("上一页").attr("data-tag", "prevPage");

    var nextPage = $("<a href='javascript:;'>").text("下一页").attr("data-tag", "nextPage");

    function init(index, count) {
        var arr = [];
        arr.push(index);//当前页在数组中间
        var i = index;
        var n = count;

        //取出前3位页数
        while (i > 1 && index - i < leftCount) {
            arr.unshift(--i);//当前页前面插入
        }

        //取出后3位页数
        i = index;
        while (i < count && i - index < rightCount) {
            arr.push(++i);//当前页后面插入
        }

        output(arr);
    }

    function output(arr) {
        //...之间的数字
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == index) {
                str += '<span class="current">' + arr[i] + '</span>';
            } else {
                str += '<a href="javascript:;">' + arr[i] + '</a>';
            }
        }

        element.html(str);
        //添加省略显示和第一页
        if (arr[0] > 2) {
            element.prepend('<span>...</span>').prepend('<a href="javascript:;">1</a>');
        } else if (arr[0] == 2) {
            element.prepend('<a href="javascript:;">1</a>');
        }
        //添加省略显示和最后一页
        if (arr[arr.length - 1] < count - 1) {
            element.append('<span>...</span>').append('<a href="javascript:;">' + count + '</a>');
        } else if (arr[arr.length - 1] == count - 1) {
            element.append('<a href="javascript:;">' + count + '</a>');
        }

        index == 1 ? prevPage.addClass("disabled") : prevPage.removeClass("disabled");

        index == count ? nextPage.addClass("disabled") : nextPage.removeClass("disabled");

        element.prepend(prevPage).append(nextPage).prepend(recordCount);
    }

    init(index, count);

    element.off("click");
    element.on("click", function (event) {
        var el = event.target;
        if (el.tagName != "A") return;//tagName:元素标签类型名

        var val = $(el).text();
        var tag = $(el).attr("data-tag");
        if (tag == "prevPage") {
            if (index == 1) return;
            index--;
        } else if (tag == "nextPage") {
            if (index == count) return;
            index++;
        } else if (!isNaN(val)) {
            index = parseInt(val);
        }

        init(index, count);
        o.pageChange && o.pageChange(index);//执行

    })
}

//ajax封装
function basicAjax(url, type, data, callback) {
    var loader;
    $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        data: data,
        cache: false,
        //beforeSend: function() {
        //    loader = layer.load(2, {shade: [0.2, '#e9e9e9']});
        //},
        success: function (result) {
            callback ? callback.call(this, result) : '';
            setTimeout(function () {
                $(".ltable tr:nth-child(odd)").addClass("odd_bg"); //隔行变色
            }, 0);
        },
        complete: function () {
            //layer.close(loader);
        },
        error:function(xhr){
            callback ? callback.call(this,xhr) : '';
        }
    })
}
