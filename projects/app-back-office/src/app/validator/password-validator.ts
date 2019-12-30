import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {

        const password = AC.get('passControl').value; // to get value in input tag
        const confirmPassword = AC.get('confirmPassControl').value; // to get value in input tag
        if (password !== confirmPassword) {
            // console.log('false');
            AC.get('confirmPassControl').setErrors({ MatchPassword: true });
        } else {
            // console.log('true');
            return null;
        }
    }
}
