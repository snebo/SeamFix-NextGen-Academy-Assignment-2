import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    // Check if the error is a client-side or network error.
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = this.getServerErrorMessage(error);
    }

    // Re-throw the error with a user-friendly message.
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return `Bad Request: The server could not understand the request. Please check your input.`;
      case 401:
        return `Unauthorized: You are not authenticated. Please log in.`;
      case 403:
        return `Forbidden: You do not have permission to access this resource.`;
      case 404:
        return `Not Found: The requested resource could not be found.`;
      case 500:
        return `Internal Server Error: Something went wrong on the server. Please try again later.`;
      default:
        return `An unexpected error occurred. Status: ${error.status}, Message: ${error.message}`;
    }
  }
}
