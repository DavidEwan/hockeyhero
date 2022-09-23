import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHeroDetails } from '../hero-details.model';
import { HeroDetailsService } from '../service/hero-details.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './hero-details-delete-dialog.component.html',
})
export class HeroDetailsDeleteDialogComponent {
  heroDetails?: IHeroDetails;

  constructor(protected heroDetailsService: HeroDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.heroDetailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
