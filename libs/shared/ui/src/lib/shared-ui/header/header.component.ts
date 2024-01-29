import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'pd-ionic-header',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, IonicModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
