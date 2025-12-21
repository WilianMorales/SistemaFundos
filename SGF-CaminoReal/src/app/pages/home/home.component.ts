import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, HeaderComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

}
