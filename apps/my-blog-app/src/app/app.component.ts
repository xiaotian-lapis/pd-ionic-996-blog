import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@pd-ionic/shared-ui';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, IonicModule],
  selector: 'pd-ionic-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-blog-app';
}
