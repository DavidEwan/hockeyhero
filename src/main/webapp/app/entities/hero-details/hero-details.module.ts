import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HeroDetailsComponent } from './list/hero-details.component';
import { HeroDetailsDetailComponent } from './detail/hero-details-detail.component';
import { HeroDetailsUpdateComponent } from './update/hero-details-update.component';
import { HeroDetailsDeleteDialogComponent } from './delete/hero-details-delete-dialog.component';
import { HeroDetailsRoutingModule } from './route/hero-details-routing.module';

@NgModule({
  imports: [SharedModule, HeroDetailsRoutingModule],
  declarations: [HeroDetailsComponent, HeroDetailsDetailComponent, HeroDetailsUpdateComponent, HeroDetailsDeleteDialogComponent],
})
export class HeroDetailsModule {}
