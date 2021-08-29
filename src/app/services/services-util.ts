import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleError(error: HttpErrorResponse) {
  let errorMessage: string = '';

  if (error.error instanceof ErrorEvent) {
    errorMessage = 'An unknown error has occurred: ' + error.error;
  } else {
    errorMessage =
      'A HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error}`;
  }

  console.error(errorMessage);

  return throwError(errorMessage);
}
