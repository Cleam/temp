(function() {
    if (!window.__union_m_block) {
        return false; 
    }
    var s = __union_m_block;
    var u = "//boardx.huanqiu.com/union_box_m.html#cid=" + s.cid + "!!!";
    if (s.size.indexOf("px") > 0) {
        var bh = s.size; 
    } else {
        var bh = document.documentElement.clientWidth * s.size.split(":")[1] / s.size.split(":")[0] + "px"; 
    }
    var ih = document.documentElement.clientHeight + "px";
    document.write("<div style=\"width:100%;height:" + bh + ";overflow:hidden;\"><iframe frameborder=\"0\" scrolling=\"no\" src=\"" + u + "\" style=\"width:100%;height:" + ih + ";\"></iframe></div>");

}());
