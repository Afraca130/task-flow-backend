import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/application/auth/auth.service';
import { RegisterUsecase, LoginUseCase, GetTokenUsecase } from '../../src/application/auth/usecases';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto } from '../../src/application/auth/dtos';

describe('AuthService', () => {
    let service: AuthService;
    let registerUsecase: RegisterUsecase;
    let loginUseCase: LoginUseCase;
    let getTokenUsecase: GetTokenUsecase;

    const mockRegisterUsecase = {
        execute: jest.fn(),
    };

    const mockLoginUseCase = {
        execute: jest.fn(),
    };

    const mockGetTokenUsecase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: RegisterUsecase,
                    useValue: mockRegisterUsecase,
                },
                {
                    provide: LoginUseCase,
                    useValue: mockLoginUseCase,
                },
                {
                    provide: GetTokenUsecase,
                    useValue: mockGetTokenUsecase,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        registerUsecase = module.get<RegisterUsecase>(RegisterUsecase);
        loginUseCase = module.get<LoginUseCase>(LoginUseCase);
        getTokenUsecase = module.get<GetTokenUsecase>(GetTokenUsecase);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        const registerDto: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
        };

        it('should successfully register a new user', async () => {
            const mockUser = {
                id: 'user-1',
                email: registerDto.email,
                name: registerDto.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockRegisterUsecase.execute.mockResolvedValue(mockUser);

            const result = await service.register(registerDto);

            expect(result).toBeDefined();
            expect(mockRegisterUsecase.execute).toHaveBeenCalledWith(registerDto);
        });

        it('should throw ConflictException if user already exists', async () => {
            mockRegisterUsecase.execute.mockRejectedValue(new ConflictException());

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        const loginDto: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully login a user', async () => {
            const mockUser = {
                id: 'user-1',
                email: loginDto.email,
                name: 'Test User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const mockToken = 'mock.jwt.token';

            mockLoginUseCase.execute.mockResolvedValue(mockUser);
            mockGetTokenUsecase.execute.mockResolvedValue(mockToken);

            const result = await service.login(loginDto);

            expect(result).toBeDefined();
            expect(result.accessToken).toBe(mockToken);
            expect(result.user).toBeInstanceOf(UserDto);
            expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto);
            expect(mockGetTokenUsecase.execute).toHaveBeenCalledWith(mockUser);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockLoginUseCase.execute.mockRejectedValue(new UnauthorizedException());

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            mockLoginUseCase.execute.mockRejectedValue(new UnauthorizedException());

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });
});
