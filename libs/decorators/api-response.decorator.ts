import { PaginationMetaDto } from '@libs/dtos/paginate-response.dto';
import { ErrorResponseDto, BaseResponseDto } from '@libs/dtos/response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, getSchemaPath, ApiResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

// 공통 에러 응답 데코레이터
const ApiCommonErrors = () =>
    applyDecorators(
        ApiBadRequestResponse({ description: '잘못된 요청입니다.', type: ErrorResponseDto }), // 하나만 예시로 표시
    );

// 단일 응답 데코레이터
export const ApiDataResponse = (options: {
    status?: number;
    description: string;
    type?: any;
    isPaginated?: boolean;
}) => {
    const schema = options.type
        ? {
              allOf: [
                  {
                      $ref: getSchemaPath(BaseResponseDto),
                  },
                  {
                      properties: {
                          data:
                              options.isPaginated || Array.isArray(options.type)
                                  ? {
                                        type: 'object',
                                        properties: {
                                            items: {
                                                type: 'array',
                                                items: { $ref: getSchemaPath(options.type[0]) },
                                            },
                                            meta: {
                                                $ref: getSchemaPath(PaginationMetaDto),
                                            },
                                        },
                                    }
                                  : {
                                        $ref: getSchemaPath(options.type),
                                    },
                      },
                  },
              ],
          }
        : {
              properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: options.description },
              },
          };

    const responseDecorator = (() => {
        const status = options.status || 200;
        const description = options.description || '성공적으로 처리되었습니다.';

        switch (status) {
            case 200:
                return ApiOkResponse({ description, schema });
            case 201:
                return ApiCreatedResponse({ description, schema });
            default:
                return ApiResponse({ status, description, schema });
        }
    })();

    return applyDecorators(responseDecorator, ApiCommonErrors());
};
