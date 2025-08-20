export class BaseResponse {
  constructor(public message: string, public data?: any) {}

  static success(data?: any) {
    return new BaseResponse("success", data);
  }

  static error(data?: any) {
    return new BaseResponse("error", data);
  }
}

export class PaginatedResponse {
  public total: number;
  public message: string;
  public data: any[];

  constructor(message: string, data: any[], total: number) {
    this.total = total;
    this.data = data;
    this.message = message;
  }

  static success(data: any[], total: number) {
    return new PaginatedResponse("success", data, total);
  }

  static error(data: any[], total: number) {
    return new PaginatedResponse("error", data, total);
  }
}
