// Common types used across the application

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
