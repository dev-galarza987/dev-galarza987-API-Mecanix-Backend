import { Test, TestingModule } from '@nestjs/testing';
import { ClientVehicleService } from './client-vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientVehicle } from './entities/client-vehicle.entity';
import { Client } from '../client/entities/client.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ClientVehicleService', () => {
  let service: ClientVehicleService;
  let clientVehicleRepository: Repository<ClientVehicle>;
  let clientRepository: Repository<Client>;
  let vehicleRepository: Repository<Vehicle>;

  const mockClientVehicleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockClientRepository = {
    findOne: jest.fn(),
  };

  const mockVehicleRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientVehicleService,
        {
          provide: getRepositoryToken(ClientVehicle),
          useValue: mockClientVehicleRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = module.get<ClientVehicleService>(ClientVehicleService);
    clientVehicleRepository = module.get<Repository<ClientVehicle>>(
      getRepositoryToken(ClientVehicle),
    );
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
    vehicleRepository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client-vehicle relationship', async () => {
      const createDto = {
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: true,
        notes: 'Test notes',
        isActive: true,
      };

      const mockClient = { code: 1001, name: 'Test', lastname: 'Client' };
      const mockVehicle = { id: 5, board: 'ABC123', model: 'Civic', brand: 'Honda' };
      const mockClientVehicle = { id: 1, ...createDto };

      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockClientVehicleRepository.findOne.mockResolvedValue(null);
      mockClientVehicleRepository.create.mockReturnValue(mockClientVehicle);
      mockClientVehicleRepository.save.mockResolvedValue(mockClientVehicle);
      mockClientVehicleRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.create(createDto);

      expect(result).toEqual(mockClientVehicle);
      expect(mockClientRepository.findOne).toHaveBeenCalledWith({ where: { code: 1001 } });
      expect(mockVehicleRepository.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
    });

    it('should throw NotFoundException if client does not exist', async () => {
      const createDto = {
        clientCode: 9999,
        vehicleId: 5,
      };

      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      const createDto = {
        clientCode: 1001,
        vehicleId: 9999,
      };

      const mockClient = { code: 1001, name: 'Test', lastname: 'Client' };
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if relationship already exists', async () => {
      const createDto = {
        clientCode: 1001,
        vehicleId: 5,
      };

      const mockClient = { code: 1001, name: 'Test', lastname: 'Client' };
      const mockVehicle = { id: 5, board: 'ABC123', model: 'Civic', brand: 'Honda' };
      const existingRelation = { id: 1, clientCode: 1001, vehicleId: 5 };

      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockClientVehicleRepository.findOne.mockResolvedValue(existingRelation);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all client-vehicle relationships', async () => {
      const mockRelations = [
        { id: 1, clientCode: 1001, vehicleId: 5 },
        { id: 2, clientCode: 1002, vehicleId: 6 },
      ];

      mockClientVehicleRepository.find.mockResolvedValue(mockRelations);

      const result = await service.findAll();

      expect(result).toEqual(mockRelations);
      expect(mockClientVehicleRepository.find).toHaveBeenCalledWith({
        relations: ['client', 'vehicle'],
        order: { addedDate: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a client-vehicle relationship by id', async () => {
      const mockRelation = { id: 1, clientCode: 1001, vehicleId: 5 };

      mockClientVehicleRepository.findOne.mockResolvedValue(mockRelation);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRelation);
      expect(mockClientVehicleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['client', 'vehicle'],
      });
    });

    it('should throw NotFoundException if relationship not found', async () => {
      mockClientVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByClient', () => {
    it('should return all vehicles for a client', async () => {
      const mockClient = { code: 1001, name: 'Test', lastname: 'Client' };
      const mockRelations = [
        { id: 1, clientCode: 1001, vehicleId: 5 },
        { id: 2, clientCode: 1001, vehicleId: 6 },
      ];

      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientVehicleRepository.find.mockResolvedValue(mockRelations);

      const result = await service.findByClient(1001);

      expect(result).toEqual(mockRelations);
      expect(mockClientRepository.findOne).toHaveBeenCalledWith({ where: { code: 1001 } });
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.findByClient(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByVehicle', () => {
    it('should return all clients for a vehicle', async () => {
      const mockVehicle = { id: 5, board: 'ABC123', model: 'Civic', brand: 'Honda' };
      const mockRelations = [
        { id: 1, clientCode: 1001, vehicleId: 5 },
        { id: 2, clientCode: 1002, vehicleId: 5 },
      ];

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockClientVehicleRepository.find.mockResolvedValue(mockRelations);

      const result = await service.findByVehicle(5);

      expect(result).toEqual(mockRelations);
      expect(mockVehicleRepository.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      mockVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.findByVehicle(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client-vehicle relationship', async () => {
      const updateDto = {
        isPrimary: true,
        notes: 'Updated notes',
        isActive: false,
      };

      const existingRelation = {
        id: 1,
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: false,
        notes: 'Old notes',
        isActive: true,
      };

      const updatedRelation = { ...existingRelation, ...updateDto };

      mockClientVehicleRepository.findOne.mockResolvedValue(existingRelation);
      mockClientVehicleRepository.update.mockResolvedValue({ affected: 1 });
      mockClientVehicleRepository.save.mockResolvedValue(updatedRelation);

      const result = await service.update(1, updateDto);

      expect(result.isPrimary).toBe(true);
      expect(result.notes).toBe('Updated notes');
      expect(result.isActive).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a client-vehicle relationship', async () => {
      const mockRelation = { id: 1, clientCode: 1001, vehicleId: 5 };

      mockClientVehicleRepository.findOne.mockResolvedValue(mockRelation);
      mockClientVehicleRepository.remove.mockResolvedValue(mockRelation);

      await service.remove(1);

      expect(mockClientVehicleRepository.remove).toHaveBeenCalledWith(mockRelation);
    });
  });

  describe('setPrimary', () => {
    it('should set a vehicle as primary for a client', async () => {
      const mockRelation = {
        id: 1,
        clientCode: 1001,
        vehicleId: 5,
        isPrimary: false,
      };

      const updatedRelation = { ...mockRelation, isPrimary: true };

      mockClientVehicleRepository.findOne.mockResolvedValue(mockRelation);
      mockClientVehicleRepository.update.mockResolvedValue({ affected: 1 });
      mockClientVehicleRepository.save.mockResolvedValue(updatedRelation);

      const result = await service.setPrimary(1);

      expect(result.isPrimary).toBe(true);
      expect(mockClientVehicleRepository.update).toHaveBeenCalled();
    });
  });
});
