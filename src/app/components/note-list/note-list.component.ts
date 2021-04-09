import { Component } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  constructor(private store: StoreService) { }

  get notes$() {
    return this.store.selectAsync(s => s.notes);
  }
}