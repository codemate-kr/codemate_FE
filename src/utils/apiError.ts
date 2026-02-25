type ApiErrorShape = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      code?: string;
      message?: string;
    };
  };
};

const isApiErrorShape = (error: unknown): error is ApiErrorShape =>
  typeof error === 'object' && error !== null;

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiErrorShape(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string' && apiMessage.length > 0) {
      return apiMessage;
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (!isApiErrorShape(error)) {
    return undefined;
  }
  return error.response?.status;
};

export const getApiErrorCode = (error: unknown): string | undefined => {
  if (!isApiErrorShape(error)) {
    return undefined;
  }
  return error.response?.data?.code;
};
