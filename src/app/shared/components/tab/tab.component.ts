import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterContentInit, OnDestroy {
  @Input() tabs: TabItem[] = [];
  @Input() activeTabId: string = '';

  @Output() tabChange = new EventEmitter<string>();

  activeTab: TabItem | null = null;

  ngAfterContentInit(): void {
    if (this.tabs.length > 0 && !this.activeTabId) {
      this.activeTabId = this.tabs[0].id;
    }
    this.setActiveTab();
  }

  ngOnDestroy(): void {
    this.tabChange.complete();
  }

  onTabClick(tab: TabItem): void {
    if (tab.disabled) return;
    if (this.activeTab?.id === tab.id) return;
    this.activeTabId = tab.id;
    this.setActiveTab();
    this.tabChange.emit(tab.id);
  }

  private setActiveTab(): void {
    this.activeTab =
      this.tabs.find((tab) => tab.id === this.activeTabId) || null;
  }

  isActive(tabId: string): boolean {
    return tabId === this.activeTabId;
  }
}
