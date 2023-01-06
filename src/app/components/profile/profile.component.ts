import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObjectType } from 'deta/dist/types/types/basic';
import { FWFService } from 'src/app/services/fwf.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractComponent {

  edit?: string;
  userForm: FormGroup;
  deleteForm: FormGroup;

  constructor(fwfService: FWFService, private formBuilder: FormBuilder, private router: Router) {
    super(fwfService);
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      img: ['', [ProfileComponent.imgValidator]],
    });
    this.deleteForm = this.formBuilder.group({
      confirmation: [false, [Validators.requiredTrue]]
    });
  }

  protected override handleUser(user?: ObjectType): void {
    super.handleUser(user);
    if (user) {
      this.userForm.patchValue({
        name: user['name'] as string,
        img: user['img'] as string
      });
    } else {
      this.userForm.patchValue({
        name: '',
        img: ''
      });
    }
  }

  private static imgValidator({ value }: AbstractControl): null | ValidationErrors {
    if (!value || value.length == 0) {
      return null;
    }
    if (!value.startsWith('https://')) {
      return { pattern: true };
    }
    try {
      new URL(value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  get name() { return this.userForm.get('name')!; }

  get img() { return this.userForm.get('img')!; }

  editField(field: string): void {
    this.edit = field
  }

  cancelEdit(field: string): void {
    if (this.me) {
      this.userForm.get(field)?.setValue(this.me[field] as string);
    }
    this.edit = undefined;
  }

  deleteField(field: string): void {
    this.userForm.get(field)?.setValue(null);
    this.updateUser();
  }

  updateUser(): void {
    let user: ObjectType = {};
    user['name'] = this.userForm.value.name;
    user['img'] = this.userForm.value.img;
    this.fwfService.updateUser(user).subscribe({
      next: () => {
        this.fwfService.refreshUser();
      }
    });
    this.edit = undefined;
  }

  deleteUser(): void {
    this.fwfService.deleteUser().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

}
