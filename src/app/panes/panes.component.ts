import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];

export interface Column {
  key: string;
  isVisible: boolean;
}

@Component({
  selector: 'app-panes',
  templateUrl: './panes.component.html',
  styleUrls: ['./panes.component.scss']
})

export class PanesComponent implements OnInit {
  displayedColumns: string[];
  inputValue: string;
  previousIndex: number;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSourceTree = new MatTreeNestedDataSource<FoodNode>();

  allColumnsInfo: Column[] = [
    { key: 'position', isVisible: true },
    { key: 'name', isVisible: true },
    { key: 'weight', isVisible: false },
    { key: 'symbol', isVisible: true },
    { key: 'mass', isVisible: true }
  ];

  data = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', mass: 12 },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', mass: 3 },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', mass: 45 },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', mass: 678 },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', mass: 90 },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', mass: 64 },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', mass: 5 },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', mass: 8 },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', mass: 33 },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', mass: 89 }
  ];
  dataSource = new MatTableDataSource(this.data);
  constructor() {
    this.dataSourceTree.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  toggleColumn(event: MatCheckboxChange) {
    this.allColumnsInfo.forEach(column => {
      if (column.key === event.source.value) {
        column.isVisible = !column.isVisible;
        return;
      }
    });
    this.updateDisplayedColumns();
  }

  onClickSubmit(formData: any) {
    this.allColumnsInfo.push({ key: formData.columnName, isVisible: true });
    this.data.map(d => {
      d[formData.columnName] = Math.floor(Math.random() * 100);
    });
    this.updateDisplayedColumns();
    this.inputValue = '';
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.allColumnsInfo
      .filter(c => c.isVisible)
      .map(c => c.key);
    console.log(this.displayedColumns);
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevIndex = this.allColumnsInfo.indexOf(
      this.allColumnsInfo.find(
        c => c.key === this.displayedColumns[event.previousIndex]
      )
    );
    const newIndex = this.allColumnsInfo.indexOf(
      this.allColumnsInfo.find(
        c => c.key === this.displayedColumns[event.currentIndex]
      )
    );
    moveItemInArray(this.allColumnsInfo, prevIndex, newIndex);
    this.updateDisplayedColumns();
  }
}
