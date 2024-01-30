import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'pd-ionic-dummy-header',
  standalone: true,
  imports: [RouterLink, IonicModule, NgIf],
  templateUrl: './dummy-header.component.html',
  styleUrl: './dummy-header.component.scss',
})
export class DummyHeaderComponent {

  @Input()
  shouldShow: boolean = false;

}
