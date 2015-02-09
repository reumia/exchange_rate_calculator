$(function(){

    // JSON 기준으로 테이블 생성
    set_table();
    // JSON 기준으로 select 의 option 생성
    set_options();
    // Select 의 값이 변경될 때마다 국기와 각종 단위를 변경해 주는 set_selector 함수 실행
    $('.selector__select').on('change', function(){
        set_selector(this);
    });
    // 바인드 함수 실행
    bind_validate();
    bind_calculate();

});