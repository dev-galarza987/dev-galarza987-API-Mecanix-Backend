import { Test, TestingModule } from '@nestjs/testing';
import { ClientVehicleController } from './client-vehicle.controller';
import { ClientVehicleService } from './client-vehicle.service';
import { CreateClientVehicleDto } from './dto/create-client-vehicle.dto';
import { UpdateClientVehicleDto } from './dto/update-client-vehicle.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ClientVehicleController', () => {
  let controller: ClientVehicleController;
  let service: ClientVehicleService;

  const mockClientVehicleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByClient: jest.fn(),
    findByVehicle: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    setPrimary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientVehicleController],
      providers: [
        {
          provide: ClientVehicleService,
          useValue: mockClientVehicleService,
        },
      ],
    }).compile();

    controller = module.get<ClientVehicleController>(ClientVehicleController);
    service = module.get<ClientVehicleService>(ClientVehicleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client-vehicle relationship', async () => {
      const createDto: CreateClientVehicleDto = {
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: true,
        notes: 'Test notes',
        isActive: true,
      };

      const expectedResult = {
        id: 1,
        ...createDto,
        addedDate: new Date(),
        updatedAt: new Date(),
      };

      mockClientVehicleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw NotFoundException if client does not exist', async () => {
      const createDto: CreateClientVehicleDto = {
        clientCode: 9999,
        vehicleId: 5,
      };

      mockClientVehicleService.create.mockRejectedValue(
        new NotFoundException('Cliente con código 9999 no encontrado'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if relationship already exists', async () => {
      const createDto: CreateClientVehicleDto = {
        clientCode: 1001,
        vehicleId: 5,
      };

      mockClientVehicleService.create.mockRejectedValue(
        new BadRequestException('Esta relación cliente-vehículo ya existe'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all client-vehicle relationships', async () => {
      const expectedResult = [
        { id: 1, clientCode: 1001, vehicleId: 5 },
        { id: 2, clientCode: 1002, vehicleId: 6 },
      ];

      mockClientVehicleService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByClient', () => {
    it('should return all vehicles for a client', async () => {
      const clientCode = 1001;
      const expectedResult = [
        { id: 1, clientCode: 1001, vehicleId: 5, isPrimary: true },
        { id: 2, clientCode: 1001, vehicleId: 6, isPrimary: false },
      ];

      mockClientVehicleService.findByClient.mockResolvedValue(expectedResult);

      const result = await controller.findByClient(clientCode);

      expect(result).toEqual(expectedResult);
      expect(service.findByClient).toHaveBeenCalledWith(clientCode);
    });

    it('should throw NotFoundException if client not found', async () => {
      const clientCode = 9999;

      mockClientVehicleService.findByClient.mockRejectedValue(
        new NotFoundException(`Cliente con código ${clientCode} no encontrado`),
      );

      await expect(controller.findByClient(clientCode)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByVehicle', () => {
    it('should return all clients for a vehicle', async () => {
      const vehicleId = 5;
      const expectedResult = [
        { id: 1, clientCode: 1001, vehicleId: 5 },
        { id: 2, clientCode: 1002, vehicleId: 5 },
      ];

      mockClientVehicleService.findByVehicle.mockResolvedValue(expectedResult);

      const result = await controller.findByVehicle(vehicleId);

      expect(result).toEqual(expectedResult);
      expect(service.findByVehicle).toHaveBeenCalledWith(vehicleId);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const vehicleId = 9999;

      mockClientVehicleService.findByVehicle.mockRejectedValue(
        new NotFoundException(`Vehículo con ID ${vehicleId} no encontrado`),
      );

      await expect(controller.findByVehicle(vehicleId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a client-vehicle relationship by id', async () => {
      const id = 1;
      const expectedResult = {
        id: 1,
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: true,
        notes: 'Test notes',
        isActive: true,
      };

      mockClientVehicleService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      const id = 999;

      mockClientVehicleService.findOne.mockRejectedValue(
        new NotFoundException(`Relación cliente-vehículo con ID ${id} no encontrada`),
      );

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client-vehicle relationship', async () => {
      const id = 1;
      const updateDto: UpdateClientVehicleDto = {
        isPrimary: false,
        notes: 'Updated notes',
        isActive: false,
      };

      const expectedResult = {
        id: 1,
        clientCode: 1001,
        vehicleId: 5,
        ...updateDto,
      };

      mockClientVehicleService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      const id = 999;
      const updateDto: UpdateClientVehicleDto = {
        isPrimary: false,
      };

      mockClientVehicleService.update.mockRejectedValue(
        new NotFoundException(`Relación cliente-vehículo con ID ${id} no encontrada`),
      );

      await expect(controller.update(id, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('setPrimary', () => {
    it('should set a vehicle as primary for a client', async () => {
      const id = 1;
      const expectedResult = {
        id: 1,
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: true,
      };

      mockClientVehicleService.setPrimary.mockResolvedValue(expectedResult);

      const result = await controller.setPrimary(id);

      expect(result).toEqual(expectedResult);
      expect(service.setPrimary).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      const id = 999;

      mockClientVehicleService.setPrimary.mockRejectedValue(
        new NotFoundException(`Relación cliente-vehículo con ID ${id} no encontrada`),
      );

      await expect(controller.setPrimary(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a client-vehicle relationship', async () => {
      const id = 1;

      mockClientVehicleService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if relationship not found', async () => {
      const id = 999;

      mockClientVehicleService.remove.mockRejectedValue(
        new NotFoundException(`Relación cliente-vehículo con ID ${id} no encontrada`),
      );

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
