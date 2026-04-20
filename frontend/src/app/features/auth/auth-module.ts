import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Register } from './register/register';
import { RequestResetComponent } from './passwordRecover/requestReset/requestReset';
import { ResetPasswordComponent } from './passwordRecover/changePassword/changePassword';

@NgModule({
  declarations: [Login, Register, RequestResetComponent, ResetPasswordComponent],
  imports: [CommonModule, AuthRoutingModule, FormsModule, TranslateModule],
})
export class AuthModule {}
