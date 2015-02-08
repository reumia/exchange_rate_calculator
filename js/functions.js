function set_table(){

    $.getJSON( "js/data.json", function(data){

        var items, $tbody, $tr, $th, $span, $td_std, $td_comp, $td_per, $tr_class;

        items = data['환율정보'];
        $tbody = $("<tbody></tbody>");

        for( var i in items ){

            // 상태에 따라 tr에 클래스 배분
            if( items[i].isPositive == "Y" ){
                $tr_class = "tr-positive"
            }
            if( items[i].isPositive == "N" ){
                $tr_class = "tr-negative"
            }
            if( items[i]['국가'] == '대한민국' ){
                $tr_class = "tr-hidden"
            }
            // 테이블 생성
            $tr = $("<tr></tr>", {
                class: $tr_class,
                'data-nation': items[i]['국가'],
                'data-unit': items[i]['통화명'],
                'data-unit-kr': items[i]['통화명_국문'],
                'data-std': items[i]['매매기준율']
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
        // 생선된 테이블 타겟에 붙여넣기
        $tbody.appendTo('.cal-table');
    });

}

function set_options() {

    $.getJSON( "js/data.json", function(data) {

        var items, $option, $select, select_default;

        items = data['환율정보'];
        $select = $(".selector__select");

        $select.each(function(){

            select_default = $(this).parents('.selector').data('default');

            for ( var i in items ) {

                $option = $('<option></option>', {
                    html: items[i]['국가'],
                    value: items[i]['통화명']
                });

                if( items[i]['통화명'] == select_default ){
                    $option.attr('selected', true);
                }

                $option.appendTo($(this));

            }

            set_selector(this);

        });



    });
}

function set_selector(target) {

    var $target;

    $target = $(target);

    $target.each(function(){

        var value, $flag, $unit, $unit_kr, flag_url, unit_kr;

        $flag = $(this).parents('.selector').find('.selector__flag');
        $unit = $(this).siblings('.selector__unit');
        $unit_kr = $(this).parents('.selector').find('.selector__unit-kr');

        if( $(this).val() != "" ){
            value = $(this).val();
        }
        else {
            value = $(this).find('option:selected').val();
        }

        $unit.text(value);

        flag_url = value.split(' ');
        flag_url = flag_url[0];
        flag_url = 'img/flags/' + flag_url + '.png';
        $flag.attr('src', flag_url);

        unit_kr = $('tr[data-unit="'+value+'"]').data('unit-kr');
        $unit_kr.text(unit_kr);

    });

}