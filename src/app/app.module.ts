import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { SecuredComponent } from './secured/secured.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';


const oidc_configuration = 'assets/auth.clientConfiguration.json';
// if your config is on server side
// const oidc_configuration = ${window.location.origin}/api/ClientAppSettings
export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}

@NgModule({
  declarations: [
    AppComponent,
    SecuredComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'home', component: AppComponent },
      { path: 'authCallback', component: AppComponent },
      { path: 'secure', component: SecuredComponent, canActivate: [AuthGuard] }
    ]),
    AuthModule.forRoot()
  ],
  providers: [OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true,
    },
  AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

      // Use the configResult to set the configurations

      const config: OpenIdConfiguration = {
        stsServer: configResult.customConfig.stsServer,
        redirect_url: configResult.customConfig.redirect_url,
        client_id:  configResult.customConfig.client_id,
        scope: configResult.customConfig.scope,
        response_type: configResult.customConfig.response_type,
        log_console_debug_active: true,
        // all other properties you want to set
      };

      this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
  }
}
