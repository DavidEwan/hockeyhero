import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HeroKeysComponent } from './list/hero-keys.component';
import { HeroKeysDetailComponent } from './detail/hero-keys-detail.component';
import { HeroKeysUpdateComponent } from './update/hero-keys-update.component';
import { HeroKeysDeleteDialogComponent } from './delete/hero-keys-delete-dialog.component';
import { HeroKeysRoutingModule } from './route/hero-keys-routing.module';

@NgModule({
  imports: [SharedModule, HeroKeysRoutingModule],
  declarations: [HeroKeysComponent, HeroKeysDetailComponent, HeroKeysUpdateComponent, HeroKeysDeleteDialogComponent],
})
export class HeroKeysModule {}
