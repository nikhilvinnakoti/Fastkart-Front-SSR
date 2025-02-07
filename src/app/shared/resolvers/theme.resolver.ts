import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetHomePage } from '../action/theme.action';

export const ThemeResolver: ResolveFn<boolean> = (route, state) => {
  const slug = route.paramMap.get('slug') || 'paris';

  return inject(Store).dispatch(new GetHomePage(slug)).pipe(
    map(() => true), // Emit true if dispatch is successful
    catchError(() => of(false)) // Emit false on error
  );
};
