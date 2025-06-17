import appErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: appErrorCode
  ) {
    super(message);
  }
}

export default AppError;
