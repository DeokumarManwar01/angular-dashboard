import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
import { HttpClientModule } from "@angular/common/http";
import { ToasterComponent } from "./components/toaster/toaster.component";

@NgModule({
  declarations: [AppComponent, DashboardComponent, SidePanelComponent, ToasterComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot(
      [],
      {
        compatibility: { strictContentSecurityPolicy: true },
      }
    )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
