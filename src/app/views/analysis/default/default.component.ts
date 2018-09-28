import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Localization} from '../../../localization';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AnalysisValidators} from '../../../directives/analysis-validators';
import {AnalysisService} from '../../../services/analysis-service';
import {CommonValidators} from '../../../directives';
import {environment} from '../../../../environments/environment';
import {Yaml} from '../../../utils';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  /**
   * 모드 변경 값
   */
  @Output()
  changeMode: EventEmitter<{mode: 'list' | 'view' | 'modify' | 'register', name: string}> = new EventEmitter<{mode: 'list' | 'view' | 'modify' | 'register', name: string}>();
  /**
   * 연관성 분석 여부
   */
  @Input()
  isCorrelation: 'yes' | 'no';
  /**
   * editForm 초기화 완료 핸들러
   */
  @Input()
  editFormComplete: (form: FormGroup) => void;
  /**
   * 룰 명 유효성 검사
   */
  @Input()
  onKeyUpRuleName: (event: KeyboardEvent) => void;
  /**
   * 제목
   */
  @Input()
  title: {list: string, edit: string};
  /**
   * 게시판 상태
   */
  get mode(): 'list' | 'view' | 'modify' | 'register' {
    return this._mode;
  }
  set mode(value: 'list' | 'view' | 'modify' | 'register') {
    this._mode = value;
    const name: string = this.editForm && this.editGroup.hasOwnProperty('name') ? this.editGroup.name.value : '';
    this.changeMode.emit({mode: value, name: name});
  }
  private _mode: 'list' | 'view' | 'modify' | 'register' = 'list';
  /**
   * 룰 목록
   */
  items;
  /**
   * 현재 페이지
   */
  page = 1 ;
  /**
   * 총 자료 수
   */
  totalRows = 0;
  /**
   * 표시할 페이지 번호 수
   */
  pageSize = 10;
  /**
   * 페이지당 표시할 행 수
   */
  rowsSize = 10;
  /**
   * 검색어 룰 명칭
   */
  keyword = '';
  /**
   * 제출 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 룰 종류에 따라 포함되는 속성 목록 맵
   */
  typeMap = {common: ['name', 'type', 'index', 'filter', 'alert', 'http_post_url', 'http_post_static_payload'],
    blacklist: ['compare_key', 'blacklist'],
    whitelist: ['compare_key', 'whitelist', 'ignore_null'],
    change: ['compare_key', 'query_key', 'timeframe', 'ignore_null'],
    frequency: ['query_key', 'timeframe', 'num_events'],
    spike: ['query_key', 'timeframe', 'spike_height', 'spike_type', 'threshold', 'threshold_ref', 'threshold_cur', 'alert_on_new_data'],
    new_term: ['fields', 'alert_on_missing_field'],
    cardinality: ['query_key', 'timeframe', 'cardinality_field', 'max_cardinality', 'min_cardinality']};
  /**
   * 룰 종류 옵션 목록
   */
  typeOptions = [{label: Localization.pick('블랙리스트'), value: 'blacklist'}, {label: Localization.pick('화이트리스트'), value: 'whitelist'}, {label: Localization.pick('변경여부 체크'), value: 'change'},
    {label: Localization.pick('발생 횟수 체크'), value: 'frequency'}, {label: Localization.pick('변동 체크'), value: 'spike'}, {label: Localization.pick('새로운 값 체크'), value: 'new_term'},
    {label: Localization.pick('카디널리티'), value: 'cardinality'}];
  /**
   * Spike Type 옵션 목록
   */
  spikeTypeOptions = [{label: 'UP', value: 'up'}, {label: 'DOWN', value: 'down'}, {label: 'BOTH', value: 'both'}];
  /**
   * Timeframe 옵션 목록
   */
  timeframeOptions = [{label: Localization.pick('초'), value: 'seconds'}, {label: Localization.pick('분'), value: 'minutes'},
    {label: Localization.pick('시'), value: 'hours'}, {label: Localization.pick('일'), value: 'days'}];
  /**
   * 필드 옵션 목록
   */
  fieldOptions: string[];
  /**
   * 목록 폼
   */
  searchForm: FormGroup;
  /**
   * 추가, 수정 폼
   */
  editForm: FormGroup;
  /**
   * 빈 룰 정보
   */
  emptySource: object;
  /**
   * 룰 정보
   * 초기화 버튼 클릭시 원래 상태로 복구
   */
  source: object;
  /**
   * 추가, 수정 폼 컨트롤 목록
   */
  get editGroup(): { [key: string]: AbstractControl; } {
    return this.editForm.controls;
  }
  /**
   * Filter / Terms / rule_name
   */
  get ruleNames() {
    return (((this.editForm.controls.filter as FormGroup).controls.terms as FormGroup).controls.rule_name as FormArray).controls;
  }
  /**
   * threshold_ref 혹은 threshold_cur 중 하나 이상 값이 있는 경우를 판별하기 위한 변수
   */
  get threshold() {
    return this.editGroup['threshold_ref'].value.toString() + this.editGroup['threshold_cur'].value.toString();
  }
  /**
   * Query Key 값 존재 여부
   */
  get alertOnNewData() {
    return this.editGroup['query_key'].value !== '';
  }
  /**
   * Validators.required
   */
  get validatorsRequired(): ValidatorFn {
    return Validators.required;
  }
  /**
   * [ Validators.required, AnalysisValidators.match ]
   */
  get validatorsRequiredMatch(): Validators {
    return [Validators.required, AnalysisValidators.match(this)];
  }
  /**
   * editForm 요소들 중 유효성 검사가 필요한 요소들에 대한 설정
   */
  get validatorsConfig(): {[key: string]: Validators | ValidatorFn} {
    return { rule_name: this.validatorsRequired, blacklist: this.validatorsRequired, whitelist: this.validatorsRequired, fields: this.validatorsRequiredMatch };
  }

  /**
   * 생성자
   * @param formBuilder
   * @param analysisService
   */
  constructor(
    private formBuilder: FormBuilder,
    private analysisService: AnalysisService) {}

  /**
   * 초기화
   */
  ngOnInit(): void {
    this.initForm();
    this.getRules();
  }
  /**
   * editForm 초기화
   */
  initForm(): void {
    this.searchForm = this.formBuilder.group({
      rule: ['', []]
    });
    this.editForm = this.formBuilder.group({
      name: ['cr_', [Validators.required, Validators.minLength(6), CommonValidators.match(this, 'editForm', 'name_correct')]],
      name_correct: ['', [Validators.required]],
      type: [this.typeOptions[0].value, [Validators.required]],
      index: ['', [Validators.required, CommonValidators.match(this, 'editForm', 'index_correct')]],
      index_correct: ['', [Validators.required]],
      filter: this.formBuilder.group({
        terms: this.formBuilder.group({
          rule_name: this.formBuilder.array([ this.formBuilder.group({item: ['', [Validators.required]]}) ])
        }),
        term: this.formBuilder.group({
          alert_sent: [true, [Validators.required]]
        }),
      }),
      alert: ['post', []],
      http_post_url: [environment.elasticBasecUrl + '/ea/results', []],
      http_post_static_payload: this.formBuilder.group({
        rule_name: ['cr_', []]
      }),
      compare_key: ['', [Validators.required, AnalysisValidators.match(this)]], // blacklist, whitelist
      query_key: ['', [AnalysisValidators.match(this)]], // change, frequency, spike, cardinality
      ignore_null: [true, [Validators.required]], // whitelist, change
      timeframe: this.formBuilder.group({
        unit: [this.timeframeOptions[0].value, []],
        value: ['', [Validators.required]],
      }), // change, frequency, spike, cardinality
      blacklist: this.formBuilder.array([ this.formBuilder.group({item: ['', [Validators.required]]}) ]), // blacklist
      whitelist: this.formBuilder.array([ this.formBuilder.group({item: ['', [Validators.required]]}) ]), // whitelist
      num_events: ['', [Validators.required]], // frequency
      spike_height: ['', [Validators.required]], // spike
      spike_type: [this.spikeTypeOptions[0].value, [Validators.required]], // spike
      threshold_ref: ['', []], // spike
      threshold_cur: ['', []], // spike
      threshold: ['', [Validators.required]], // spike
      alert_on_new_data: [true, [Validators.required]], // spike
      fields: this.formBuilder.array([ this.formBuilder.group({item: ['', [Validators.required, AnalysisValidators.match(this)]]}) ]), // new term
      alert_on_missing_field: [true, [Validators.required]], // new term
      cardinality_field: ['', [Validators.required, AnalysisValidators.match(this)]], // cardinality
      max_cardinality: ['', [Validators.required]], // cardinality
      min_cardinality: ['', [Validators.required]], // cardinality
    });
    if (this.editFormComplete) {
      this.editFormComplete(this.editForm);
    }
    this.emptySource = this.editForm.getRawValue();
  }
  /**
   * 룰 목록 요청
   * @param page
   * @param rule
   */
  getRules(page: number = 1, rule: string = ''): void {
    this.analysisService.getRules(this.isCorrelation, page, rule, result => {
      this.mode = 'list';
      this.page = page;
      this.keyword = rule;
      this.searchForm.controls.rule.setValue(rule);
      this.totalRows = result.data.total;
      this.items = result.data.buckets;
    });
  }
  /**
   * 룰 정보 요청
   * @param rule
   */
  getRule(rule: string): void {
    this.analysisService.getRule(rule, result => {
      this.submitted = false;
      // console.log(result.data.data);
      if (!result.data.data) {
        alert(Localization.pick('비정상적인 룰 입니다.'));
        return;
      }
      this.source = Yaml.parse(result.data.data);
      this.source['index_correct'] = '';
      if (this.source.hasOwnProperty('timeframe')) {
        let key: string;
        for (key of Object.keys(this.source['timeframe'])) {
          this.source['timeframe'] = {unit: key, value: this.source['timeframe'][key]};
        }
      }
      if (this.source.hasOwnProperty('query_key') && this.source['query_key'] === null) {
        delete this.source['query_key'];
      }
      Yaml.patch(this.source, this.editForm, this.validatorsConfig);
      this.editGroup.name.disable();
      this.mode = 'modify';
    });
  }
  /**
   * 필드 옵션 목록 요청
   */
  getFields(index: string): void {
    this.analysisService.getFields(index, result => {
      this.editGroup.index_correct.setValue(index);
      this.editGroup.index.setValue(index);
      this.fieldOptions = result.data.fields;
    });
  }
  /**
   * 검색
   */
  onSearch(): void {
    this.getRules(1, this.searchForm.controls.rule.value);
  }
  /**
   * 등록하기 모드로 전환
   */
  onRegister(): void {
    this.editGroup.name.enable();
    this.mode = 'register';
    this.submitted = false;
    Yaml.patch(this.emptySource, this.editForm, this.validatorsConfig);
  }
  /**
   * 수정하기 모드로 전환
   * @param rule
   */
  onModify(rule: string): void {
    this.submitted = false;
    this.getRule(rule);
  }
  /**
   * 삭제하기
   * @param rule
   */
  onDelete(rule: string): void {
    if (confirm(Localization.pick('삭제 하시겠습니까?'))) {
      this.analysisService.deleteRule(rule, result => {
        this.getRules(this.page, this.keyword);
      });
    }
  }
  /**
   * 저장
   */
  onSave(): void {
    this.submitted = true;
    const target = this.editForm.getRawValue();
    // create required properties
    const properties: string[] = this.typeMap.common.concat(this.typeMap[target.type]);
    // delete properties
    let key;
    for (key of Object.keys(target)) {
      if (!properties.includes(key)) {
        delete target[key];
      } else {
        if (this.editGroup[key].status === 'INVALID') {
          // alert(`${key} is invalid!`);
          return;
        }
      }
    }
    delete target['threshold'];
    if (target.hasOwnProperty('alert_on_new_data') && target.query_key === '') {
      delete target['alert_on_new_data'];
    }
    // fix timeframe property
    if (target.hasOwnProperty('timeframe')) {
      const value = {};
      value[target.timeframe.unit] = target.timeframe.value;
      target.timeframe = value;
    }
    // if query_key is empty then delete
    if (target.hasOwnProperty('query_key') && target['query_key'].replace(/s/g) === '') {
      delete target['query_key'];
    }
    target.http_post_static_payload.rule_name = target.name;

    const data = Yaml.stringify(target);
    console.log(data);
    this.analysisService.setRule(target.name, data, result => {
      this.getRules();
    });
  }
  /**
   * 초기화
   */
  onReset(): void {
    Yaml.patch(this.mode === 'register' ? this.emptySource : this.source, this.editForm, this.validatorsConfig);
  }
  /**
   * 룰 명 중복 검사 핸들러
   */
  onCheckDuplication() {
    const errors = this.editGroup.name.errors;
    if (errors && errors.hasOwnProperty('minlength')) {
      this.submitted = true;
      return;
    }
    const rule = this.editGroup.name.value;
    this.analysisService.checkDuplication(rule, result => {
      if (result.data.msg === 'success') {
        this.editGroup.name_correct.setValue(rule);
        this.editGroup.name.setValue(rule);
      } else {
        alert(Localization.pick('이미 사용중인 룰 명 입니다.'));
        this.editGroup.name_correct.setValue('');
      }
    });
  }
  /**
   * 인덱스 사용가능 여부 검사 핸들러
   */
  onCheckIndex() {
    const errors = this.editGroup.index.errors;
    if (errors && errors.hasOwnProperty('required')) {
      this.submitted = true;
      return;
    }
    const index = this.editGroup.index.value;
    this.analysisService.checkIndex(index, result => {
      if (result.data.result === 'success') {
        this.getFields(index);
      } else {
        alert(Localization.pick('존재하지 않는 인덱스 입니다.'));
        this.editGroup.index_correct.setValue('');
      }
    });
  }
  /**
   * 페이지 이동 이벤트시 호출될
   * @param page
   */
  paginationHandler(page: number): void {
    this.getRules(page, this.keyword);
  }
  /**
   * 현재 룰 종류가 인자 목록 중 포함되는지 여부
   * @param types
   */
  isShow(...types: ('blacklist' | 'whitelist' | 'change' | 'frequency' | 'spike' | 'new_term' | 'cardinality')[]) {
    let type;
    for (type of types) {
      if (type === this.editGroup.type.value) {
        return true;
      }
    }
    return false;
  }
  /**
   * 폼 배열 아이템 추가
   */
  addItem(key: string, validators: Validators | ValidatorFn = null): void {
    (this.editForm.get(key) as FormArray).push(this.formBuilder.group({
      item: ['', validators],
    }));
  }
  /**
   * 폼 배열 아이템 제거
   * @param key       : 제거 할 폼 배열 명
   * @param index     : 배열 위치
   */
  deleteItem(key: string, index: number): void {
    (this.editForm.get(key) as FormArray).removeAt(index);
  }
  /**
   * Filter > Terms > Rule Name 아이템 추가
   */
  addRuleNameItem(): void {
    (((this.editForm.controls.filter as FormGroup).controls.terms as FormGroup).controls.rule_name as FormArray).push(this.formBuilder.group({
      item: ['', [Validators.required]],
    }));
  }
  /**
   * Filter > Terms > Rule Name 아이템 삭제
   * @param index
   */
  deleteRuleNameItem(index: number): void {
    (((this.editForm.controls.filter as FormGroup).controls.terms as FormGroup).controls.rule_name as FormArray).removeAt(index);
  }

}
