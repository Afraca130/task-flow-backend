import { PaginationMetaDto } from '@src/common/dtos/paginate-response.dto';
import { ErrorResponseDto, BaseResponseDto } from '@src/common/dtos/response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    getSchemaPath,
    ApiResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger';

// 응답 타입 정의
export type ApiResponseType = 'single' | 'array' | 'paginated';

// API 응답 옵션 인터페이스
interface ApiResponseOptions<TModel extends Type<any> = any> {
    status?: number;
    description: string;
    type?: TModel;
    responseType?: ApiResponseType;
    includeAuth?: boolean;
    additionalErrors?: any[];
}

// 표준 에러 응답 데코레이터
export const ApiStandardErrors = (includeAuth = true, additionalErrors: any[] = []) => {
    const decorators = [
        ApiBadRequestResponse({
            description: '잘못된 요청입니다.',
            type: ErrorResponseDto,
        }),
        ApiInternalServerErrorResponse({
            description: '서버 내부 오류가 발생했습니다.',
            type: ErrorResponseDto,
        }),
        ...additionalErrors,
    ];

    if (includeAuth) {
        decorators.push(
            ApiUnauthorizedResponse({
                description: '인증이 필요합니다.',
                type: ErrorResponseDto,
            }),
            ApiForbiddenResponse({
                description: '권한이 없습니다.',
                type: ErrorResponseDto,
            }),
        );
    }

    return applyDecorators(...decorators);
};

// 통합 API 응답 데코레이터
export const ApiCustomResponse = <TModel extends Type<any>>(options: ApiResponseOptions<TModel>) => {
    const {
        status = 200,
        description,
        type,
        responseType = 'single',
        includeAuth = true,
        additionalErrors = [],
    } = options;

    // 스키마 생성 함수
    const createSchema = () => {
        if (!type) {
            return {
                allOf: [
                    { $ref: getSchemaPath(BaseResponseDto) },
                    {
                        properties: {
                            data: { type: 'object', nullable: true },
                        },
                    },
                ],
            };
        }

        switch (responseType) {
            case 'array':
                return {
                    allOf: [
                        { $ref: getSchemaPath(BaseResponseDto) },
                        {
                            properties: {
                                data: {
                                    type: 'array',
                                    items: { $ref: getSchemaPath(type) },
                                },
                            },
                        },
                    ],
                };

            case 'paginated':
                return {
                    allOf: [
                        { $ref: getSchemaPath(BaseResponseDto) },
                        {
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        items: {
                                            type: 'array',
                                            items: { $ref: getSchemaPath(type) },
                                        },
                                        meta: { $ref: getSchemaPath(PaginationMetaDto) },
                                    },
                                },
                            },
                        },
                    ],
                };

            case 'single':
            default:
                return {
                    allOf: [
                        { $ref: getSchemaPath(BaseResponseDto) },
                        {
                            properties: {
                                data: { $ref: getSchemaPath(type) },
                            },
                        },
                    ],
                };
        }
    };

    // 응답 데코레이터 선택
    const getResponseDecorator = () => {
        const schema = createSchema();

        switch (status) {
            case 200:
                return ApiOkResponse({ description, schema });
            case 201:
                return ApiCreatedResponse({ description, schema });
            case 204:
                return ApiNoContentResponse({ description });
            default:
                return ApiResponse({ status, description, schema });
        }
    };

    return applyDecorators(getResponseDecorator(), ApiStandardErrors(includeAuth, additionalErrors));
};

// 편의성을 위한 특수 데코레이터들
export const ApiDataResponse = <TModel extends Type<any>>(
    type: TModel | null,
    options: Omit<ApiResponseOptions<TModel>, 'type' | 'responseType'>,
) => {
    return ApiCustomResponse({
        ...options,
        type: type || undefined,
        responseType: 'single',
    });
};

export const ApiArrayResponse = <TModel extends Type<any>>(
    type: TModel,
    options: Omit<ApiResponseOptions<TModel>, 'type' | 'responseType'>,
) => {
    return ApiCustomResponse({
        ...options,
        type,
        responseType: 'array',
    });
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    type: TModel,
    options: Omit<ApiResponseOptions<TModel>, 'type' | 'responseType'>,
) => {
    return ApiCustomResponse({
        ...options,
        type,
        responseType: 'paginated',
    });
};
