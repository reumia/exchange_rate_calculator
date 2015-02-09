function set_table() {

    $.getJSON( "js/data.json", function(data){

        var items, $tbody, $tr, $th, $span, $td_std, $td_comp, $td_per, $tr_class;

        items = data['환율정보'];
        $tbody = $("<tbody></tbody>");

        for ( var i in items ) {

            // 상태에 따라 tr에 클래스 배분
            if ( items[i].isPositive == "Y" ) {
                $tr_class = "tr-positive"
            }
            if ( items[i].isPositive == "N" ) {
                $tr_class = "tr-negative"
            }
            if ( items[i]['국가'] == '대한민국' ) {
                $tr_class = "tr-hidden"
            }
            // 테이블 생성
            $tr = $("<tr></tr>", {
                'class': $tr_class,
                'data-nation': items[i]['국가'],
                'data-unit': items[i]['통화명'],
                'data-unit-kr': items[i]['통화명_국문'],
                'data-std': items[i]['매매기준율']
            });
            $th = $("<th></th>", {
                'html': items[i]['국가']
            }).appendTo($tr);
            $span = $("<span></span>", {
                'class': "text-default",
                'html': " " + items[i]['통화명']
            }).appendTo($th);
            $td_std = $("<td></td>", {
                'class': "td-std",
                'html': items[i]['매매기준율']
            }).appendTo($tr);
            $td_comp = $("<td></td>", {
                'class': "td-comp",
                'html': items[i]['전일대비']
            }).appendTo($tr);
            $td_per = $("<td></td>", {
                'class': "td-per",
                'html': items[i]['등락율'] + "%"
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

            select_default = $(this).parents('.selector').attr('data-default');

            for ( var i in items ) {

                $option = $('<option></option>', {
                    'html': items[i]['국가'],
                    'value': items[i]['통화명']
                });

                if ( items[i]['통화명'] == select_default ) {
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

    $target.each(function() {

        var value, $flag, $unit, $unit_kr, flag_url, unit_kr, $selector, nation;

        $selector = $(this).parents('.selector');
        $flag = $(this).parents('.selector').find('.selector__flag');
        $unit = $(this).siblings('.selector__unit');
        $unit_kr = $selector.find('.selector__unit-kr');

        // 셀렉터가 값을 가지고 있지 않은 경우에 이미 선택되어있는 옵션의 값을 가져 온다.
        if ( $(this).val() != "" ) {
            value = $(this).val();
        }
        else {
            value = $(this).find('option:selected').val();
        }

        // 각 위치에 값 대입
        $unit.text(value);

        flag_url = value.split(' ');
        flag_url = flag_url[0];
        flag_url = 'img/flags/' + flag_url + '.png';
        $flag.attr('src', flag_url);

        unit_kr = $('tr[data-unit="'+value+'"]').attr('data-unit-kr');
        $unit_kr.text(unit_kr);

        nation = $('tr[data-unit="'+value+'"]').attr('data-nation');
        $flag.attr('alt', nation);

        // 계산을 위해 selector 에 데이터 값 추가
        $selector.attr('data-value', value);

    });

}

/*
    인풋에 입력된 값을 아래쪽에 화폐단위로 환산하여 입력
 */
function set_money_by_input($target) {

    var value, $money;

    value = $target.val();
    value = Number(value).toLocaleString();
    $money = $target.siblings('.selector__txt').find('.selector__money');

    $money.text(value);

}

/*
    입력된 숫자를 소숫점 두자리까지 반올림하여 되출력
 */
function set_number_default(number) {

    return Math.round( number * 100 ) / 100;

}
/*
    계산
 */
function calculate($target) {
    var input_num, $selector, $target_selector, $target_input, cal_std, cal_target_std, i, result;

    $selector = $target.parents('.selector');
    if ( $selector.hasClass('selector--top') ) {
        $target_selector = $('.selector--bottom');
    }
    else {
        $target_selector = $('.selector--top');
    }
    $target_input = $target_selector.find('.selector__input');
    cal_std = $selector.attr('data-value');
    cal_std = $('tr[data-unit="'+ cal_std +'"]').attr('data-std');
    cal_target_std = $target_selector.attr('data-value');
    cal_target_std = $('tr[data-unit="'+ cal_target_std +'"]').attr('data-std');
    input_num = $target.val();

    // 입력된 값을 선택된 매매기준율로 곱해진 값 i(KRW) 를 만들어, 다른 국가의 화폐로 계산하기 위한 상수로 활용한다.
    i = Number( input_num * cal_std );
    i = set_number_default(i);

    // 상수 i 를 기반으로 상대 셀렉터의 매매기준율로 계산
    result = Number( i / cal_target_std );
    result = set_number_default(result);

    // 결과값을 상대 셀렉터의 인풋에 입력
    $target_input.val(result);

    // 인풋에 입력된 값이 money 에 입력되도록 함수 재실행
    set_money_by_input($target_input);
}

/*
    숫자가 아닌 경우 입력 불가
 */
function only_numeric(key) {

    // 숫자, 숫자패드, 소숫점, 백스페이스, 탭 만 사용 가능
    if ( key.which && (key.which  > 47 && key.which  < 58 || key.which > 95 && key.which < 106 || key.which == 8 || key.which == 9 || key.which == 110 || key.which == 190 ) ) {
        // 숫자인 경우
    }
    else {
        // 숫자가 아닌 경우
        key.preventDefault();
    }

}
/*
    입력되기 이전의 값 리턴
 */
function set_value_before($target) {

    var value;

    value = $target.val();

    return value;

}

/*
    최초입력 값이 0이면 삭제
 */
function validate_zero($target) {

    var value;

    value = $target.val();

    if ( value == "0" ) {
        $target.val("");
    }
}

/*
    숫자가 아니면 이전 값으로 복원
 */
function validate_numeric($target, value_before) {

    var value;

    value = $target.val();

    if ( ! $.isNumeric(value) ) {

        $target.val(value_before);

    }

}

/*
    검사 함수 바인드
 */
function bind_validate() {

    var value_before;

    $('.selector')
        .on('keydown', '.selector__input', function(event){
            only_numeric(event);
            value_before = set_value_before($(this))
        })
        .on('keyup', '.selector__input', function(){
            validate_zero($(this));
            validate_numeric($(this), value_before);
        });

}

/*
    계산 함수 바인드
 */
function bind_calculate() {

    $('.selector')
        .on('keyup', '.selector__input', function(){
            set_money_by_input($(this));
            calculate($(this));
        })
        .on('change', '.selector__select', function(){
            var $target = $(this).parents('.selector').find('.selector__input');
            calculate($target);
        });

}