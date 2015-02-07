$(function(){

    $.getJSON( "js/data.json", function( data ) {

        var items = data['환율정보'],
            $tbody = $("<tbody></tbody>");

        for( var i in items ){
            var $tr, $th, $span, $td_std, $td_comp, $td_per, $tr_class;

            // 상태에 따라 tr에 클래스 배분
            if( items[i]['isPositive'] == "Y" ){
                $tr_class = "tr-positive"
            } else {
                $tr_class = "tr-negative"
            }

            // 객체 생성 및 위치
            $tr = $("<tr></tr>", {
                class: $tr_class
            });
            $th = $("<th></th>", {
                html: items[i]['국가']
            }).appendTo($tr);
            $span = $("<span></span>", {
                class: "text-default",
                html: " " + items[i]['통화명']
            }).appendTo($th);
            $td_std = $("<td></td>", {
                class: "td-std",
                html: items[i]['매매기준율']
            }).appendTo($tr);
            $td_comp = $("<td></td>", {
                class: "td-comp",
                html: items[i]['전일대비']
            }).appendTo($tr);
            $td_per = $("<td></td>", {
                class: "td-per",
                html: items[i]['등락율'] + "%"
            }).appendTo($tr);
            $tr.appendTo($tbody);
        }

        $tbody.appendTo('.cal-table');

    });

});