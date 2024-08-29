import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({ exports: [CalendarModule], imports: [CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class CalendarConfigModule {}
