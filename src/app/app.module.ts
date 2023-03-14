import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { UserWalletComponent } from 'src/components/userWallet/userwallet.component';
import { TokenInfoComponent } from 'src/components/tokenInfo/tokenInfo.component';
@NgModule({
  declarations: [
    AppComponent,
    UserWalletComponent,
    TokenInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
