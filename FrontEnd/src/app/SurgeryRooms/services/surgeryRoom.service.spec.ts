import { TestBed } from '@angular/core/testing';
import { SurgeryRoomService } from './surgeryRoom.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { SurgeryRoomDto } from '../dto/surgeryRoomDto';
import { HttpParams } from '@angular/common/http';

describe('SurgeryRoomService', () => {
    let service: SurgeryRoomService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SurgeryRoomService]
        });
        service = TestBed.inject(SurgeryRoomService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch all rooms', () => {
        const mockRooms: SurgeryRoomDto[] = [
            {
                code: "AAAA-001",
                name: "Room 1",
                description: "Room 1 description",
                forSurgery: true
            },
            {
                code: "AAAA-002",
                name: "Room 2",
                description: "Room 2 description",
                forSurgery: true
            }
        ];

        service.getAllSurgeryRooms().subscribe((surgeryRoom) => {
            expect(surgeryRoom.length).toBe(2);
            expect(surgeryRoom).toEqual(mockRooms);
        });

        const req = httpMock.expectOne(`${baseUrl}SurgeryRoom`);
        expect(req.request.method).toBe('GET');
        req.flush(mockRooms);
    });

    it('should fetch room by filters', () => {
        const mockRoom: SurgeryRoomDto[] = [
            {
                code: "AAAA-001",
                name: "Room 1",
                description: "Room 1 description",
                forSurgery: true
            }
        ];

        service.getSurgeryRoom("AAAA-001", "Room 1", "Room 1 description", true).subscribe((rooms) => {
            expect(rooms.length).toBe(1);
            expect(rooms).toEqual(mockRoom);
        });
        let filters = new HttpParams();
        filters = filters.set('code', 'AAAA-001');
        filters = filters.set('name', 'Room 1');
        filters = filters.set('description', 'Room 1 description');
        filters = filters.set('forSurgery', true);

        const req = httpMock.expectOne(
            `${baseUrl}SurgeryRoom?${filters}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockRoom);
    });

    it('should fetch room by code', () => {
        const mockRoom: SurgeryRoomDto = {
            code: "AAAA-001",
            name: "Room 1",
            description: "Room 1 description",
            forSurgery: true
        };

        service.getSurgeryRoomByCode('AAAA-001').subscribe((room) => {
            expect(room).toEqual(mockRoom);
        });

        const req = httpMock.expectOne(`${baseUrl}SurgeryRoom/AAAA-001`);
        expect(req.request.method).toBe('GET');
        req.flush(mockRoom);
    });

    it('should create a new room', () => {
        const newRoom: SurgeryRoomDto = {
            code: "AAAA-001",
            name: "Room 1",
            description: "Room 1 description",
            forSurgery: true
        };
        const mockResponse: SurgeryRoomDto = {
            code: "AAAA-001",
            name: "Room 1",
            description: "Room 1 description",
            forSurgery: true
        };

        service.createSurgeryRoom(newRoom).subscribe((room) => {
            expect(room).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${baseUrl}SurgeryRoom`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newRoom);
        req.flush(mockResponse);
    });
});