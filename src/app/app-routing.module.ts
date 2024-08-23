import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mantenedor', component: MantenedorComponent,canActivate:[AuthGuard] },
  { path: 'recuperar', component: PasswordRecoverComponent },
  {
    path: 'paises',
    loadChildren: () => import('./parent-child-component/parent-child.module').then(m => m.ParentChildModule),canActivate:[AuthGuard]
  },
	{ path: '', pathMatch: 'full', redirectTo: '' },
	// cambiar
	{ path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
