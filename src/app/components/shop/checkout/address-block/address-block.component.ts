import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserAddress } from '../../../../shared/interface/user.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-address-block',
  templateUrl: './address-block.component.html',
  styleUrls: ['./address-block.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class AddressBlockComponent {

  @Input() addresses?: UserAddress[] = [];
  @Input() type: string = 'shipping';

  @Output() selectAddress: EventEmitter<string> = new EventEmitter();

  selectedAddressId?: string;

  constructor() { }

  ngOnInit() {
    // Automatically emit the selectAddress event for the first item if it's available
    if (this.addresses && this.addresses.length > 0) {
      this.selectedAddressId = (this.addresses[0] as any)._id;
      console.log(this.addresses);
      this.selectAddress.emit(String(this.selectedAddressId)); // Emit the first address if available
    }
  }

  set(event: Event) {
    const selectedId = String((<HTMLInputElement>event.target)?.value);
    this.selectedAddressId = selectedId;
    this.selectAddress.emit(this.selectedAddressId); // Emit the selected address ID
  }
}


