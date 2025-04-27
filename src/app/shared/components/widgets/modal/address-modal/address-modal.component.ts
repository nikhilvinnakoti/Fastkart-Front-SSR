import {
  Component,
  TemplateRef,
  ViewChild,
  PLATFORM_ID,
  Inject,
  inject,
} from "@angular/core";
import { isPlatformBrowser, AsyncPipe } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngxs/store";
import { map, Observable } from "rxjs";
import {
  Select2Data,
  Select2UpdateEvent,
  Select2Module,
} from "ng-select2-component";
import {
  CreateAddress,
  GetUserDetails,
  UpdateAddress,
} from "../../../../action/account.action";
import { CountryState } from "../../../../state/country.state";
import { StateState } from "../../../../state/state.state";
import { UserAddress } from "../../../../interface/user.interface";
import * as data from "../../../../data/country-code";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "../../button/button.component";
import { AuthState } from "src/app/shared/state/auth.state";

@Component({
  selector: "address-modal",
  templateUrl: "./address-modal.component.html",
  styleUrls: ["./address-modal.component.scss"],
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    Select2Module,
    AsyncPipe,
    TranslateModule,
  ],
})
export class AddressModalComponent {
  public form: FormGroup;
  public closeResult: string;
  public modalOpen: boolean = false;

  public states$: Observable<Select2Data>;
  public address: UserAddress | null;
  public codes = data.countryCodes;
  public isBrowser: boolean;

  userId: String | null = null;
  userId$ = inject(Store).select(AuthState._id);

  @ViewChild("addressModal", { static: false })
  AddressModal: TemplateRef<string>;

  countries$: Observable<Select2Data> = inject(Store).select(
    CountryState.countries
  );

  constructor(
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store,
    private formBuilder: FormBuilder
  ) {
    this.userId$.subscribe((_id) => (this.userId = _id));
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.form = this.formBuilder.group({
      title: new FormControl("", [Validators.required]),
      street: new FormControl("", [Validators.required]),
      state_id: new FormControl("", [Validators.required]),
      country_id: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      pincode: new FormControl("", [Validators.required]),
      country_code: new FormControl("91", [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
      ]),
    });
  }

  // 🟢 Reusable state loader
  private setStatesByCountryId(countryId: number) {
    this.states$ = this.store
      .select(StateState.states)
      .pipe(map((filterFn) => filterFn(countryId)));
  }

  // 🔁 Triggered by UI when user selects country
  countryChange(data: Select2UpdateEvent) {
    const countryId = +data?.value;
    if (countryId) {
      this.setStatesByCountryId(countryId);
      if (!this.address) {
        this.form.controls["state_id"].setValue("");
      }
    } else {
      this.form.controls["state_id"].setValue("");
    }
  }

  async openModal(value?: UserAddress) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalOpen = true;
      this.patchForm(value);
      this.modalService
        .open(this.AddressModal, {
          ariaLabelledBy: "address-add-Modal",
          centered: true,
          windowClass: "theme-modal modal-lg",
        })
        .result.then(
          (result) => {
            `Result ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) return "by pressing ESC";
    if (reason === ModalDismissReasons.BACKDROP_CLICK)
      return "by clicking on a backdrop";
    return `with: ${reason}`;
  }

  // patchForm(value?: UserAddress) {
  //   if (value) {
  //     this.address = value;
  //     this.form.patchValue({
  //       user_id: value?.user_id,
  //       title: value?.title,
  //       street: value?.street,
  //       country_id: value?.country_id,
  //       state_id: value?.state_id,
  //       city: value?.city,
  //       pincode: value?.pincode,
  //       country_code: value?.country_code,
  //       phone: value?.phone,
  //     });

  //     // 🟢 Load states for this country
  //     this.setStatesByCountryId(value.country_id);

  //     // 🟢 Ensure correct state is selected after they load
  //     this.states$?.subscribe((states: any) => {
  //       const selectedState = states.find(
  //         (state: any) => state.id === value.state_id
  //       );
  //       if (selectedState) {
  //         this.form.controls["state_id"].setValue(selectedState.id);
  //       }
  //     });
  //   } else {
  //     this.address = null;
  //     this.form.reset();
  //     this.form.controls["country_code"].setValue("91");
  //   }
  // }

  // submit() {
  //   this.form.markAllAsTouched();

  //   const formData = { ...this.form.value, user_id: this.userId };
  //   let action = new CreateAddress(formData);

  //   if (this.address) {
  //     action = new UpdateAddress(this.form.value, this.userId);
  //   }

  //   if (this.form.valid) {
  //     this.store.dispatch(action).subscribe({
  //       complete: () => {
  //         this.form.reset();
  //         if (!this.address) {
  //           this.form.controls["country_code"].setValue("91");
  //         }
  //       },
  //     });
  //   }
  // }
  patchForm(value?: UserAddress) {
    if (value) {
      this.address = value;
      this.form.patchValue({
        user_id: value?.user_id,
        title: value?.title,
        street: value?.street,
        country_id: value?.country?.id || value?.country_id,
        state_id: value?.state?.id || value?.state_id,
        city: value?.city,
        pincode: value?.pincode,
        country_code: value?.country_code,
        phone: value?.phone,
      });
  
      // 🟢 Load states for this country
      const countryId = value?.country?.id || value?.country_id;
      this.setStatesByCountryId(countryId);
  
      // 🟢 Select proper state from state list
      this.states$?.subscribe((states: any[]) => {
        const selectedState = states.find(
          (s: any) => +s.value === (value?.state?.id || value?.state_id)
        );
        if (selectedState) {
          this.form.controls["state_id"].setValue(selectedState.value);
        }
      });
    } else {
      this.address = null;
      this.form.reset();
      this.form.controls["country_code"].setValue("91");
    }
  }
  
 
submit() {
  this.form.markAllAsTouched();
  if (this.form.invalid || !this.userId) return;

  const formValue = this.form.value;
  const countryId = +formValue.country_id;
  const stateId = +formValue.state_id;

  // Select2 uses: { label: string, value: number }
  const countries = this.store.selectSnapshot(CountryState.countries) || [];

  const stateFilterFn = this.store.selectSnapshot(StateState.states);
  const states = stateFilterFn ? stateFilterFn(countryId) : [];

  const selectedCountry = countries.find(
    (c: any) => +c.value === countryId
  );

  const selectedState = states.find(
    (s: any) => +s.value === stateId
  );

  const formData = {
    ...formValue,
    user_id: this.userId,
    country: selectedCountry
      ? { id: +selectedCountry.value, name: selectedCountry.label }
      : null,
    state: selectedState
      ? {
          id: +selectedState.value,
          name: selectedState.label,
          country_id: +countryId,
        }
      : null,
  };
  console.log("address", this.address);

  const action = this.address
    ? new UpdateAddress(formData,(this.address as any)._id)
    : new CreateAddress(formData);

  this.store.dispatch(action).subscribe({
    complete: () => {
      
      if (!this.address) {
        this.form.reset();
        this.form.controls["country_code"].setValue("91");
        this.store.dispatch(new GetUserDetails(this.userId))
      }
      this.modalService.dismissAll();
     
       
    },
  });
}



  


  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}

