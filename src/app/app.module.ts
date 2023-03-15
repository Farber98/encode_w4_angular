import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { UserWalletComponent } from 'src/components/userWallet/userwallet.component';
import { TokenInfoComponent } from 'src/components/tokenInfo/tokenInfo.component';
import { BallotComponent } from 'src/components/ballot/ballot.component';
@NgModule({
  declarations: [
    AppComponent,
    UserWalletComponent,
    TokenInfoComponent,
    BallotComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
