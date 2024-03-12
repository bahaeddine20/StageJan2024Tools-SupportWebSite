import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

export function provideHttpClient(httpClient: HttpClient) {
  return (url: string) => {
    return fetch(url).then(response => response.json());
  };
}

@NgModule({
  imports: [
    BrowserModule,
    ServerModule,
    AppModule,
    HttpClientModule,
    FlexLayoutServerModule,
  ],
  providers: [
    {
      provide: HttpClient,
      useFactory: provideHttpClient,
      deps: [HttpClient]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
