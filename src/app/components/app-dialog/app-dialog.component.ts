import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';

@Component({
  selector: 'app-app-dialog',
  templateUrl: './app-dialog.component.html',
  styleUrls: ['./app-dialog.component.scss']
})
export class AppDialogComponent {

  form: FormGroup;
  notification: boolean = false;

  constructor(private fwfService: FWFService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      link: ['', [Validators.required, AppDialogComponent.urlValidator]],
      notification: false,
      email: { value: '', disabled: true }
    });
  }

  private static urlValidator({ value }: AbstractControl): null | ValidationErrors {
    if (!value || value.length == 0 || !value.startsWith('https://')) {
      return { pattern: true };
    }
    try {
      new URL(value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  setNotification(checked: boolean): void {
    this.notification = checked;
    if (checked) {
      this.form.get('email')?.clearValidators();
      this.form.get('email')?.addValidators([Validators.email, Validators.required]);
      this.form.get('email')?.enable();
    } else {
      this.form.get('email')?.setValue(undefined);
      this.form.get('email')?.clearValidators();
      this.form.get('email')?.disable();
    }
  }

  makeAppProposal(): void {
    let proposal: ObjectType = {};
    proposal['link'] = this.form.value.link;
    if (this.form.value.email) {
      proposal['email'] = this.form.value.email;
    }
    this.fwfService.makeAppProposal(proposal).subscribe();
  }

}