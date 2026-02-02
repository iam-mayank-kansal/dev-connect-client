// ============= AUTH API =============
export namespace ImageKitAPI {
  // imagekit access
  export interface ImageKitAuthResponse {
    signature: string;
    expire: number;
    token: string;
  }

  // delete imagekit resource
  export interface DeleteImageKitRequest {
    fileId: string;
  }

  export interface DeleteImageKitResponse {
    responseCode: number;
    status: string;
    message: string;
  }
}
