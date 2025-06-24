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

// 표준 에러 응답 데코레이터
const ApiStandardErrors = (includeAuth = true) => {
    const decorators = [
        ApiBadRequestResponse({
            description: '잘못된 요청입니다.',
            type: ErrorResponseDto,
        }),
        ApiInternalServerErrorResponse({
            description: '서버 내부 오류가 발생했습니다.',
            type: ErrorResponseDto,
        }),
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

// 단일 데이터 응답 데코레이터
export const ApiDataResponse = <TModel extends Type<any>>(options: {
    status?: number;
    description: string;
    type?: TModel;
    includeAuth?: boolean;
    additionalErrors?: any[];
}) => {
    const { status = 200, description, type, includeAuth = true, additionalErrors = [] } = options;

    const schema = type
        ? {
              allOf: [
                  { $ref: getSchemaPath(BaseResponseDto) },
                  {
                      properties: {
                          data: { $ref: getSchemaPath(type) },
                      },
                  },
              ],
          }
        : {
              allOf: [
                  { $ref: getSchemaPath(BaseResponseDto) },
                  {
                      properties: {
                          data: { type: 'object', nullable: true },
                      },
                  },
              ],
          };

    const responseDecorator = (() => {
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
    })();

    return applyDecorators(responseDecorator, ...additionalErrors, ApiStandardErrors(includeAuth));
};

// 페이지네이션 응답 데코레이터
export const ApiPaginatedResponse = <TModel extends Type<any>>(options: {
    status?: number;
    description: string;
    type: TModel;
    includeAuth?: boolean;
    additionalErrors?: any[];
}) => {
    const { status = 200, description, type, includeAuth = true, additionalErrors = [] } = options;

    const schema = {
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

    const responseDecorator = (() => {
        switch (status) {
            case 200:
                return ApiOkResponse({ description, schema });
            case 201:
                return ApiCreatedResponse({ description, schema });
            default:
                return ApiResponse({ status, description, schema });
        }
    })();

    return applyDecorators(responseDecorator, ...additionalErrors, ApiStandardErrors(includeAuth));
};

// 배열 응답 데코레이터 (페이지네이션 없음)
export const ApiArrayResponse = <TModel extends Type<any>>(options: {
    status?: number;
    description: string;
    type: TModel;
    includeAuth?: boolean;
    additionalErrors?: any[];
}) => {
    const { status = 200, description, type, includeAuth = true, additionalErrors = [] } = options;

    const schema = {
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

    const responseDecorator = (() => {
        switch (status) {
            case 200:
                return ApiOkResponse({ description, schema });
            case 201:
                return ApiCreatedResponse({ description, schema });
            default:
                return ApiResponse({ status, description, schema });
        }
    })();

    return applyDecorators(responseDecorator, ...additionalErrors, ApiStandardErrors(includeAuth));
};
