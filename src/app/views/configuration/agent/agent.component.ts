import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../../../services';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  agentManager: {'type': string, 'max_agents': string, 'rule_version': string, 'openssl': string, 'version': string};
  agentLists: {'status': string, 'id': string, 'name': string, 'ip': string, 'system': string, 'version': string}[] = [];

  constructor(
    private configuratonService: ConfigurationService) { }

  ngOnInit() {
    // 에이전트 매니저 리스트
    this.configuratonService.agentManagerList(result => {
      this.agentManager = result.data;
    });
    // 에이전트 리스트
    this.configuratonService.agentList(result => {
      this.agentLists = result.data;
    });
  }

}
