import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHeroKeys } from '../hero-keys.model';
import { HeroKeysService } from '../service/hero-keys.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './hero-keys-delete-dialog.component.html',
})
export class HeroKeysDeleteDialogComponent {
  heroKeys?: IHeroKeys;

  constructor(protected heroKeysService: HeroKeysService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.heroKeysService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
