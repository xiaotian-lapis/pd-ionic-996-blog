import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'pd-ionic-header',
  standalone: true,
  imports: [RouterLink, IonicModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  @Input()
  title: string = "Hello";

  @Input()
  onSignOut: () => void = () => {console.log('onSignOut')};
}
