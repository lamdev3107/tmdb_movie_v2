import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface ToggleSelectBox {
  value: any;
  label: string;
}

@Component({
  selector: 'app-toggle-select-box-list',
  templateUrl: './toggle-select-box-list.component.html',
  styleUrls: ['./toggle-select-box-list.component.scss'],
})
export class ToggleSelectBoxListComponent implements OnInit {
  @Input() list: ToggleSelectBox[] = [];
  selectedItems: ToggleSelectBox[] = [];
  @Output() onChangeSelectList = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  isItemSelected(item: any) {
    const result = this.selectedItems.findIndex(
      (it: any) => item.value === it.value
    );
    return result;
  }

  toggleItem(item: ToggleSelectBox) {
    const idx = this.selectedItems.findIndex(
      (it: ToggleSelectBox) => it.value === item.value
    );
    if (idx > -1) {
      this.selectedItems.splice(idx, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.onChangeSelectList.emit(this.selectedItems);
    // TODO: Add Output EventEmitter if needed
  }
}
