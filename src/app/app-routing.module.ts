import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { PadreComponent } from './parent-child-component/padre/padre.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mantenedor', component: MantenedorComponent,canActivate:[AuthGuard] },
  { path: 'paises', component: PadreComponent,canActivate:[AuthGuard] },
	{ path: '', pathMatch: 'full', redirectTo: '' },
	// cambiar
	{ path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
