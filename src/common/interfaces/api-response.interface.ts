export interface PaginationMeta {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta | Record<string, any>; // 더 명확한 타입
}
